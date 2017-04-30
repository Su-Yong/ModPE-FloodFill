/*
 * FloodFill Script
 * 
 * Version: 1.0.0
 * Author: SuYong
 * Lisence: Apache-2.0
 * 
 * 여담이다만 몰폰하며 만든거라 구조가 이상합니다(?)
 */
const Button = android.widget.Button;
const ImageButton = android.widget.ImageButton;
const ToggleButton = android.widget.ToggleButton;
const TextView = android.widget.TextView;
const ImageView = android.widget.ImageView;
const Toast = android.widget.Toast;
const LinearLayout = android.widget.LinearLayout;
const FrameLayout = android.widget.FrameLayout;
const RelativeLayout = android.widget.RelativeLayout;
const PopupWindow = android.widget.PopupWindow;
const ScrollView = android.widget.ScrollView;
const HorizontalScrollView = android.widget.HorizontalScrollView;
const SeekBar = android.widget.SeekBar;
const EditText = android.widget.EditText;
const View = android.view.View;
const ProgressBar = android.widget.ProgressBar;
const Switch = android.widget.Switch;
const Spinner = android.widget.Spinner;
const ArrayAdapter = android.widget.ArrayAdapter;
// widget

const CardView = android.support.v7.widget.CardView;
// support widget

const GONE = android.view.View.GONE;
const VISIBLE = android.view.View.VISIBLE;
const INVISIBLE = android.view.View.INVISIBLE;
const OnTouchListener = android.view.View.OnTouchListener;
const OnClickListener = android.view.View.OnClickListener;
const OnCheckedChangeListener = android.widget.CompoundButton.OnCheckedChangeListener;
const MotionEvent = android.view.MotionEvent;
const Gravity = android.view.Gravity;
const ViewGroup = android.view.ViewGroup;
// View

const Dialog = android.app.Dialog;
const AlertDialog = android.app.AlertDialog;
const Intent = android.content.Intent;
const Uri = android.net.Uri;
// app / content / net

const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Canvas;
const Paint = android.graphics.Paint;
const Drawable = android.graphics.drawable.Drawaable;
const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const ColorDrawable = android.graphics.drawable.ColorDrawable;
const NinePatchDrawable = android.graphics.drawable.NinePatchDrawable;
const Typeface = android.graphics.Typeface;
const Color = android.graphics.Color;
const RectF = android.graphics.RectF;
const Rect = android.graphics.Rect;
const BitmapFactory = android.graphics.BitmapFactory;
// Graphics

const File = java.io.File;
const BufferedInputStream = java.io.BufferedInputStream;
const FileInputStream = java.io.FileInputStream;
const InputStream = java.io.InputStream;
// Files

const TypedValue = android.util.TypedValue;

const Thread = java.lang.Thread;
const URL = java.net.URL;

const BLOCK_LAUNCHER = net.zhuoweizhang.mcpelauncher;

var MC = {};

MC.Screen = {
  IN_GAME_HUD: "hud_screen",
  IN_GAME: "in_game_play_screen"
};

MC.Color = {
  PRIMARY: Color.parseColor("#FAFAFA"),
  PRIMARY_DARK: Color.parseColor("#EEEEEE"), // 콩콩
  ACCENT: Color.parseColor("#00A4FF"),
};

MC.CTX = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

MC.WIDTH = MC.CTX.getScreenWidth();
MC.HEIGHT = MC.CTX.getScreenHeight();

MC.getView = function() {
  return MC.CTX.getWindow().getDecorView();
};

MC.dp = function(dips) {
  return dips * MC.CTX.getResources().getDisplayMetrics().density;
};

MC.UIThread = function(func) {
  MC.CTX.runOnUiThread(new java.lang.Runnable({
    run: function() {
      try {
        func();
      } catch(e) {
        print(e + " " +e.lineNumber);
      }
    }
  }));
};

MC.Block = function() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  
  this.id = 0;
  this.data = 0;
  this.params = [];
};

MC.Block.prototype.setXYZ = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  
  return this;
};

