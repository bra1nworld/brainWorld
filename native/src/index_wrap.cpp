#include <vector>
#include <node.h>
#include <node_buffer.h>
#include <pcl/PCLPointCloud2.h>
#include <pcl/point_cloud.h>
#include <pcl/point_types.h>
#include <pcl/conversions.h>
#include <ingredient/ingredient.h>
#include "index_wrap.h"

namespace ingredient
{

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Int32;
using v8::Value;
using v8::Exception;

Persistent<Function> SequentialIndexWrap::constructor;

SequentialIndexWrap::SequentialIndexWrap()
{
}

SequentialIndexWrap::~SequentialIndexWrap()
{
    std::cerr << "decons index" << std::endl;
}

void SequentialIndexWrap::Init(Isolate* isolate) {

   // Prepare constructor template
   Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
   tpl->SetClassName(String::NewFromUtf8(isolate, "SequentialIndex"));
   tpl->InstanceTemplate()->SetInternalFieldCount(1);

   // Prototype
   NODE_SET_PROTOTYPE_METHOD(tpl, "at", at);
   NODE_SET_PROTOTYPE_METHOD(tpl, "size", size);

   constructor.Reset(isolate, tpl->GetFunction());
   // exports->Set(String::NewFromUtf8(isolate, "SequentialIndexWrap"),
   //         tpl->GetFunction());
}

void SequentialIndexWrap::New(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    if (args.IsConstructCall()) {
        // Invoked as constructor: `new SequentialIndexWrap(...)`
        assert(args[0]->IsInt32() && args[1]->IsInt32());
        int64_t iptr;
        *(reinterpret_cast<int32_t*>(&iptr)) = args[0]->Int32Value();
        *(reinterpret_cast<int32_t*>(&iptr) + 1) = args[1]->Int32Value();

        //SequentialIndex* index = reinterpret_cast<SequentialIndex*>(iptr);
        
        auto index = *reinterpret_cast<std::shared_ptr<SequentialIndex>*>(iptr);
        SequentialIndexWrap* obj = new SequentialIndexWrap();
        //obj->index_.reset(index);
        obj->index_ = index;
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
        // delete obj;
    } else {
        // Invoked as plain function `SequentialIndexWrap(...)`, turn into construct call.
        const int argc = 0;
        Local<Value> argv[argc] = {  };
        Local<Function> cons = Local<Function>::New(isolate, constructor);
        Local<Context> context = isolate->GetCurrentContext();
        Local<Object> instance =
                cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(instance);
    }
}

void SequentialIndexWrap::NewInstance(const FunctionCallbackInfo<Value>& args,
				      std::shared_ptr<SequentialIndex> index,
				      v8::Local<v8::Value> datasetWrapper)
{
    Isolate* isolate = args.GetIsolate();

    //int64_t iptr = reinterpret_cast<int64_t>(index.get());
    int64_t iptr = reinterpret_cast<int64_t>(&index);

    const unsigned argc = 2;
    Local<Value> argv[argc];
    argv[0] = Int32::New(isolate, *(reinterpret_cast<int32_t*>(&iptr)));
    argv[1] = Int32::New(isolate, *(reinterpret_cast<int32_t*>(&iptr) + 1));
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> instance =
            cons->NewInstance(context, argc, argv).ToLocalChecked();
    
    Local<String> name = String::NewFromUtf8(isolate, "database");
    instance->Set(name,datasetWrapper);

    args.GetReturnValue().Set(instance);
}

// https://community.risingstack.com/using-buffers-node-js-c-plus-plus/
void bufferFreeCallback(char* data, void* hint)
{
    delete reinterpret_cast<std::vector<uint8_t>*>(hint);
}

void SequentialIndexWrap::at(const FunctionCallbackInfo<v8::Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    if (args.Length() != 2)
        isolate->ThrowException(String::NewFromUtf8(isolate, "Wrong argument"));
    if (!args[0]->IsString() || !args[1]->IsNumber())
        isolate->ThrowException(String::NewFromUtf8(isolate, "Wrong type"));

    String::Utf8Value utf8(args[0]->ToString());
    std::string topic(*utf8);
    size_t id = args[1]->Uint32Value();

    SequentialIndexWrap* obj =
        ObjectWrap::Unwrap<SequentialIndexWrap>(args.Holder());

    ingredient::DataHolder data_holder;
    obj->index_->at(topic, id, &data_holder);
    rjPrint(*data_holder.attribute());

    auto pointcloud2 = data_holder.as<pcl::PCLPointCloud2>();
    std::cerr << pointcloud2.height << " " << pointcloud2.width << " " << pointcloud2.point_step << " " << pointcloud2.data.size() << std::endl;

    std::vector<uint8_t>* buffer = new std::vector<uint8_t>(
            sizeof(uint32_t) * 2 + pointcloud2.data.size());

    uint32_t size = pointcloud2.width * pointcloud2.height;
    uint32_t point_step = pointcloud2.point_step;
    std::cerr << &size << " " << &size + 1 << std::endl;
    std::memcpy(buffer->data(), &size, sizeof(uint32_t));
    std::memcpy(buffer->data() + sizeof(uint32_t), &point_step, sizeof(uint32_t));
    std::memcpy(buffer->data() + sizeof(uint32_t) * 2,
            pointcloud2.data.data(), pointcloud2.data.size() * sizeof(uint8_t));
    
    args.GetReturnValue().Set(
            node::Buffer::New(isolate, reinterpret_cast<char*>(buffer->data()),
                buffer->size(),
                bufferFreeCallback, buffer).ToLocalChecked());
    
}

void SequentialIndexWrap::size(const FunctionCallbackInfo<v8::Value>& args)
{
    Isolate* isolate = args.GetIsolate();
    if (args.Length() != 1)
        isolate->ThrowException(String::NewFromUtf8(isolate, "Wrong argument"));
    if (!args[0]->IsString())
        isolate->ThrowException(String::NewFromUtf8(isolate, "Wrong type"));

    String::Utf8Value utf8(args[0]->ToString());
    std::string topic(*utf8);
    size_t id = args[1]->Uint32Value();

    SequentialIndexWrap* obj =
        ObjectWrap::Unwrap<SequentialIndexWrap>(args.Holder());

    size_t count = obj->index_->size(topic);
    args.GetReturnValue().Set(
            Number::New(isolate, count));
    
}

}


