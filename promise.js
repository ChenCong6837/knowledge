//摘自：https://juejin.im/post/5aa1fce051882555677e21aa

//我相信每个前端都遇到过这样一个问题，当一个异步任务的执行需要依赖另一个异步任务的结果时，
//我们一般会将两个异步任务嵌套起来，这种情况发生一两次还可以忍，但是发生很多次之后，你的代码就会变成这个熊样：

//===============================回调地狱=============================================
async1(function(){
    async2(function(){
        async3(function(
            async4(funciton(){
                async5(function(){
                    //(╯°□°）╯︵┻━┻
                    //...
                });
            });
        });
    });
});

/* 这就是所谓的回调地狱，代码层层嵌套，环环相扣，很明显，逻辑稍微复杂一些，这样的程序就会变得难以维护。
对于这种情况，程序源们想了很多解决方案（比如将代码模块化），但流程控制上，还是没有掏出})的大量嵌套。
但在ES2015的标准里，Promise的标准化，一定程度上解决了JavaScript的流程操作问题。*/

//======================================================================================
//promise的基本用法：

//时至今日，很多现代浏览器都已经实现，但是为了兼容，建议自行对Promise进行封装或者使用第三方的解决方
//案（如webpack对es6语法进行编译）。 那么，我么将得到一个Promise构造函数，新建一个Promise的实例：

var _promise = new Promise(function(resolve, reject){
    setTimeout(function(){
        var rand = Math.random();
        if(rand<0.5){
            resolve("resolve" + rand);
        }else{
            reject("reject" + rand);
        }
    },1000);
    
});

/*运行结果:
 *有两种情况：
 *1)无事发生
 *2)报错形如：d.js:7 Uncaught (in promise) reject0.9541820247347901
 */

/* 由上所示，Promise的构造函数接收一个函数作为参数，该函数接受两个额外的函数，resolve和reject，
这两个函数分别代表将当前Promise置为fulfilled(解决)和rejected(拒绝)两个状态。
Promise正是通过这两个状态来控制异步操作的结果。接下来我们将讨论Promise的用法，
实际上Promise上的实例_promise是一个对象，不是一个函数。在声明的时候，Promise传递的参数函数会立即执行，
因此Promise使用的正确姿势是在其外层再包裹一层函数。
*/