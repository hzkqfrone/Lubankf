import { get, post } from './http'

/*
*注册
 *  mobile	string	是	手机号
 *  sms_code	int	是	验证码
 *  step	int	是	第几步，传1
 */
export function register(data) { return post('api/default/register.htm', data); }

//获取验证码
export function sendCode(data) { return post('api/default/sms-send-code.htm', data); }

//验证邀请码 获取推荐人
export function referrer(data) { return post('api/recommend/recommend/validate-invite-code.htm', data); }


//获取token
export function getToken(data) { return post('api/default/get-token.htm', data); }


//滑块成功后调用
export function ncpc(data) { return post('api/default/ncpc.htm', data); }

//找回密码
export function forgetPassword(data) { return post('api/default/forget-password.htm', data); }

//短信登录
export function textLogin(data) { return post('	api/default/sms-login.htm', data); }

//修改密码
export function changepwd(data) { return post('/vueApi/changepwd', data); }

//首页登录
export function getUserLogin(data) { return post('api/default/login.htm', data); }

//退出登录
export function userLogout(data) { return post('api/admin/logout.htm', data); }

//登录首页列表-标签查询
//tag	int	否	0会话中 1已离线
export function getUserList(data) { return post('api/task/index.htm', data); }

//上传 - 上传图片
export function uploadImage(data) { return post('api/upload/image.htm', data); }

//聊天历史记录
export function chatLog(data) { return post('api/task/chat-log.htm', data); }


//修改未读为已读
export function changeReader(data) { return post('api/task/reader.htm', data); }

//获取未读消息数未读
export function getUnreadTaskApi(data) { return get('api/task/count-num.htm', data); }

//添加修改标签信息  修改 传id
export function addEditTag(data) { return post('api/tags/edit.htm', data); }


//用户标签 - 获取标签信息
export function getTagInfo(data) { return post('api/tags/info.htm', data); }

//用户标签 - 删除标签
export function deleteTag(data) { return post('api/tags/delete.htm', data); }

//用户标签 - 修改用户标签
export function editUserTag(data) { return post('api/user/add-tag.htm', data); }

//删除用户标签
export function deleteUserTag(data) { return post('api/user/del-tag.htm', data); }

//結束服務
export function closeTask(data) { return post('api/task/close-task.htm', data); }

//获取可转接客服列表
export function getService(data) { return post('api/task/transfer-list.htm', data); }

//转接客服
export function transferService(data) { return post('api/task/transfer.htm', data); }


//修改用户备注信息
export function updatedUserInfo(data) { return post('api/user/edit-note.htm', data); }

//获取用户备注信息
export function getUserNoteInfo(data) { return post('api/user/note.htm', data); }


//获取客服列表
export function getAllServiceList(data) { return post('api/admin/index.htm', data); }

//获取客服详情信息
export function getServiceInfo(data) { return get('api/admin/edit.htm', data); }


//编辑客服
export function addAndEditService(data) { return post('api/admin/edit.htm', data); }

//	删除客服
export function deleteService(data) { return post('api/admin/delete.htm', data); }

//绑定应用列表
export function accreditList(data) { return post('api/settings/app/index.htm', data); }

//主动发起会话
export function startTask(data) { return post('api/task/start-task.htm', data); }

//微信接入 授权
export function wechatAuth(data) { return post('api/settings/app/auth.htm', data); }

//	会话中获取快捷回复列表
export function getChatReply(data) { return post('/api/settings/quick-reply/task-search-reply.htm', data); }

// 获取快捷回复列表
export function getReplyList(data) { return post('api/settings/quick-reply/list.htm', data); }

//编辑 - 添加 快捷回复组
export function addEditGroup(data) { return post('api/settings/quick-reply/edit-group.htm', data); }

//删除快捷回复组/回复内容
export function deleteReply(data) { return post('api/settings/quick-reply/delete.htm', data); }

