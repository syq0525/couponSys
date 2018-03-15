<template>
    <section>
        <el-row class="breadcrumb">券方案/{{id==null?'创建':queryStatus==2?'编辑':'查看'}}乐橙券方案</el-row>
        <div class="create-info">
            <span>券方案编码：{{code}}</span>
            <span class="fr">创建人：{{username}} | 创建时间：{{$format(createTime)}}</span>
        </div>
        <el-card v-loading="loading">
            <el-row>
                <el-col class="module-title" >基本设置</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <span class="search-span">劵方案名称：</span>
                    <el-input v-model="name" style="width:40%" placeholder="优惠券名称不可以超过25个字符" @input="checkName(name,25,'name')" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                </el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">优惠券类型：</span>
                    <el-button :type="thresholdType==1?'primary':''" @click="thresholdType=1">满减券</el-button>
                    <el-button :type="thresholdType==2?'primary':''" @click="thresholdType=2">无门槛代金券</el-button>
                </el-col>
            </el-row>
            <el-row >
                <el-col  v-if="thresholdType==1">
                    <span class="search-span">优惠券面值：</span>
                    <span>订单满</span><el-input style="width:80px;margin:0 10px" v-model="thresholdAmt" @input="keyupMoney('thresholdAmt',thresholdAmt)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input><span>减</span><el-input style="width:80px;margin:0 10px" v-model="couponAmt" @input="keyupMoney('couponAmt',couponAmt)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input><span>元</span>
                </el-col>
                <el-col  v-if="thresholdType==2">
                    <span class="search-span">优惠券面值：</span>
                    <el-input style="width:80px;margin-right:10px"  v-model="couponAmt" @input="keyupMoney('couponAmt',couponAmt)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input><span>元</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :md="8">
                    <span class="search-span">总发行量：</span>
                    <el-input style="width:80px" v-model="issuanceQty"  @input="keyupNum('issuanceQty',issuanceQty)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                    <span>张</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :md="8">
                    <span class="search-span">承担金额：</span>
                    <el-input style="width:80px" v-model="undertakeAmt"  @input="keyupMoney('undertakeAmt',undertakeAmt)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                    <span>元</span>
                </el-col>
            </el-row>
            <el-row>
                
                <el-col v-for="(item,index) in selscale" :key="index">
                    <span class="search-span fl" style="width:140px;line-height:40px" v-if="index==0">费用承担方：</span>
                    <span class="search-span fl" style="height:40px;" v-else></span>
                    <el-tag type="primary" style="margin-left:5px">{{index+1}}</el-tag>
                    <el-cascader
                        style="margin-right:10px"
                        :options="scalearr"
                        @active-item-change="getSection"
                        :props="props"
                        :disabled="queryStatus!=2&&id!=null?true:false"
                        v-model="selscale[index]">
                    </el-cascader>
                    
                    承担比例：<el-input style="width:80px" v-model="percentarr[index]" @input="keyupMoney('percentarr',percentarr[index],index)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input><span>%</span>
                    <el-button type="primary" class="el-icon-plus" @click="plusScale" style="margin-left:10px"></el-button>
                    <el-button type="primary" class="el-icon-minus" @click="minusScale(index)" v-if="selscale.length>1"></el-button>
                </el-col>
                
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">优惠券有效期：</span>
                    <el-select v-model="validityType" placeholder="请选择" :disabled="queryStatus!=2&&id!=null?true:false">
                        <el-option label="截止日期至" :value="1"></el-option>
                        <el-option label="自定义时间段" :value="2"></el-option>
                        <el-option label="领取后" :value="3"></el-option>
                    </el-select>
                    <span v-show="validityType==1">
                        <el-date-picker
                            :disabled="queryStatus!=2&&id!=null?true:false"
                            v-model="deadTime"
                            :editable="false"
                            type="datetime"
                            placeholder="截止时间"
                            :default-value="new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59)"
                            :picker-options="pickerBeginDateBefore">
                        </el-date-picker>
                    </span>
                    <span v-show="validityType==2">
                        <el-date-picker
                            v-model="validityTime"
                            :disabled="queryStatus!=2&&id!=null?true:false"
                            :editable="false"
                            @change="initTimeArr('validityTime',validityTime)"
                            type="datetimerange"
                            :default-time="['00:00:00', '23:59:59']"
                            placeholder="选择时间范围"
                            :picker-options="pickerBeginDateBefore">
                        </el-date-picker>
                    </span>
                    <span v-show="validityType==3">
                        <span>至领券之日起</span><el-input style="width:80px;margin:0 10px" v-model="validityDay"  @input="keyupNum('validityDay',validityDay)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input><span>天</span>
                    </span>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <span class="search-span">使用须知：</span>
                    <el-input type="textarea" :rows="4" placeholder="请详细描述该优惠券使用的说明内容，不超过500个字符" style="width:50%" v-model="notice" @input="checkName(notice,500,'notice')" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                </el-col>
            </el-row>
            <el-row >
                <el-col class="module-title" >推广设置</el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">可领取时间：</span>
                    <el-date-picker
                        v-model="availableTime"
                        :disabled="queryStatus!=2&&id!=null?true:false"
                        :editable="false"
                        @change="initTimeArr('availableTime',availableTime)"
                        type="datetimerange"
                        :default-time="['00:00:00', '23:59:59']"
                        placeholder="选择时间范围"
                        :picker-options="pickerBeginDateBefore">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">限领设置：</span>
                    <el-select v-model="limitType" placeholder="请选择" :disabled="queryStatus!=2&&id!=null?true:false">
      
                        <el-option label="活动期间每人限领" :value="1"></el-option>
                        <el-option label="活动期间每人每日限领" :value="2"></el-option>
                    </el-select>
                    <el-input style="width:80px;margin:0 10px" v-model="limitQty" @input="keyupNum('limitQty',limitQty)" :disabled="queryStatus!=2&&id!=null?true:false"></el-input><span>张</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col>
                    <span class="search-span">会员等级：</span>
                    <el-select v-model="mbeGrade" multiple placeholder="选择会员等级" :disabled="queryStatus!=2&&id!=null?true:false">
                        <el-option label="普卡" value="251"></el-option>
                        <el-option label="银卡" value="252"></el-option>
                        <el-option label="金卡" value="253"></el-option>
                        <el-option label="钻石卡" value="254"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row >
                <el-col :lg="15">
                    <span class="search-span fl" style="width:140px">适用门店：</span>
                    <el-tree 
                        :data="category" 
                        :props="defaultProps"  
                        ref="tree"   
                        show-checkbox 
                        node-key="id" 
                        :accordion="true" 
                        style="margin-left:145px">
                    </el-tree>
                </el-col>
            </el-row>

            
            <el-row>
                <el-col>
                    <span class="search-span"></span>
                    <el-checkbox v-model="isPublic" :disabled="queryStatus!=2&&id!=null?true:false">领券中心页面显示该券方案</el-checkbox>
                </el-col>
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span" ></span>
                    <el-checkbox v-model="isShared" :disabled="queryStatus!=2&&id!=null?true:false">领券链接可被分享</el-checkbox>
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
        name:'addlecheng',
        data(){
            return{
                queryStatus:this.$route.query.status||null,
                id:this.$route.query.id||null,
                code:'',  //劵方案编码
                createTime:'',  //创建时间
                username:'',
                creater:'',  //创建人账号
                name:'',   //优惠券名称
                type:2,  //劵类型  1.优惠券  2.乐橙劵   3.外平台劵
                couponAmt:'',  //优惠券面值
                thresholdType:1, //1.有门槛  2.无门槛
                thresholdAmt:'',  //满减金额(有门槛)
                issuanceQty:'', //发行劵总数量
                remainQty:'',  //发行劵剩余数量
                validityType:1,  //1.绝对时间  2.相对时间
                validityDay:'',   //相对时间  多少天
                deadTime:null,  //截止之间
                validityTime:[], //绝对时间有效期时间范围
                notice:'',  //须知
                availableTime:[],  //可领取时间范围
                mbeGrade:'',  //会员等级
                limitType:1,  //限额设置 1.没人限额 2.期间每人限额  3.期间每人每天限额
                limitQty:'',  //限额数量
                isPublic:false,  //领劵中心是否可见  1.是  2.否
                isShared:false,  //是否分享  1.是  2.否
                vstatus:1,
                defaultProps:{
                    children: 'children',  
                    label: 'name'
                },
                category: [],  //初始化商城
                loading:false,
                pickerBeginDateBefore:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    } 
                
                },
                selscale:[   //奖品值
                   []
                ],  
                props:{
                    label:'name',
                    value: 'id',
                    children: 'children'
                },
                scalearr:[],
                percentarr:[],
                undertakeAmt:'',//承担金额
            }
            
        },

        mounted(){

            if(this.id==null){
                this.getCode()
            }else{
                this.initInfo()
            }

        },
        methods:{

            async getSection(val){
                
                let index=0
                for(var i=0;i<this.scalearr.length;i++){
                    if(this.scalearr[i].id==val[0]){
                        index=i
                        break;
                    }
                    
                }
                if(this.scalearr[index].children==0){
                    
                    let d={
                        fourshop:val[0]
                    }
                    let res = await this.$get('/couponSys/common/getDeptByFourshop.json',d);
                    if(Object.keys(res).length!=0){
                        this.scalearr[index].children = res
                    }
                    
                }
            },
            plusScale(){
                this.selscale.push([])
            },
            minusScale(index){
                this.selscale.splice(index,1)
                this.percentarr.splice(index,1)
            },

            
            initTimeArr(name,time){
                if(!time){
                    this[name]=[]
                }
            },
            
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
            async initInfo(){
                let d={
                    id:this.id
                }
                let res = await this.$get('/couponSys/couponSchemeOffline/toUpdate.json',d);
                this.code=res.entity.code
                this.name=res.entity.name
                this.username=res.entity.createrName
                this.creater=res.entity.creater
                this.createTime=res.entity.createTime
                this.thresholdType=res.entity.thresholdType
                this.couponAmt=res.entity.couponAmt
                this.thresholdAmt=res.entity.thresholdAmt
                this.undertakeAmt=res.entity.undertakeAmt
                
                this.issuanceQty=res.entity.issuanceQty
                this.validityType=res.entity.validityType
                this.validityDay=res.entity.validityDay
                this.deadTime=res.entity.deadTime
                this.validityTime=[res.entity.startTime,res.entity.endTime]
                this.notice=res.entity.notice
                this.availableTime=[res.entity.availableStartTime,res.entity.availableEndTime]
                this.mbeGrade=res.entity.mbeGrade.split(',')
                this.limitType=res.entity.limitType
                this.limitQty=res.entity.limitQty
                this.isPublic=res.entity.isPublic==1?true:false
                this.isShared=res.entity.isShared==1?true:false
                this.vstatus=res.entity.vstatus
                this.category=res.detailTree
                this.scalearr=res.fourslist
                for(var i in this.scalearr){
                    this.$set(this.scalearr[i],'children',[]) 
                }
                this.selscale=[]
                let sarr=res.selectList;
                for(let i=0;i<sarr.length;i++){
                    
                    for(let j in this.scalearr){
                        if(this.scalearr[j].id==sarr[i].fkFourshopId){
                            let d={
                                fourshop:sarr[i].fkFourshopId
                            }
                            let res = await this.$get('/couponSys/common/getDeptByFourshop.json',d);
                            this.scalearr[j].children = res
                            let item=[Number(sarr[i].fkFourshopId),sarr[i].fkDeptId]
                            this.selscale.push(item)
                            this.percentarr.push(sarr[i].percent)
                            break
                        }
                    }

                }
                let list=res.detailTree
                let arr=[];
                for(let i=0;i<list.length;i++){
                    if(list[i].select==1){
                        arr.push(list[i])

                    }else if(list[i].children){

                        for(let j=0;j<list[i].children.length;j++){

                            if(list[i].children[j].select==1){ 
                                arr.push(list[i].children[j])

                            }else if(list[i].children[j].children){

                                for(let m=0;m<list[i].children[j].children.length;m++){

                                    if(list[i].children[j].children[m].select==1){
                                         arr.push(list[i].children[j].children[m])

                                    }else if(list[i].children[j].children[m].children){

                                        for(let n=0;n<list[i].children[j].children[m].children.length;n++){

                                            if(list[i].children[j].children[m].children[n].select==1){
                                                arr.push(list[i].children[j].children[m].children[n])
                                            }

                                        }

                                    }

                                }
                            }
                        }
                    }

                }
                this.$nextTick(()=>{
                    this.$refs.tree.setCheckedNodes(arr);
                })

            },
            async getCode(){
                let res = await this.$get('/couponSys/couponSchemeOffline/create.json');
                this.category=res.detailTree
                this.scalearr=res.fourslist
                for(var i in this.scalearr){
                    this.$set(this.scalearr[i],'children',[])
                }
                this.code=res.entity.code
                this.createTime=res.entity.createTime;
                let userinfo = unescape(sessionStorage.getItem('userinfo'));
                if (userinfo) {
                    userinfo = JSON.parse(userinfo);
                    this.creater=userinfo.id;
                    this.username=userinfo.name
                }

            },
            checkValue(nodes){
                if(this.name==''||this.couponAmt==''||(this.thresholdType==1&&this.thresholdAmt=='')||this.issuanceQty==''||this.undertakeAmt==''||this.availableTime.length==0||this.limitQty==''||this.mbeGrade==''||nodes.length==0||this.percentarr.length!=this.selscale.length||this.percentarr.indexOf(null)!=-1){
                    this.$message.error('信息设置不完整');
                    return false
                }
                if((this.validityType==1&&!this.deadTime)||(this.validityType==2&&this.validityTime.length==0)||(this.validityType==3&&this.validityDay=='')){
                    this.$message.error('信息设置不完整');
                    return false
                }

                if(this.issuanceQty>3000000){
                    this.$message.error('总发行量不能超过300万张');
                    return false
                }
                if(this.thresholdType==1&&(parseFloat(this.thresholdAmt)<parseFloat(this.couponAmt))){
                    this.$message.error('订单面值必须大于满减券面值');
                    return false
                }

                if((this.validityType==1&&new Date(this.deadTime).getTime()<new Date(this.availableTime[1]).getTime())||(this.validityType==2&&new Date(this.validityTime[1]).getTime()<new Date(this.availableTime[1]).getTime())){
                    this.$message.error('可领取时间必须在优惠券有效期截止时间之前');
                    return false
                }
                var percentNum=0
                for(var i in this.percentarr){
                    percentNum+=Number(this.percentarr[i])
                }
                if(percentNum!=100){
                    this.$message.error('总承担比例相加和必须100%');
                    return false
                }

                return true
            },
            async saveInfo(){

                let nodes=this.$refs.tree.getCheckedNodes();
                let categoryList=[];
                for(let i=0;i<nodes.length;i++){
                    let item={
                        fkCouponSchemeId:this.id,
                        fourshopId:nodes[i].cat_id ? nodes[i].id:'',
                        source:1,
                        isGood:nodes[i].cat_id ? 1:0,
                        categoryId:nodes[i].cat_id ? nodes[i].cat_id:nodes[i].id
                    }
                    categoryList.push(item)
                }

                let bCouponSchemeUndertakeList=[]
                for(let i=0;i<this.selscale.length;i++){
                    if(this.selscale[i].length!=0){
                        let farr=this.scalearr.filter((item)=>{
                            return this.selscale[i][0]==item.id;
                        })
                        let darr=farr[0].children.filter((item)=>{
                            return this.selscale[i][1]==item.id;
                        })

                        let item={
                            fkFourshopId:this.selscale[i][0],
                            fkDeptId:this.selscale[i][1],
                            fkFourshopName:farr[0].name,
                            fkDeptName:darr[0].name,
                            percent:this.percentarr[i],
                            
                        }
                        bCouponSchemeUndertakeList.push(item)
                    }else{
                        this.$message.error('信息设置不完整');
                        return false
                    }
                    
                }
                
                let check=this.checkValue(nodes)
                if(!check){
                    return
                }
                
                let d={
                    content:{ 
                        bCouponSchemeOffline:{
                            id:this.id,
                            code:this.code,
                            createTime:this.$format(this.createTime),
                            creater:this.creater,
                            name:this.name,
                            type:this.type,
                            couponAmt:this.couponAmt,
                            thresholdType:this.thresholdType,
                            thresholdAmt:this.thresholdType==1?this.thresholdAmt:'',
                            issuanceQty:this.issuanceQty,
                            undertakeAmt:this.undertakeAmt,
                            remainQty:this.remainQty,
                            validityType:this.validityType,
                            validityDay:this.validityDay,
                            deadTime:this.$format(this.deadTime),
                            startTime:this.$format(this.validityTime[0]),
                            endTime:this.$format(this.validityTime[1]),
                            notice:this.notice,
                            availableStartTime:this.$format(this.availableTime[0]),
                            availableEndTime:this.$format(this.availableTime[1]),
                            mbeGrade:this.mbeGrade.join(','),
                            limitType:this.limitType,
                            limitQty:this.limitQty,
                            isPublic:this.isPublic?1:2,
                            isShared:this.isShared?1:2,
                            vstatus:this.vstatus
                        },
                        bCouponSchemeFourshopList:categoryList,
                        bCouponSchemeUndertakeList:bCouponSchemeUndertakeList
                    }
                }
                this.loading=true
                let res;
                if(this.id==null){
                    res = await this.$post('/couponSys/couponSchemeOffline/add.json',d);
                }else{
                    res = await this.$post('/couponSys/couponSchemeOffline/update.json',d);
                }
                this.loading=false
                if(res.errcode==0){
                    this.$message.success(this.id==null?'添加成功':'修改成功');
                    // eventBus.$emit('resetlechenglist')
                    this.$router.go(-1)
                }else{
                    this.$message.error(res.msg);
                }
            },
            goBack(){
                this.$router.go(-1)
            },
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
    .proportion{
        margin-left: 10px;
    }
</style>
