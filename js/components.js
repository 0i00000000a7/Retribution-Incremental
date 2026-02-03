// ============================================
// Vue组件系统 - 组件配置管理器
// ============================================

class VueComponentManager {
  constructor() {
    this.components = new Map();
    this.systemComponents = new Map();
    this.componentCategories = new Map();
    this.registered = false;
    this.vueInstance = null;
  }
  
  // 定义组件
  defineComponent(name, definition) {
    if (this.components.has(name)) {
      console.warn(`组件 ${name} 已存在，将被覆盖`);
    }
    
    this.components.set(name, {
      ...definition,
      name,
      timestamp: Date.now()
    });
    
    return this;
  }
  
  // 定义系统组件
  defineSystemComponent(name, definition) {
    this.systemComponents.set(name, definition);
    return this;
  }
  
  // 批量定义组件
  defineComponents(componentMap) {
    Object.entries(componentMap).forEach(([name, definition]) => {
      this.defineComponent(name, definition);
    });
    return this;
  }
  
  // 注册组件到Vue
  registerComponents(Vue) {
    if (!Vue || typeof Vue.component !== 'function') {
      console.error('Vue未定义或Vue.component不是函数');
      return false;
    }
    
    // 注册普通组件
    this.components.forEach((definition, name) => {
      try {
        Vue.component(name, definition);
        console.log(`已注册组件: ${name}`);
      } catch (error) {
        console.error(`注册组件 ${name} 时出错:`, error);
      }
    });
    
    // 注册系统组件
    this.systemComponents.forEach((definition, name) => {
      try {
        Vue.component(name, definition);
        console.log(`已注册系统组件: ${name}`);
      } catch (error) {
        console.error(`注册系统组件 ${name} 时出错:`, error);
      }
    });
    
    this.registered = true;
    return true;
  }
  
  // 创建Vue实例
  createVueInstance(Vue, el, data, methods, computed) {
    if (!this.registered) {
      console.warn('组件未注册，正在注册...');
      this.registerComponents(Vue);
    }
    
    try {
      this.vueInstance = new Vue({
        el,
        data: () => data,
        methods,
        computed,
        mounted() {
          console.log('Vue实例已挂载');
        },
        updated() {
          // 组件更新后的逻辑
        }
      });
      
      return this.vueInstance;
    } catch (error) {
      console.error('创建Vue实例时出错:', error);
      return null;
    }
  }
  
  // 获取组件定义
  getComponent(name) {
    return this.components.get(name) || this.systemComponents.get(name);
  }
  
  // 获取所有组件
  getAllComponents() {
    return {
      components: Array.from(this.components.entries()),
      systemComponents: Array.from(this.systemComponents.entries())
    };
  }
  
  // 移除组件
  removeComponent(name) {
    return this.components.delete(name);
  }
  
  // 清除所有组件
  clearComponents() {
    this.components.clear();
    this.systemComponents.clear();
    this.registered = false;
  }
}

// ============================================
// 基础UI组件定义
// ============================================

class BaseComponents {
  // 显示文本组件
  static getDisplayText() {
    return {
      props: ['layer', 'data'],
      template: `
        <span class="instant" v-html="data"></span>
      `
    };
  }
  
  // 原始HTML组件
  static getRawHtml() {
    return {
      props: ['layer', 'data'],
      template: `
        <span class="instant" v-html="data"></span>
      `
    };
  }
  
  // 空白组件
  static getBlank() {
    return {
      props: ['layer', 'data'],
      template: `
        <div class="instant">
          <div class="instant" v-if="!data" :style="{'width': '8px', 'height': '17px'}"></div>
          <div class="instant" v-else-if="Array.isArray(data)" :style="{'width': data[0], 'height': data[1]}"></div>
          <div class="instant" v-else :style="{'width': '8px', 'height': data}"><br></div>
        </div>
      `
    };
  }
  
  // 显示图像组件
  static getDisplayImage() {
    return {
      props: ['layer', 'data'],
      template: `
        <img class="instant" :src="data" :alt="data">
      `
    };
  }
}

