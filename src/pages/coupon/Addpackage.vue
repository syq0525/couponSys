
<template>
    <section>
        <el-row class="breadcrumb">券方案/{{id==null?'创建':queryStatus==2?'编辑':'查看'}}券包方案</el-row>
        <div class="create-info">
            <span>券包方案编码：{{code}}</span>
            <span class="fr">创建人：{{username}} | 创建时间：{{$format(createTime)}}</span>
        </div>
        <el-card v-loading="loading">
            <el-row >
                <el-col class="module-title" >基本设置</el-col>
            </el-row>
            <el-row >
                <el-col>
                    <span class="search-span">券包方案名称：</span>
                    <el-input v-model="name" :disabled="queryStatus!=2&&id!=null?true:false" style="width:50%" placeholder="券包方案名称不可以超过100个字符" @input="checkName(name,100,'name')"></el-input>
                </el-col>
            </el-row>
            <el-row >
                <el-col :md="8">
                    <span class="search-span">券包数量：</span>
                    <el-input style="width:80px" v-model="issuanceQty" @input="keyupNum('issuanceQty',issuanceQty)" :disabled="queryStatus!=2&&id!=null?true:false" ></el-input>
                    <span>套</span>
                </el-col>
            </el-row>
            <!-- <el-row>
                <span class="search-span fl" style="width:140px">设置券包内容：</span>
                <el-col :span="8">
                    <el-tree 
                        :data="couponArr" 
                        :props="defaultProps"  
                        ref="tree1"
                        show-checkbox 
                        node-key="id" 
                        @check="selCoupon">
                        
                    </el-tree>
                </el-col>
                <el-col :span="8">
                    <el-tree 
                        :data="selcouponArr" 
                        :props="defaultProps"  
                        ref="tree2"
                        node-key="id" >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                            
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => remove(node, data)">
                                Delete
                            </el-button>
                            </span>
                        </span>
                    </el-tree>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col v-for="(item,index) in selscale" :key="index">
                    <span class="search-span fl" style="width:140px;line-height:40px" v-if="index==0">设置券包内容：</span>
                    <span class="search-span fl" style="height:40px;" v-else></span>
                    <el-tag type="primary" style="margin-left:5px">{{index+1}}</el-tag>
                    <el-cascader
                        style="margin-right:10px"
                        :options="scalearr"
                        :props="props"
                        :disabled="queryStatus!=2&&id!=null?true:false"
                        v-model="selscale[index]">
                    </el-cascader>
                    
                    <el-input-number v-model="numarr[index]"   :min="1" :disabled="queryStatus!=2&&id!=null?true:false"></el-input-number> <span>张</span>
                    <el-button type="primary" class="el-icon-plus" @click="plusScale" style="margin-left:10px"></el-button>
                    <el-button type="primary" class="el-icon-minus" @click="minusScale(index)" v-if="selscale.length>1"></el-button>
                </el-col>
                
            </el-row>
            <el-row >
                <el-col >
                    <span class="search-span">券包描述：</span>
                    <el-input type="textarea" :rows="4" placeholder="请详细描述该券包使用的说明内容，不超过500个字符" style="width:50%" v-model="notice" @input="checkName(notice,500,'remark')" :disabled="queryStatus!=2&&id!=null?true:false"></el-input>
                </el-col>
            </el-row>
            <el-row >
                <el-col class="module-title" >推广设置</el-col>
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
        name:'addpackage',
        data(){
            return{
                loading:false,
                queryStatus:this.$route.query.status||null,
                id:this.$route.query.id||null,
                code:'',  //券包编码
                createTime:'',  //创建时间
                creater:'',
                fkCreatorUserId:'',
                username:'',
                name:'',
                issuanceQty:'',
                notice:'',
                vstatus:2,
                isShared:false,  //是否分享  1.是  2.否

                selscale:[   //选券包值
                   []
                ],  
                props:{
                    label:'name',
                    value: 'id',
                    children: 'children'
                },
                scalearr:[
                    {
                        children:[],
                        id:1,
                        name:'优惠券'
                    },{
                        children:[],
                        id:2,
                        name:'乐橙券'
                    },{
                        children:[],
                        id:3,
                        name:'外平台券'
                    },
                ],
                numarr:[1]  //选择张数
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
            
            plusScale(){
                this.selscale.push([])
                this.numarr.push(1)
            },
            minusScale(index){
                this.selscale.splice(index,1)
                this.numarr.splice(index,1)
            },

            async getCode(){
                
                let res = await this.$get('/couponSys/couponPackage/create.json');
                this.code=res.entity.code
                this.createTime=res.entity.createTime
                this.creater=res.entity.creater
                this.scalearr[0].children=res.coupons.listOn;
                this.scalearr[1].children=res.coupons.listOff;
                this.scalearr[2].children=res.coupons.listOut;
                let userinfo = unescape(sessionStorage.getItem('userinfo'));
                if (userinfo) {
                    userinfo = JSON.parse(userinfo);
                    this.creater=userinfo.id;
                    this.username=userinfo.name
                }
            
            },
            async initInfo(){
                let d={
                    id:this.id
                }
                let res = await this.$get('/couponSys/couponPackage/toUpdate.json',d);
                this.code=res.entity.code
                this.name=res.entity.name
                this.username=res.entity.createrName
                this.creater=res.entity.creater
                this.createTime=res.entity.createTime
                this.issuanceQty=res.entity.issuanceQty
                this.notice=res.entity.notice
                this.vstatus=res.entity.vstatus
                this.isShared=res.entity.isShared==1?true:false
                this.scalearr[0].children=res.listOn;
                this.scalearr[1].children=res.listOff;
                this.scalearr[2].children=res.listOut;

                this.selscale=[]
                this.numarr=[]
                for(let i=0;i<res.subList.length;i++){
                    let item=[Number(res.subList[i].couponSchemeType),res.subList[i].pkCouponSchemeId]
                    this.selscale.push(item)
                    this.numarr.push(res.subList[i].couponQty)
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
            checkValue(){
                if(this.name==''||this.issuanceQty==''){
                    this.$message.error('信息设置不完整');
                    return false
                }
                
                return true
            },
            async saveInfo(){
                let bCouponPackageSubList=[]
                for(let i=0;i<this.selscale.length;i++){
                    if(this.selscale[i].length!=0){
                        
                        let item={
                            couponSchemeType:this.selscale[i][0],
                            pkCouponSchemeId:this.selscale[i][1],
                            couponQty:this.numarr[i],
                        }
                        bCouponPackageSubList.push(item)
                    }else{
                        this.$message.error('信息设置不完整');
                        return false
                    }
                    
                }

   
                let check=this.checkValue()
                if(!check){
                    return
                }
                let d={
                    content:{ 
                        bCouponPackage:{
                            id:this.id,
                            code:this.code,
                            createTime:this.$format(this.createTime),
                            creater:this.creater,
                            name:this.name,
                            issuanceQty:this.issuanceQty,
                            notice:this.notice,

                            isShared:this.isShared?1:2,
                            vstatus:this.vstatus
                        },
                        bCouponPackageSubList:bCouponPackageSubList,
                    }
                }
                this.loading=true
                let res;
                if(this.id==null){
                    res = await this.$post('/couponSys/couponPackage/add.json',d);
                }else{
                    res = await this.$post('/couponSys/couponPackage/update.json',d);
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

