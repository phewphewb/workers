# Changelog
All notable changes to this project will be documented in this file.

### Formatting guidelines 
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Types of changes
* `:construction_worker: New Features` - for new features.
* `:rocket: Improvements` - for changes in existing functionality.
* `:bug: Bug Fixes` - for any bug fixes.
* `:x: Removed` - for now removed features.

## UNRELEASED

## RELEASE [0.0.1] - 25/08/2022

### :construction_worker: New Features

* basic implementation
 
* support basic syntax 

```javascript
const task = { module: "console", method: "log", data: { message: "Hello World!" }}
const result = await thread.run(task);
const event = { name: "message", data: { message: "Hello World!" }}
thread.forward(event);
thread.on('name', listener);
thread.sub('name', listener);
```


