$(function(){
    var LUBANKFURL = 'https://www.lubankf.com/';
    //提交
    $('#submitBtn').on('click',function(){
        var i_username = $('.i_username').val(),
            i_phone = $('.i_phone').val(),
            i_email = $('.i_email').val(),
            password_hash = $('.password_hash').val(),
            r_username = $('.r_username').val(),
            r_phone = $('.r_phone').val(),
            remarks = $('.remarks').val();

        var phoneRe = /^1\d{10}$/;
        var emailRe = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        $('.verify_error').hide();
        var data = {
            i_username: i_username,
            i_phone: i_phone,
            i_email: i_email,
            password_hash: password_hash,
            r_username: r_username,
            r_phone: r_phone,
            remarks: remarks
        }
        if(submitForm(data)){
            if (!phoneRe.test(i_phone)){
                $('.verify_tel_error').show().html('手机号格式有误');
                return
            } else if(!emailRe.test(i_email)){
                $('.verify_email_error').show().html('邮箱格式有误');
                return
            } else if(!phoneRe.test(r_phone)){
                $('.verify_rtel_error').show().html('手机号码格式有误');
                return
            }
            submitForm(data);
        }
    })

    var submitForm = function(data){
        $.ajax({
            type: 'post',
            data: data,
            url: LUBANKFURL + 'api/recommend/recommend/submit.htm',
            success: function(res){
                if(res.code == 0){
                    $('.success_box,.mark').fadeIn();
                    $('.form_val').val('');
                }else{
                    $('.wrong').fadeIn().find('p').html(res.msg);
                    setTimeout(function() {
                        $('.wrong').fadeOut();
                    }, 1500)
                }
            },
            error: function(){
                console.log('errror');
            }
        })
    }

    var validate = function(){
        var tag = true;
        var val = $('.form_val');
        $('.error').hide();
        for(var i = 0; i < val.length; i++){
            if(!val.eq(i).val()){
                tag = false;
                val.eq(i).siblings('.error').show();
            }
        }
        return tag;
    }

    $('.mark').on('click',function(){
        $('.mark, .success_box').fadeOut();
    })
})