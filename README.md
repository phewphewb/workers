# Threads in web apps

## Browser multithreading based on Web Worker API

A tiny library for multithreading in browser. The library aims to make the work with worker in browsers easy. 

## Good for

- keep application state in a shared worker and have one source of thruth 
- keep api calls, espcially via websocket in shared worker
- keep data normalization in another thread
- separate the ui thread from any heavy computation logic
- build a multiwindow in borwser progressive web applications with single state
- keep saving to local database and syncing everything later to a cloud away from main thread

## Usage examples
    
### Execute tasks

    const task = { module: "console", method: "log", data: { message: "Hello World!" }}
    const result = await thread.run(task);
        
### Forward events

    const event = { name: "message", data: { message: "Hello World!" }}
    thread.forward(event);

### Subscribe to all events

    thread.on('name', listener);
### Subscribe to state events

    thread.sub('name', listener);

## Future ventures
Eventually this should look something like `goroutines`. 
Where you call a method on a module/object/instance as it was in the main thread namesapse.

`const result = await module.compute(somedata)`

Where `somedata` could be a huge object. 

But as an idea that still needs some research and performance mesures and as an alternative to using `SharedArrayBuffer`.

The shared worker would get some kind of `id` or `query` to be able to get the data directly from the local data base (eg IndexedDB) to avoid structural cloning between threads.  