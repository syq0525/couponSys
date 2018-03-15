export default {
    methods: {
      keyupNum(name,num){
        if(num){
            this.$nextTick(()=>{
                if(num==0){
                    this[name]=''
                }else{
                    this[name]=num.replace(/\D/g,'')
                }
                
            })     
        }
      },
      keyupMoney(name,num,index=-1){
          if(num){
              this.$nextTick(()=>{
                  if(num==0){
                      if(index!=-1){
                        this[name][index]=''
                      }else{
                        this[name]=''
                      }
                    
                  }else{
                    if(index!=-1){
                        this.$set(this[name],index,num.replace(/[^\d^\.]+/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'))                   
                    }else{
                        this[name]=num.replace(/[^\d^\.]+/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
                    }    
                  }
              })     
          }
      },
      $format(date){
        if(!date){
            return ''
        }
        let d=new Date(date);
        let month=(d.getMonth() + 1).toString().length<2 ? '0'+(d.getMonth() + 1):(d.getMonth() + 1);
        let day=d.getDate().toString().length<2 ? '0'+d.getDate():d.getDate();
        let hour=d.getHours().toString().length<2 ? '0'+d.getHours():d.getHours();
        let minutes=d.getMinutes().toString().length<2 ? '0'+d.getMinutes():d.getMinutes();
        let seconds=d.getSeconds().toString().length<2 ? '0'+d.getSeconds():d.getSeconds();
        let time=d.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
        return time
      }
    }
  }
  