
#include <pcl/common/io.h>
#include <pcl/point_types.h>
#include <pcl/point_cloud.h>
#include <pcl/conversions.h>
#include <pcl/visualization/pcl_visualizer.h>
#include <pcl/visualization/point_cloud_color_handlers.h>
#include <yaml-cpp/yaml.h>

// #include <ros/console.h>
#include <velodyne_pointcloud/rawdata.h>
#include <tf/LinearMath/Matrix3x3.h>

#include <ingredient/ingredient.h>
#include <ingredient/yaml_config.h>

int main(int argc, char **argv)
{
    using ingredient::Dataset;
    using ingredient::DataHolder;
    using ingredient::RosbagDataset;
    using ingredient::RobotCarDataset;
    using ingredient::SequentialIndex;

    // ros::init(argc, argv, "lidar_gps_stitcher");
    // ros::NodeHandle node;
    // ros::NodeHandle priv_nh("~");
    std::string config_path = argv[1];
    auto config = YAML::LoadFile(config_path);
    std::cerr << "Config info: " << config << std::endl;

    assert(config["dataset_config"].IsDefined());

    auto dataset = ingredient::loadDataset(config["dataset_config"]);
    std::string topic = config["pointcloud_topic"].as<std::string>();

    assert(config["seq"].IsDefined());
    size_t seq = config["seq"].as<int>();

    auto seq_index = dataset->by<SequentialIndex>();
    assert(seq_index.get());

    DataHolder data;
    seq_index->at(topic, seq, &data);
    
    auto pointcloud = data.as<pcl::PCLPointCloud2>();

    assert(config["pcd_path"].IsDefined());
    std::string pcd_path = config["pcd_path"].as<std::string>();
    pcl::io::savePCDFile(pcd_path, pointcloud);

}
