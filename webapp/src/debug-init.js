window.onload = function () {
    var p;
    p = new LeafRequire.BestPractice({
        config: "/require.json",
        localStoragePrefix: "LeafRequire",
        debug: true,
        withVersion: true,
        version: Math.random().toString()
    });
    p.run();
    window.GlobalContext = p.context
    return window.GlobalContext = p.context;

};