//	编辑 - 添加 快捷回复内容
export function addEditReply(data) { return post('api/settings/quick-reply/edit-reply.htm', data); }

// 获取快捷回复列表
export function replyList(data) { return post('api/settings/quick-reply/reply-list.htm', data); }

//获取公众号信息
export function wechatInfo(data) { return post('api/wechat/info.htm', data); }

//	设置公众号首次关注或者等待中信息提示
export function wechatInfoEdit(data) { return post('api/wechat/edit.htm', data); }

//导入快捷回复
export function importReplyList(data) { return post('api/settings/quick-reply/import.htm', data); }

//获取客户列表
export function customerList(data) { return post('api/user/list.htm', data); }

//获取单个用户所有会话列表
export function customerChatList(data) { return post('api/user/task-list.htm', data); }

//在线咨询 - 搜索用户
export function userSearch(data) { return post('api/task/search.htm', data); }

//	查询当前自定义菜单
export function getCustomMenu(data) { return post('api/settings/menu/get-menu.htm', data); }

//	创建自定义菜单
export function createCustomMenu(data) { return post('api/settings/menu/create-menu.htm', data); }

//	新增/编辑 图文素材
export function material(data) { return post('api/settings/menu/material.htm', data); }

//	获取素材详情信息
export function getMaterial(data) { return post('api/settings/menu/get-material.htm', data); }

//会话发送消息
export function sendTaskMessage(data) { return post('api/task/task.htm', data); }

//网站接入 - 添加pc 应用
export function addWebApp(data) { return post('api/settings/app/edit-web-app.htm', data); }

//网站接入 - 获取网站接入详情
export function getWebApp(data) { return post('api/settings/app/get-web-app.htm', data); }

//网站接入 - 删除网站接入
export function deleteWebsiteAccess(data) { return get('api/settings/app/delete-web-app.htm', data); }

//微博接入 - 添加微博接入
export function addWeibo(data) { return post('api/settings/app/add-weibo.htm', data); }

//企业微信接入 - 添加企业微信接入
export function addWorkWechat(data) { return post('api/settings/app/add-wechat-company.htm', data); }


//应用接入 - 删除应用
export function deleteApp(data) { return post('api/settings/app/del-app.htm', data); }


//角色列表 - 获取角色列表
export function getRoleList(data) { return post('api/settings/sys/auth-role.htm', data); }

//角色列表 - 角色详情信息
export function getAuthList(data) { return post('api/settings/sys/get-role-list.htm', data); }

//角色列表 - 编辑时
export function getRoleInfo(data) { return post('api/settings/sys/get-role-info.htm', data); }
    
//角色列表 - 添加 || 编辑 角色
export function addEditRole(data) { return post('api/settings/sys/edit-auth-role.htm', data); }

//角色列表 - 删除
export function deleteRole(data) { return post('api/settings/sys/delete-role.htm', data); }

//数据统计 - 会话总体大概情况
export function overview(data) { return post('api/report/overview.htm', data); }

//数据统计 - 报表
export function report(data) { return post('api/report/im-report-analyse.htm', data); }

//数据统计 - 会话量趋势
export function chatMsgTrend(data) { return post('api/report/im-data-trend.htm', data); }

//数据统计 - WBE应用数据分析
export function webReport(data) { return post('api/report/web-report-data.htm', data); }

//数据统计 - 客服好评数统计
export function evaluationData(data) { return post('api/report/kefu-evaluation-data.htm', data); }

//数据统计 - WEB端系统，搜索引擎等数据分析
export function webSourceReport(data) { return post('api/report/web-source-report-data.htm', data); }

//数据统计 - 首页数据
export function homeReport(data) { return post('api/report/kefu-reception-data.htm', data); }

//数据统计 - 首页数据
export function homeTicketsReport(data) { return post('api/report/kefu-gongdan-data.htm', data); }

//设置当前客服状态
export function setActive(data) { return post('api/admin/set-active.htm', data); }