MC.Block.prototype.setBlock = function(id, data, params) {
  this.id = id;
  this.data = data;
  this.params = params | [];
  
  return this;
};

MC.Block.prototype.getX = function() {
  return this.x;
};
MC.Block.prototype.getY = function() {
  return this.y;
};
MC.Block.prototype.getZ = function() {
  return this.z;
};

MC.Block.prototype.getId = function() {
  return this.id;
};
MC.Block.prototype.getData = function() {
  return this.data;
};

var Language = {};
Language.ko = {
  LANGUAGE: "ko",
  
  FILL: "채우기",
  REPLACE: "바꾸기",
  INVALID_ITEM: "사용할 수 없는 아이템 입니다.",
  LOADING: "로딩중...",
  FINISHED: "완료",
  INITIALIZING: "초기화중...",
  SETTING: "설정",
  SPEED: "속도",
  WORK_FINISHED: "작업 종료",
  USE: "사용",
  WORKING_LIST: "작업 목록",
  DEVELOPING: "개발중...",
  Speeds: {
    FASTEST: "가장 빠름",
    FASTER: "더 빠름",
    FAST: "빠름",
    STABLE: "안정적임",
    MORE_STABLE: "더 안정적임",
    MOD_TICK: "ModTick 속도",
  }
};

Language.en = { // please translate this constant
  LANGUAGE: "en",
  
  FILL: "Fill",
  REPLACE: "Replace",
  INVALID_ITEM: "This item is invalid.",
  LOADING: "Loading...",
  FINISHED: "Finish",
  INITIALIZING: "Initializing...",
  SETTING: "Setting",
  WORK_FINISHED: "Work finished",
  SPEED: "Speed",
  USE: "Enable",
  WORKING_LIST: "Working List",
  DEVELOPING: "Developing...",
  Speeds: {
    FASTEST: "Fastest",
    FASTER: "Faster",
    FAST: "Fast",
    STABLE: "Stable",
    MORE_STABLE: "More Stable",
    MOD_TICK: "ModTick speed",
  }
};

var Speed = {
  FASTEST: 1,
  FASTER: 2,
  FAST: 5,
  STABLE: 10,
  MORE_STABLE: 20,
  MOD_TICK: 50,
};

var State = {
  START: 0,
  INIT: 1,
  WORKING: 2,
  FINISHED: 3,
  THREAD_STOPPED: 4
};

var FloodFill = {
  lang: Language.en, // standard language
  speed: Speed.STABLE, 
  use: false,
};

FloodFill.patchLanguage = function() {
  var language = ModPE.getLanguage().split("_")[0];
  var region = ModPE.getLanguage().split("_")[1];
  
  for each(var i in Object.keys(Language)) {
    if(language == Language[i].LANGUAGE) {
      FloodFill.lang = Language[i];
    }
  }
};

var FillWorker = function() {
  this.queue = [];
  this.target = null;
  this.replaceBlock = null;
  this.isStart = false;
  this.speed = FloodFill.speed;
  this.listener = function() {};
  
  var me = this;
  this.thread = new Thread({
    run: function() {
      while(me.queue.length > 0) {
        if(!me.isStart) {
          me.thread.interrupt();
          me.listener(State.THREAD_STOPPED);
          return;
        }
        Thread.sleep(me.speed);
        var x = me.queue[0].getX();
        var y = me.queue[0].getY();
        var z = me.queue[0].getZ();
        
        if(Level.getTile(x + 1, y, z) == me.target.getId() &&
           Level.getData(x + 1, y, z) == me.target.getData()) {
          var block = new MC.Block();
          block.setXYZ(x + 1, y, z);
          block.setBlock(me.target.getId(), me.target.getData());
          
          Level.setTile(x + 1, y, z, me.replaceBlock.getId(), me.replaceBlock.getData());
          me.queue.push(block);
        }
        if(Level.getTile(x - 1, y, z) == me.target.getId() &&
           Level.getData(x - 1, y, z) == me.target.getData()) {
          var block = new MC.Block();
          block.setXYZ(x - 1, y, z);
          block.setBlock(me.target.getId(), me.target.getData());
          
          Level.setTile(x - 1, y, z, me.replaceBlock.getId(), me.replaceBlock.getData());
          me.queue.push(block);
        }
        if(Level.getTile(x, y, z + 1) == me.target.getId() &&
           Level.getData(x, y, z + 1) == me.target.getData()) {
          var block = new MC.Block();
          block.setXYZ(x, y, z + 1);
          block.setBlock(me.target.getId(), me.target.getData());
          
          Level.setTile(x, y, z + 1, me.replaceBlock.getId(), me.replaceBlock.getData());
          me.queue.push(block);
        }
        if(Level.getTile(x, y, z - 1) == me.target.getId() &&
           Level.getData(x, y, z - 1) == me.target.getData()) {
          var block = new MC.Block();
          block.setXYZ(x, y, z - 1);
          block.setBlock(me.target.getId(), me.target.getData());
          
          Level.setTile(x, y, z - 1, me.replaceBlock.getId(), me.replaceBlock.getData());
          me.queue.push(block);
        }
        
        me.queue.shift();
        
        if(me.queue.length <= 0) {
          me.stop();
          me.listener(State.FINISHED);
        }
      }
    }
  });
};

