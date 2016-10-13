---
layout: topic
module: CSS
title:  常见问题
---

#### 移动端清除输入框内阴影

在ios上，输入框默认有内部阴影，可以通过`-webkit-appearance`清除

```css
input {
    -webkit-appearance: none;
}
```

#### 浏览器窗口滑动条

默认情况下，页面高度小于浏览器窗口高度时，浏览器不会显示垂直滑动条；页面高度大于浏览器窗口高度时，浏览器会显示垂直滑动条，由于垂直滑动条会占据页面宽度，导致在这两种类型的页面之间切换时页面宽度不一致而引发的视觉错位，影响体验。

解决方案：通过设置`overflow`，始终显示浏览器窗口垂直滑动条

```css
html {
    overflow-y: scroll;
    overflow: -moz-scrollbars-vertical;
}
```
