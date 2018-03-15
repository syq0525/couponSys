<template>
    <section>
        <el-row class="breadcrumb">发放券/{{id==null?'创建':queryStatus==2?'编辑':'查看'}}推送活动</el-row>
        <div class="create-info">
            <span>营销活动编码：{{code}}</span>
            <span class="fr">创建人：{{username}} | 创建时间：{{$format(createTime)}}</span>
        </div>
        <el-card v-loading="loading">
            <el-row >
                <el-col class="module-title" >基本设置</el-col>
            </el-row>
            <el-row >
                <el-col>
                    <span class="search-span">营销活动名称：</span>
                    <el-input v-model="name" :disabled="queryStatus!=2&&id!=null?true:false" style="width:50%" placeholder="营销名称不可以超过100个字符" @input="checkName(name,100,'name')"></el-input>
                </el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">活动类型：</span>
                    <el-button type="primary">推送活动</el-button>  
                </el-col>
            </el-row>
            <!-- <el-row >
                <el-col >
                    <span class="search-span">推送渠道：</span>
                    <el-select v-model="pushChannel" placeholder="请选择" multiple :disabled="queryStatus!=2&&id!=null?true:false">
                        <el-option label="短信" value="1"></el-option>
                        <el-option label="微信" value="2"></el-option>
                        <el-option label="APP消息中心" value="3"></el-option>
                        <el-option label="APP PUSH+消息中心" value="4"></el-option>
                    </el-select>
                </el-col>
            </el-row> -->
            <el-row >
                <el-col >
                    <span class="search-span">消息通知：</span>
                    <el-select v-model="messageConfigId" placeholder="请选择消息通知模板" :disabled="queryStatus!=2&&id!=null?true:false">
                        <el-option :label="item.description" :value="item.messageConfigId" v-for="(item,index) in msgArr"></el-option>
                    </el-select>
                </el-col>
             </el-row>
            
            <el-row >
                <el-col >
                    <span class="search-span">活动描述：</span>
                    <el-input type="textarea" :rows="4" placeholder="请详细描述该优惠券使用的说明内容，不超过500个字符" style="width:50%" v-model="remark" @input="checkName(remark,500,'remark')" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                </el-col>
            </el-row>
            <el-row >
                <el-col class="module-title" >奖品设置</el-col>
            </el-row>
            <el-row>
                <el-col v-for="(item,index) in selprize" :key="index">
                    <span class="search-span"></span>
                    <el-tag type="primary">{{index+1}}</el-tag>
                    <el-cascader
                        style="margin-right:10px"
                        :options="prizearr"
                        :disabled="queryStatus!=2&&id!=null?true:false"
                        :props="props"
                        v-model="selprize[index]">
                    </el-cascader>
                    <el-button type="primary" class="el-icon-plus" @click="plusPrize"></el-button>
                    <el-button type="primary" class="el-icon-minus" @click="minusPrize(index)" v-if="selprize.length>1"></el-button>
                </el-col>
                
            </el-row>
            <el-row>
                <el-col class="module-title" >用户设置</el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">会员筛选条件：</span>
                    
                    <el-select v-model="filterType" placeholder="请选择筛选条件" :disabled="queryStatus!=2&&id!=null?true:false">
                        <el-option label="会员等级筛选" :value="1" ></el-option>
                        <el-option label="会员id筛选" :value="2"></el-option>
                        <el-option label="SQL语句筛选" :value="3"></el-option>
                        <el-option label="会员手机号筛选" :value="4"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row v-if="filterType==1">
                <el-col >
                    <span class="search-span">会员等级：</span>
                    <el-select v-model="mbeGrade" multiple placeholder="选择会员等级" :disabled="queryStatus!=2&&id!=null?true:false">
                        <el-option label="普卡" value="251"></el-option>
                        <el-option label="银卡" value="252"></el-option>
                        <el-option label="金卡" value="253"></el-option>
                        <el-option label="钻石卡" value="254"></el-option>
                    </el-select>
                    <el-button type="primary" size="large" style="margin-left:10px" @click="searchNum('memberNum1',mbeGrade.join(','))" :disabled="mbeGrade==''?true:false">查询选中会员数</el-button>
                </el-col>
            </el-row>
            <el-row v-if="filterType==2">
                <el-col>
                    <span class="search-span">手工选择会员：</span>
                    <el-input style="width:40%" placeholder='输入会员id，用","分隔' v-model="memberCodeStr" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                    <el-button type="primary" size="large" style="margin-left:10px" @click="searchNum('memberNum2',memberCodeStr)" :disabled="memberCodeStr==''?true:false">查询选中会员数</el-button>
                </el-col>
            </el-row>
            <el-row v-if="filterType==3">
                <el-col>
                    <span class="search-span">手工选择会员：</span>
                    <el-input style="width:40%" placeholder='输入SQL语句进行筛选' v-model="conditionSql" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                    <el-button type="primary" size="large" style="margin-left:10px" @click="searchNum('memberNum3',conditionSql)" :disabled="conditionSql==''?true:false">查询选中会员数</el-button>
                </el-col>
            </el-row>
            <el-row v-if="filterType==4">
                <el-col>
                    <span class="search-span">手工选择会员：</span>
                    <el-input style="width:40%" placeholder='输入会员手机号码进行筛选，用","分隔' v-model="memberPhone" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                    <el-button type="primary" size="large" style="margin-left:10px" @click="searchNum('memberNum4',memberPhone)" :disabled="memberPhone==''?true:false">查询选中会员数</el-button>
                </el-col>
            </el-row>
            <el-row v-if="filterType==1&&memberNum1!=''">
                <el-col >
                    <span class="search-span"></span>
                    <span style="color:red">{{memberNum1}}</span>
                </el-col>
            </el-row>
            <el-row v-else-if="filterType==2&&memberNum2!=''">
                <el-col >
                    <span class="search-span"></span>
                    <span style="color:red">{{memberNum2}}</span>
                </el-col>
            </el-row>
            <el-row v-else-if="filterType==3&&memberNum3!=''">
                <el-col >
                    <span class="search-span"></span>
                    <span style="color:red">{{memberNum3}}</span>
                </el-col>
            </el-row>
            <el-row v-else-if="filterType==4&&memberNum4!=''">
                <el-col >
                    <span class="search-span"></span>
                    <span style="color:red">{{memberNum4}}</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span"></span>
                    <span >！券的余额小于选择数目，创建失败</span>
                </el-col>
            </el-row>
            <el-row class="btn-group" >
                <el-button type="primary" size="large" @click="saveInfo" v-show="!id||queryStatus==2" >保存</el-button>
                <el-button type="primary" size="large" @click="goBack">返回</el-button> 
            </el-row>
        </el-card>
    </section>