FillWorker.prototype.setTarget = function(target) {
  this.target = target;
  this.queue.push(target);
  
  return this;
};
FillWorker.prototype.setReplaceBlock = function(replaceBlock) {
  this.replaceBlock = replaceBlock;
  
  return this;
};

FillWorker.prototype.setListener = function(func) {
  this.listener = func;
  
  return this;
}

FillWorker.prototype.start = function() {
  this.isStart = true;
  this.thread.start();
  this.listener(State.START);
  this.speed = FloodFill.speed;
  
  return this;
};
FillWorker.prototype.stop = function() {
  this.isStart = false;
  this.thread.interrupt();
  
  return this;
};

var GUI = {
  main: function() {
    this.window = null;
    this.layout = null;
    this.isOpened = false;
  },
  menu: function() {
    this.window = null;
    this.isOpened = false;
    this.speedButton = null;
  },
  speed: function() {
    this.window = null;
    this.layout = null;
  },
  list: function() {
    this.window = null;
  }
};

GUI.main.prototype.init = function() {
  var me = this;
  this.window = new PopupWindow(MC.CTX);
  
  this.layout = new LinearLayout(MC.CTX);
   
  var button = new ImageButton(MC.CTX);
  button.setImageBitmap(Background.fill);
  button.setBackgroundResource(Background.rippleBorderless());
  button.setOnClickListener(new OnClickListener({
    onClick: function() {
      MC.UIThread(function() {
        if(me.isOpened) {
          me.isOpened = false;
          Windows.menu.isOpened = false;
          Windows.menu.dismiss();
          Windows.speed.dismiss();
        } else {
          me.isOpened = true;
          Windows.menu.show();
        }
      });
    }
  }));
  
  this.layout.addView(button, MC.dp(40), MC.dp(40));
  this.layout.setGravity(Gravity.CENTER | Gravity.CENTER);
  this.window.setAnimationStyle(android.R.style.Animation_Dialog);
  this.window.setBackgroundDrawable(new BitmapDrawable(Background.circle()));
  this.window.setContentView(this.layout);
  this.window.setWidth(MC.dp(40));
  this.window.setHeight(MC.dp(40));
};

GUI.main.prototype.show = function() {
  this.window.showAtLocation(MC.getView(), Gravity.RIGHT | Gravity.TOP, MC.dp(8), MC.dp(8));
};

GUI.main.prototype.dismiss = function() {
  if(this.window != null && this.window.isShowing()) {
    this.window.dismiss();
  }
};