// ============================================
// 布局组件定义
// ============================================

class LayoutComponents {
  // 行布局组件
  static getRow() {
    return {
      props: ['layer', 'data'],
      computed: {
        key() { return this.$vnode.key; }
      },
      template: `
        <div class="upgTable instant">
          <div class="upgRow">
            <div v-for="(item, index) in data">
              <div v-if="!Array.isArray(item)" :is="item" :layer="layer" :style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
              <div v-else-if="item.length==3" :style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" :is="item[0]" :layer="layer" :data="item[1]" :key="key + '-' + index"></div>
              <div v-else-if="item.length==2" :is="item[0]" :layer="layer" :data="item[1]" :style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
            </div>
          </div>
        </div>
      `
    };
  }
  
  // 列布局组件
  static getColumn() {
    return {
      props: ['layer', 'data'],
      computed: {
        key() { return this.$vnode.key; }
      },
      template: `
        <div class="upgTable instant">
          <div class="upgCol">
            <div v-for="(item, index) in data">
              <div v-if="!Array.isArray(item)" :is="item" :layer="layer" :style="tmp[layer].componentStyles[item]" :key="key + '-' + index"></div>
              <div v-else-if="item.length==3" :style="[tmp[layer].componentStyles[item[0]], (item[2] ? item[2] : {})]" :is="item[0]" :layer="layer" :data="item[1]" :key="key + '-' + index"></div>
              <div v-else-if="item.length==2" :is="item[0]" :layer="layer" :data="item[1]" :style="tmp[layer].componentStyles[item[0]]" :key="key + '-' + index"></div>
            </div>
          </div>
        </div>
      `
    };
  }
  
  // 水平线组件
  static getHLine() {
    return {
      props: ['layer', 'data'],
      template: `
        <hr class="instant hl" :style="data ? {'width': data} : {}">
      `
    };
  }
  
  // 垂直线组件
  static getVLine() {
    return {
      props: ['layer', 'data'],
      template: `
        <div class="instant vl2" :style="data ? {'height': data} : {}"></div>
      `
    };
  }
}

// ============================================
// 游戏功能组件定义
// ============================================

class GameComponents {
  // 升级组件
  static getUpgrade() {
    return {
      props: ['layer', 'data'],
      template: `
        <button 
          v-if="tmp[layer].upgrades && tmp[layer].upgrades[data]!== undefined && tmp[layer].upgrades[data].unlocked" 
          :id="'upgrade-' + layer + '-' + data" 
          @click="buyUpg(layer, data)"
          :class="{
            upgrade: true,
            [data]: true,
            [layer]: true,
            tooltipBox: true,
            upg: true,
            bought: hasUpgrade(layer, data),
            locked: (!canAffordUpgrade(layer, data) && !hasUpgrade(layer, data)),
            can: (canAffordUpgrade(layer, data) && !hasUpgrade(layer, data))
          }"
          :style="[(!hasUpgrade(layer, data) && canAffordUpgrade(layer, data)) ? {'background-color': tmp[layer].color} : {}, tmp[layer].upgrades[data].style]"
        >
          <span v-if="layers[layer].upgrades[data].fullDisplay" v-html="run(layers[layer].upgrades[data].fullDisplay, layers[layer].upgrades[data])"></span>
          <span v-else>
            <span v-if="tmp[layer].upgrades[data].title">
              <h3 v-html="i18n(tmp[layer].upgrades[data].title, tmp[layer].upgrades[data].titleI18N)"></h3><br>
            </span>
            <span v-html="i18n(tmp[layer].upgrades[data].description, tmp[layer].upgrades[data].descriptionI18N)"></span>
            <span v-if="layers[layer].upgrades[data].effectDisplay">
              <br>{{i18n('当前效果', 'Currently', false)}}: <span v-html="run(i18n(layers[layer].upgrades[data].effectDisplay, layers[layer].upgrades[data].effectDisplayI18N), layers[layer].upgrades[data])"></span>
            </span>
            <br><br>{{i18n('价格', 'Cost', false)}}: {{ formatWhole(tmp[layer].upgrades[data].cost) }} {{tmp[layer].upgrades[data].currencyDisplayName ? tmp[layer].upgrades[data].currencyDisplayName : (i18n(tmp[layer].resource, tmp[layer].resourceI18N))}}
          </span>
          <tooltip v-if="tmp[layer].upgrades[data].tooltip" :text="i18n(tmp[layer].upgrades[data].tooltip, tmp[layer].upgrades[data].tooltipI18N)"></tooltip>
        </button>
      `
    };
  }
  
