<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
      <el-tab-pane label="核销券" name="first" v-if="verifyoperate">
        <verifypage></verifypage>
      </el-tab-pane>
      <el-tab-pane label="核销记录" name="second" v-if="verifyread">
        <verifylist></verifylist>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import verifypage from './Verifypage.vue'
  import verifylist from './Verifylist.vue'
  export default {
    data(){
      return{
        activeName: 'first',
        verifyread:false,
        verifyoperate:false
      }
    },
    components:{
      verifypage,
      verifylist,
    },
    mounted(){
      this.getData()
    },
    methods: { 
      async getData(){
        this.listLoading=true
        let d={
            functionStr:'verify'
        };
        let res = await this.$get('/couponSys/mgrFunction/getFunction.json',d);
        if(res.verifyread){
          this.verifyread=true
        }
        if(res.verifyoperate){
          this.verifyoperate=true
        }
        if(!res.verifyoperate){
          this.activeName='second'
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