GUI.menu.prototype.init = function() {
  this.window = new PopupWindow(MC.CTX);
      
  var card = new LinearLayout(MC.CTX);
  card.setBackgroundDrawable(Background.roundRect());
    
  function makeLayout(iconImg, text, widget) {
    var layout = new LinearLayout(MC.CTX);
    var icon = new ImageView(MC.CTX);
    icon.setImageBitmap(iconImg);
    
    var textView = new TextView(MC.CTX);
    textView.setText(text);
    textView.setPadding(MC.dp(2), 0, 0, 0);
    
    var dummy = new View(MC.CTX);
    var params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.FILL_PARENT, LinearLayout.LayoutParams.FILL_PARENT);
    params.weight = 1;
    params.gravity = Gravity.RIGHT;
    dummy.setLayoutParams(params);
  
    layout.setPadding(MC.dp(8), MC.dp(4), MC.dp(8), MC.dp(2));
    layout.setGravity(Gravity.LEFT | Gravity.CENTER);
    layout.addView(icon);
    layout.addView(textView);
    if(widget != null) {
      layout.addView(dummy);
      layout.addView(widget);
    }
    
    return layout;
  }
  
  var titleClose = new ImageButton(MC.CTX);
  titleClose.setImageBitmap(Background.close);
  titleClose.setBackgroundResource(Background.rippleBorderless());
  titleClose.setOnClickListener(new OnClickListener({
    onClick: function(view) {
      MC.UIThread(function() {
        if(Windows.main.isOpened) {
          Windows.main.isOpened = false;
          Windows.menu.isOpened = false;
          Windows.menu.dismiss();
          Windows.speed.dismiss();
        } else {
          Windows.main.isOpened = true;
          Windows.menu.show();
        }
      });
    }
  }));
  var titleLayout = makeLayout(Background.setting, FloodFill.lang.SETTING, titleClose);
  titleLayout.setPadding(MC.dp(10), MC.dp(2), MC.dp(0), MC.dp(2));
  
  var useSwitch = new Switch(MC.CTX);
  useSwitch.setChecked(FloodFill.use);
  useSwitch.setOnCheckedChangeListener(new OnCheckedChangeListener() {
    onCheckedChanged: function(view, isChecked) {
      FloodFill.use = isChecked;
    }
  });
  var useLayout = makeLayout(Background.fillBig, FloodFill.lang.USE, useSwitch);
  
  var me = this;
  var name = "";
  for(var i in Speed) {
    if(FloodFill.speed == Speed[i]) {
      name = FloodFill.lang.Speeds[i];
    }
  }
  this.speedButton = new Button(MC.CTX);
  this.speedButton.setText(name + "");
  this.speedButton.setBackgroundResource(Background.rippleBorderless());
  this.speedButton.setOnClickListener(new OnClickListener({
    onClick: function(view) {
      MC.UIThread(function() {
        if(me.isOpened) {
          me.isOpened = false;
          Windows.speed.dismiss();
        } else {
          me.isOpened = true;
          Windows.speed.show();
        }
      });
    }
  }));
  var speedLayout = makeLayout(Background.time, FloodFill.lang.SPEED, this.speedButton);
  
  var listButton = new ImageButton(MC.CTX);
  listButton.setImageBitmap(Background.more);
  listButton.setBackgroundResource(Background.rippleBorderless());
  listButton.setOnClickListener(new OnClickListener({
    onClick: function(view) {
      MC.UIThread(function() {
        Util.toast(FloodFill.lang.DEVELOPING);
      })
    }
  }));
  var listLayout = makeLayout(Background.work, FloodFill.lang.WORKING_LIST, listButton);
  
  var dummy = new View(MC.CTX);
  dummy.setBackgroundColor(Color.parseColor("#BDBDBD"));
  
  var layout = new LinearLayout(MC.CTX);
  layout.setOrientation(1);
  layout.setPadding(MC.dp(4), MC.dp(8), MC.dp(4), MC.dp(8));
  layout.addView(useLayout);
  layout.addView(speedLayout);
  layout.addView(listLayout);
  
  card.setOrientation(1);
  card.setPadding(MC.dp(8), MC.dp(8), MC.dp(8), MC.dp(8));
  card.addView(titleLayout);
  card.addView(dummy, MC.dp(400), 4);
  card.addView(layout);
  
  this.window.setAnimationStyle(android.R.style.Animation_Dialog);
  this.window.setBackgroundDrawable(null);
  this.window.setContentView(card);
  this.window.setWidth(MC.dp(250));
  this.window.setHeight(MC.dp(200));
};

