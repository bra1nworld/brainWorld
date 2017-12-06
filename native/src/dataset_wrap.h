#include <node.h>
#include <node_object_wrap.h>
#include <ingredient/ingredient.h>

namespace ingredient
{

class SequentialIndexWrap;

class DatasetWrap : public node::ObjectWrap
{
public:
    static void Init(v8::Isolate* isolate);
    static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
private:
    explicit DatasetWrap();
    ~DatasetWrap();

    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
    static v8::Persistent<v8::Function> constructor;

    static void indexSequentially(const v8::FunctionCallbackInfo<v8::Value>& args);

    std::shared_ptr<ingredient::Dataset> dataset_;

    std::shared_ptr<SequentialIndexWrap> seq_index_wrap_;
};

}