  // 升级组组件
  static getUpgrades() {
    return {
      props: ['layer', 'data'],
      template: `
        <div v-if="tmp[layer].upgrades" class="upgTable">
          <div v-for="row in (data === undefined ? tmp[layer].upgrades.rows : data)" class="upgRow">
            <div v-for="col in tmp[layer].upgrades.cols">
              <div v-if="tmp[layer].upgrades[row*10+col]!== undefined && tmp[layer].upgrades[row*10+col].unlocked" class="upgAlign">
                <upgrade :layer="layer" :data="row*10+col" :style="tmp[layer].componentStyles.upgrade"></upgrade>
              </div>
            </div>
          </div>
          <br>
        </div>
      `
    };
  }
  
  // 购买组件
  static getBuyable() {
    return {
      props: ['layer', 'data', 'size'],
      data() {
        return {
          interval: false,
          time: 0
        };
      },
      template: `
        <div v-if="tmp[layer].buyables && tmp[layer].buyables[data]!== undefined && tmp[layer].buyables[data].unlocked" style="display: grid">
          <button 
            :class="{
              buyable: true,
              [data]: true,
              [layer]: true,
              tooltipBox: true,
              can: tmp[layer].buyables[data].canBuy,
              locked: !tmp[layer].buyables[data].canAfford,
              bought: player[layer].buyables[data].gte(tmp[layer].buyables[data].purchaseLimit)
            }"
            :style="[
              tmp[layer].buyables[data].canBuy ? {'background-color': tmp[layer].color} : {},
              size ? {'height': size, 'width': size} : {},
              tmp[layer].componentStyles.buyable,
              tmp[layer].buyables[data].style
            ]"
            @click="buyBuyable(layer, data)"
            @mousedown="start"
            @mouseleave="stop"
            @mouseup="stop"
            @touchstart="start"
            @touchend="stop"
            @touchcancel="stop"
          >
            <span v-if="tmp[layer].buyables[data].title">
              <h2 v-html="i18n(tmp[layer].buyables[data].title, tmp[layer].buyables[data].titleI18N)"></h2><br>
            </span>
            <span :style="{'white-space': 'pre-line'}" v-html="run(i18n(layers[layer].buyables[data].display, layers[layer].buyables[data].displayI18N), layers[layer].buyables[data])"></span>
            <node-mark :layer="layer" :data="tmp[layer].buyables[data].marked"></node-mark>
            <tooltip v-if="tmp[layer].buyables[data].tooltip" :text="i18n(tmp[layer].buyables[data].tooltip, tmp[layer].buyables[data].tooltipI18N)"></tooltip>
          </button>
          <br v-if="(tmp[layer].buyables[data].sellOne !== undefined && !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)) || (tmp[layer].buyables[data].sellAll && !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false))">
          <sell-one :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-one']" v-if="(tmp[layer].buyables[data].sellOne)&& !(tmp[layer].buyables[data].canSellOne !== undefined && tmp[layer].buyables[data].canSellOne == false)"></sell-one>
          <sell-all :layer="layer" :data="data" :style="tmp[layer].componentStyles['sell-all']" v-if="(tmp[layer].buyables[data].sellAll)&& !(tmp[layer].buyables[data].canSellAll !== undefined && tmp[layer].buyables[data].canSellAll == false)"></sell-all>
        </div>
      `,
      methods: {
        start() {
          if (!this.interval) {
            this.interval = setInterval(() => {
              if (this.time >= 5) {
                buyBuyable(this.layer, this.data);
              }
              this.time = this.time + 1;
            }, 20);
          }
        },
        stop() {
          clearInterval(this.interval);
          this.interval = false;
          this.time = 0;
        }
      }
    };
  }
  
