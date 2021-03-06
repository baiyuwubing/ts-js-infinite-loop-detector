# Infinite Loop Detector

## A mini library to detect infinite loop in TypeScript/JavaScript
## ts Usage

```ts
DebugUtil.InfiniteLoopDetector.detect.call(this,
    `
        while (true) {
        }
    `
))
```

or
```ts
const id = DebugUtil.InfiniteLoopDetector.id;
while (true) {
    DebugUtil.InfiniteLoopDetector.infiniteLoopDetector(id);
}
```

## js Usage 

```js
var code = `
for (;;) {
    console.log(1)
}`

code = infiniteLoopDetector.wrap(code)
// Can only wrap plain code string, no function or other things, or it will throw
// There is also an `unwrap` method to restore the code to the previous shape

try {
    eval(code)
} catch(e) {
    if (e.type === 'InfiniteLoopError') {
        console.log('infinite loop detected')
    }
}
```
## Related blog post

https://zhuanlan.zhihu.com/p/23954773
