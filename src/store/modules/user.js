import Cookies from 'js-cookie';
import { userLogout } from "@/libs/api";
var handel = true;
export default {
    mutations: {
        logout (state, vm) {
            if(!handel) return false;
            userLogout().then(res => {
                handel = false;
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("login_data");
                sessionStorage.removeItem("LUBAN_WAIT_CONUNT");
                if(vm){
                    vm.websock.close(3001);
                    vm.$store.state.app.pageOpenedList = [];
                }
                vm.$router.push({
                    name: 'login'
                });
                setTimeout(() => {
                    location.reload()
                }, 200);
            });
        },
        fetch: function() {
 
            return window.JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
           
        },
           
        save: function(items) {
        
            window.localStorage.setItem(STORAGE_KEY, window.JSON.stringify(items))
        
        }
    }
};