  // 购买组组件
  static getBuyables() {
    return {
      props: ['layer', 'data'],
      template: `
        <div v-if="tmp[layer].buyables" class="upgTable">
          <respec-button v-if="tmp[layer].buyables.respec && !(tmp[layer].buyables.showRespec !== undefined && tmp[layer].buyables.showRespec == false)" :layer="layer" :style="[{'margin-bottom': '12px'}, tmp[layer].componentStyles['respec-button']]"></respec-button>
          <div v-for="row in (data === undefined ? tmp[layer].buyables.rows : data)" class="upgRow">
            <div v-for="col in tmp[layer].buyables.cols">
              <div v-if="tmp[layer].buyables[row*10+col]!== undefined && tmp[layer].buyables[row*10+col].unlocked" class="upgAlign" :style="{'margin-left': '7px', 'margin-right': '7px', 'height': (data ? data : 'inherit')}">
                <buyable :layer="layer" :data="row*10+col"></buyable>
              </div>
            </div>
            <br>
          </div>
        </div>
      `
    };
  }
  
  // 主要显示组件
  static getMainDisplay() {
    return {
      props: ['layer', 'data'],
      template: `
        <div>
          <span v-if="player[layer].points.lt('1e1000')">{{i18n("您有", "You have", false)}} </span>
          <h2 :style="{'color': tmp[layer].color, 'text-shadow': '0px 0px 10px ' + tmp[layer].color}">
            {{data ? format(player[layer].points, data) : formatWhole(player[layer].points)}}
          </h2>
          {{i18n(tmp[layer].resource, tmp[layer].resourceI18N)}}
          <span v-if="layers[layer].effectDescription">, <span v-html="run(i18n(layers[layer].effectDescription, layers[layer].effectDescriptionI18N), layers[layer])"></span></span>
          <br><br>
        </div>
      `
    };
  }
  
  // 重置按钮组件
  static getPrestigeButton() {
    return {
      props: ['layer', 'data'],
      template: `
        <button 
          v-if="(tmp[layer].type !== 'none')" 
          :class="{
            [layer]: true,
            reset: true,
            locked: !tmp[layer].canReset,
            can: tmp[layer].canReset
          }"
          :style="[tmp[layer].canReset ? {'background-color': tmp[layer].color} : {}, tmp[layer].componentStyles['prestige-button']]"
          v-html="prestigeButtonText(layer)" 
          @click="doReset(layer)"
        ></button>
      `
    };
  }
}

// ============================================
// 组件工厂和注册器
// ============================================

class ComponentFactory {
  static createBaseComponents() {
    return {
      'display-text': BaseComponents.getDisplayText(),
      'raw-html': BaseComponents.getRawHtml(),
      'blank': BaseComponents.getBlank(),
      'display-image': BaseComponents.getDisplayImage()
    };
  }
  
  static createLayoutComponents() {
    return {
      'row': LayoutComponents.getRow(),
      'column': LayoutComponents.getColumn(),
      'h-line': LayoutComponents.getHLine(),
      'v-line': LayoutComponents.getVLine()
    };
  }
  
  static createGameComponents() {
    return {
      'upgrade': GameComponents.getUpgrade(),
      'upgrades': GameComponents.getUpgrades(),
      'buyable': GameComponents.getBuyable(),
      'buyables': GameComponents.getBuyables(),
      'main-display': GameComponents.getMainDisplay(),
      'prestige-button': GameComponents.getPrestigeButton()
    };
  }
  
  // 可以根据需要添加更多组件工厂方法
}

// ============================================
// Vue组件系统 - 主系统
// ============================================

class VueComponentSystem {
  constructor() {
    this.componentManager = new VueComponentManager();
    this.initialized = false;
    this.vue = null;
    this.app = null;
  }
  
