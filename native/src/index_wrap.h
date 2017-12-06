#ifndef INGREDIENT_INDEX_WRAP_H
#define INGREDIENT_INDEX_WRAP_H
#include <memory>
#include <node.h>
#include <node_object_wrap.h>
#include <ingredient/ingredient.h>

namespace ingredient
{

class DatasetWrap;

class SequentialIndexWrap : public node::ObjectWrap
{
public:
    static void Init(v8::Isolate* isolate);
    static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args,
			    std::shared_ptr<SequentialIndex> index, v8::Local<v8::Value> datasetWrapper);
// private:
    explicit SequentialIndexWrap();
    ~SequentialIndexWrap();

    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
    static v8::Persistent<v8::Function> constructor;

    static void at(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void size(const v8::FunctionCallbackInfo<v8::Value>& args);

    std::shared_ptr<ingredient::SequentialIndex> index_;

};

}

#endif
