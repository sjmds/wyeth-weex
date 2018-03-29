<template>
  <div class = "o-searchview">
    <div  class = "o-searchbar-wrap">
      <!--搜索条-->
      <transition name = "slide-fade">
        <div ref = "input1" class = "o-searchbar-inner" :style = "inputStyle">
          <image class = "o-search-icon" :src = "searchIcon"/>
          <input class = "o-search-input"
                 :placeholder = "hintText"
                 return-key-type = "search"
                 ref = "input"
                 type = "search"
                 :autofocus = "autofocus"
                 @change = "onChange"
                 @return = "onreturn"
                 @input = "onInput"
                 @focus = "onFocus"
                 @blur = "onBlur"/>
        </div>
      </transition>

      <transition name = "slide-fade">
        <text v-if = "isOpen" @click = "onBtnClick" class = "o-searchbar-cancel" lines = "1">{{btnText}}</text>
      </transition >
    </div>
    <transition name = "alpha-fade">
      <div v-show="isOpen&&!searchover" class = "o-history" @click="onBgClick">
        <slot name = "search_preview"></slot>
      </div>
    </transition>
    <transition name = "alpha-fade">
      <div v-if="isOpen&&searchover" ref = "result_page" class = "o-history" >
        <slot name = "search_result"></slot>
      </div>
    </transition>

  </div>
</template>

<script>
  // 其它用法与vue相同
  import Base from '../../mixins/base'
  const animation = weex.requireModule('animation')
  var modal = weex.requireModule('modal')
  export default {
    mixins: [Base],
    props: {
      hint: {
        type: String,
        default: '搜索一下'
      },
      autofocus: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      btnText: {
        type: String,
        default: function () {
          return '取消'
        }
      }
    },
    data () {
      return {
        searchIcon: require('assets/search.png'),
        clearImg: require('assets/delete.png'),
        isOpen: false,
        searchover: false,
        hintText: this.hint,
        value: ''
      }
    },
    watch: {
      searchover: function (newobj, oldobj) {
        this.$emit('showResult', newobj)
      }
    },
    computed: {
      inputStyle: function () {
        return {
          width: this.rpx(718, true),
          backgroundColor: '#ffffff',
          justifyContent: this.isOpen ? 'flex-start' : 'center'
        }
      }
    },
    methods: {
      onBgClick: function () {
      	this.$router.go(-1)
      },
      onFocus: function () {
        this.isOpen = true
        this.changeWidth(630)
        this.$emit('onFocus')
//      modal.toast({
//        message: 'This is a toast',
//        duration: 0.3
//      })
        console.log('----- onFocus')
      },
      onBlur: function () {
        this.$emit('onBlur')
        console.log('----- onBlur')
      },
      changeWidth: function (w) {
        var testEl = this.$refs.input1
        animation.transition(testEl, {
          styles: {
            width: this.rpx(w, true)
          },
          duration: 300,
          timingFunction: 'linear',
          delay: 0
        }, function () {
        })
      },
      cancel: function () {
        this.isOpen = false
        this.searchover = false
        this.changeWidth(718)
        this.$emit('onClose')
        this.clear()
      },
      onBtnClick: function () {
        if (this.btnText === '取消') {
          this.cancel()
        } else {
          this.$emit('onBtnClick')
        }
      },
      getValue () {
        return this.$refs.input.$el.value
      },
      onChange (ev) {
//      modal.toast({
//        message: 'input onChange',
//        duration: 0.8
//      })
      },
      onInput (event) {
        this.value = event.value
        this.searchover = false
      },
      onreturn: function (event) {
        this.search(event.value)
//      this.$refs.input.blur()
      },
      search (value) {
        if (value.trim() === '') {
          modal.toast({
            message: '搜索词不得为空',
            duration: 0.3
          })
        } else {
          this.$refs.input.$el.value = value
          this.$emit('search', value)
          this.jump()
        }
      },
      clear: function () {
        this.$refs.input.$el.value = ''
        this.searchover = false
      },
      jump () {
        this.searchover = true
        this.$nextTick(function () {
          if (this.$refs.result_page.$children.length > 0) {
            // 不跳转
            this.searchover = true
          } else {
            this.searchover = false
          }
        })
      },
      back () {
        this.searchover = false
      }

    },
    created () {
      if (this.$refs.input) {
        this.clear()
        if (this.autofocus) {
          this.$refs.input.focus()
        }
      }
    },
    mounted () {
    },
    activated () {
      if (this.autofocus) {
        this.isOpen = true
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "index"
</style>