//设置最大会话上限
export function setMaxService(data) { return post('api/admin/set-max-service-num.htm', data); }

//员工管理 - 获取技能组列表
export function getServiceGroup(data) { return post('api/skill-group/info.htm', data); }

//员工管理 - 添加修改技能组信息
export function addGroupInfo(data) { return post('api/skill-group/edit.htm', data); }

//员工管理 - 删除技能组
export function deleteSkillGroup(data) { return post('api/skill-group/del.htm', data); }

//黑名单 - 拉黑用户
export function pullBlack(data) { return post('api/user/blacklist.htm', data); }

//留言 - 获取pc留言列表
export function getLeaveList(data) { return post('api/leave/leave-list.htm', data); }

//留言 - 获取单条留言信息
export function getLeaveMsg(data) { return get('api/leave/leave-msg.htm', data); }

//留言 - 留言详情  -  提交备注信息
export function submintLeave(data) { return post('api/leave/leave.htm', data); }

//留言 - 修改留言状态
export function updatedLeave(data) { return post('api/leave/handle.htm', data); }

//留言 - 分配留言给客服
export function allotLeave(data) { return post('api/leave/allot.htm', data); }

//会话 - 同事会话列表
export function getColleaguList(data) { return post('api/inside/inside.htm', data); }

//会话 - 获取指定同事会话记录
export function getColleaguChatLog(data) { return post('api/inside/inside-log.htm', data); }

//会话 - 同事发送会话
export function colleaguSendMsg(data) { return post('api/inside/inside-task.htm', data); }

//会话 - 同事聊天将未读消息改为已读
export function colleaguReader(data) { return post('api/inside/reader.htm', data); }

//会话 - 设置/取消会话置顶
export function setTop(data) { return post('api/task/set-top.htm', data); }

//待接入 - 客服主动接入待接入会话
export function serviceJoinUp(data) { return post('api/task/join-up.htm', data); }

//黑名单 - 	ip黑名单添加
export function addIpBlack(data) { return post('api/blacklist/edit.htm', data); }

//黑名单 - 获取黑名单列表
export function getBlacklist(data) { return post('api/blacklist/list.htm', data); }

//黑名单 - 黑名单删除
export function delBlacklist(data) { return post('api/blacklist/del.htm', data); }

//个人信息 - 获取个人信息
export function getUserInfo(data) { return get('api/admin/user-info.htm', data); }

//个人信息 - 修改个人信息
export function edittUserInfo(data) { return post('api/admin/user-info.htm', data); }

//个人信息 - 修改密码
export function alterPassword(data) { return post('api/admin/alter-password.htm', data); }

//网站版本
export function getVersion(data) { return post('site/version.htm', data); }

//工单 - 工单列表
export function getTicketsList(data) { return post('api/tickets/index.htm', data); }

//工单 - 创建工单
export function createTickets(data) { return post('api/tickets/create.htm', data); }

//工单 - 修改工单
export function editTickets(data) { return post('api/tickets/update.htm', data); }

//工单 - 工单分类
export function ticketsClassify(data) { return post('api/tickets/cate-gory.htm', data); }

//工单 - 创建工单分类
export function createClassify(data) { return post('api/tickets/create-cate-gory.htm', data); }

//工单 - 修改工单分类
export function editClassify(data) { return post('api/tickets/update-cate-gory.htm', data); }

//工单 - 工单详情
export function ticketsDetails(data) { return post('api/tickets/details.htm', data); }

//工单 - 分配工单给客服
export function ticketsAllot(data) { return post('api/tickets/allot.htm', data); }

//工单 - 回复工单
export function ticketsReply(data) { return post('api/tickets/reply.htm', data); }

//工单 - 修改工单状态
export function updateTicketStatus(data) { return post('api/tickets/update-status.htm', data); }

