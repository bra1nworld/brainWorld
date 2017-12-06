// hello.cc
// #include <nan.h>
#include <node.h>
#include <pcl/PCLPointCloud2.h>
#include <pcl/point_cloud.h>
#include <pcl/conversions.h>
#include <pcl/point_types.h>
#include <ingredient/ingredient.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}

std::string config_str =
"{ path: /media/li/Data/data/hebei_map2/2017-07-30-00-26-23.bag,"
// "  velodyne_calibration_path: /home/li/do_ws/install_isolated/share/velodyne_pointcloud/params/VLP16db.yaml }";
"  velodyne_calibration_path: /opt/ros/kinetic/share/velodyne_pointcloud/params/VLP16db.yaml }";

void exampleMethod(const FunctionCallbackInfo<Value>& args)
{
    YAML::Node config = YAML::Load(config_str);
    std::shared_ptr<ingredient::Dataset> dataset(
            new ingredient::RosbagDataset(config));
    std::shared_ptr<ingredient::SequentialIndex> seq_index =
        dataset->by<ingredient::SequentialIndex>();
    std::string topic = "/velodyne_packets";
    std::cerr << seq_index->size(topic) << std::endl;
    ingredient::DataHolder data_holder;
    seq_index->at(topic, 10, &data_holder);
    pcl::PCLPointCloud2 pointcloud2 = data_holder.as<pcl::PCLPointCloud2>();
    pcl::PointCloud<pcl::PointXYZ> pointcloud;
    pcl::fromPCLPointCloud2(pointcloud2, pointcloud);
    std::cerr << pointcloud.size() << std::endl;
    std::cerr << pointcloud.at(10) << std::endl;
    std::cerr << pointcloud.at(10).x << " " << pointcloud.at(10).z << std::endl;
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
  NODE_SET_METHOD(exports, "exampleMethod", exampleMethod);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
