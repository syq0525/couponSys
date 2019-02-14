<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
      <el-tab-pane label="营销活动" name="first" v-if="marketinglistread">
        <mrketinglist :marketinglistadd="marketinglistadd"  :marketinglistupdate="marketinglistupdate" :marketinglistdelete="marketinglistdelete" :marketinglistpush="marketinglistpush"></mrketinglist>
      </el-tab-pane>
      <el-tab-pane label="线下制券记录" name="second" v-if="underlineread">
        <underlinelist :underlineadd="underlineadd" :underlineupdate="underlineupdate" :underlinedelete="underlinedelete" :underlinedownload="underlinedownload" :underlinemake="underlinemake"></underlinelist>
      </el-tab-pane>
      <el-tab-pane label="发放记录" name="third" v-if="grantlistread">
        <grantlist></grantlist>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
  import mrketinglist from './Marketinglist.vue'
  import underlinelist from './Underlinelist.vue'
  import grantlist from './Grantlist.vue'
  export default {
    name:'in-grantbox',
    data(){
      return{
        activeName: 'first',
        marketinglistread:false,
        grantlistread:false,
        marketinglistadd:false,
        marketinglistupdate:false,
        marketinglistdelete:false,
        marketinglistpush:false,
        underlineread:false,
        underlineadd:false,
        underlineupdate:false,
        underlinedelete:false,
        underlinedownload:false,
        underlinemake:false,
      }
    },
    components:{
      mrketinglist,
      underlinelist,
      grantlist,
    },
    activated(){
      this.getData()
    },
    watch:{
      activeName(val){
        var index=0;
        switch(val){
          case 'first':
            index=0;
            break;
          case 'second':
            index=1;
            break;
          case 'third':
            index=2;
            break;
        }

        document.querySelectorAll('.el-table')[index].style.width = "99.9%";
        setTimeout(()=>{
          document.querySelectorAll('.el-table')[index].style.width = "100%";
        },100)
      }
      
    },
    methods: { 
      async getData(){

        this.listLoading=true
        let d={
            functionStr:'grant'
        };
        let res = await this.$get('/couponSys/mgrFunction/getFunction.json',d);
        if(res.marketinglistread){
          this.marketinglistread=true
        }
        if(res.grantlistread){
          this.grantlistread=true
        }
        if(res.marketinglistadd){
          this.marketinglistadd=true
        }
        if(res.marketingliststart){
          this.marketingliststart=true
        }
        if(res.marketingliststop){
          this.marketingliststop=true
        }
        if(res.marketinglistupdate){
          this.marketinglistupdate=true
        }
        if(res.marketinglistdelete){
          this.marketinglistdelete=true
        }
        if(res.marketinglistpush){
          this.marketinglistpush=true
        }
        if(res.underlineread){
          this.underlineread=true
        }
        if(res.underlineadd){
          this.underlineadd=true
        }
        if(res.underlineupdate){
          this.underlineupdate=true
        }
        if(res.underlinedelete){
          this.underlinedelete=true
        }
        if(res.underlinedownload){
          this.underlinedownload=true
        }
        if(res.underlinemake){
          this.underlinemake=true
        }
        if(!res.marketinglistread){
          this.activeName='second'
        }else if(!res.marketinglistread&&!res.grantlistread){
          this.activeName='third'
        }
      },
      
      handleClick(tab, event) {
          // this.$router.replace({path:'/home/coupon/couponbox',query:{type:this.activeName}})
      }
    }
  }
</script>
<style lang="scss">

</style>