GUI.menu.prototype.show = function() {
  this.window.showAtLocation(MC.getView(), Gravity.RIGHT | Gravity.TOP, MC.dp(4), MC.dp(4));
};

GUI.menu.prototype.dismiss = function() {
  if(this.window != null && this.window.isShowing()) {
    this.window.dismiss();
  }
};

GUI.speed.prototype.init = function() {
  var me = this;
  this.window = new PopupWindow(MC.CTX);
  
  var scroll = new HorizontalScrollView(MC.CTX);
  this.layout = new LinearLayout(MC.CTX);
  
  var list = [];
  for each(var e in Object.keys(FloodFill.lang.Speeds)) {
    list.push(FloodFill.lang.Speeds[e]);
  }
  
  for(var i in list) {
    var button = new Button(MC.CTX);
    button.setBackgroundResource(Background.rippleBorderless());
    button.setText(list[i] + "");
    button.setTag(i);
    button.setOnClickListener(new OnClickListener({
      onClick: function(view) {
        FloodFill.speed = Speed[Object.keys(Speed)[parseInt(view.getTag())]];
        MC.UIThread(function() {
          Windows.menu.speedButton.setText(list[parseInt(view.getTag())]);
        });
        //Util.toast(list[parseInt(view.getTag())]);
        Windows.speed.dismiss();
        Windows.menu.isOpened = false;
      }
    }));
  
    this.layout.addView(button);
  }
  
  this.layout.setBackgroundDrawable(Background.roundRect());
  scroll.addView(this.layout);
  this.window.setAnimationStyle(android.R.style.Animation_Dialog);
  this.window.setBackgroundDrawable(null);
  this.window.setContentView(scroll);
  this.window.setWidth(MC.dp(200));
  this.window.setHeight(MC.dp(50))

};
GUI.speed.prototype.show = function() {
  this.window.showAtLocation(MC.getView(), Gravity.RIGHT | Gravity.TOP, MC.dp(14), MC.dp(134));
};

GUI.speed.prototype.dismiss = function() {
  if(this.window != null && this.window.isShowing()) {
    this.window.dismiss();
  }
};

GUI.list.prototype.init = function() {
  var me = this;
  this.window = new PopupWindow(MC.CTX);
  
  var layout = new LinearLayout(MC.CTX);
  
  function makeLayout() {
    
  }
  
  layout.addView();
  layout.setGravity(Gravity.CENTER | Gravity.CENTER);
  this.window.setAnimationStyle(android.R.style.Animation_Dialog);
  this.window.setBackgroundDrawable(null);
  this.window.setContentView(layout);
  this.window.setWidth(MC.dp(250));
  this.window.setHeight(MC.dp(200));
};

GUI.list.prototype.show = function() {
  this.window.showAtLocation(MC.getView(), Gravity.RIGHT | Gravity.TOP, MC.dp(4), MC.dp(4));
};

GUI.list.prototype.dismiss = function() {
  if(this.window != null && this.window.isShowing()) {
    this.window.dismiss();
  }
};


var Util = {};
Util.urlToBitmap = function(link) {
  var url = new URL(link);
  var connection = url.openConnection();
  connection.setDoInput(true);
  connection.connect();
  var bitmap = BitmapFactory.decodeStream(connection.getInputStream());
  return bitmap;
};
Util.ninePatch = function(bitmap, x, y, xx, yy) {
  var NO_COLOR = 0x00000001;
  var buffer = java.nio.ByteBuffer.allocate(84).order(java.nio.ByteOrder.nativeOrder());

  buffer.put(0x01);
  buffer.put(0x02);
  buffer.put(0x02);
  buffer.put(0x09);
  buffer.putInt(0);
  buffer.putInt(0);
  buffer.putInt(0);
  buffer.putInt(0);
  buffer.putInt(0);
  buffer.putInt(0);
  buffer.putInt(0);
  buffer.putInt(y);
  buffer.putInt(yy);
  buffer.putInt(x);
  buffer.putInt(xx);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);
  buffer.putInt(NO_COLOR);

  var drawable = new NinePatchDrawable(MC.CTX.getResources(), bitmap, buffer.array(), new Rect(), null);

  return drawable;
};
Util.toast = function(msg) {
  MC.UIThread(function() {
    var toast = Toast.makeText(MC.CTX, msg, Toast.LENGTH_SHORT);
    toast.show();
  });
};

