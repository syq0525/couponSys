<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
      <el-tab-pane label="优惠券" name="first" v-if="couponread">
        <couponlist :couponadd="couponadd" :couponstart="couponstart" :couponstop="couponstop" :couponupdate="couponupdate" :coupondelete="coupondelete" :couponcopy="couponcopy"></couponlist>
      </el-tab-pane>
      <el-tab-pane label="乐橙券" name="second" v-if="lechengread">
        <lechenglist :lechengadd="lechengadd" :lechengstart="lechengstart" :lechengstop="lechengstop" :lechengupdate="lechengupdate" :lechengdelete="lechengdelete" :lechengcopy="lechengcopy"></lechenglist>
      </el-tab-pane>
      <el-tab-pane label="外平台券" name="third" v-if="platformread">
        <platformlist :platformadd="platformadd" :platformstart="platformstart" :platformstop="platformstop" :platformupdate="platformupdate" :platformdelete="platformdelete" :platformcopy="platformcopy"></platformlist>
      </el-tab-pane>
      <el-tab-pane label="券包" name="four" v-if="packageread">
        <packagelist :packageadd="packageadd" :packagestart="packagestart" :packagestop="packagestop" :packageupdate="packageupdate" :packagedelete="packagedelete" :packagecopy="packagecopy"></packagelist>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import couponlist from './Couponlist.vue'
  import lechenglist from './Lechenglist.vue'
  import platformlist from './Platformlist.vue'
  import packagelist from './Packagelist.vue'
  export default {
    name:'in-couponbox',
    data(){
      return{
        activeName: 'first',
        couponread:false,
        lechengread:false,
        platformread:false,
        couponadd:false,
        lechengadd:false,
        platformadd:false,
        couponstart:false,
        lechengstart:false,
        platformstart:false,
        couponstop:false,
        lechengstop:false,
        platformstop:false,
        couponupdate:false,
        lechengupdate:false,
        platformupdate:false,
        coupondelete:false,
        lechengdelete:false,
        platformdelete:false,
        couponcopy:false,
        lechengcopy:false,
        platformcopy:false,
        packageread:false,
        packageadd:false,
        packagestart:false,
        packagestop:false,
        packageupdate:false,
        packagedelete:false,
        packagecopy:false,
      }
    },
    components:{
      couponlist,
      lechenglist,
      platformlist,
      packagelist
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
          case 'four':
            index=3;
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
            functionStr:'coupon'
        };
        let res = await this.$get('/couponSys/mgrFunction/getFunction.json',d);
        if(res.couponadd){
          this.couponadd=true
        }
        if(res.couponread){
          this.couponread=true
        }
        if(res.lechengadd){
          this.lechengadd=true
        }
        if(res.lechengread){
          this.lechengread=true
        }
        if(res.platformadd){
          this.platformadd=true
        }
        if(res.platformread){
          this.platformread=true
        }

        if(res.couponstart){
          this.couponstart=true
        }
        if(res.lechengstart){
          this.lechengstart=true
        }
        if(res.platformstart){
          this.platformstart=true
        }
        if(res.couponstop){
          this.couponstop=true
        }
        if(res.lechengstop){
          this.lechengstop=true
        }
        if(res.platformstop){
          this.platformstop=true
        }

        if(res.couponupdate){
          this.couponupdate=true
        }
        if(res.lechengupdate){
          this.lechengupdate=true
        }
        if(res.platformupdate){
          this.platformupdate=true
        }
        if(res.coupondelete){
          this.coupondelete=true
        }
        if(res.lechengdelete){
          this.lechengdelete=true
        }
        if(res.platformdelete){
          this.platformdelete=true
        }
        if(res.couponcopy){
          this.couponcopy=true
        }
        if(res.lechengcopy){
          this.lechengcopy=true
        }
        if(res.platformcopy){
          this.platformcopy=true
        }

        if(res.packageadd){
          this.packageadd=true
        }
        if(res.packageread){
          this.packageread=true
        }
        if(res.packagestart){
          this.packagestart=true
        }
        if(res.packagestop){
          this.packagestop=true
        }
        if(res.packageupdate){
          this.packageupdate=true
        }
        if(res.packagedelete){
          this.packagedelete=true
        }
        if(res.packagecopy){
          this.packagecopy=true
        }

        if(!res.couponread){
          this.activeName='second'
        }else if(!res.couponread&&!res.lechengread){
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
