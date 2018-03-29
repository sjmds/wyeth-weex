/**
 * Created by FJC on 2017/9/12.
 */

export default {

  methods: {
    num2str (num) {
      if (num > 10000) {
        let n = num / 10000
        return n.toFixed(1) + '万'
      }
      return num
    }

  }

}
