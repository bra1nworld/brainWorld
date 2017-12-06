#include <node.h>
#include <node_object_wrap.h>
#include <ingredient/ingredient.h>

namespace ingredient
{

class DataHolderWrap : public node::ObjectWrap
{
public:
    static void Init(v8::Local<v8::Object> exports);
    static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
private:
    explicit DataHolderWrap();
    ~DataHolderWrap();

    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
    static v8::Persistent<v8::Function> constructor;

    static void foo(const v8::FunctionCallbackInfo<v8::Value>& args);

    ingredient::DataHolder data_holder_;
};

}
