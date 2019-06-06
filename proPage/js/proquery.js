$(function(){
    var LUBANKFURL = 'https://www.lubankf.com/';
    //查询
    $('.query_btn').on('click',function(){
        var emailRe = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        var email = $('.email').val(),
            pw = $('.password').val();
        if(!email){
            showError('form_item_email', '请填写您的邮箱');
            return
        }else if(!pw){
            showError('form_item_pw', '请填写查询密码');
            return
        }else if(!emailRe.test(email)){
            showError('form_item_email', '邮箱格式有误');
            return
        }
        var data = {
            i_email: email,
            password_hash: pw
        }
        queryRecommed(data);
        $('.submit_loading').show();
    })


    var queryRecommed = function(data){
        $.ajax({
            type: 'post',
            url: LUBANKFURL + 'api/recommend/recommend/search.htm',
            dataType: 'json',
            data: data,
            success: function(res){
                if(res.code == 0){
                    $('.error,.query_btn').remove();
                    $('.table').show();
                    var str = '';
                    res.data.forEach(e => {
                        str += '<tr>\
                            <td>'+ e.r_username +'</td>\
                            <td>'+ e.r_phone +'</td>\
                            <td class="content">'+ e.remarks +'</td>\
                            <td>'+ e.status +'</td>\
                            <td>'+ e.pay_status +'</td>\
                            <td>'+ e.money +'</td>\
                            <td class="content">'+ e.note +'</td>\
                        </tr>';
                    });
                    $('#tbody').html(str);
                }else{
                    showError('from', res.msg);
                }
                $('.submit_loading').hide();
            },
            error: function(){
                console.log('error');
            }
        })
    }

    var showError = function(dom, msg){
        var str = '<div class="error">'+ msg +'</div>'
        $('.error').remove();
        $('.'+ dom).append(str);
    }
})