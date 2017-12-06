// #include <nan.h>
#include "dataset_wrap.h"
#include "index_wrap.h"
#include <node.h>
#include <pcl/PCLPointCloud2.h>
#include <pcl/point_cloud.h>
#include <pcl/conversions.h>
#include <pcl/point_types.h>
#include <ingredient/ingredient.h>


namespace ingredient {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void createDataset(const FunctionCallbackInfo<Value>& args)
{
    DatasetWrap::NewInstance(args);
}
// void createSequentialIndex(const FunctionCallbackInfo<Value>& args)
// {
//     SequentialIndexWrap::NewInstance(args);
// }

void initAll(Local<Object> exports, Local<Object> module) {
    DatasetWrap::Init(exports->GetIsolate());
    SequentialIndexWrap::Init(exports->GetIsolate());
    NODE_SET_METHOD(exports, "createDataset", createDataset);
//     NODE_SET_METHOD(exports, "createSequentialIndex", createSequentialIndex);
  // NODE_SET_METHOD(exports, "exampleMethod", exampleMethod);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, initAll)

}  // namespace demo
