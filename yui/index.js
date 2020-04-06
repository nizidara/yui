"use strict";


let tasks = new Map();	//key:タスクの文字列 value:完了しているかどうかの真偽値
let money = new Map();	//key:貸している人 value:金額
let anime = new	Map();	//key:曜日	value:アニメ配列


const fs = require("fs");
const fileName = "./tasks.json";
const fileName_money = "./money.json";
const fileName_anime = "./anime.json";


//同期的にファイルから復元
try{
	const data = fs.readFileSync(fileName, "utf8");
	
	tasks = new Map(JSON.parse(data));

}catch (ignore){
	console.log(fileName + "から復元できませんでした");
}


try{
	const data_money = fs.readFileSync(fileName_money, "utf8");
	money = new Map(JSON.parse(data_money));
}catch (ignore){
	console.log(fileName_money + "から復元できませんでした");
}


try{
	const data_anime = fs.readFileSync(fileName_anime, "utf8");
	anime = new Map(JSON.parse(data_anime));
}catch (ignore){
	console.log(fileName_anime + "から復元できませんでした");
	anime.set("日曜日", []);
	anime.set("月曜日", []);
	anime.set("火曜日", []);
	anime.set("水曜日", []);
	anime.set("木曜日", []);
	anime.set("金曜日", []);
	anime.set("土曜日", []);
}

//タスクをファイルに保存する
function saveTasks(){
	fs.writeFileSync(fileName, JSON.stringify(Array.from(tasks)), "utf8");
}

function saveMoney(){
	fs.writeFileSync(fileName_money, JSON.stringify(Array.from(money)), "utf8");
}

function saveAnime(){
	fs.writeFileSync(fileName_anime, JSON.stringify(Array.from(anime)), "utf8");
}




/*
視聴中のアニメを追加

曜日は
var data = new Date();
var dayOfWeek = date.getDay();
で取得可能(日:0, 月1)

今日明日などは7で割ればいい
*/



//追加
//anime.get("曜日").push("aaa")
function plus_anime(day, title){
	anime.get(day).push(title);
	saveAnime();
}



//削除
//index = anime.get("曜日").indexOf("aaa");
//anime[曜日][1].splice(index, 1);
function del_anime(day, title){

	if(anime.get(day).indexOf(title) == -1){
		return false;
	}else{
		const index = anime.get(day).indexOf(title);
		anime.get(day).splice(index, 1);
		saveAnime();
	}
}


//曜日消去
//anime[曜日][1] = [];
function del_anime_week(day){

	if(anime.has(day)){
		anime.get(day).length = 0;
		saveAnime();
	}else{
		return false;
	}
}


//全体表示
function list_anime(){
	return Array.from(anime);
}

//今日のアニメ
//anime[曜日][1]
function list_anime_today(day){
	return Array.from(anime.get(day));
}




/*
金貸しを追加
追加
削除
リスト表示
検索
*/

//追加
function lend(name, much){
	money.set(name, much);
	saveMoney();
}


//削除
function del_money(name){
	if(money.has(name)){
		money.delete(name);
		saveMoney();
	}else{
		return false;
	}
}



//リスト表示
function list_money(){
	return Array.from(money);
}


//検索
function search_money(name){
	if(money.has(name)){
		return money.get(name);
	}else{
		return false;
	}
}




/*
TODOを追加する
@param{string} task
*/
function todo(task){
	tasks.set(task, false);
	saveTasks();
}

function isDone(pair) {
	return pair[1];
}

function isNotDone(pair) {
	return !pair[1];
}

//未完リスト
function list() {
  	return Array.from(tasks)
  		.filter(isNotDone)
  		.map(t => t[0]);
}

function done(task){
	if(tasks.has(task)){
		tasks.set(task, true);
		saveTasks();
	}else{
		return false;
	}
}

function donelist() {
  return Array.from(tasks)
    .filter(isDone)
    .map(t => t[0]);
}

function del(task) {
	if(tasks.has(task)){
		tasks.delete(task);
		saveTasks();
	}else{
		return false;
	}
}

module.exports = {
	//todoリスト
	todo, 
	list,
	done,
	donelist, 
	del, 
	//金
	lend, 
	del_money, 
	list_money,
	search_money,
	//アニメ
	plus_anime,
	del_anime,
	del_anime_week,
	list_anime,
	list_anime_today
};