  // 初始化组件系统
  initialize() {
    if (this.initialized) return;
    
    try {
      // 注册基础组件
      const baseComponents = ComponentFactory.createBaseComponents();
      this.componentManager.defineComponents(baseComponents);
      
      // 注册布局组件
      const layoutComponents = ComponentFactory.createLayoutComponents();
      this.componentManager.defineComponents(layoutComponents);
      
      // 注册游戏组件
      const gameComponents = ComponentFactory.createGameComponents();
      this.componentManager.defineComponents(gameComponents);
      
      // 这里可以添加更多组件注册
      // ...
      
      this.initialized = true;
      console.log('Vue组件系统初始化完成');
    } catch (error) {
      console.error('初始化Vue组件系统时出错:', error);
    }
  }
  
  // 加载Vue系统
  loadVue(Vue) {
    if (!Vue) {
      console.error('Vue未定义');
      return false;
    }
    
    // 初始化组件
    this.initialize();
    
    // 注册组件
    if (!this.componentManager.registerComponents(Vue)) {
      return false;
    }
    
    // 创建Vue实例
    this.createVueApp(Vue);
    
    return true;
  }
  
  // 创建Vue应用实例
  createVueApp(Vue) {
    if (!Vue) return;
    
    // 准备Vue实例数据和方法
    const vueData = this.getVueData();
    const vueMethods = this.getVueMethods();
    const vueComputed = this.getVueComputed();
    
    // 创建Vue实例
    this.app = new Vue({
      el: '#app',
      data: vueData,
      methods: vueMethods,
      computed: vueComputed,
      mounted() {
        console.log('游戏Vue应用已挂载');
        this.onAppMounted();
      },
      updated() {
        // 组件更新后的逻辑
      }
    });
    
    // 设置全局引用
    window.app = this.app;
    
    console.log('Vue应用实例创建完成');
  }
  
  // 获取Vue实例数据
  getVueData() {
    return {
      player,
      tmp,
      options,
      Decimal,
      format,
      formatWhole,
      formatTime,
      formatSmall,
      focused,
      getThemeName,
      layerunlocked,
      doReset,
      buyUpg,
      buyUpgrade,
      startChallenge,
      milestoneShown,
      keepGoing,
      hasUpgrade,
      hasMilestone,
      hasAchievement,
      hasChallenge,
      maxedChallenge,
      getBuyableAmount,
      getClickableState,
      inChallenge,
      canAffordUpgrade,
      canBuyBuyable,
      canCompleteChallenge,
      subtabShouldNotify,
      subtabResetNotify,
      challengeStyle,
      challengeButtonText,
      constructBarStyle,
      constructParticleStyle,
      VERSION,
      LAYERS,
      hotkeys,
      activePopups,
      particles,
      mouseX,
      mouseY,
      shiftDown,
      ctrlDown,
      run,
      gridRun,
      getPointsDisplay
    };
  }
  
  // 获取Vue实例方法
  getVueMethods() {
    return {
      // 这里可以添加Vue实例特有的方法
      onAppMounted() {
        console.log('Vue应用已完全挂载');
        // 执行挂载后的初始化逻辑
      },
      
      // 工具方法
      debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },
      
      // 事件处理
      handleResize: this.debounce(() => {
        // 处理窗口大小调整
        if (window.TreeRenderSystem) {
          window.TreeRenderSystem.canvasManager.handleResize();
        }
      }, 250)
    };
  }
  
  // 获取Vue实例计算属性
  getVueComputed() {
    return {
      // 这里可以添加Vue实例的计算属性
      currentLanguage() {
        return options?.ch || 'en';
      },
      
      gamePoints() {
        return player?.points || new Decimal(0);
      },
      
      // 更多计算属性...
    };
  }
  
  // 获取组件管理器
  getComponentManager() {
    return this.componentManager;
  }
  
  // 获取Vue实例
  getVueInstance() {
    return this.app;
  }
  
  // 重新加载组件
  reloadComponents() {
    if (this.app) {
      this.app.$forceUpdate();
      console.log('Vue组件已重新加载');
    }
  }
  
  // 销毁Vue实例
  destroy() {
    if (this.app) {
      this.app.$destroy();
      this.app = null;
    }
    
    this.componentManager.clearComponents();
    this.initialized = false;
    
    console.log('Vue组件系统已销毁');
  }
}

