#include <node.h>
#include <yaml-cpp/yaml.h>
#include <ingredient/ingredient.h>
#include "dataset_wrap.h"
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
using v8::Value;

Persistent<Function> DatasetWrap::constructor;

DatasetWrap::DatasetWrap()
{
}

DatasetWrap::~DatasetWrap()
{
    std::cerr << "decons dataset" << std::endl;
}

void DatasetWrap::Init(Isolate* isolate) {

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "Dataset"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "indexSequentially", indexSequentially);

    constructor.Reset(isolate, tpl->GetFunction());
    // exports->Set(String::NewFromUtf8(isolate, "DatasetWrap"),
    //         tpl->GetFunction());
}

void DatasetWrap::New(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    if (args.IsConstructCall()) {
        std::cerr << "New a" << std::endl;
        // Invoked as constructor: `new DatasetWrap(...)`
        double value = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
        assert(!args[0]->IsUndefined() && args[0]->IsString());
        v8::String::Utf8Value utf8(args[0]->ToString());
        std::string config_str(*utf8);
        DatasetWrap* obj = new DatasetWrap();
        YAML::Node config = YAML::Load(config_str);
        obj->dataset_.reset(new ingredient::RosbagDataset(config));

        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
        // delete obj;
    } else {
        // Invoked as plain function `DatasetWrap(...)`, turn into construct call.
        std::cerr << "New b" << std::endl;
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        Local<Function> cons = Local<Function>::New(isolate, constructor);
        Local<Context> context = isolate->GetCurrentContext();
        Local<Object> instance =
                cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(instance);
    }
}


void DatasetWrap::NewInstance(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    const unsigned argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Context> context = isolate->GetCurrentContext();
    Local<Object> instance =
            cons->NewInstance(context, argc, argv).ToLocalChecked();

    args.GetReturnValue().Set(instance);
}

void DatasetWrap::indexSequentially(const FunctionCallbackInfo<v8::Value>& args)
{
    std::cerr << "indexSequentially" << std::endl;
    Isolate* isolate = args.GetIsolate();
    DatasetWrap* obj = ObjectWrap::Unwrap<DatasetWrap>(args.Holder());
    std::shared_ptr<SequentialIndex> index = obj->dataset_->by<ingredient::SequentialIndex>();
    SequentialIndexWrap::NewInstance(args, index,args.Holder());
    
    return;

    // Isolate* isolate = args.GetIsolate();
    // DatasetWrap* obj = ObjectWrap::Unwrap<DatasetWrap>(args.Holder());
    // v8::Local<v8::Object> wrapped;
    // std::cerr << "is1" << std::endl;
    // obj->seq_index_wrap_->wrapTo(wrapped);
    // std::cerr << "is2" << std::endl;
    // args.GetReturnValue().Set(obj->seq_index_wrap_->handle(isolate));
    // obj->seq_index_wrap_->wrapTo(args.GetReturnValue());
}

}