//工单 - 删除工单分类
export function deleteClassify(data) { return post('api/tickets/delete-cate-gory.htm', data); }

//工单 - 删除工单
export function deleteTicket(data) { return post('api/tickets/delete-ticket.htm', data); }

//客服评价 - 获取基本设置信息【评价设置】
export function evaluationList(data) { return post('api/config/info.htm', data); }

//客服评价 - 添加基本设置信息【评价设置】
export function editEvaluation(data) { return post('api/config/edit.htm', data); }

//消息中心 - 获取消息列表
export function getMessageList(data) { return post('api/message/list.htm', data); }

//消息中心 - 设置消息已读
export function seeMessage(data) { return post('api/message/see.htm', data); }

//消息中心 - 消息添加
export function addMessage(data) { return post('api/message/add.htm', data); }

//实时访客 - 获取实时访客列表
export function getCallerList(data) { return post('api/temp/temp-list.htm', data); }

//实时访客 - 获取实时访客轨迹
export function getTraceList(data) { return post('api/temp/trace-list.htm', data); }

//实时访客 - 邀请pc用户会话
export function invitedSession(data) { return post('api/temp/invite-chat.htm', data); }

//会话- 主动邀请评价
export function evaluation(data) { return post('api/task/invite-evaluation.htm', data); }

//自定义筛选 - 添加自定义筛选
export function addCustom(data) { return post('api/custom/create.htm', data); }

//自定义筛选 - 	自定义筛选列表
export function getCustomList(data) { return post('api/custom/search.htm', data); }

//自定义筛选 -  获取单条自定义筛选内容详情
export function getCustomDetails(data) { return post('api/custom/get-one.htm', data); }

//自定义筛选 - 	更新自定义筛选内容
export function updateCustom(data) { return post('api/custom/update.htm', data); }

//自定义筛选 - 删除自定义筛选
export function deleteCustom(data) { return post('api/custom/delete.htm', data); }

//自定义筛选 - 获取筛选客服列表
export function getFilServiceList(data) { return post('api/admin/get-service-list.htm', data); }

//公共 - 获取公共配置信息
export function getLuBanCofig(data) { return post('api/settings/config/get-config.htm', data); }

//公共 - 获取当前账号绑定的所有应用
export function getAccessList(data) { return post('api/settings/app/get-list.htm', data); }


//机器人 - 获取知识库列表
export function getKnowledge(data) { return post('api/robot/knowledge/search.htm', data); }

//机器人 - 创建知识库
export function createKnowledge(data) { return post('api/robot/knowledge/create.htm', data); }

//机器人 - 	获取知识库详情
export function knowledgeDetails(data) { return post('api/robot/knowledge/get-one.htm', data); }

//机器人 - 更新知识库
export function updateKnowledge(data) { return post('api/robot/knowledge/update.htm', data); }

//机器人 - 	删除知识库
export function deleteKnowledge(data) { return post('api/robot/knowledge/delete-knowledge.htm', data); }

//机器人 - 	获取所有知识库分类
export function getCateList(data) { return post('api/robot/knowledge/get-cate.htm', data); }

//机器人 - 	创建知识库分类
export function createCate(data) { return post('api/robot/knowledge/create-cate.htm', data); }

//机器人 - 	创建知识库分类
export function updateCate(data) { return post('api/robot/knowledge/update-cate.htm', data); }

//机器人 - 	删除知识库分类
export function deleteCate(data) { return post('api/robot/knowledge/delete-cate.htm', data); }

//机器人 -  获取机器人设置
export function getRobotSetting(data) { return post('api/robot/settings/search.htm', data); }

//机器人 -  设置机器人
export function settingRobot(data) { return post('api/robot/settings/save.htm', data); }

//机器人 -  获取高频词列表
export function getHighFrequencyList(data) { return post('api/robot/knowledge/search-mark.htm', data); }

//机器人 -  删除高频词列表 (添加之后立即删除)
export function deleteMark(data) { return post('api/robot/knowledge/delete-mark.htm', data); }

