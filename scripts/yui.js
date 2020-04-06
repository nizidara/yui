// Description:
//	TODO を管理することができるボットです
// Commands:
//   ボット名 todo     - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表

"use strict";
//console.log("動け");


const yui = require("../yui");

const date = new Date();
const dayOfWeek = date.getDay();
const daylist = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const today_day = daylist[dayOfWeek];
const yesterday_day = daylist[(dayOfWeek + 6) % 7];

module.exports = (robot) => {


	//アニメ関連
	robot.hear(/見る (.+) (.+)/i, (msg) => {
		const day = msg.match[1].trim();
		const title = msg.match[2].trim();
		const username = msg.message.user.name;

		yui.plus_anime(day, title);
		msg.send(`@${username}さん！\n\n${day} に ${title} を登録しました！\n\n放送が楽しみです！ユイと一緒に見ましょう！`);
	});

	robot.hear(/見た (.+) (.+)/i, (msg) => {
		const day = msg.match[1].trim();
		const title = msg.match[2].trim();
		const animedel = yui.del_anime(day, title);
		const username = msg.message.user.name;

		if(animedel == false){
			msg.send(`@${username}さん！\n${day} に ${title} は登録されていませんよ？`);
		}else{
			msg.send(`@${username}さん！\n${title} 面白かったですね！\nまた一緒に見たいです！`);
		}
	});

	robot.hear(/消し (.+) (.+)/i, (msg) => {
		const day = msg.match[1].trim();
		const title = msg.match[2].trim();
		const animedel = yui.del_anime(day, title);
		const username = msg.message.user.name;

		if(animedel == false){
			msg.send(`@${username}さん！\n${day} に ${title} は登録されていませんよ？`);
		}else{
			msg.send(`@${username}さん！\n${title} を消しました！\nユイも面白いアニメ探すの手伝います！`);
		}
	});

	robot.hear(/視聴完了 (.+)/i, (msg) => {
		const day = msg.match[1].trim();
		const animedel = yui.del_anime_week(day);
		const username = msg.message.user.name;

		if(animedel == false){
			msg.send(`@${username}さん！\n[視聴完了 ○曜日]で指示してください！`);
		}else{
			msg.send(`${day}のアニメを全部見ました！\n来期の ${day} にはいいアニメがあるといいですね！`);
		}
	});


	robot.hear(/今日のアニメ/i, (msg) =>{
		const list = yui.list_anime_today(today_day);
		const username = msg.message.user.name;

		if(list.length == 0){
			msg.send(`今日放送するアニメはないです……`);
		}else{
			msg.send(`今日放送するアニメは、\n\n・${list.join("\n・")}\n\nです！\nユイも楽しみです！一緒に見ましょう！`);
		}
	});

	robot.hear(/昨日のアニメ/i, (msg) =>{
		const list = yui.list_anime_today(yesterday_day);
		const username = msg.message.user.name;

		if(list.length == 0){
			msg.send(`昨日放送したアニメはないです……`);
		}else{
			msg.send(`昨日放送したアニメは、\n\n・${list.join("\n・")}\n\nです！\nはやくユイも見たいです！`);
		}
	});

	robot.hear(/アニメ (.+)/i, (msg) =>{
		const day = msg.match[1].trim();
		const list = yui.list_anime_today(day);
		const username = msg.message.user.name;

		if(list.length == 0){
			msg.send(`今季は ${day} に放送するアニメはないです……`);
		}else{
			msg.send(`${day} に放送するアニメは、\n\n・${list.join("\n・")}\n\nです！\nユイも一緒に見たいです！`);
		}
	});

	robot.hear(/今季アニメ/i, (msg) =>{
		const list = yui.list_anime();
		const username = msg.message.user.name;
		var anime_list_week = "";

		//daylist[i]で曜日
		for(var i = 0; i < 7; i++){
			var list_dayanime = list[i][1];
			var day = daylist[i];
			if(list_dayanime.length == 0){
				anime_list_week = `${anime_list_week}\n\n${day}`;
			}else{
				anime_list_week = `${anime_list_week}\n\n${day}\n・${list_dayanime.join("\n・")}\n`
			}
		}

		msg.send(`@${username}さんが今季見ているアニメはこれだけあります！\n${anime_list_week}`);

	});


	//金関連
	robot.hear(/貸し (.+) (.+)/i, (msg) => {
		const name = msg.match[1].trim();
		const much = msg.match[2].trim();
		const username = msg.message.user.name;

		yui.lend(name, much);
		msg.send(`@${username}さん！\n\n${name} に ${much} 貸しちゃいました……\n\nちゃんと返してもらってくださいね！`);
	});


	robot.hear(/貸してい/i, (msg) => {
		const list = yui.list_money();
		const username = msg.message.user.name;

		if(list.length == 0){
			msg.send(`@${username}さん！\n今は誰にもお金を貸していませんよ`);
		}else{
			msg.send(`@${username}さん！\nお金を貸している一覧はこちらになります！\n\n・${list.join("\n・")}\n\nです！\nちゃんと返してもらってくださいね！`);
		}
	});

	robot.hear(/返金 (.+)/i, (msg) => {
		const name = msg.match[1].trim();
		const namedel = yui.del_money(name);
		const username = msg.message.user.name;
		
		if(namedel == false){
			msg.send(`@${username}さん！\n${name} さんはお金を借りていないですよ？`);
		}else{
			msg.send(`@${username}さん！\n${name} さんはちゃんとお金を返してくれました！\nいい友人ですね！`);
		}
	});

	robot.hear(/金額 (.+)/i, (msg) => {
		const name = msg.match[1].trim();
		const much = yui.search_money(name);
		const username = msg.message.user.name;

		if(much == false){
			msg.send(`@${username}さん！\n${name} さんはお金を借りていませんよ？`);
		}else{
			msg.send(`@${username}さん！\n${name} さんに貸しているお金は ${much} です！\n\nちゃんと返してもらってくださいね！`);
		}
	});


	robot.hear(/追加 (.+)/i, (msg) => {
		const task = msg.match[1].trim();
		const username = msg.message.user.name;

		yui.todo(task);
		msg.send(`@${username}さん！\n${task} を追加しました！\n頑張ってください！`);
	});

	robot.hear(/終了 (.+)/i, (msg) => {
		const task = msg.match[1].trim();
		const taskdone= yui.done(task);
		const username = msg.message.user.name;

		if(taskdone == false){
			msg.send(`@${username}さん！\n${task} は存在してないですよ？`);
		}else{
			msg.send(`@${username}さん！\nお疲れ様です！\n${task} は完了しました！`);
		}
	});

	robot.hear(/削除 (.+)/i, (msg) => {
		const task = msg.match[1].trim();
		const taskdel = yui.del(task);
		const username = msg.message.user.name;
		
		if(taskdel == false){
			msg.send(`@${username}さん！\n${task} は存在してないですよ？`);
		}else{
			msg.send(`@${username}さん！\n${task} を消しました！`);
		}
	});

	robot.hear(/リスト/i, (msg) => {
		const list = yui.list();
		const username = msg.message.user.name;

		if(list.length == 0){
			msg.send(`@${username}さん！\n今は何も予定がありません。\n\n[追加]コマンドで予定を追加できます！\n\nユイを頼って下さい！`);
		}else{
			msg.send(`@${username}さん！\n今の予定は\n\n・${list.join("\n・")}\n\nです！\n頑張ってください！`);
		}
	});

	robot.hear(/完了済/i, (msg) => {
		const donelist = yui.donelist();
		const username = msg.message.user.name;

		if(donelist.length == 0){
			msg.send(`@${username}さん！\n完了したの予定はありません……\n\n[完了]コマンドで予定を完了リスト追加できます！`);
		}else{
			msg.send(`@${username}さん！\n完了したの予定は\n\n・${donelist.join("\n・")}\n\nです！\nよく頑張りました！`);
		}
	});

	robot.hear(/おはよう/i, (msg) => {
		const username = msg.message.user.name;
		const lots = ["大吉", "吉", "中吉", "末吉", "凶"];
		const lot = lots[Math.floor(Math.random() * lots.length)];

		msg.send(`おはようございます！ @${username} さん！\n\n今日の運勢は${lot}です！\n\n今日も一日頑張りましょう！`);
	})


	robot.hear(/コマンド/i, (msg) => {
		const username = msg.message.user.name;

		msg.send(`ユイは仕事の管理ができます！\n\n
次のコマンドを入力してください！\n\n
アニメ系\n
[見る ○曜日 △△]:○曜日に△△を見ることを追加\n
[見た ○曜日 △△]:○曜日の△△を見た\n
[消し ○曜日 △△]:○曜日の△△を消し\n
[視聴完了 ○曜日]:○曜日のアニメを全部見た\n
[今日のアニメ]:視聴中の今日放送するアニメ一覧\n
[昨日のアニメ]:視聴中の昨日放送したアニメ一覧\n
[アニメ ○曜日]:視聴中の○曜日に放送するアニメ一覧\n
[今季アニメ]:今季アニメ一覧\n\n
金貸し系\n
[貸し ○○ △円]:○○に△円貸したことを追加\n
[返金 ○○]:○○を貸しリストから削除\n
[金額 ○○]:○○が借りている金額を表示\n
[貸してい]:貸しリストの表示\n\n
todoリスト系\n
[追加 ○○]:仕事の追加\n
[終了 ○○]:仕事の完了\n
[削除 ○○]:仕事の削除\n
[リスト]:仕事のリスト\n
[完了済]:完了した仕事\n\n
その他
[おはよう]:今日の運勢を占います！\n
[ユイちゃん]:ユイとお話ができます！`);
	})

	robot.hear(/ユイちゃん/, (msg) => {
		const username = msg.message.user.name;

		const i = Math.floor(Math.random() * 4);

		switch(i){
			case 0:
				msg.send(`どうかしましたか？`);
				break;
			case 1:
				msg.send(`私は高性能AIのユイです！`);
				break;
			case 2:
				msg.send(`@${username} さんの仕事の手伝いをします！`);
				break;
			case 3:
				msg.send(`@${username} さんはユイのパパです！`);
				break;
		}
	})
}