/**
 * Created by Administrator on 2016/1/20 0020.
 */
$(function(){



    var theBaseInfo = {
        '$canvas': document.getElementById('canvas'),//dom
        'outerR': 8,//外圆半径，需要以rem做单位
        'border':0.8,//外边框，需要以rem做单位
        'borderColor':'#b463ff',
        'texts': [
            {
            'id': 0,
            'content':['一等奖￥30','代金劵','img/yidengjiang.png']
        },{
            'id': 1,
            'content':['再接再厉','img/niao.png']//
        },{
            'id': 2,
            'content':['四等奖￥5','代金劵','img/sidengjiang.png']
        },{
            'id': 3,
            'content':['再接再厉','img/niao.png']//
        },{
            'id': 4,
            'content':['三等奖￥10','代金劵','img/sandengjiang.png']
        },{
            'id': 5,
            'content':['再接再厉','img/niao.png']//
        },{
            'id': 6,
            'content':['二等奖￥20','代金劵','img/erdengjiang.png']
        },{
            'id': 7,
            'content':['再接再厉','img/niao.png']//谢谢惠顾与再接再厉一定要放在最后
        }
        ],
        'color': ['#ff7b5d', '#78e6b5','#ffc600','#58dded','#d16dff','#78e6b5','#81e6f2','#ffc600'],
        'innerR': 3.5,//内圆半径
        'innerColor': '#fff',//内圆颜色
        'arrowColor': '#b463ff',
        'startR': 2.3,//开始抽奖半径
        'startColor': '#ddffba',//中间可以转的颜色
        'noRollColor': '#ccc',//不能转的颜色
        'textColor': '#fff',//字体颜色
        'weixinData':{},//微信项目
        'innerText':'你敢抽,我就送',//内部逗号用来分割上下行
        'innerTextColor':'#b463ff',
        'dizuo':'img/dizuo.png',//底座，涉及到写还剩几次
        'chance': 3,//活动机会，n或者random也就是无限次
        'callback': null,
        'ajaxURL':'zhuanPan.txt',//后台返回的接口，只要提供中几等奖（text中的中奖id就好）
    }
    var zhuanPan = new ZhuanPan_moCentre(theBaseInfo)

    zhuanPan.run()

})