var Background = {};

Background.rippleBorderless = function() {
  var outValue = new TypedValue();
  MC.CTX.getTheme().resolveAttribute(android.R.attr.selectableItemBackgroundBorderless, outValue, true); 
  return outValue.resourceId;
};
Background.ripple = function() {
  var outValue = new TypedValue();
  MC.CTX.getTheme().resolveAttribute(android.R.attr.selectableItemBackground, outValue, true); 
  return outValue.resourceId;
};

Background.fillBig = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/editor/drawable-xxhdpi/ic_format_color_fill_black_24dp.png")
Background.fill = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/editor/drawable-xxhdpi/ic_format_color_fill_black_18dp.png")
Background.time = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/image/drawable-xxhdpi/ic_timelapse_black_24dp.png")
Background.setting = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/action/drawable-xxhdpi/ic_settings_black_24dp.png");
Background.close = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/navigation/drawable-xxhdpi/ic_close_black_24dp.png");
Background.work = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/action/drawable-xxhdpi/ic_work_black_24dp.png");
Background.more = Util.urlToBitmap("https://raw.githubusercontent.com/google/material-design-icons/master/navigation/drawable-xxhdpi/ic_chevron_right_black_18dp.png");

Background.circle = function() {
  var bitmap = Bitmap.createBitmap(256, 256, Bitmap.Config.ARGB_8888);
  var canvas = new Canvas(bitmap);
  var paint = new Paint();
  paint.setARGB(255, 245, 245, 245);
  paint.setShadowLayer(12, 0, 4, Color.parseColor("#55000000"));
  
  canvas.drawCircle(128, 128, 112, paint);
  
  return bitmap;
}
Background.roundRect = function() {
  var bitmap = Bitmap.createBitmap(256, 256, Bitmap.Config.ARGB_8888);
  var canvas = new Canvas(bitmap);
  var paint = new Paint();
  paint.setARGB(255, 245, 245, 245);
  paint.setShadowLayer(12, 0, 4, Color.parseColor("#55000000"));
    
  canvas.drawRoundRect(new RectF(16, 16, 256 - 16, 256 - 16), 8, 8, paint);
  
  return Util.ninePatch(bitmap, 24, 24, 232, 232);
}

var Windows = {};
Windows.main = new GUI.main();
Windows.menu = new GUI.menu()
Windows.speed = new GUI.speed();;

MC.UIThread(function() {
  Windows.main.init();
  Windows.menu.init()
  Windows.speed.init();
});

function screenChangeHook(screen) {
  MC.UIThread(function() {
    if(screen == MC.Screen.IN_GAME_HUD) {
      FloodFill.patchLanguage();
      MC.UIThread(function() {
        Windows.main.init();
        Windows.menu.init();
        Windows.speed.init();
      });
      Windows.main.show();
      Windows.menu.dismiss();
      Windows.speed.dismiss();
      // show
    } else if(screen != MC.Screen.IN_GAME) {
      Windows.main.dismiss();
      Windows.menu.dismiss();
      Windows.speed.dismiss();
      // dismiss
    }
  });
}

function useItem(x, y, z, i, b, s, id, bd) {
  if(FloodFill.use) {
    preventDefault();
    
    var target = new MC.Block();
    target.setXYZ(x, y, z);
    target.setBlock(b, bd);
  
    var replaceBlock = new MC.Block();
    replaceBlock.setBlock(i, id);
  
    var worker = new FillWorker();
    worker.setTarget(target);
    worker.setReplaceBlock(replaceBlock);
    worker.setListener(function(state) {
      switch(state) {
        case State.FINISHED:
          Util.toast(FloodFill.lang.WORK_FINISHED);
        break;
        default:
      }
    });
    worker.start();
  }
}