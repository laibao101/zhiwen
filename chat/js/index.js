


$(function () {
	/*显示文章内容*/
	$.ajax({
		type:"post",
		url:"show_content.php",
		success:function(response){
			var arr=$.parseJSON(response);
			var html='';
			var json2={};
			var json={};
			$.ajax({
				type:"post",
				url:"show_content_img.php",
				success:function (response) {
					json2=$.parseJSON(response);
					for(var i=0; i<json2.length; i++){
						for(var j=0;j<arr.length;j++){
							if(json2[i].content_id==arr[j].content_id){
								arr[j]["url"]=json2[i].url;
							}else{

							}
						}
					}
					for(var i=0; i<arr.length; i++){
						if(!arr[i].url){
							arr[i]["url"]='img/1.jpg';
						}
					}
					$(arr).each(function(){
						html='<div class="media">\
							<div class="row">\
								<p><span class="pub_user">'+$(this)[0].user+'</span><span>发表于</span><time>'+$(this)[0].date+'</time></p>\
								<div class="media-left col-lg-3 col-md-3 col-xm-3">\
									<a href="javascript:;" class="thumbnail">\
										<img src="'+$(this)[0].url+'" alt="" />\
									</a>\
								</div>\
								<div class=" col-lg-9 col-md-9 col-xm-9">\
									<h3 class="media-heading">'+$(this)[0].title+'</h3>\
									<p>'+$(this)[0].content.substring(0,200)+'</p>\
								</div>\
							</div>\
							<div class="row">\
				<ul class="nav navbar-nav ">\
					<li><a href="javascript:;" class="comment_num" data-id='+$(this)[0].id+'>\
					<span class="glyphicon glyphicon-comment"></span>\
					'+$(this)[0].count+'条评论</a></li>\
				<li><a href="javascript:;">\
					<span class="glyphicon glyphicon-send"></span>\
					分享</a></li>\
				</ul>\
				</div><div class="comment hide" ></div></div><hr />\
					</div>';
						$("#content").append(html);
					});
					/*将循环好的文章写入页面*/
					//$("#content").append(html);

					/*点击有多少条评论的按钮，载入评论内容并且循环好，再写入页面*/
					$(".glyphicon-comment").parents("li").each(function (index,value) {
						$(this).on("click","a",function(){
							var aA=$(this);
							var comment=aA.parents(".media").find(".comment");
							if(comment.hasClass("hide")){
								aA.css("background","#afd9ee");
								comment.removeClass("hide").css("display","none").slideDown("slow");
								$.ajax({
									type:"post",
									url:"show_comment.php",
									data:{
										titleid : aA.attr("data-id"),
									},
									success: function (response) {
										/*加载第一次的两条评论*/
										var json= $.parseJSON(response);
										var html2='';
										comment.html('');
										var count= 0;
										/*存在评论就加载评论*/
										if(json.length!=0){
											count=json[0].count;
											$(json).each(function (index,value) {
												html2+='<div class="row">\
												<p><span class="pub_user">'+$(this)[0].user+'</span><span>发表于</span><time>'+$(this)[0].date+'</time></p>\
											<div class="media-left col-lg-2 col-md-2 col-xm-3 col-xs-3">\
												<a href="javascript:;" class="thumbnail">\
												<img src="img/1.jpg" alt="" />\
												</a>\
												</div>\
												<div class=" col-lg-10 col-md-10 col-xm-9 col-xs-9">\
												<p>\
												'+$(this)[0].comment+'\
											</p>\
											</div>\
											</div>';
											});

										}

										var page=2;
										if(page<count){//还有评论
											html2+='<button class="btn btn-default btn-block load" data-id="'+aA.attr("data-id")+'">加载更多评论</button>';

										}
										html2+='<textarea name="comment" rows="4" cols="" class="form-control"></textarea>\
										<div class="col-lg-offset-11 col-md-offset-11 col-xm-offset-10 col-xs-offset-10">\
										<button class="btn btn-default right  add_submit" data-id="'+aA.attr("data-id")+'">提交</button>\
										</div>';
										comment.append(html2);
										var load_btn=comment.find(".load");
										if(load_btn){
											/*点击加载更多评论*/
											$(".load").click(function () {
												if(page<=count){//能加载更多评论
													load_btn.html("<span ><img src='img/more_load.gif'/></span>");
													$.ajax({
														type:"post",
														url:"show_comment.php",
														data:{
															titleid : aA.attr("data-id"),
															page:page++,
														},
														success: function (response) {
															var json2= $.parseJSON(response);
															var html3='';
															$(json2).each(function () {
																html3+='<div class="row">\
															<p><span class="pub_user">'+$(this)[0].user+'</span><span>发表于</span><time>'+$(this)[0].date+'</time></p>\
														<div class="media-left col-lg-2 col-md-2 col-xm-3 col-xs-3">\
															<a href="javascript:;" class="thumbnail">\
															<img src="img/1.jpg" alt="" />\
															</a>\
															</div>\
															<div class=" col-lg-10 col-md-10 col-xm-9 col-xs-9">\
															<p>\
															'+$(this)[0].comment+'\
														</p>\
														</div>\
														</div>';
															});
															$(html3).insertBefore( load_btn );
															load_btn.html("加载更多评论");
															if(page==6){
																load_btn.remove();
															}
														},
													})
												}
											});

										}

										/*提交评论*/
										var add_submit=comment.find(".add_submit");
										add_submit.click(function () {

											/*登录了才能提交，没有登录点击提交就弹出登录框*/
											if($.cookie("user")){
												if(comment.find("textarea").val()!='' ){//登录了填写了评论内容，才能发送提交请求
													$.ajax({
														type:"post",
														url:"add_comment.php",
														data:{
															titleid:add_submit.attr("data-id"),
															user: $.cookie("user"),
															comment:comment.find("textarea").val(),
														},
														beforeSend: function () {
															$("#loadding span").html("正在提交评论");
															$("#loadding").modal("show");
														},
														success: function () {
															$("#loadding span").html("提交成功").css("background-image","url(img/reg_succ.png)");
															setTimeout(function () {
																$("#loadding").modal("hide");
																$("#loadding span").html("正在提交").css("background-image","url(img/loading.gif)");

															},500);
															var Reg=/[^0-9]+/g;
															aA.html('<span class="glyphicon glyphicon-comment"></span> ' +(Number(aA.html().replace(Reg,''))+1)+'条评论');
															var html3='';
															var date=new Date();
															var time=date.getFullYear()+"-"+( (date).getMonth()+1 )+ "-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
															html3+='<div class="row">\
														<p><span class="pub_user">'+$.cookie("user")+'</span><span>发表于</span><time>'+time+'</time></p>\
													<div class="media-left col-lg-2 col-md-2 col-xm-3 col-xs-3">\
														<a href="javascript:;" class="thumbnail">\
														<img src="img/1.jpg" alt="" />\
														</a>\
														</div>\
														<div class=" col-lg-10 col-md-10 col-xm-9 col-xs-9">\
														<p>\
														'+comment.find("textarea").val()+'\
													</p>\
													</div>\
													</div>';
															/*如果已经存在至少一条评论，那就直接插在第一个的前面，否则就直接添加进去*/

															if(comment.children().eq(0).hasClass(".row")){
																$(html3).insertBefore(comment.find(".row").eq(0));
															}else {
																$(html3).insertBefore(comment.find("textarea[name=comment]"));
															}
														}
													});
												}else{
													alert("评论内容不能为空");
												}
											}else{
												$("#login").modal("show");
											}

										});


									},
									beforeSend: function () {
										var html2='';
										html2='<div class="row load_con" >\
									<span class="loadding">正在加载评论</span>\
									</div>';
										comment.append(html2);
									}
								});
							}else{
								comment.slideUp("fast", function () {
									comment.addClass("hide");
									aA.css("background","white");
									aA.hover(function () {
										$(this).css("background","#eee");
									},function () {
										$(this).css("background","white");
									});
								});

							}


						})
					})
				}
			});

		}
	});
	/*存在cookie就直接显示登陆*/
	if($.cookie("user")){
		$(".member").find("li:first a ").html( $.cookie("user"));
		$(".member").removeClass("hide");
		$(".reg").addClass("hide");
		$("#side_reg").addClass("hide");
		show_user_img();
		$("#user-info").removeClass("hide");
		show_user_info();
		$("#user_img").click(function () {
			$("#user-info .navbar-brand").trigger("click");
		});
	}
	/*显示用户详细信息*/
	function show_user_info() {
		$.ajax({
			type:'post',
			url:'show_side_question.php',
			data:{
				user:$.cookie("user"),
			},
			success:function (response) {
				var json=$.parseJSON(response);
				$("#all_question").find(".badge").html(json.length);
				$("#side_member").html($.cookie("user"));
				var src=show_user_img();
				var html='';
				$(json).each(function (index) {
					html+='<tr>\
								<td >'+(index+1)+'</td>\
								<td>'+$(this)[0].title.substring(0,11)+'...</td>\
							</tr>';
				});
				$("#show_all_title").find('tbody').html(html);
			}
		})
	}
	/*显示导航栏用户头像和侧边栏用户头像*/
	function show_user_img() {
		$.ajax({
			type:"post",
			url:'show_user_img.php',
			data:{
				user:$.cookie("user"),
			},
			success:function (response) {
				if(response==''){//如果返回里面是空，那么就是用户没有上传过头像，就显示默认头像
					$("#user_img").html('<span class="glyphicon glyphicon-user"></span>'+$.cookie("user"));
					$("#user_img").css("background-image","none");
					$("#side_member").prev().html('<span class="glyphicon glyphicon-user"></span></a>');
					return false;
				}else{//如果返回有路径，就显示用户头像
					$("#user_img").html($.cookie("user"));
					$("#user_img").css("background-image","url(uploads/user/"+response+")");
					$("#side_member").prev().html('<img src="uploads/user/'+response+'" style=""  class="img-responsive img-circle" alt="">');
				}


			}
		})
	}
});

