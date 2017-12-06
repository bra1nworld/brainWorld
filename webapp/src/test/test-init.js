window.onload = function() {
    var p;
    p = new LeafRequire.BestPractice({
        config: "/test/require.json",
        localStoragePrefix: "LeafRequireTest",
        debug: true,
        withVersion:true,
        version:Math.random().toString(),
        entry:"test"
    });
    p.run();
    window.LeafTestContext = p.context
    return window.LeafTestContext = p.context;
};
