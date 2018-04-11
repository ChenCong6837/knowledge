# 如何隐藏一个DOM元素  
1. 设置CSS display属性为none，效果：元素不显示，不占位；  
2. 设置CSS visibility属性为hidden，效果：元素不显示，但占位；
3. opacity值为0；
4. position值为absolute，并且将其移到不可见区域；
5. HTML5元素的属性值hidden，（就是给元素声明一个hidden属性），`<div hidden>`；
6. 元素的font-size、line-height、width、height设置为0；
7. 设置元素的transform的translateX或者translateY的值为-100%；
8. 设置元素的transform的transform：scale(0)；