window.onload=function () {
	$(function(){

		/*日历*/
		$('#datetimepicker').datetimepicker({
			weekStart:0,
			todayHighlight:true,
			show:true,
			todayBtn:true,
			autoclose:true,
			showMeridian:false,
			startView: 2,
			language: 'zh-CN',
			minView: 2,
			keyboardNavigation:true,
			format: 'yyyy-mm-dd ',

		}) ;
		/*边栏日历*/
		$('#datetimepicker_side').datetimepicker({
			weekStart:0,
			todayHighlight:true,
			show:true,
			todayBtn:true,
			autoclose:true,
			showMeridian:false,
			startView: 2,
			language: 'zh-CN',
			minView: 2,
			keyboardNavigation:true,
			format: 'yyyy-mm-dd '
		}) ;

		var date=new Date();
		var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();


		/*选择性别*/
		$(".choose .btn").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			$(this).find("input").attr("checked","checked");
			$(this).siblings().find("input").removeAttr("checked");
		});

		/*注册*/
		$("#reg form").validate({
			submitHandler: function(form,FormData) {
				var str='';
				str=$("#reg form").serialize()+"&sex="+ encodeURI( $("#reg form .btn").find("input[checked=checked]").val() )+"&birthday="+$("#datetimepicker").find("input").val();
				function sub(){
					$.ajax({
						type:"post",
						url:"add.php",
						data:str,
						success:function(){

							$("#loadding span").html("注册成功！").css("background-image","url(img/reg_succ.png)");
							setTimeout(function(){
								$("#loadding").modal("hide");
								$("#reg").addClass("modal").modal("hide");
								setTimeout(function(){
									$("#loadding").html("正在提交").css("background-image","url(img/loading.gif)");
								},500)

							},800);
							$.cookie("user",$("#user").val());
							$(".member").find("li:first a ").html('<span class="glyphicon glyphicon-user"></span>'+  $.cookie("user"));
							$(".member").removeClass("hide");
							$(".reg").addClass("hide");
							$(form).resetForm();
							$("#user_img").click(function () {
								$("#user-info .navbar-brand").trigger("click");
							});
						},
						beforeSend:function(){
							$("#loadding").modal("show");
							$("#reg").removeClass("modal");
						}
					});
				}
				$(form).ajaxSubmit({
					beforeSubmit:sub,

				})

			},
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();

				if (errors > 0) {
					$('#reg').css( 'height', errors * 20 + 380);
				} else {
					$('#reg').css( 'height', 380);
				}
				this.defaultShowErrors();
			},

			rules: {
				user: {
					minlength: 6,
					required: true,
					remote:{
						url:"is_user.php",
						type:"post",
					}
				},
				pass:{
					required:true,
					minlength:6,
				},
				email:{
					required:true,
					email:true,
				},
				date:{
					date:true,
				},
			},

			messages:{
				user:{
					minlength:"请输入至少6位",
					required:"用户名不得为空",
					remote:"账号已经存在，请尝试其他账号"
				},
				pass:{
					minlength:"请输入至少6位",
					required:"密码不得为空",
				},
				email:{
					required:"邮箱不得为空",
				},
			},
			errorLabelContainer: '#reg_error',
			wrapper:'li',

		});

		/*边栏注册*/
		$("#side_reg form").validate({
			submitHandler: function(form,FormData) {
				var str='';
				str=$("#reg form").serialize()+"&sex="+ encodeURI( $("#reg form .btn").find("input[checked=checked]").val() )+"&birthday="+$("#datetimepicker").find("input").val();
				function sub(){
					$.ajax({
						type:"post",
						url:"add.php",
						data:str,
						success:function(){
							/*隐藏侧边栏，显示用户信息*/
							$("#side_re").addClass("hide");
							$("#user-info").removeClass("hide");

							$("#loadding span").html("注册成功！").css("background-image","url(img/reg_succ.png)");
							setTimeout(function(){
								$("#loadding").modal("hide");
								setTimeout(function(){
									$("#loadding").html("正在提交").css("background-image","url(img/loading.gif)");
								},500)

							},800);
							$.cookie("user",$("#side_user").val());
							$(".member").find("li:first a ").html('<span class="glyphicon glyphicon-user"></span> '+  $.cookie("user"));
							$(".member").removeClass("hide");
							$(".reg").addClass("hide");
							$(form).resetForm();
							$("#user_img").click(function () {
								$("#user-info .navbar-brand").trigger("click");
							});
						},
						beforeSend:function(){
							$("#loadding").modal("show");
						}
					});
				}
				$(form).ajaxSubmit({
					beforeSubmit:sub,

				})

			},
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();

				if (errors > 0) {
					$('#reg').css( 'height', errors * 20 + 380);
				} else {
					$('#reg').css( 'height', 380);
				}
				this.defaultShowErrors();
			},

			rules: {
				user: {
					minlength: 6,
					required: true,
					remote:{
						url:"is_user.php",
						type:"post",
					}
				},
				pass:{
					required:true,
					minlength:6,
				},
				email:{
					required:true,
					email:true,
				},
				date:{
					date:true,
				},
			},

			messages:{
				user:{
					minlength:"请输入至少6位",
					required:"用户名不得为空",
					remote:"账号已经存在，请尝试其他账号"
				},
				pass:{
					minlength:"请输入至少6位",
					required:"密码不得为空",
				},
				email:{
					required:"邮箱不得为空",
				},
			},
			errorLabelContainer: '#side_reg_error',
			wrapper:'li',

		});

		$("form").resetForm();


		/*登录*/
		$("#login form").validate({
			submitHandler:function(form){
				$(form).ajaxSubmit({
					type:"post",
					url:"login.php",
					beforeSubmit:function(){
						$("#loadding").modal("show");
						$("#login").removeClass("modal");
					},
					success:function(){
						/*点击用户名，弹出上传头像的对话框*/
						$("#user_img").click(function () {
							$("#user-info .navbar-brand").trigger("click");
						});
						$("#loadding span").html("登录成功！").css("background-image","url(img/reg_succ.png)");
						setTimeout(function(){
							$("#loadding").modal("hide");
							$("#login").addClass("modal").modal("hide");
							setTimeout(function(){
								$("#loadding span").html("正在提交").css("background-image","url(img/loading.gif)");
							},100)

						},500);
						/*设置cookie*/
						if( $("input[name=expires]").is(":checked") ){
							$.cookie("user",$("#login_user").val(),{expires:7,});
						}else{
							$.cookie("user",$("#login_user").val());
						}
						/*登录进去了，如果用户已经上传过头像就显示用户上传的头像，如果用户没有上传头像，就显示默认头像*/
						show_user_img();
						//$(".member").find("li:first a ").html('<span class="glyphicon glyphicon-user"></span>'+  $.cookie("user"));
						$(".member").removeClass("hide");
						$(".reg").addClass("hide");
						$(form).resetForm();
						$("#user-info").removeClass("hide");
						show_user_info();
						$("#side_reg").addClass("hide");

					},
				})
			},
			errorLabelContainer: '#login_error',
			wrapper:'li',
			rules:{
				login_user:{
					required:true,
					minlength:6,
				},
				login_pass:{
					required:true,
					minlength:6,
					remote:{
						url:"login.php",
						type:"post",
						data : {
							login_user : function () {
								return $('#login_user').val();
							},
						},
					}
				}
			},
			messages:{
				login_user:{
					required:"用户名不能为空",
					minlength:"用户名小于6位"
				},
				login_pass:{
					required:"密码不得为空",
					minlength:"密码不能少于6位",
					remote:"账号或者密码不正确",
				}

			}
		});




		/*退出登录*/
		$(".exit").click(function(){
			$.cookie("user",'',{expires:-1});
			$(".member").find("li:first a ").html('<span class="glyphicon glyphicon-user"></span>注册知问');
			$(".reg").removeClass("hide");
			$(".member").addClass("hide");
			$("#loadding").modal("show");
			$("#loadding span").html("退出成功！").css("background-image","url(img/reg_succ.png)");
			$("#user-info").addClass("hide");
			setTimeout(function(){
				$("#loadding").modal("hide");
				$("#side_reg").removeClass("hide");
				setTimeout(function(){
					$("#loadding span").html("正在提交").css("background-image","url(img/loading.gif)");
				},100)

			},800);
		});

		/*提问框里面的上传图片被打开，点击的是图标，但是默认点击input[type=file]*/
		$(".picture").click(function(){
			$(this).next().trigger("click");
		});


		/*问题提交*/
		$(".push").click(function(){

			if($("#question input[name=title]").val()!=''){

				/*获取时间戳，作为文章的唯一识别码*/
				var date=new Date();
				var times=date.getTime();
				/*上传图片*/
				if($('#file')[0].files[0]){
					var formData = new FormData();
					formData.append('file', $('#file')[0].files[0]);
					$.ajax({
						url: 'post_content_img.php',
						type: 'POST',
						cache: false,
						data: formData,
						processData: false,
						contentType: false,
						success:function (response) {
							var json=$.parseJSON(response);
							$.ajax({
								type:"post",
								url:'add_content_img.php',
								data:{
									url:json.url,
									content_id:times,
								},
								success:function () {
									console.log("图片保存成功")
								}

							});

						},
					});
				}

				/*提问框里面的*/

				var src='img/1.jpg';//用来存放图片文件的源码
				/*$("#question form").ajaxSubmit({*/
				$.ajax({
					type:"post",
					url:"add_content.php",
					data:{
						user:$.cookie("user"),
						content:$("textarea[name=question]").val().replace(/\n/ig,''),  //防止有回车会出现bug
						title:$("#title").val(),
						content_id:times,
					},
					beforeSend:function(){
						$("#loadding").modal("show");
						$("#question").removeClass("modal");
						$(".push").addClass("disabled");
						if($('#file')[0].files[0]){
							var oReader = new FileReader();
							oReader.readAsDataURL($('#file')[0].files[0]);
							oReader.onload=function (e) {
								var url=e.target.result;
								src=url;
							};
						}

					},
					success:function(){
						/*问题提交成功后修改侧边栏情况*/
						$(".badge").html( Number($(".badge").html())+1 );
						var td='<tr><td>'+Number($(".badge").html())+'</td><td>'+$("#title").val().substring(0,11)+'...</td></tr>';
						$("#show_all_title").append(td);
						/*问题提交成功后还得获取此问题对应的id*/
						$.ajax({
							url:"show_content.php",
							type:"post",
							success:function (response) {
								var json=$.parseJSON(response);
								var id=0;//存储保存下来的data-id
								for(var i=0; i<json.length; i++){
									if($("#title").val()==json[i].title){
										id=json[i].id;
									}
								}
								$("#loadding span").html("问题提交成功!").css("background-image","url(img/success.gif)");
								var date=new Date();
								var time=date.getFullYear()+"-"+( (date).getMonth()+1 )+ "-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
								var html='';
								html='<div class="media man"><div class="row media-body">\
							<p><span class="pub_user">'+$.cookie("user")+'</span><span>发表于</span><time>'+time+'</time></p>\
							<div class="media-left col-lg-3 col-md-3 col-xm-3">\
								<a href="javascript:;" class="thumbnail">\
									<img src="'+src+'" alt="" />\
								</a>\
							</div>\
							<div class=" col-lg-9 col-md-9 col-xm-9">\
								<h3 class="media-heading">'+$("#title").val()+'</h3>\
								<p>\
								'+$("textarea[name=question]").val()+'\
								</p>\
							</div>\
						</div>\
						<div class="row">\
							<ul class="nav navbar-nav ">\
								<li><a href="javascript:;" data-id="'+id+'">\
								<span class="glyphicon glyphicon-comment" ></span>\
								0条评论</a></li>\
								<li><a href="javascript:;" >\
								<span class="glyphicon glyphicon-send"></span>\
								分享</a></li>\
							</ul>\
				</div><div class="comment hide" ><textarea name="comment" rows="4" cols="" class="form-control"></textarea>\
										<div class="col-lg-offset-11 col-md-offset-11 col-xm-offset-10 col-xs-offset-10">\
										<button class="btn btn-default right  add_submit" data-id="'+id+'">提交</button>\
										</div></div></div><hr />\
					</div>';
								$("#content").prepend(html);
								setTimeout(function(){
									$("#loadding").modal("hide");
									$("#question").addClass("modal").modal("hide");
									$(".push").removeClass("disabled");
									setTimeout(function(){
										$("#loadding span").html("正在提交").css("background-image","url(img/loading.gif)");
									},100);
									$("#question form").resetForm();
								},1200);
								$(".man .glyphicon-comment").parents("li").click(function () {
									var aA=$(this).children("a");
									var comment=$(this).parents(".media").find(".comment");
									if(comment.hasClass("hide")){
										aA.css("background","#afd9ee");
										comment.removeClass("hide").css("display","none").slideDown("slow");
									}else{
										comment.slideUp("fast", function () {
											comment.addClass("hide");
											aA.css("background","white");
											aA.hover(function () {
												$(this).css("background","#eee");
											},function () {
												$(this).css("background","white");
											});
										});
									}
								});
								/*提交评论*/
								var aA=$(".man .glyphicon-comment").parents("li").children("a");
								var comment=$(".man .glyphicon-comment").parents("li").parents(".media").find(".comment");
								var add_submit=comment.find(".add_submit");
								add_submit.click(function () {
									/*登录了才能提交，没有登录点击提交就弹出登录框*/
									if($.cookie("user")){
										if(comment.find("textarea").val()!='' ){//登录了填写了评论内容，才能发送提交请求
											$.ajax({
												type:"post",
												url:"add_comment.php",
												data:{
													titleid:add_submit.attr("data-id"),
													user: $.cookie("user"),
													comment:comment.find("textarea").val(),
												},
												beforeSend: function () {
													$("#loadding span").html("正在提交评论");
													$("#loadding").modal("show");
												},
												success: function () {
													$("#loadding span").html("提交成功").css("background-image","url(img/reg_succ.png)");
													setTimeout(function () {
														$("#loadding").modal("hide");
														$("#loadding span").html("正在提交").css("background-image","url(img/loading.gif)");

													},500);
													var Reg=/[^0-9]+/g;
													aA.html('<span class="glyphicon glyphicon-comment"></span> ' +(Number(aA.html().replace(Reg,''))+1)+'条评论');
													var html3='';
													var date=new Date();
													var time=date.getFullYear()+"-"+( (date).getMonth()+1 )+ "-"+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
													html3+='<div class="row">\
														<p><span class="pub_user">'+$.cookie("user")+'</span><span>发表于</span><time>'+time+'</time></p>\
													<div class="media-left col-lg-2 col-md-2 col-xm-3 col-xs-3">\
														<a href="javascript:;" class="thumbnail">\
														<img src="img/1.jpg" alt="" />\
														</a>\
														</div>\
														<div class=" col-lg-10 col-md-10 col-xm-9 col-xs-9">\
														<p>\
														'+comment.find("textarea").val()+'\
													</p>\
													</div>\
													</div>';
													/*如果已经存在至少一条评论，那就直接插在第一个的前面，否则就直接添加进去*/

													if(comment.children().eq(0).hasClass(".row")){
														$(html3).insertBefore(comment.find(".row").eq(0));
													}else {
														$(html3).insertBefore(comment.find("textarea[name=comment]"));
													}
												}
											});
										}else{
											alert("评论内容不能为空");
										}
									}else{
										$("#login").modal("show");
									}

								});
							}
						});


					}
				});
			}else{
				alert("标题不能为空!");
			}

		});




		/*点击提问按钮，如果没有登录，就弹出登录框，登录了就弹提问框*/
		$(".question").click(function(){
			if(!$.cookie("user")){
				$("#login").modal("show");
			}else{
				$("#question").modal("show");
				$("#question").removeClass("hide");
			}
		});





		/*点击旁边已经有账号，点击注册按钮，弹出登录框*/
		$("#side_exit_btn").click(function () {
			$("#login").modal("show");
		});


		/*登录后，点击会员名旁边的退出按钮，退出登录*/
		$("#side_exit").click(function () {
			$(".exit").trigger("click");
		});

		/*点击侧边栏会员头像，弹出上传头像的模态框*/
		$("#user-info .navbar-brand").click(function () {
			$("#upload_user_img").modal("show");
		});

		/*点击浏览，弹出选择图片的对话框*/
		function show_up_load() {
			$("#upload_img").on('click',function () {
				$(this).next().trigger("click");

			});
		}
		show_up_load();

		/*用户选择文件之后，上传文件*/
		$("#upload_img").next().change(function () {
			var file=$(this)[0].files[0];
			$("#upload_img").prev().val($(this).val());
			var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
			//用户选择的不是图片文件，不能上传，让用户重新选择
			if(!rFilter.test(file.type)){
				alert("不是图片文件，请重新选择");
			}else{
				var url;
				var oReader = new FileReader();
				oReader.readAsDataURL(file);
				oReader.onload=function (e) {
					url=e.target.result;


					$("#preview_user_img").attr("src", url);
					//预览图片加载出来后才让用户确认
					$("#preview_user_img").load(function () {
						var src=url;
						if(confirm("确定这张图片吗?")){
							$("#upload_img").html("上传");
							$("#upload_img").off('click').click(function () {
								var formData=new FormData();
								formData.append("file",file);
								//只有按钮显示上传的时候才能上传，避免上传后再浏览就多上传一次
								if( $("#upload_img").html()=='上传'){
									$.ajax({
										type:"post",
										url:'post_file.php',
										cache: false,
										data: formData,
										processData: false,
										contentType: false,
										beforeSend:function () {
											$("#upload_user_img").removeClass("modal");
											$("#loadding").modal("show");
										},
										success:function (response) {
											/*上传成功，将用户头像，顶部导航头像都立即变更过来*/
											$("#user_img").css("background-image","url("+src+")");
											$("#side_member").prev().html('<img src="'+src+'" style=""  class="img-responsive img-circle" alt="">');
											/*将上传提醒框关闭*/
											$("#upload_user_img").addClass("modal").modal("hide");
											$("#loadding span").html("头像上传成功").css("background-image","url(img/success.gif)");
											setTimeout(function () {
												$("#loadding").modal("hide");
												$("#loadding span").html("正在提交").css("background-image","url(img/loading.gif)");
											},800);
											var json=$.parseJSON(response);
											var url=json.url.substring(json.url.indexOf("r/")+2);
											/*获取保存路径并且写入数据库*/
											$.ajax({
												url:"add_user_img.php",
												type:"post",
												data:{
													url:url,
													user:$.cookie("user"),
												},
												beforeSend:function () {

												},
												success:function () {
													show_up_load();
													$("#upload_img").html("浏览");
												}
											})
										}
									});
								}
							});

						}

					});
				};
			}


		});




	});
};