//机器人 -  导出知识库模板
export function exportTemplate(data) { return post('api/robot/knowledge/export-template.htm', data); }

//机器人 -  开启/关闭机器人辅助回答
export function openRobot(data) { return post('api/admin/set-sup-robot.htm', data); }

//知识模板库 - 查看权限
export function permissionAuth(data) { return get('api/robot/permission/check.htm', data); }

//知识模板库 - 获取行业列表
export function getTRradeList(data) { return get('api/robot/permission/trade-list.htm', data); }

//知识模板库 - 添加行业 pid	int	是	上级id（顶级传0）
export function createTrade(data) { return post('api/robot/trade/create.htm', data); }

//知识模板库 - 修改行业分类
export function updateTrade(data) { return post('api/robot/trade/update.htm', data); }

//知识模板库 - 删除行业分类
export function deleteTrade(data) { return post('api/robot/trade/delete.htm', data); }

//知识模板库 - 	设置行业分类
export function setTrade(data) { return post('api/robot/permission/set-trade.htm', data); }

//知识模板库 - 加载列表
export function templateList(data) { return post('api/robot/permission/template-list.htm', data); }

//知识模板库 - 添加知识模板
export function createTemplate(data) { return post('api/robot/k-template/create.htm', data); }

//知识模板库 - 编辑知识模板
export function updateTemplate(data) { return post('api/robot/k-template/update.htm', data); }

//知识模板库 - 删除知识模板
export function deleteTemplate(data) { return post('api/robot/k-template/delete.htm', data); }

//知识模板库 - 知识模板库导入到当前账号内
export function importTemplate(data) { return post('api/robot/permission/import.htm', data); }



//会话规则 - 获取会话规则
export function getTaskRole(data) { return post('api/config/get-task-role.htm', data); }

//会话规则 - 获取会话规则
export function setTaskRole(data) { return post('api/config/set-task-role.htm', data); }

//指定客服 - 设置指定客服/技能组接待该应用所有会话
export function setAssgin(data) { return post('api/settings/app/set-belong.htm', data); }

//指定客服 - 获取指定客服
export function getAssgin(data) { return post('api/settings/app/get-belong.htm', data); }

//敏感词 - 获取敏感词列表
export function getSensitiveList(data) { return post('api/settings/sensitive/list.htm', data); }

//敏感词 - 添加敏感词
export function addSensitive(data) { return post('api/settings/sensitive/create.htm', data); }

//敏感词 - 修改敏感词
export function updateSensitive(data) { return post('api/settings/sensitive/update.htm', data); }

//敏感词 - 删除敏感词
export function delSensitive(data) { return post('api/settings/sensitive/delete.htm', data); }


//微信消息通知 - Step2:授权微信消息通知
export function qrcode(data) { return post('site/qrcode.htm', data); }

//微信消息通知 - 小程序授权
export function programQrcode(data) { return post('site/qrcode-user.htm', data); }


//推广页 - 获取邀请奖励明细
export function recommendList(data) { return post('api/recommend/log/list.htm', data); }

//推广页 - 查看奖励详情列表
export function obtainedDetailList(data) { return post('api/recommend/log/detail-list.htm', data); }


//购买坐席 - 获取支付配置
export function initPayData(data) { return post('api/payment/buy/get-rate.htm', data); }

//购买坐席 - 选择年限跟客服数量后统计价格
export function imputedPrice (data) { return post('api/payment/buy/count-price.htm', data); }

//购买坐席 - 提交订单 - 查看订单详情
export function submitOrder (data) { return post('api/payment/buy/preview.htm', data); }

//购买坐席 - 订单列表 
export function orderList (data) { return post('api/payment/order/search.htm', data); }

//购买坐席 - 取消订单 
export function cancelOrder (data) { return post('api/payment/order/cancel.htm', data); }
