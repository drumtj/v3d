import $ from "jquery";
// import BiscuitViewer from "./BiscuitViewer";

export default class UI {

  $messageBox = null;
  $message = null;


  constructor(){
    this.$messageBox = $("#messageBox");
    this.$message = $("#message");
  }


  static instance;
  static getInstance(){
    if(!this.instance) this.instance = new UI();
    return this.instance;
  }

  static globalMessageModule;
  static getMessageModlue(){
    if(this.instance){
      return this.instance.message;
    }else{
      return this.globalMessageModule || (this.globalMessageModule = (function(){
        let $messageBox = $("#messageBox");
        let $message = $("#message");
        return function (str){
          // console.error("!", $message);
          if(str == null){
            $messageBox.hide();
          }else{
            $message.html(str);
            $messageBox.show();
          }
        }
      })())
    }
  }


  message(str){
    if(str == null){
      this.$messageBox.hide();
    }else{
      this.$message.html(str);
      this.$messageBox.show();
    }
  }

}
