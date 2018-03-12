//摘自：https://juejin.im/post/5aa1fce051882555677e21aa

//我相信每个前端都遇到过这样一个问题，当一个异步任务的执行需要依赖另一个异步任务的结果时，
//我们一般会将两个异步任务嵌套起来，这种情况发生一两次还可以忍，但是发生很多次之后，你的代码就会变成这个熊样：

//===============================回调地狱=============================================
async1(function () {
    async2(function () {
        async3(function (
            async4(funciton() {
                async5(function () {
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

var _promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
        var rand = Math.random();
        if (rand < 0.5) {
            resolve("resolve" + rand);
        } else {
            reject("reject" + rand);
        }
    }, 1000);

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
因此Promise使用的正确姿势是在其外层再包裹一层函数：
*/
var run = function () {
    var _promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            var rand = Math.random();
            if (rand < 0.5) {
                resolve("resolve" + rand);
            } else {
                reject("reject" + rand);
            }
        }, 1000);
    });
    return _promise;
}
run();

//这是Promise的正常用法，接下来，就是对异步操作结果的处理，接着上面创建的函数run()：

run().then(function (data) {
    console.log(data);
});

//每个Promise的实例对象，都有一个then的方法，这个方法就是用来处理之前各种异步逻辑的结果。

/*那么,
各位可能会问，
这么做有什么卵用？
当然有用，到目前为止，我们学会了Promise的基本流程，但是这种用法和嵌套回调函数似乎没什么区别，
而且增加了复杂度。但是我们说了，Promise的用处，实际上是在于多重异步操作相互依赖的情况下，
对于逻辑流程的控制。Promise正是通过对两种状态的控制，以此来解决流程的控制。请看如下代码：
*/

run().then(function (data) {
    //处理resolve的代码
    cosnole.log("Promise被置为resolve", data);
}, function (data) {
    //处理reject的代码
    cosnole.log("程序被置为了reject", data);
})

/* 如果异步操作获得了我们想要的结果，那我们将调用resolve函数，在then的第一个作为参数的匿名函数中可以获取数据，
如果我们得到了错误的结果，调用reject函数，在then函数的第二个作为参数的匿名函数中获取错误处理数据。
这样，一个次完整的Promise调用就结束了。对于Promise的then()方法，then总是会返回一个Promise实例，
因此你可以一直调用then，形如run().then().then().then().then().then().....
在一个then()方法调用异步处理成功的状态时，你既可以return一个确定的“值”，也可以再次返回一个Promise实例，
当返回的是一个确切的值的时候，then会将这个确切的值传入一个默认的Promise实例，并且这个Promise实例会立即置为fulfilled状态，
以供接下来的then方法里使用。如下所示：
 */

run().then(function (data) {
    console.log("第一次", data);
    return data;
}).then(function (data) {
    console.log("第二次", data);
    return data;
}).then(function (data) {
    console.log("第三次", data);
    return data;
});

/* 异步处理成功的打印结果：
    第一次 resolve0.49040459200760167d.js:18 
    第二次 resolve0.49040459200760167d.js:21 
    第三次 resolve0.49040459200760167
    由此可知then方法可以无限调用下去。
*/
//根绝这个特性，我们就可以将相互依赖的多个异步逻辑，进行比较顺序的管理了。下面举一个拥有3个异步操作的例子，代码有些长。

//第一个异步任务
function run_a() {
    return new Promise(function (resolve, reject) {
        //假设已经进行了异步操作，并且获得了数据
        resolve("step1");
    });
}
//第二个异步任务
function run_b(data_a) {
    return new Promise(function (resolve, reject) {
        //假设已经进行了异步操作，并且获得了数据
        console.log(data_a);
        resolve("step2");
    });
}
//第三个异步任务
function run_c(data_b) {
    return new Promise(function (resolve, reject) {
        //假设已经进行了异步操作，并且获得了数据
        console.log(data_b);
        resolve("step3");
    });
}

//连续调用
run_a().then(function (data) {
    return run_b(data);
}).then(function (data) {
    return run_c(data);
}).then(function (data) {
    console.log(data);
});

/*运行结果
  step1
  step2
  step3
*/
//这样，连续依赖的几个异步操作，就完成了，解决了让人头痛的回调地狱问题。

//======================================================================================

// 异步操作拒绝及中断调用链

/*前文提到过，then方法可以接收两个匿名函数作为参数，第一个参数是Promise置为fulfilled状态后的回调，
第二个是置为rejected状态的回调。在很多情况下，如果连续的几个异步任务，其中某个异步任务处理失败，
那么接下来的几个任务很大程度上就不需要继续处理了，那么我们该如何终止then的调用链呢？在Promsie的实例上，
除了then方法外，还有一个catch方法，catch方法的具体作用，我们沿用上面的代码，将run_a()改造一下来看：
*/
//修改run_a的一步操作可能存在拒绝状态
function run_a() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (Math.random() > .5) {
                resolve("step1");
            } else {
                reject("error");
            }
        }, 1000);
    });
}

//这样做不会中断
run_a().then(function (data) {
    return run_b(data);
}, function (data) {
    //如果是这样处理rejected状态，并不会中断调用链
    return data;
}).then(function (data) {
    return run_c(data);
}).then(function (data) {
    console.log(data);
});

//在调用链的末尾加上catch方法，当某个环节的Promise的异步处理出错时，将中断其后的调用，直接跳到最后的catch
run_a().then(function (data) {
    return run_b(data);
}).then(function (data) {
    return run_c(data);
}).then(function (data) {
    console.log(data);
}).catch(function (e) {
    //rejected的状态将直接跳到catch里，剩下的调用不会再继续
    console.log(e);
});

/* 以上代码简单描述了如何中断链式调用，值得注意的是，catch方法还有try catch的作用，也就是说，
then里面的逻辑代码如果出现了错误，并不会在控制台抛出，而是会直接有catch捕获。*/

//======================================================================================
// Promise.all的扩展
/* 本扩展实现了将多个异步操作合并为一个操作，也就是并行处理异步，最后统一操作结果，注意:本方法只能通过Promise对象直接调用，
实例不能进行此操作。

all()接收一个参数数组，数组中的每一项都对应一个 */

//第一个异步任务
function run_a(){
    return new Promise(function(resolve, reject){                
        //假设已经进行了异步操作，并且获得了数据
        resolve("step1")
    });
}
//第二个异步任务
function run_b(){
    return new Promise(function(resolve, reject){
        //假设已经进行了异步操作，并且获得了数据
        resolve("step2");
    });
}
//第三个异步任务
function run_c(){
    return new Promise(function(resolve, reject){
        //假设已经进行了异步操作，并且获得了数据
        resolve("step3");
    });
}

Promise.all([run_a(),run_b(),run_c()]).then(function(data){
    console.log(data);
},function(data){
    console.log(data);
});

/*打印结果
  ["step1","step2","step3"]
*/

//修改第二个异步任务
//第一个异步任务
function run_b(){
    return new Promise(function(resolve, reject){                
        //假设已经进行了异步操作，并且获得了数据
        reject("step2")
    });
}
/*打印结果
 *捕获了第一个出现的拒绝状态的数据
  ["step2"]
*/

//由上所示，并行运算的结果将按照入参顺序放在放在数组里返回。