// ============================================
// Vue组件系统 - 全局实例
// ============================================

// 创建全局实例
const VueComponentSystemInstance = new VueComponentSystem();

// 兼容原loadVue函数
function loadVue() {
  // 检查Vue是否可用
  if (typeof Vue === 'undefined') {
    console.error('Vue未定义，无法加载组件系统');
    return;
  }
  
  // 加载Vue组件系统
  return VueComponentSystemInstance.loadVue(Vue);
}

// 兼容原app变量
let app = null;

// 初始化函数
function initializeVueComponentSystem() {
  // 等待Vue加载
  if (typeof Vue === 'undefined') {
    console.warn('Vue未定义，延迟初始化组件系统');
    setTimeout(initializeVueComponentSystem, 100);
    return;
  }
  
  // 设置全局引用
  if (typeof window !== 'undefined') {
    window.VueComponentSystem = VueComponentSystemInstance;
    window.ComponentFactory = ComponentFactory;
  }
  
  console.log('Vue组件系统准备就绪');
  
  // 注意：实际加载将在loadVue()函数中调用
}

// 自动初始化
initializeVueComponentSystem();

// 导出模块（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VueComponentSystem: VueComponentSystemInstance,
    VueComponentManager,
    BaseComponents,
    LayoutComponents,
    GameComponents,
    ComponentFactory,
    loadVue
  };
}
// 1. 手动初始化组件系统
VueComponentSystemInstance.initialize();

// 2. 添加自定义组件
VueComponentSystemInstance.componentManager.defineComponent('custom-component', {
  props: ['layer', 'data'],
  template: `
    <div class="custom-component">
      <h3>自定义组件</h3>
      <p>{{ data }}</p>
    </div>
  `,
  methods: {
    customMethod() {
      console.log('自定义方法');
    }
  }
});

// 3. 获取组件定义
const upgradeComponent = VueComponentSystemInstance.componentManager.getComponent('upgrade');
console.log('升级组件定义:', upgradeComponent);

// 4. 获取所有组件
const allComponents = VueComponentSystemInstance.componentManager.getAllComponents();
console.log('所有组件:', allComponents);

// 5. 动态重新加载组件
VueComponentSystemInstance.reloadComponents();

// 6. 使用组件工厂创建新组件集
const customComponents = ComponentFactory.createCustomComponents({
  'my-component': {
    props: ['data'],
    template: '<div>{{ data }}</div>'
  }
});

// 7. 注册新的组件集
VueComponentSystemInstance.componentManager.defineComponents(customComponents);

// 8. 手动触发Vue加载（通常由游戏框架自动调用）
loadVue();

// 创建自定义组件类别
class CustomGameComponents {
  // 自定义挑战组件
  static getCustomChallenge() {
    return {
      props: ['layer', 'data'],
      template: `
        <div class="custom-challenge">
          <h3>自定义挑战</h3>
          <button @click="startCustomChallenge">开始挑战</button>
        </div>
      `,
      methods: {
        startCustomChallenge() {
          console.log('开始自定义挑战');
          // 自定义逻辑
        }
      }
    };
  }
  
  // 自定义成就组件
  static getCustomAchievement() {
    return {
      props: ['layer', 'data'],
      template: `
        <div class="custom-achievement">
          <span class="achievement-icon">🏆</span>
          <span class="achievement-text">{{ data.name }}</span>
        </div>
      `
    };
  }
}

// 扩展组件工厂
ComponentFactory.createCustomComponents = function(customMap) {
  return customMap;
};

// 注册自定义组件
VueComponentSystemInstance.componentManager.defineComponents({
  'custom-challenge': CustomGameComponents.getCustomChallenge(),
  'custom-achievement': CustomGameComponents.getCustomAchievement()
});

