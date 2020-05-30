const cookie = {
  /**
   * 读取 cookie 键 对应的 值
   * @param name 获取的 cookie 键
   */
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