</template>
<script>
    export default {
        name:'addmarketing',
        data(){
            return{
                memberNum1:'',
                memberNum2:'',
                memberNum3:'',
                memberNum4:'',
                fkCreatorUserId:'',
                queryStatus:this.$route.query.status||null,
                id:this.$route.query.id||null,
                code:'',  //营销活动编码
                createTime:'',  //创建时间
                username:'',
                name:'',  //营销活动名称
                type:1,  //活动类型  1.推送活动
                remark:'',  //活动描述
                // pushChannel:'', //推送渠道
                messageConfigId:'',   //消息模板
                msgArr:[],
                props: {
                    label:'COUPONSCHEMENAME',
                    value: 'FKCOUPONSCHEMEID',
                    children: 'children'
                },
                prizearr: [{   //奖品设置
                    FKCOUPONSCHEMEID: 1,
                    COUPONSCHEMENAME: '优惠券',
                    children: []
                },{  
                    FKCOUPONSCHEMEID: 2,
                    COUPONSCHEMENAME: '乐橙券',
                    children: []
                },{  
                    FKCOUPONSCHEMEID: 3,
                    COUPONSCHEMENAME: '外平台券',
                    children: []
                }],
                selprize:[   //奖品值
                   []
                ],  
                filterType:1, //会员筛选条件
                mbeGrade:'',  //会员等级
                memberCodeStr:'',  //会员编码
                conditionSql:'',
                memberPhone:'',//会员手机号
                loading:false,
                pickerBeginDateBefore:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                
                }
            }
            
        },
        mounted(){
            this.getMsg()
            this.getPrize()
            if(this.id==null){
                this.getCode()
            }else{
                this.initInfo()
            }
            let userinfo = unescape(sessionStorage.getItem('userinfo'));
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
                this.fkCreatorUserId=userinfo.id;
                this.username=userinfo.name
            }
        },
        methods:{
            checkName(val,num,name){
                 if(val){
                    this.$nextTick(()=>{
                        var len = 0;  
                        var arr=[]
                        for (var i=0; i<val.length; i++) {  
                            if (val.charCodeAt(i)>127 || val.charCodeAt(i)==94) {  
                                len += 2;  
                            } else {  
                                len ++;  
                            }
                            if(len>num){
                                this[name]=val
                                break;
                            }
                            arr.push(val[i])
                        }  
                        this[name]=arr.join('')
                    })     
                }
            },
            async getMsg(){
                let d={
                    content:{
                        messageType:'1',
                        subtype:'20',
                        platform:'1',
                    }
                }
                let res = await this.$post('/CRM/appmessagecenter/getMessageConfigList.json',d);
                if(res.errcode==0){
                    this.msgArr=res.content.messageConfigList;
                }
            },
            async initInfo(){
                let d={
                    id:this.id
                }
                let res = await this.$get('/couponSys/sendCouponScheme/toUpdate.json',d);
                this.code=res.bSendCouponScheme.code
                this.createTime=res.bSendCouponScheme.createTime
                this.name=res.bSendCouponScheme.name
                // this.pushChannel=res.bSendCouponScheme.pushChannel.split(',')
                this.remark=res.bSendCouponScheme.remark
                this.messageConfigId=parseInt(res.bSendCouponScheme.messageConfigId)
                this.filterType=res.bSendCouponCondition.filterType;
                this.memberCodeStr=this.filterType==2?res.bSendCouponTargetStr:'';
                this.memberPhone=this.filterType==4?res.bSendCouponTargetStr:'';
                if(res.bSendCouponCondition.grade){
                    this.mbeGrade=res.bSendCouponCondition.grade.split(',')
                }
                this.selprize=[]
                let arr=res.bSendCouponConfList;
                for(let i=0;i<arr.length;i++){
                    let item=[arr[i].couponSchemeType,arr[i].fkCouponSchemeId]
                    this.selprize.push(item)
                }
            },
            async getCode(){
                
                let res = await this.$get('/couponSys/sendCouponScheme/create.json');
                this.code=res.bSendCouponScheme.code
                this.createTime=res.bSendCouponScheme.createTime
            
            },
            async getPrize(val,index){
                
                for(let i=0;i<this.prizearr.length;i++){
                    let d={
                        type:this.prizearr[i].FKCOUPONSCHEMEID
                    }
                    let res = await this.$get('/couponSys/sendCouponScheme/queryCouponScheme.json',d);
                    if(res.errcode==0){
                        let list=res.couponScheme.list
                        this.prizearr[i].children = list;
                    }
                    
                }
            },
            
            plusPrize(){
                this.selprize.push([])
            },
            minusPrize(index){
                this.selprize.splice(index,1)
            },
            checkValue(){
                if(this.name==''||this.messageConfigId==''||this.selprize[0].length==0){
                    this.$message.error('信息设置不完整');
                    return false
                }
                if((this.filterType==1&&this.mbeGrade=='')||(this.filterType==2&&this.memberCodeStr=='')||(this.filterType==3&&this.conditionSql=='')||(this.filterType==4&&this.memberPhone=='')){
                    this.$message.error('信息设置不完整');
                    return false
                }
                return true
            },
            async saveInfo(){

                let bSendCouponConfList=[]
                for(let i=0;i<this.selprize.length;i++){
                    let item={
                        fkSendSchemeId:this.id,
                        fkCouponSchemeId:this.selprize[i][1],
                        couponSchemeType:this.selprize[i][0],
                        couponQuantity:1
                    }
                    bSendCouponConfList.push(item)
                }
                let check=this.checkValue()
                if(!check){
                    return
                }
                var messageConfigName=''
                for(let i=0;i<this.msgArr.length;i++){
                    if(this.msgArr[i].messageConfigId==this.messageConfigId){
                        messageConfigName=this.msgArr[i].description
                    }
                }
                let d={
                    content:{
                        bSendCouponScheme:{
                            fkCreatorUserId:this.fkCreatorUserId,
                            remark:this.remark,  
                            id:this.id,
                            code:this.code,
                            createTime:this.$format(this.createTime),
                            name:this.name,
                            type:this.type,
                            messageConfigId:this.messageConfigId,
                            messageConfigName:messageConfigName
                        },
                        bSendCouponConfList:bSendCouponConfList,
                        bSendCouponCondition:{
                            filterType:this.filterType,
                            grade:this.filterType==1?this.mbeGrade.join(','):'',
                            conditionSql:this.filterType==3?this.conditionSql:''
                        },
                        bSendCouponTargetStr:this.filterType==2?this.memberCodeStr:this.filterType==4?this.memberPhone:''
                    }
                }
                this.loading=true
                let res;
                if(this.id==null){
                    res = await this.$post('/couponSys/sendCouponScheme/add.json',d);
                }else{
                    res = await this.$post('/couponSys/sendCouponScheme/update.json',d);
                }
                this.loading=false
                if(res.errcode==0){
                    this.$message.success(this.id==null?'添加成功':'修改成功')
                    // eventBus.$emit('resetMarketinglist')
                    this.$router.go(-1)
                }else{
                    this.$message.error(res.msg);
                }
            },
            goBack(){
                this.$router.go(-1)
            },
            async searchNum(type,condition){
                this.loading=true
                let d={
                    content:{
                        type:this.filterType,
                        condition:condition
                    }
                    
                }
                let res = await this.$post('/couponSys/sendCouponScheme/memberCount.json',d);
                this.loading=false
                if(res.errcode==0){
                    this[type]=res.content.dec
                }else{
                    this.$message.error(res.msg);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .search-span{
        display: inline-block;
        width: 140px;
        text-align: right;
    }
    
    .el-col{
        margin-bottom: 20px
    }
    .notes{
        margin-left: 30px;
    }
    .el-textarea{
        vertical-align: top;
    }
    .btn-group{
        margin-top:40px;
        text-align:center
    }
</style>
