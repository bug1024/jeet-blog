/**
* @vue/shared v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function os(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Y = {}, yt = [], Be = () => {
}, fi = () => !1, _n = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), xn = (e) => e.startsWith("onUpdate:"), re = Object.assign, cs = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Sr = Object.prototype.hasOwnProperty, B = (e, t) => Sr.call(e, t), R = Array.isArray, _t = (e) => Jt(e) === "[object Map]", ui = (e) => Jt(e) === "[object Set]", As = (e) => Jt(e) === "[object Date]", D = (e) => typeof e == "function", ee = (e) => typeof e == "string", ke = (e) => typeof e == "symbol", k = (e) => e !== null && typeof e == "object", ai = (e) => (k(e) || D(e)) && D(e.then) && D(e.catch), di = Object.prototype.toString, Jt = (e) => di.call(e), Cr = (e) => Jt(e).slice(8, -1), hi = (e) => Jt(e) === "[object Object]", fs = (e) => ee(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ft = /* @__PURE__ */ os(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), wn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Tr = /-\w/g, Me = wn(
  (e) => e.replace(Tr, (t) => t.slice(1).toUpperCase())
), Er = /\B([A-Z])/g, mt = wn(
  (e) => e.replace(Er, "-$1").toLowerCase()
), pi = wn((e) => e.charAt(0).toUpperCase() + e.slice(1)), $n = wn(
  (e) => e ? `on${pi(e)}` : ""
), je = (e, t) => !Object.is(e, t), Dn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, gi = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Ar = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Mr = (e) => {
  const t = ee(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Ms;
const Sn = () => Ms || (Ms = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function jt(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = ee(s) ? Rr(s) : jt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (ee(e) || k(e))
    return e;
}
const Or = /;(?![^(]*\))/g, Pr = /:([^]+)/, Ir = /\/\*[^]*?\*\//g;
function Rr(e) {
  const t = {};
  return e.replace(Ir, "").split(Or).forEach((n) => {
    if (n) {
      const s = n.split(Pr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Vt(e) {
  let t = "";
  if (ee(e))
    t = e;
  else if (R(e))
    for (let n = 0; n < e.length; n++) {
      const s = Vt(e[n]);
      s && (t += s + " ");
    }
  else if (k(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Fr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Lr = /* @__PURE__ */ os(Fr);
function mi(e) {
  return !!e || e === "";
}
function $r(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = us(e[s], t[s]);
  return n;
}
function us(e, t) {
  if (e === t) return !0;
  let n = As(e), s = As(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = ke(e), s = ke(t), n || s)
    return e === t;
  if (n = R(e), s = R(t), n || s)
    return n && s ? $r(e, t) : !1;
  if (n = k(e), s = k(t), n || s) {
    if (!n || !s)
      return !1;
    const i = Object.keys(e).length, r = Object.keys(t).length;
    if (i !== r)
      return !1;
    for (const l in e) {
      const o = e.hasOwnProperty(l), c = t.hasOwnProperty(l);
      if (o && !c || !o && c || !us(e[l], t[l]))
        return !1;
    }
  }
  return String(e) === String(t);
}
const bi = (e) => !!(e && e.__v_isRef === !0), ye = (e) => ee(e) ? e : e == null ? "" : R(e) || k(e) && (e.toString === di || !D(e.toString)) ? bi(e) ? ye(e.value) : JSON.stringify(e, vi, 2) : String(e), vi = (e, t) => bi(t) ? vi(e, t.value) : _t(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[Hn(s, r) + " =>"] = i, n),
    {}
  )
} : ui(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Hn(n))
} : ke(t) ? Hn(t) : k(t) && !R(t) && !hi(t) ? String(t) : t, Hn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    ke(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ce;
class Dr {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ce && (ce.active ? (this.parent = ce, this.index = (ce.scopes || (ce.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes) {
        const s = this.scopes.slice();
        for (t = 0, n = s.length; t < n; t++)
          s[t].pause();
      }
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes) {
        const i = this.scopes.slice();
        for (t = 0, n = i.length; t < n; t++)
          i[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, n = s.length; t < n; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = ce;
      try {
        return ce = this, t();
      } finally {
        ce = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ce, ce = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ce === this)
        ce = this.prevScope;
      else {
        let t = ce;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const i = this.scopes.slice();
        for (n = 0, s = i.length; n < s; n++)
          i[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Hr() {
  return ce;
}
let J;
const Nn = /* @__PURE__ */ new WeakSet();
class yi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ce && (ce.active ? ce.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Nn.has(this) && (Nn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || xi(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Os(this), wi(this);
    const t = J, n = Oe;
    J = this, Oe = !0;
    try {
      return this.fn();
    } finally {
      Si(this), J = t, Oe = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        hs(t);
      this.deps = this.depsTail = void 0, Os(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Nn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Gn(this) && this.run();
  }
  get dirty() {
    return Gn(this);
  }
}
let _i = 0, Lt, $t;
function xi(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = $t, $t = e;
    return;
  }
  e.next = Lt, Lt = e;
}
function as() {
  _i++;
}
function ds() {
  if (--_i > 0)
    return;
  if ($t) {
    let t = $t;
    for ($t = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Lt; ) {
    let t = Lt;
    for (Lt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function wi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Si(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), hs(s), Nr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Gn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ci(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ci(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Bt) || (e.globalVersion = Bt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Gn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = J, s = Oe;
  J = e, Oe = !0;
  try {
    wi(e);
    const i = e.fn(e._value);
    (t.version === 0 || je(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    J = n, Oe = s, Si(e), e.flags &= -3;
  }
}
function hs(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      hs(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Nr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Oe = !0;
const Ti = [];
function Ye() {
  Ti.push(Oe), Oe = !1;
}
function Xe() {
  const e = Ti.pop();
  Oe = e === void 0 ? !0 : e;
}
function Os(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = J;
    J = void 0;
    try {
      t();
    } finally {
      J = n;
    }
  }
}
let Bt = 0;
class jr {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ps {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!J || !Oe || J === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== J)
      n = this.activeLink = new jr(J, this), J.deps ? (n.prevDep = J.depsTail, J.depsTail.nextDep = n, J.depsTail = n) : J.deps = J.depsTail = n, Ei(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = J.depsTail, n.nextDep = void 0, J.depsTail.nextDep = n, J.depsTail = n, J.deps === n && (J.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Bt++, this.notify(t);
  }
  notify(t) {
    as();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ds();
    }
  }
}
function Ei(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ei(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Jn = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ Symbol(
  ""
), Yn = /* @__PURE__ */ Symbol(
  ""
), kt = /* @__PURE__ */ Symbol(
  ""
);
function ae(e, t, n) {
  if (Oe && J) {
    let s = Jn.get(e);
    s || Jn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new ps()), i.map = s, i.key = n), i.track();
  }
}
function Je(e, t, n, s, i, r) {
  const l = Jn.get(e);
  if (!l) {
    Bt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (as(), t === "clear")
    l.forEach(o);
  else {
    const c = R(e), d = c && fs(n);
    if (c && n === "length") {
      const u = Number(s);
      l.forEach((h, y) => {
        (y === "length" || y === kt || !ke(y) && y >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(kt)), t) {
        case "add":
          c ? d && o(l.get("length")) : (o(l.get(ht)), _t(e) && o(l.get(Yn)));
          break;
        case "delete":
          c || (o(l.get(ht)), _t(e) && o(l.get(Yn)));
          break;
        case "set":
          _t(e) && o(l.get(ht));
          break;
      }
  }
  ds();
}
function bt(e) {
  const t = /* @__PURE__ */ V(e);
  return t === e ? t : (ae(t, "iterate", kt), /* @__PURE__ */ Ee(e) ? t : t.map(Pe));
}
function Cn(e) {
  return ae(e = /* @__PURE__ */ V(e), "iterate", kt), e;
}
function He(e, t) {
  return /* @__PURE__ */ Ze(e) ? St(/* @__PURE__ */ pt(e) ? Pe(t) : t) : Pe(t);
}
const Vr = {
  __proto__: null,
  [Symbol.iterator]() {
    return jn(this, Symbol.iterator, (e) => He(this, e));
  },
  concat(...e) {
    return bt(this).concat(
      ...e.map((t) => R(t) ? bt(t) : t)
    );
  },
  entries() {
    return jn(this, "entries", (e) => (e[1] = He(this, e[1]), e));
  },
  every(e, t) {
    return Ue(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ue(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => He(this, s)),
      arguments
    );
  },
  find(e, t) {
    return Ue(
      this,
      "find",
      e,
      t,
      (n) => He(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Ue(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ue(
      this,
      "findLast",
      e,
      t,
      (n) => He(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Ue(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ue(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Vn(this, "includes", e);
  },
  indexOf(...e) {
    return Vn(this, "indexOf", e);
  },
  join(e) {
    return bt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Vn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ue(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return At(this, "pop");
  },
  push(...e) {
    return At(this, "push", e);
  },
  reduce(e, ...t) {
    return Ps(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ps(this, "reduceRight", e, t);
  },
  shift() {
    return At(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ue(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return At(this, "splice", e);
  },
  toReversed() {
    return bt(this).toReversed();
  },
  toSorted(e) {
    return bt(this).toSorted(e);
  },
  toSpliced(...e) {
    return bt(this).toSpliced(...e);
  },
  unshift(...e) {
    return At(this, "unshift", e);
  },
  values() {
    return jn(this, "values", (e) => He(this, e));
  }
};
function jn(e, t, n) {
  const s = Cn(e), i = s[t]();
  return s !== e && !/* @__PURE__ */ Ee(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
const Br = Array.prototype;
function Ue(e, t, n, s, i, r) {
  const l = Cn(e), o = l !== e && !/* @__PURE__ */ Ee(e), c = l[t];
  if (c !== Br[t]) {
    const h = c.apply(e, r);
    return o ? Pe(h) : h;
  }
  let d = n;
  l !== e && (o ? d = function(h, y) {
    return n.call(this, He(e, h), y, e);
  } : n.length > 2 && (d = function(h, y) {
    return n.call(this, h, y, e);
  }));
  const u = c.call(l, d, s);
  return o && i ? i(u) : u;
}
function Ps(e, t, n, s) {
  const i = Cn(e), r = i !== e && !/* @__PURE__ */ Ee(e);
  let l = n, o = !1;
  i !== e && (r ? (o = s.length === 0, l = function(d, u, h) {
    return o && (o = !1, d = He(e, d)), n.call(this, d, He(e, u), h, e);
  }) : n.length > 3 && (l = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const c = i[t](l, ...s);
  return o ? He(e, c) : c;
}
function Vn(e, t, n) {
  const s = /* @__PURE__ */ V(e);
  ae(s, "iterate", kt);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ bs(n[0]) ? (n[0] = /* @__PURE__ */ V(n[0]), s[t](...n)) : i;
}
function At(e, t, n = []) {
  Ye(), as();
  const s = (/* @__PURE__ */ V(e))[t].apply(e, n);
  return ds(), Xe(), s;
}
const kr = /* @__PURE__ */ os("__proto__,__v_isRef,__isVue"), Ai = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ke)
);
function Kr(e) {
  ke(e) || (e = String(e));
  const t = /* @__PURE__ */ V(this);
  return ae(t, "has", e), t.hasOwnProperty(e);
}
class Mi {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return s === (i ? r ? Qr : Ri : r ? Ii : Pi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = R(t);
    if (!i) {
      let c;
      if (l && (c = Vr[n]))
        return c;
      if (n === "hasOwnProperty")
        return Kr;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ de(t) ? t : s
    );
    if ((ke(n) ? Ai.has(n) : kr(n)) || (i || ae(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ de(o)) {
      const c = l && fs(n) ? o : o.value;
      return i && k(c) ? /* @__PURE__ */ Zn(c) : c;
    }
    return k(o) ? i ? /* @__PURE__ */ Zn(o) : /* @__PURE__ */ Tn(o) : o;
  }
}
class Oi extends Mi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = R(t) && fs(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ Ze(r);
      if (!/* @__PURE__ */ Ee(s) && !/* @__PURE__ */ Ze(s) && (r = /* @__PURE__ */ V(r), s = /* @__PURE__ */ V(s)), !l && /* @__PURE__ */ de(r) && !/* @__PURE__ */ de(s))
        return d || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : B(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ de(t) ? t : i
    );
    return t === /* @__PURE__ */ V(i) && c && (o ? je(s, r) && Je(t, "set", n, s) : Je(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = B(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && Je(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!ke(n) || !Ai.has(n)) && ae(t, "has", n), s;
  }
  ownKeys(t) {
    return ae(
      t,
      "iterate",
      R(t) ? "length" : ht
    ), Reflect.ownKeys(t);
  }
}
class Ur extends Mi {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Wr = /* @__PURE__ */ new Oi(), zr = /* @__PURE__ */ new Ur(), qr = /* @__PURE__ */ new Oi(!0);
const Xn = (e) => e, en = (e) => Reflect.getPrototypeOf(e);
function Gr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ V(i), l = _t(r), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, d = i[e](...s), u = n ? Xn : t ? St : Pe;
    return !t && ae(
      r,
      "iterate",
      c ? Yn : ht
    ), re(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: y } = d.next();
          return y ? { value: h, done: y } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: y
          };
        }
      }
    );
  };
}
function tn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Jr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ V(r), o = /* @__PURE__ */ V(i);
      e || (je(i, o) && ae(l, "get", i), ae(l, "get", o));
      const { has: c } = en(l), d = t ? Xn : e ? St : Pe;
      if (c.call(l, i))
        return d(r.get(i));
      if (c.call(l, o))
        return d(r.get(o));
      r !== l && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && ae(/* @__PURE__ */ V(i), "iterate", ht), i.size;
    },
    has(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ V(r), o = /* @__PURE__ */ V(i);
      return e || (je(i, o) && ae(l, "has", i), ae(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ V(o), d = t ? Xn : e ? St : Pe;
      return !e && ae(c, "iterate", ht), o.forEach((u, h) => i.call(r, d(u), d(h), l));
    }
  };
  return re(
    n,
    e ? {
      add: tn("add"),
      set: tn("set"),
      delete: tn("delete"),
      clear: tn("clear")
    } : {
      add(i) {
        const r = /* @__PURE__ */ V(this), l = en(r), o = /* @__PURE__ */ V(i), c = !t && !/* @__PURE__ */ Ee(i) && !/* @__PURE__ */ Ze(i) ? o : i;
        return l.has.call(r, c) || je(i, c) && l.has.call(r, i) || je(o, c) && l.has.call(r, o) || (r.add(c), Je(r, "add", c, c)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ Ee(r) && !/* @__PURE__ */ Ze(r) && (r = /* @__PURE__ */ V(r));
        const l = /* @__PURE__ */ V(this), { has: o, get: c } = en(l);
        let d = o.call(l, i);
        d || (i = /* @__PURE__ */ V(i), d = o.call(l, i));
        const u = c.call(l, i);
        return l.set(i, r), d ? je(r, u) && Je(l, "set", i, r) : Je(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ V(this), { has: l, get: o } = en(r);
        let c = l.call(r, i);
        c || (i = /* @__PURE__ */ V(i), c = l.call(r, i)), o && o.call(r, i);
        const d = r.delete(i);
        return c && Je(r, "delete", i, void 0), d;
      },
      clear() {
        const i = /* @__PURE__ */ V(this), r = i.size !== 0, l = i.clear();
        return r && Je(
          i,
          "clear",
          void 0,
          void 0
        ), l;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = Gr(i, e, t);
  }), n;
}
function gs(e, t) {
  const n = Jr(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    B(n, i) && i in s ? n : s,
    i,
    r
  );
}
const Yr = {
  get: /* @__PURE__ */ gs(!1, !1)
}, Xr = {
  get: /* @__PURE__ */ gs(!1, !0)
}, Zr = {
  get: /* @__PURE__ */ gs(!0, !1)
};
const Pi = /* @__PURE__ */ new WeakMap(), Ii = /* @__PURE__ */ new WeakMap(), Ri = /* @__PURE__ */ new WeakMap(), Qr = /* @__PURE__ */ new WeakMap();
function el(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function Tn(e) {
  return /* @__PURE__ */ Ze(e) ? e : ms(
    e,
    !1,
    Wr,
    Yr,
    Pi
  );
}
// @__NO_SIDE_EFFECTS__
function tl(e) {
  return ms(
    e,
    !1,
    qr,
    Xr,
    Ii
  );
}
// @__NO_SIDE_EFFECTS__
function Zn(e) {
  return ms(
    e,
    !0,
    zr,
    Zr,
    Ri
  );
}
function ms(e, t, n, s, i) {
  if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = el(Cr(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return i.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function pt(e) {
  return /* @__PURE__ */ Ze(e) ? /* @__PURE__ */ pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ze(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Ee(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function bs(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ V(t) : e;
}
function nl(e) {
  return !B(e, "__v_skip") && Object.isExtensible(e) && gi(e, "__v_skip", !0), e;
}
const Pe = (e) => k(e) ? /* @__PURE__ */ Tn(e) : e, St = (e) => k(e) ? /* @__PURE__ */ Zn(e) : e;
// @__NO_SIDE_EFFECTS__
function de(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
  return sl(e, !1);
}
function sl(e, t) {
  return /* @__PURE__ */ de(e) ? e : new il(e, t);
}
class il {
  constructor(t, n) {
    this.dep = new ps(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ V(t), this._value = n ? t : Pe(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Ee(t) || /* @__PURE__ */ Ze(t);
    t = s ? t : /* @__PURE__ */ V(t), je(t, n) && (this._rawValue = t, this._value = s ? t : Pe(t), this.dep.trigger());
  }
}
function ze(e) {
  return /* @__PURE__ */ de(e) ? e.value : e;
}
const rl = {
  get: (e, t, n) => t === "__v_raw" ? e : ze(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ de(i) && !/* @__PURE__ */ de(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Fi(e) {
  return /* @__PURE__ */ pt(e) ? e : new Proxy(e, rl);
}
class ll {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ps(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Bt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    J !== this)
      return xi(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Ci(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function ol(e, t, n = !1) {
  let s, i;
  return D(e) ? s = e : (s = e.get, i = e.set), new ll(s, i, n);
}
const nn = {}, fn = /* @__PURE__ */ new WeakMap();
let at;
function cl(e, t = !1, n = at) {
  if (n) {
    let s = fn.get(n);
    s || fn.set(n, s = []), s.push(e);
  }
}
function fl(e, t, n = Y) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: c } = n, d = (M) => i ? M : /* @__PURE__ */ Ee(M) || i === !1 || i === 0 ? nt(M, 1) : nt(M);
  let u, h, y, C, $ = !1, P = !1;
  if (/* @__PURE__ */ de(e) ? (h = () => e.value, $ = /* @__PURE__ */ Ee(e)) : /* @__PURE__ */ pt(e) ? (h = () => d(e), $ = !0) : R(e) ? (P = !0, $ = e.some((M) => /* @__PURE__ */ pt(M) || /* @__PURE__ */ Ee(M)), h = () => e.map((M) => {
    if (/* @__PURE__ */ de(M))
      return M.value;
    if (/* @__PURE__ */ pt(M))
      return d(M);
    if (D(M))
      return c ? c(M, 2) : M();
  })) : D(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (y) {
      Ye();
      try {
        y();
      } finally {
        Xe();
      }
    }
    const M = at;
    at = u;
    try {
      return c ? c(e, 3, [C]) : e(C);
    } finally {
      at = M;
    }
  } : h = Be, t && i) {
    const M = h, K = i === !0 ? 1 / 0 : i;
    h = () => nt(M(), K);
  }
  const z = Hr(), N = () => {
    u.stop(), z && z.active && cs(z.effects, u);
  };
  if (r && t) {
    const M = t;
    t = (...K) => {
      const se = M(...K);
      return N(), se;
    };
  }
  let _ = P ? new Array(e.length).fill(nn) : nn;
  const F = (M) => {
    if (!(!(u.flags & 1) || !u.dirty && !M))
      if (t) {
        const K = u.run();
        if (M || i || $ || (P ? K.some((se, he) => je(se, _[he])) : je(K, _))) {
          y && y();
          const se = at;
          at = u;
          try {
            const he = [
              K,
              // pass undefined as the old value when it's changed for the first time
              _ === nn ? void 0 : P && _[0] === nn ? [] : _,
              C
            ];
            _ = K, c ? c(t, 3, he) : (
              // @ts-expect-error
              t(...he)
            );
          } finally {
            at = se;
          }
        }
      } else
        u.run();
  };
  return o && o(F), u = new yi(h), u.scheduler = l ? () => l(F, !1) : F, C = (M) => cl(M, !1, u), y = u.onStop = () => {
    const M = fn.get(u);
    if (M) {
      if (c)
        c(M, 4);
      else
        for (const K of M) K();
      fn.delete(u);
    }
  }, t ? s ? F(!0) : _ = u.run() : l ? l(F.bind(null, !0), !0) : u.run(), N.pause = u.pause.bind(u), N.resume = u.resume.bind(u), N.stop = N, N;
}
function nt(e, t = 1 / 0, n) {
  if (t <= 0 || !k(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ de(e))
    nt(e.value, t, n);
  else if (R(e))
    for (let s = 0; s < e.length; s++)
      nt(e[s], t, n);
  else if (ui(e) || _t(e))
    e.forEach((s) => {
      nt(s, t, n);
    });
  else if (hi(e)) {
    for (const s in e)
      nt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && nt(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Yt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    En(i, t, n);
  }
}
function Ae(e, t, n, s) {
  if (D(e)) {
    const i = Yt(e, t, n, s);
    return i && ai(i) && i.catch((r) => {
      En(r, t, n);
    }), i;
  }
  if (R(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(Ae(e[r], t, n, s));
    return i;
  }
}
function En(e, t, n, s = !0) {
  const i = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: l } = t && t.appContext.config || Y;
  if (t) {
    let o = t.parent;
    const c = t.proxy, d = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; o; ) {
      const u = o.ec;
      if (u) {
        for (let h = 0; h < u.length; h++)
          if (u[h](e, c, d) === !1)
            return;
      }
      o = o.parent;
    }
    if (r) {
      Ye(), Yt(r, null, 10, [
        e,
        c,
        d
      ]), Xe();
      return;
    }
  }
  ul(e, n, i, s, l);
}
function ul(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const ge = [];
let De = -1;
const xt = [];
let tt = null, vt = 0;
const Li = /* @__PURE__ */ Promise.resolve();
let un = null;
function al(e) {
  const t = un || Li;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function dl(e) {
  let t = De + 1, n = ge.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = ge[s], r = Kt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function vs(e) {
  if (!(e.flags & 1)) {
    const t = Kt(e), n = ge[ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Kt(n) ? ge.push(e) : ge.splice(dl(t), 0, e), e.flags |= 1, $i();
  }
}
function $i() {
  un || (un = Li.then(Hi));
}
function hl(e) {
  if (!R(e))
    tt && e.id === -1 ? tt.splice(vt + 1, 0, e) : e.flags & 1 || (xt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      xt.push(e[t]);
  $i();
}
function Is(e, t, n = De + 1) {
  for (; n < ge.length; n++) {
    const s = ge[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ge.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Di(e) {
  if (xt.length) {
    const t = [...new Set(xt)].sort(
      (n, s) => Kt(n) - Kt(s)
    );
    if (xt.length = 0, tt) {
      for (let n = 0; n < t.length; n++)
        tt.push(t[n]);
      return;
    }
    for (tt = t, vt = 0; vt < tt.length; vt++) {
      const n = tt[vt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    tt = null, vt = 0;
  }
}
const Kt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Hi(e) {
  try {
    for (De = 0; De < ge.length; De++) {
      const t = ge[De];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Yt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; De < ge.length; De++) {
      const t = ge[De];
      t && (t.flags &= -2);
    }
    De = -1, ge.length = 0, Di(), un = null, (ge.length || xt.length) && Hi();
  }
}
let Ve = null, Ni = null;
function an(e) {
  const t = Ve;
  return Ve = e, Ni = e && e.type.__scopeId || null, t;
}
function Qn(e, t = Ve, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && mn(-1);
    const r = an(t), l = gt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let c = gt.length; c > l; c--) hr();
      an(r), s._d && mn(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function lt(e, t, n, s) {
  const i = e.dirs, r = t && t.dirs;
  for (let l = 0; l < i.length; l++) {
    const o = i[l];
    r && (o.oldValue = r[l].value);
    let c = o.dir[s];
    c && (Ye(), Ae(c, n, 8, [
      e.el,
      o,
      e,
      t
    ]), Xe());
  }
}
function pl(e, t) {
  if (be) {
    let n = be.provides;
    const s = be.parent && be.parent.provides;
    s === n && (n = be.provides = Object.create(s)), n[e] = t;
  }
}
function rn(e, t, n = !1) {
  const s = mr();
  if (s || wt) {
    let i = wt ? wt._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && D(t) ? t.call(s && s.proxy) : t;
  }
}
const gl = /* @__PURE__ */ Symbol.for("v-scx"), ml = () => rn(gl);
function Bn(e, t, n) {
  return ji(e, t, n);
}
function ji(e, t, n = Y) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = re({}, n), c = t && s || !t && r !== "post";
  let d;
  if (qt) {
    if (r === "sync") {
      const C = ml();
      d = C.__watcherHandles || (C.__watcherHandles = []);
    } else if (!c) {
      const C = () => {
      };
      return C.stop = Be, C.resume = Be, C.pause = Be, C;
    }
  }
  const u = be;
  o.call = (C, $, P) => Ae(C, u, $, P);
  let h = !1;
  r === "post" ? o.scheduler = (C) => {
    _e(C, u && u.suspense);
  } : r !== "sync" && (h = !0, o.scheduler = (C, $) => {
    $ ? C() : vs(C);
  }), o.augmentJob = (C) => {
    t && (C.flags |= 4), h && (C.flags |= 2, u && (C.id = u.uid, C.i = u));
  };
  const y = fl(e, t, o);
  return qt && (d ? d.push(y) : c && y()), y;
}
function bl(e, t, n) {
  const s = this.proxy, i = ee(e) ? e.includes(".") ? Vi(s, e) : () => s[e] : e.bind(s, s);
  let r;
  D(t) ? r = t : (r = t.handler, n = t);
  const l = Xt(this), o = ji(i, r.bind(s), n);
  return l(), o;
}
function Vi(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const vl = /* @__PURE__ */ Symbol("_vte"), An = (e) => e.__isTeleport, Te = /* @__PURE__ */ Symbol("_leaveCb"), Mt = /* @__PURE__ */ Symbol("_enterCb");
function yl() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Pn(() => {
    e.isMounted = !0;
  }), In(() => {
    e.isUnmounting = !0;
  }), e;
}
const Ce = [Function, Array], Bi = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Ce,
  onEnter: Ce,
  onAfterEnter: Ce,
  onEnterCancelled: Ce,
  // leave
  onBeforeLeave: Ce,
  onLeave: Ce,
  onAfterLeave: Ce,
  onLeaveCancelled: Ce,
  // appear
  onBeforeAppear: Ce,
  onAppear: Ce,
  onAfterAppear: Ce,
  onAppearCancelled: Ce
}, ki = (e) => {
  const t = e.subTree;
  return t.component ? ki(t.component) : t;
}, _l = {
  name: "BaseTransition",
  props: Bi,
  setup(e, { slots: t }) {
    const n = mr(), s = yl();
    return () => {
      const i = t.default && Wi(t.default(), !0), r = i && i.length ? Ki(i) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? co() : void 0
      );
      if (!r)
        return;
      const l = /* @__PURE__ */ V(e), { mode: o } = l;
      if (s.isLeaving)
        return kn(r);
      const c = dn(r);
      if (!c)
        return kn(r);
      let d = es(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (h) => d = h
      );
      c.type !== me && Ut(c, d);
      let u = n.subTree && dn(n.subTree);
      if (u && u.type !== me && !dt(u, c) && ki(n).type !== me) {
        let h = es(
          u,
          l,
          s,
          n
        );
        if (Ut(u, h), o === "out-in" && c.type !== me)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave, u = void 0;
          }, kn(r);
        o === "in-out" && c.type !== me ? h.delayLeave = (y, C, $) => {
          const P = Ui(
            s,
            u
          );
          P[String(u.key)] = u, y[Te] = () => {
            C(), y[Te] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            $(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return r;
    };
  }
};
function Ki(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== me) {
        t = n;
        break;
      }
  }
  return t;
}
const xl = _l;
function Ui(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function es(e, t, n, s, i) {
  const {
    appear: r,
    mode: l,
    persisted: o = !1,
    onBeforeEnter: c,
    onEnter: d,
    onAfterEnter: u,
    onEnterCancelled: h,
    onBeforeLeave: y,
    onLeave: C,
    onAfterLeave: $,
    onLeaveCancelled: P,
    onBeforeAppear: z,
    onAppear: N,
    onAfterAppear: _,
    onAppearCancelled: F
  } = t, M = String(e.key), K = Ui(n, e), se = (H, U) => {
    H && Ae(
      H,
      s,
      9,
      U
    );
  }, he = (H, U) => {
    const Z = U[1];
    se(H, U), R(H) ? H.every((A) => A.length <= 1) && Z() : H.length <= 1 && Z();
  }, ve = {
    mode: l,
    persisted: o,
    beforeEnter(H) {
      let U = c;
      if (!n.isMounted)
        if (r)
          U = z || c;
        else
          return;
      H[Te] && H[Te](
        !0
        /* cancelled */
      );
      const Z = K[M];
      Z && dt(e, Z) && Z.el[Te] && Z.el[Te](), se(U, [H]);
    },
    enter(H) {
      if (K[M] === e) return;
      let U = d, Z = u, A = h;
      if (!n.isMounted)
        if (r)
          U = N || d, Z = _ || u, A = F || h;
        else
          return;
      let X = !1;
      H[Mt] = (Ke) => {
        X || (X = !0, Ke ? se(A, [H]) : se(Z, [H]), ve.delayedLeave && ve.delayedLeave(), H[Mt] = void 0);
      };
      const ue = H[Mt].bind(null, !1);
      U ? he(U, [H, ue]) : ue();
    },
    leave(H, U) {
      const Z = String(e.key);
      if (H[Mt] && H[Mt](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return U();
      se(y, [H]);
      let A = !1;
      H[Te] = (ue) => {
        A || (A = !0, U(), ue ? se(P, [H]) : se($, [H]), H[Te] = void 0, K[Z] === e && delete K[Z]);
      };
      const X = H[Te].bind(null, !1);
      K[Z] = e, C ? he(C, [H, X]) : X();
    },
    clone(H) {
      const U = es(
        H,
        t,
        n,
        s,
        i
      );
      return i && i(U), U;
    }
  };
  return ve;
}
function kn(e) {
  if (Mn(e))
    return e = st(e), e.children = null, e;
}
function dn(e) {
  if (!Mn(e))
    return An(e.type) && e.children ? Ki(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && D(n.default))
      return n.default();
  }
}
function Ut(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Ut(
      An(n.type) && dn(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Wi(e, t = !1, n) {
  let s = [], i = 0;
  for (let r = 0; r < e.length; r++) {
    let l = e[r];
    const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : r);
    l.type === xe ? (l.patchFlag & 128 && i++, s = s.concat(
      Wi(l.children, t, o)
    )) : (t || l.type !== me) && s.push(o != null ? st(l, { key: o }) : l);
  }
  if (i > 1)
    for (let r = 0; r < s.length; r++)
      s[r].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
  return D(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    re({ name: e.name }, t, { setup: e })
  ) : e;
}
function qi(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Rs(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const hn = /* @__PURE__ */ new WeakMap();
function Dt(e, t, n, s, i = !1) {
  if (R(e)) {
    e.forEach(
      (P, z) => Dt(
        P,
        t && (R(t) ? t[z] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (Ht(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Dt(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? xs(s.component) : s.el, l = i ? null : r, { i: o, r: c } = e, d = t && t.r, u = o.refs === Y ? o.refs = {} : o.refs, h = o.setupState, y = /* @__PURE__ */ V(h), C = h === Y ? fi : (P) => Rs(u, P) ? !1 : B(y, P), $ = (P, z) => !(z && Rs(u, z));
  if (d != null && d !== c) {
    if (Fs(t), ee(d))
      u[d] = null, C(d) && (h[d] = null);
    else if (/* @__PURE__ */ de(d)) {
      const P = t;
      $(d, P.k) && (d.value = null), P.k && (u[P.k] = null);
    }
  }
  if (D(c))
    Yt(c, o, 12, [l, u]);
  else {
    const P = ee(c), z = /* @__PURE__ */ de(c);
    if (P || z) {
      const N = () => {
        if (e.f) {
          const _ = P ? C(c) ? h[c] : u[c] : $() || !e.k ? c.value : u[e.k];
          if (i)
            R(_) && cs(_, r);
          else if (R(_))
            _.includes(r) || _.push(r);
          else if (P)
            u[c] = [r], C(c) && (h[c] = u[c]);
          else {
            const F = [r];
            $(c, e.k) && (c.value = F), e.k && (u[e.k] = F);
          }
        } else P ? (u[c] = l, C(c) && (h[c] = l)) : z && ($(c, e.k) && (c.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const _ = () => {
          N(), hn.delete(e);
        };
        _.id = -1, hn.set(e, _), _e(_, n);
      } else
        Fs(e), N();
    }
  }
}
function Fs(e) {
  const t = hn.get(e);
  t && (t.flags |= 8, hn.delete(e));
}
Sn().requestIdleCallback;
Sn().cancelIdleCallback;
const Ht = (e) => !!e.type.__asyncLoader, Mn = (e) => e.type.__isKeepAlive;
function wl(e, t) {
  Gi(e, "a", t);
}
function Sl(e, t) {
  Gi(e, "da", t);
}
function Gi(e, t, n = be) {
  const s = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (On(t, s, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      Mn(i.parent.vnode) && Cl(s, t, n, i), i = i.parent;
  }
}
function Cl(e, t, n, s) {
  const i = On(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Ji(() => {
    cs(s[t], i);
  }, n);
}
function On(e, t, n = be, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...l) => {
      Ye();
      const o = Xt(n), c = Ae(t, n, e, l);
      return o(), Xe(), c;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const Qe = (e) => (t, n = be) => {
  (!qt || e === "sp") && On(e, (...s) => t(...s), n);
}, Tl = Qe("bm"), Pn = Qe("m"), El = Qe(
  "bu"
), Al = Qe("u"), In = Qe(
  "bum"
), Ji = Qe("um"), Ml = Qe(
  "sp"
), Ol = Qe("rtg"), Pl = Qe("rtc");
function Il(e, t = be) {
  On("ec", e, t);
}
const Rl = /* @__PURE__ */ Symbol.for("v-ndc");
function pn(e, t, n, s) {
  let i;
  const r = n, l = R(e);
  if (l || ee(e)) {
    const o = l && /* @__PURE__ */ pt(e);
    let c = !1, d = !1;
    o && (c = !/* @__PURE__ */ Ee(e), d = /* @__PURE__ */ Ze(e), e = Cn(e)), i = new Array(e.length);
    for (let u = 0, h = e.length; u < h; u++)
      i[u] = t(
        c ? d ? St(Pe(e[u])) : Pe(e[u]) : e[u],
        u,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let o = 0; o < e; o++)
      i[o] = t(o + 1, o, void 0, r);
  } else if (k(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (o, c) => t(o, c, void 0, r)
      );
    else {
      const o = Object.keys(e);
      i = new Array(o.length);
      for (let c = 0, d = o.length; c < d; c++) {
        const u = o[c];
        i[c] = t(e[u], u, c, r);
      }
    }
  else
    i = [];
  return i;
}
const ts = (e) => e ? br(e) ? xs(e) : ts(e.parent) : null, Nt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ re(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => ts(e.parent),
    $root: (e) => ts(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Xi(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      vs(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = al.bind(e.proxy)),
    $watch: (e) => bl.bind(e)
  })
), Kn = (e, t) => e !== Y && !e.__isScriptSetup && B(e, t), Fl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: l, type: o, appContext: c } = e;
    if (t[0] !== "$") {
      const y = l[t];
      if (y !== void 0)
        switch (y) {
          case 1:
            return s[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Kn(s, t))
          return l[t] = 1, s[t];
        if (i !== Y && B(i, t))
          return l[t] = 2, i[t];
        if (B(r, t))
          return l[t] = 3, r[t];
        if (n !== Y && B(n, t))
          return l[t] = 4, n[t];
        ns && (l[t] = 0);
      }
    }
    const d = Nt[t];
    let u, h;
    if (d)
      return t === "$attrs" && ae(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (u = o.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== Y && B(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      h = c.config.globalProperties, B(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Kn(i, t) ? (i[t] = n, !0) : s !== Y && B(s, t) ? (s[t] = n, !0) : B(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== Y && o[0] !== "$" && B(e, o) || Kn(t, o) || B(r, o) || B(s, o) || B(Nt, o) || B(i.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : B(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Ls(e) {
  return R(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let ns = !0;
function Ll(e) {
  const t = Xi(e), n = e.proxy, s = e.ctx;
  ns = !1, t.beforeCreate && $s(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: r,
    methods: l,
    watch: o,
    provide: c,
    inject: d,
    // lifecycle
    created: u,
    beforeMount: h,
    mounted: y,
    beforeUpdate: C,
    updated: $,
    activated: P,
    deactivated: z,
    beforeDestroy: N,
    beforeUnmount: _,
    destroyed: F,
    unmounted: M,
    render: K,
    renderTracked: se,
    renderTriggered: he,
    errorCaptured: ve,
    serverPrefetch: H,
    // public API
    expose: U,
    inheritAttrs: Z,
    // assets
    components: A,
    directives: X,
    filters: ue
  } = t;
  if (d && $l(d, s, null), l)
    for (const Q in l) {
      const G = l[Q];
      D(G) && (s[Q] = G.bind(n));
    }
  if (i) {
    const Q = i.call(n, n);
    k(Q) && (e.data = /* @__PURE__ */ Tn(Q));
  }
  if (ns = !0, r)
    for (const Q in r) {
      const G = r[Q], it = D(G) ? G.bind(n, n) : D(G.get) ? G.get.bind(n, n) : Be, Zt = !D(G) && D(G.set) ? G.set.bind(n) : Be, rt = It({
        get: it,
        set: Zt
      });
      Object.defineProperty(s, Q, {
        enumerable: !0,
        configurable: !0,
        get: () => rt.value,
        set: (Ie) => rt.value = Ie
      });
    }
  if (o)
    for (const Q in o)
      Yi(o[Q], s, n, Q);
  if (c) {
    const Q = D(c) ? c.call(n) : c;
    Reflect.ownKeys(Q).forEach((G) => {
      pl(G, Q[G]);
    });
  }
  u && $s(u, e, "c");
  function le(Q, G) {
    R(G) ? G.forEach((it) => Q(it.bind(n))) : G && Q(G.bind(n));
  }
  if (le(Tl, h), le(Pn, y), le(El, C), le(Al, $), le(wl, P), le(Sl, z), le(Il, ve), le(Pl, se), le(Ol, he), le(In, _), le(Ji, M), le(Ml, H), R(U))
    if (U.length) {
      const Q = e.exposed || (e.exposed = {});
      U.forEach((G) => {
        Object.defineProperty(Q, G, {
          get: () => n[G],
          set: (it) => n[G] = it,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  K && e.render === Be && (e.render = K), Z != null && (e.inheritAttrs = Z), A && (e.components = A), X && (e.directives = X), H && qi(e);
}
function $l(e, t, n = Be) {
  R(e) && (e = ss(e));
  for (const s in e) {
    const i = e[s];
    let r;
    k(i) ? "default" in i ? r = rn(
      i.from || s,
      i.default,
      !0
    ) : r = rn(i.from || s) : r = rn(i), /* @__PURE__ */ de(r) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (l) => r.value = l
    }) : t[s] = r;
  }
}
function $s(e, t, n) {
  Ae(
    R(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Yi(e, t, n, s) {
  let i = s.includes(".") ? Vi(n, s) : () => n[s];
  if (ee(e)) {
    const r = t[e];
    D(r) && Bn(i, r);
  } else if (D(e))
    Bn(i, e.bind(n));
  else if (k(e))
    if (R(e))
      e.forEach((r) => Yi(r, t, n, s));
    else {
      const r = D(e.handler) ? e.handler.bind(n) : t[e.handler];
      D(r) && Bn(i, r, e);
    }
}
function Xi(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = r.get(t);
  let c;
  return o ? c = o : !i.length && !n && !s ? c = t : (c = {}, i.length && i.forEach(
    (d) => gn(c, d, l, !0)
  ), gn(c, t, l)), k(t) && r.set(t, c), c;
}
function gn(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && gn(e, r, n, !0), i && i.forEach(
    (l) => gn(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = Dl[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const Dl = {
  data: Ds,
  props: Hs,
  emits: Hs,
  // objects
  methods: Pt,
  computed: Pt,
  // lifecycle
  beforeCreate: pe,
  created: pe,
  beforeMount: pe,
  mounted: pe,
  beforeUpdate: pe,
  updated: pe,
  beforeDestroy: pe,
  beforeUnmount: pe,
  destroyed: pe,
  unmounted: pe,
  activated: pe,
  deactivated: pe,
  errorCaptured: pe,
  serverPrefetch: pe,
  // assets
  components: Pt,
  directives: Pt,
  // watch
  watch: Nl,
  // provide / inject
  provide: Ds,
  inject: Hl
};
function Ds(e, t) {
  return t ? e ? function() {
    return re(
      D(e) ? e.call(this, this) : e,
      D(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Hl(e, t) {
  return Pt(ss(e), ss(t));
}
function ss(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Pt(e, t) {
  return e ? re(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Hs(e, t) {
  return e ? R(e) && R(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : re(
    /* @__PURE__ */ Object.create(null),
    Ls(e),
    Ls(t ?? {})
  ) : t;
}
function Nl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = re(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = pe(e[s], t[s]);
  return n;
}
function Zi() {
  return {
    app: null,
    config: {
      isNativeTag: fi,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let jl = 0;
function Vl(e, t) {
  return function(s, i = null) {
    D(s) || (s = re({}, s)), i != null && !k(i) && (i = null);
    const r = Zi(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const d = r.app = {
      _uid: jl++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: _o,
      get config() {
        return r.config;
      },
      set config(u) {
      },
      use(u, ...h) {
        return l.has(u) || (u && D(u.install) ? (l.add(u), u.install(d, ...h)) : D(u) && (l.add(u), u(d, ...h))), d;
      },
      mixin(u) {
        return r.mixins.includes(u) || r.mixins.push(u), d;
      },
      component(u, h) {
        return h ? (r.components[u] = h, d) : r.components[u];
      },
      directive(u, h) {
        return h ? (r.directives[u] = h, d) : r.directives[u];
      },
      mount(u, h, y) {
        if (!c) {
          const C = d._ceVNode || fe(s, i);
          return C.appContext = r, y === !0 ? y = "svg" : y === !1 && (y = void 0), e(C, u, y), c = !0, d._container = u, u.__vue_app__ = d, xs(C.component);
        }
      },
      onUnmount(u) {
        o.push(u);
      },
      unmount() {
        c && (Ae(
          o,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(u, h) {
        return r.provides[u] = h, d;
      },
      runWithContext(u) {
        const h = wt;
        wt = d;
        try {
          return u();
        } finally {
          wt = h;
        }
      }
    };
    return d;
  };
}
let wt = null;
const Bl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Me(t)}Modifiers`] || e[`${mt(t)}Modifiers`];
function kl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Y;
  let i = n;
  const r = t.startsWith("update:"), l = r && Bl(s, t.slice(7));
  l && (l.trim && (i = n.map((u) => ee(u) ? u.trim() : u)), l.number && (i = n.map(Ar)));
  let o, c = s[o = $n(t)] || // also try camelCase event handler (#2249)
  s[o = $n(Me(t))];
  !c && r && (c = s[o = $n(mt(t))]), c && Ae(
    c,
    e,
    6,
    i
  );
  const d = s[o + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, Ae(
      d,
      e,
      6,
      i
    );
  }
}
const Kl = /* @__PURE__ */ new WeakMap();
function Qi(e, t, n = !1) {
  const s = n ? Kl : t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let l = {}, o = !1;
  if (!D(e)) {
    const c = (d) => {
      const u = Qi(d, t, !0);
      u && (o = !0, re(l, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !r && !o ? (k(e) && s.set(e, null), null) : (R(r) ? r.forEach((c) => l[c] = null) : re(l, r), k(e) && s.set(e, l), l);
}
function Rn(e, t) {
  return !e || !_n(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), B(e, t[0].toLowerCase() + t.slice(1)) || B(e, mt(t)) || B(e, t));
}
function Ns(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [r],
    slots: l,
    attrs: o,
    emit: c,
    render: d,
    renderCache: u,
    props: h,
    data: y,
    setupState: C,
    ctx: $,
    inheritAttrs: P
  } = e, z = an(e);
  let N, _;
  try {
    if (n.shapeFlag & 4) {
      const M = i || s, K = M;
      N = Ne(
        d.call(
          K,
          M,
          u,
          h,
          C,
          y,
          $
        )
      ), _ = o;
    } else {
      const M = t;
      N = Ne(
        M.length > 1 ? M(
          h,
          { attrs: o, slots: l, emit: c }
        ) : M(
          h,
          null
        )
      ), _ = t.props ? o : Ul(o);
    }
  } catch (M) {
    gt.length = 0, En(M, e, 1), N = fe(me);
  }
  let F = N;
  if (_ && P !== !1) {
    const M = Object.keys(_), { shapeFlag: K } = F;
    M.length && K & 7 && (r && M.some(xn) && (_ = Wl(
      _,
      r
    )), F = st(F, _, !1, !0));
  }
  if (n.dirs && (F = st(F, null, !1, !0), F.dirs = F.dirs ? F.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const M = An(F.type) && dn(F) || F;
    Ut(M, n.transition);
  }
  return N = F, an(z), N;
}
const Ul = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || _n(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Wl = (e, t) => {
  const n = {};
  for (const s in e)
    (!xn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function zl(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: l, children: o, patchFlag: c } = t, d = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? js(s, l, d) : !!l;
    if (c & 8) {
      const u = t.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        const y = u[h];
        if (er(l, s, y) && !Rn(d, y))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? js(s, l, d) : !0 : !!l;
  return !1;
}
function js(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (er(t, e, r) && !Rn(n, r))
      return !0;
  }
  return !1;
}
function er(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && k(s) && k(i) ? !us(s, i) : s !== i;
}
function ql({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const tr = {}, nr = () => Object.create(tr), sr = (e) => Object.getPrototypeOf(e) === tr;
function Gl(e, t, n, s = !1) {
  const i = {}, r = nr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), ir(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ tl(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Jl(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ V(i), [c] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const u = e.vnode.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        let y = u[h];
        if (Rn(e.emitsOptions, y))
          continue;
        const C = t[y];
        if (c)
          if (B(r, y))
            C !== r[y] && (r[y] = C, d = !0);
          else {
            const $ = Me(y);
            i[$] = is(
              c,
              o,
              $,
              C,
              e,
              !1
            );
          }
        else
          C !== r[y] && (r[y] = C, d = !0);
      }
    }
  } else {
    ir(e, t, i, r) && (d = !0);
    let u;
    for (const h in o)
      (!t || // for camelCase
      !B(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = mt(h)) === h || !B(t, u))) && (c ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[u] !== void 0) && (i[h] = is(
        c,
        o,
        h,
        void 0,
        e,
        !0
      )) : delete i[h]);
    if (r !== o)
      for (const h in r)
        (!t || !B(t, h)) && (delete r[h], d = !0);
  }
  d && Je(e.attrs, "set", "");
}
function ir(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (Ft(c))
        continue;
      const d = t[c];
      let u;
      i && B(i, u = Me(c)) ? !r || !r.includes(u) ? n[u] = d : (o || (o = {}))[u] = d : Rn(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, l = !0);
    }
  if (r) {
    const c = /* @__PURE__ */ V(n), d = o || Y;
    for (let u = 0; u < r.length; u++) {
      const h = r[u];
      n[h] = is(
        i,
        c,
        h,
        d[h],
        e,
        !B(d, h)
      );
    }
  }
  return l;
}
function is(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = B(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && D(c)) {
        const { propsDefaults: d } = i;
        if (n in d)
          s = d[n];
        else {
          const u = Xt(i);
          s = d[n] = c.call(
            null,
            t
          ), u();
        }
      } else
        s = c;
      i.ce && i.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (r && !o ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === mt(n)) && (s = !0));
  }
  return s;
}
const Yl = /* @__PURE__ */ new WeakMap();
function rr(e, t, n = !1) {
  const s = n ? Yl : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, l = {}, o = [];
  let c = !1;
  if (!D(e)) {
    const u = (h) => {
      c = !0;
      const [y, C] = rr(h, t, !0);
      re(l, y), C && o.push(...C);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!r && !c)
    return k(e) && s.set(e, yt), yt;
  if (R(r))
    for (let u = 0; u < r.length; u++) {
      const h = Me(r[u]);
      Vs(h) && (l[h] = Y);
    }
  else if (r)
    for (const u in r) {
      const h = Me(u);
      if (Vs(h)) {
        const y = r[u], C = l[h] = R(y) || D(y) ? { type: y } : re({}, y), $ = C.type;
        let P = !1, z = !0;
        if (R($))
          for (let N = 0; N < $.length; ++N) {
            const _ = $[N], F = D(_) && _.name;
            if (F === "Boolean") {
              P = !0;
              break;
            } else F === "String" && (z = !1);
          }
        else
          P = D($) && $.name === "Boolean";
        C[
          0
          /* shouldCast */
        ] = P, C[
          1
          /* shouldCastTrue */
        ] = z, (P || B(C, "default")) && o.push(h);
      }
    }
  const d = [l, o];
  return k(e) && s.set(e, d), d;
}
function Vs(e) {
  return e[0] !== "$" && !Ft(e);
}
const ys = (e) => e === "_" || e === "_ctx" || e === "$stable", _s = (e) => R(e) ? e.map(Ne) : [Ne(e)], Xl = (e, t, n) => {
  if (t._n)
    return t;
  const s = Qn((...i) => _s(t(...i)), n);
  return s._c = !1, s;
}, lr = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (ys(i)) continue;
    const r = e[i];
    if (D(r))
      t[i] = Xl(i, r, s);
    else if (r != null) {
      const l = _s(r);
      t[i] = () => l;
    }
  }
}, or = (e, t) => {
  const n = _s(t);
  e.slots.default = () => n;
}, cr = (e, t, n) => {
  for (const s in t)
    (n || !ys(s)) && (e[s] = t[s]);
}, Zl = (e, t, n) => {
  const s = e.slots = nr();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (cr(s, t, n), n && gi(s, "_", i, !0)) : lr(t, s);
  } else t && or(e, t);
}, Ql = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = Y;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : cr(i, t, n) : (r = !t.$stable, lr(t, i)), l = t;
  } else t && (or(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !ys(o) && l[o] == null && delete i[o];
}, _e = io;
function eo(e) {
  return to(e);
}
function to(e, t) {
  const n = Sn();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: r,
    createElement: l,
    createText: o,
    createComment: c,
    setText: d,
    setElementText: u,
    parentNode: h,
    nextSibling: y,
    setScopeId: C = Be,
    insertStaticContent: $
  } = e, P = (f, a, p, v = null, b = null, g = null, T = void 0, S = null, w = !!a.dynamicChildren) => {
    if (f === a)
      return;
    f && !dt(f, a) && (v = Qt(f), Ie(f, b, g, !0), f = null), a.patchFlag === -2 && (w = !1, a.dynamicChildren = null);
    const { type: m, ref: I, shapeFlag: E } = a;
    switch (m) {
      case Fn:
        z(f, a, p, v);
        break;
      case me:
        N(f, a, p, v);
        break;
      case ln:
        f == null && _(a, p, v, T);
        break;
      case xe:
        A(
          f,
          a,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        );
        break;
      default:
        E & 1 ? K(
          f,
          a,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        ) : E & 6 ? X(
          f,
          a,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        ) : (E & 64 || E & 128) && m.process(
          f,
          a,
          p,
          v,
          b,
          g,
          T,
          S,
          w,
          Tt
        );
    }
    I != null && b ? Dt(I, f && f.ref, g, a || f, !a) : I == null && f && f.ref != null && Dt(f.ref, null, g, f, !0);
  }, z = (f, a, p, v) => {
    if (f == null)
      s(
        a.el = o(a.children),
        p,
        v
      );
    else {
      const b = a.el = f.el;
      a.children !== f.children && d(b, a.children);
    }
  }, N = (f, a, p, v) => {
    f == null ? s(
      a.el = c(a.children || ""),
      p,
      v
    ) : a.el = f.el;
  }, _ = (f, a, p, v) => {
    [f.el, f.anchor] = $(
      f.children,
      a,
      p,
      v,
      f.el,
      f.anchor
    );
  }, F = ({ el: f, anchor: a }, p, v) => {
    let b;
    for (; f && f !== a; )
      b = y(f), s(f, p, v), f = b;
    s(a, p, v);
  }, M = ({ el: f, anchor: a }) => {
    let p;
    for (; f && f !== a; )
      p = y(f), i(f), f = p;
    i(a);
  }, K = (f, a, p, v, b, g, T, S, w) => {
    if (a.type === "svg" ? T = "svg" : a.type === "math" && (T = "mathml"), f == null)
      se(
        a,
        p,
        v,
        b,
        g,
        T,
        S,
        w
      );
    else {
      const m = f.el && f.el._isVueCE ? f.el : null;
      try {
        m && m._beginPatch(), H(
          f,
          a,
          b,
          g,
          T,
          S,
          w
        );
      } finally {
        m && m._endPatch();
      }
    }
  }, se = (f, a, p, v, b, g, T, S) => {
    let w, m;
    const { props: I, shapeFlag: E, transition: O, dirs: L } = f;
    if (w = f.el = l(
      f.type,
      g,
      I && I.is,
      I
    ), E & 8 ? u(w, f.children) : E & 16 && ve(
      f.children,
      w,
      null,
      v,
      b,
      Un(f, g),
      T,
      S
    ), L && lt(f, null, v, "created"), he(w, f, f.scopeId, T, v), I) {
      for (const q in I)
        q !== "value" && !Ft(q) && r(w, q, null, I[q], g, v);
      "value" in I && r(w, "value", null, I.value, g), (m = I.onVnodeBeforeMount) && $e(m, v, f);
    }
    L && lt(f, null, v, "beforeMount");
    const j = no(b, O);
    j && O.beforeEnter(w), s(w, a, p), ((m = I && I.onVnodeMounted) || j || L) && _e(() => {
      try {
        m && $e(m, v, f), j && O.enter(w), L && lt(f, null, v, "mounted");
      } finally {
      }
    }, b);
  }, he = (f, a, p, v, b) => {
    if (p && C(f, p), v)
      for (let g = 0; g < v.length; g++)
        C(f, v[g]);
    if (b) {
      let g = b.subTree;
      if (a === g || dr(g.type) && (g.ssContent === a || g.ssFallback === a)) {
        const T = b.vnode;
        he(
          f,
          T,
          T.scopeId,
          T.slotScopeIds,
          b.parent
        );
      }
    }
  }, ve = (f, a, p, v, b, g, T, S, w = 0) => {
    for (let m = w; m < f.length; m++) {
      const I = f[m] = S ? Ge(f[m]) : Ne(f[m]);
      P(
        null,
        I,
        a,
        p,
        v,
        b,
        g,
        T,
        S
      );
    }
  }, H = (f, a, p, v, b, g, T) => {
    const S = a.el = f.el;
    let { patchFlag: w, dynamicChildren: m, dirs: I } = a;
    w |= f.patchFlag & 16;
    const E = f.props || Y, O = a.props || Y;
    let L;
    if (p && ot(p, !1), (L = O.onVnodeBeforeUpdate) && $e(L, p, a, f), I && lt(a, f, p, "beforeUpdate"), p && ot(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    m && (!f.dynamicChildren || f.dynamicChildren.length !== m.length) && (w = 0, T = !1, m = null), (E.innerHTML && O.innerHTML == null || E.textContent && O.textContent == null) && u(S, ""), m ? U(
      f.dynamicChildren,
      m,
      S,
      p,
      v,
      Un(a, b),
      g
    ) : T || G(
      f,
      a,
      S,
      null,
      p,
      v,
      Un(a, b),
      g,
      !1
    ), w > 0) {
      if (w & 16)
        Z(S, E, O, p, b);
      else if (w & 2 && E.class !== O.class && r(S, "class", null, O.class, b), w & 4 && r(S, "style", E.style, O.style, b), w & 8) {
        const j = a.dynamicProps;
        for (let q = 0; q < j.length; q++) {
          const W = j[q], ie = E[W], oe = O[W];
          (oe !== ie || W === "value") && r(S, W, ie, oe, b, p);
        }
      }
      w & 1 && f.children !== a.children && u(S, a.children);
    } else !T && m == null && Z(S, E, O, p, b);
    ((L = O.onVnodeUpdated) || I) && _e(() => {
      L && $e(L, p, a, f), I && lt(a, f, p, "updated");
    }, v);
  }, U = (f, a, p, v, b, g, T) => {
    for (let S = 0; S < a.length; S++) {
      const w = f[S], m = a[S], I = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        w.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (w.type === xe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !dt(w, m) || // - In the case of a component, it could contain anything.
        w.shapeFlag & 198) ? h(w.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      P(
        w,
        m,
        I,
        null,
        v,
        b,
        g,
        T,
        !0
      );
    }
  }, Z = (f, a, p, v, b) => {
    if (a !== p) {
      if (a !== Y)
        for (const g in a)
          !Ft(g) && !(g in p) && r(
            f,
            g,
            a[g],
            null,
            b,
            v
          );
      for (const g in p) {
        if (Ft(g)) continue;
        const T = p[g], S = a[g];
        T !== S && g !== "value" && r(f, g, S, T, b, v);
      }
      "value" in p && r(f, "value", a.value, p.value, b);
    }
  }, A = (f, a, p, v, b, g, T, S, w) => {
    const m = a.el = f ? f.el : o(""), I = a.anchor = f ? f.anchor : o("");
    let { patchFlag: E, dynamicChildren: O, slotScopeIds: L } = a;
    L && (S = S ? S.concat(L) : L), f == null ? (s(m, p, v), s(I, p, v), ve(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      a.children || [],
      p,
      I,
      b,
      g,
      T,
      S,
      w
    )) : E > 0 && E & 64 && O && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren && f.dynamicChildren.length === O.length ? (U(
      f.dynamicChildren,
      O,
      p,
      b,
      g,
      T,
      S
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (a.key != null || b && a === b.subTree) && fr(
      f,
      a,
      !0
      /* shallow */
    )) : G(
      f,
      a,
      p,
      I,
      b,
      g,
      T,
      S,
      w
    );
  }, X = (f, a, p, v, b, g, T, S, w) => {
    a.slotScopeIds = S, f == null ? a.shapeFlag & 512 ? b.ctx.activate(
      a,
      p,
      v,
      T,
      w
    ) : ue(
      a,
      p,
      v,
      b,
      g,
      T,
      w
    ) : Ke(f, a, w);
  }, ue = (f, a, p, v, b, g, T) => {
    const S = f.component = ho(
      f,
      v,
      b
    );
    if (Mn(f) && (S.ctx.renderer = Tt), po(S, !1, T), S.asyncDep) {
      if (b && b.registerDep(S, le, T), !f.el) {
        const w = S.subTree = fe(me);
        N(null, w, a, p), f.placeholder = w.el;
      }
    } else
      le(
        S,
        f,
        a,
        p,
        b,
        g,
        T
      );
  }, Ke = (f, a, p) => {
    const v = a.component = f.component;
    if (zl(f, a, p))
      if (v.asyncDep && !v.asyncResolved) {
        Q(v, a, p);
        return;
      } else
        v.next = a, v.update();
    else
      a.el = f.el, v.vnode = a;
  }, le = (f, a, p, v, b, g, T) => {
    const S = () => {
      if (f.isMounted) {
        let { next: E, bu: O, u: L, parent: j, vnode: q } = f;
        {
          const Fe = ur(f);
          if (Fe) {
            E && (E.el = q.el, Q(f, E, T)), Fe.asyncDep.then(() => {
              _e(() => {
                f.isUnmounted || m();
              }, b);
            });
            return;
          }
        }
        let W = E, ie;
        ot(f, !1), E ? (E.el = q.el, Q(f, E, T)) : E = q, O && Dn(O), (ie = E.props && E.props.onVnodeBeforeUpdate) && $e(ie, j, E, q), ot(f, !0);
        const oe = Ns(f), Re = f.subTree;
        f.subTree = oe, P(
          Re,
          oe,
          // parent may have changed if it's in a teleport
          h(Re.el),
          // anchor may have changed if it's in a fragment
          Qt(Re),
          f,
          b,
          g
        ), E.el = oe.el, W === null && ql(f, oe.el), L && _e(L, b), (ie = E.props && E.props.onVnodeUpdated) && _e(
          () => $e(ie, j, E, q),
          b
        );
      } else {
        let E;
        const { el: O, props: L } = a, { bm: j, m: q, parent: W, root: ie, type: oe } = f, Re = Ht(a);
        ot(f, !1), j && Dn(j), !Re && (E = L && L.onVnodeBeforeMount) && $e(E, W, a), ot(f, !0);
        {
          ie.ce && ie.ce._hasShadowRoot() && ie.ce._injectChildStyle(
            oe,
            f.parent ? f.parent.type : void 0
          );
          const Fe = f.subTree = Ns(f);
          P(
            null,
            Fe,
            p,
            v,
            f,
            b,
            g
          ), a.el = Fe.el;
        }
        if (q && _e(q, b), !Re && (E = L && L.onVnodeMounted)) {
          const Fe = a;
          _e(
            () => $e(E, W, Fe),
            b
          );
        }
        (a.shapeFlag & 256 || W && Ht(W.vnode) && W.vnode.shapeFlag & 256) && f.a && _e(f.a, b), f.isMounted = !0, a = p = v = null;
      }
    };
    f.scope.on();
    const w = f.effect = new yi(S);
    f.scope.off();
    const m = f.update = w.run.bind(w), I = f.job = w.runIfDirty.bind(w);
    I.i = f, I.id = f.uid, w.scheduler = () => vs(I), ot(f, !0), m();
  }, Q = (f, a, p) => {
    a.component = f;
    const v = f.vnode.props;
    f.vnode = a, f.next = null, Jl(f, a.props, v, p), Ql(f, a.children, p), Ye(), Is(f), Xe();
  }, G = (f, a, p, v, b, g, T, S, w = !1) => {
    const m = f && f.children, I = f ? f.shapeFlag : 0, E = a.children, { patchFlag: O, shapeFlag: L } = a;
    if (O > 0) {
      if (O & 128) {
        Zt(
          m,
          E,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        );
        return;
      } else if (O & 256) {
        it(
          m,
          E,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        );
        return;
      }
    }
    L & 8 ? (I & 16 && Ct(m, b, g), E !== m && u(p, E)) : I & 16 ? L & 16 ? Zt(
      m,
      E,
      p,
      v,
      b,
      g,
      T,
      S,
      w
    ) : Ct(m, b, g, !0) : (I & 8 && u(p, ""), L & 16 && ve(
      E,
      p,
      v,
      b,
      g,
      T,
      S,
      w
    ));
  }, it = (f, a, p, v, b, g, T, S, w) => {
    f = f || yt, a = a || yt;
    const m = f.length, I = a.length, E = Math.min(m, I);
    let O;
    for (O = 0; O < E; O++) {
      const L = a[O] = w ? Ge(a[O]) : Ne(a[O]);
      P(
        f[O],
        L,
        p,
        null,
        b,
        g,
        T,
        S,
        w
      );
    }
    m > I ? Ct(
      f,
      b,
      g,
      !0,
      !1,
      E
    ) : ve(
      a,
      p,
      v,
      b,
      g,
      T,
      S,
      w,
      E
    );
  }, Zt = (f, a, p, v, b, g, T, S, w) => {
    let m = 0;
    const I = a.length;
    let E = f.length - 1, O = I - 1;
    for (; m <= E && m <= O; ) {
      const L = f[m], j = a[m] = w ? Ge(a[m]) : Ne(a[m]);
      if (dt(L, j))
        P(
          L,
          j,
          p,
          null,
          b,
          g,
          T,
          S,
          w
        );
      else
        break;
      m++;
    }
    for (; m <= E && m <= O; ) {
      const L = f[E], j = a[O] = w ? Ge(a[O]) : Ne(a[O]);
      if (dt(L, j))
        P(
          L,
          j,
          p,
          null,
          b,
          g,
          T,
          S,
          w
        );
      else
        break;
      E--, O--;
    }
    if (m > E) {
      if (m <= O) {
        const L = O + 1, j = L < I ? a[L].el : v;
        for (; m <= O; )
          P(
            null,
            a[m] = w ? Ge(a[m]) : Ne(a[m]),
            p,
            j,
            b,
            g,
            T,
            S,
            w
          ), m++;
      }
    } else if (m > O)
      for (; m <= E; )
        Ie(f[m], b, g, !0), m++;
    else {
      const L = m, j = m, q = /* @__PURE__ */ new Map();
      for (m = j; m <= O; m++) {
        const we = a[m] = w ? Ge(a[m]) : Ne(a[m]);
        we.key != null && q.set(we.key, m);
      }
      let W, ie = 0;
      const oe = O - j + 1;
      let Re = !1, Fe = 0;
      const Et = new Array(oe);
      for (m = 0; m < oe; m++) Et[m] = 0;
      for (m = L; m <= E; m++) {
        const we = f[m];
        if (ie >= oe) {
          Ie(we, b, g, !0);
          continue;
        }
        let Le;
        if (we.key != null)
          Le = q.get(we.key);
        else
          for (W = j; W <= O; W++)
            if (Et[W - j] === 0 && dt(we, a[W])) {
              Le = W;
              break;
            }
        Le === void 0 ? Ie(we, b, g, !0) : (Et[Le - j] = m + 1, Le >= Fe ? Fe = Le : Re = !0, P(
          we,
          a[Le],
          p,
          null,
          b,
          g,
          T,
          S,
          w
        ), ie++);
      }
      const Cs = Re ? so(Et) : yt;
      for (W = Cs.length - 1, m = oe - 1; m >= 0; m--) {
        const we = j + m, Le = a[we], Ts = a[we + 1], Es = we + 1 < I ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Ts.el || ar(Ts)
        ) : v;
        Et[m] === 0 ? P(
          null,
          Le,
          p,
          Es,
          b,
          g,
          T,
          S,
          w
        ) : Re && (W < 0 || m !== Cs[W] ? rt(Le, p, Es, 2) : W--);
      }
    }
  }, rt = (f, a, p, v, b = null) => {
    const { el: g, type: T, transition: S, children: w, shapeFlag: m } = f;
    if (m & 6) {
      rt(f.component.subTree, a, p, v);
      return;
    }
    if (m & 128) {
      f.suspense.move(a, p, v);
      return;
    }
    if (m & 64) {
      T.move(f, a, p, Tt);
      return;
    }
    if (T === xe) {
      s(g, a, p);
      for (let E = 0; E < w.length; E++)
        rt(w[E], a, p, v);
      s(f.anchor, a, p);
      return;
    }
    if (T === ln) {
      F(f, a, p);
      return;
    }
    if (v !== 2 && m & 1 && S)
      if (v === 0)
        S.persisted && !g[Te] ? s(g, a, p) : (S.beforeEnter(g), s(g, a, p), _e(() => S.enter(g), b));
      else {
        const { leave: E, delayLeave: O, afterLeave: L } = S, j = () => {
          f.ctx.isUnmounted ? i(g) : s(g, a, p);
        }, q = () => {
          const W = g._isLeaving || !!g[Te];
          g._isLeaving && g[Te](
            !0
            /* cancelled */
          ), S.persisted && !W ? j() : E(g, () => {
            j(), L && L();
          });
        };
        O ? O(g, j, q) : q();
      }
    else
      s(g, a, p);
  }, Ie = (f, a, p, v = !1, b = !1) => {
    const {
      type: g,
      props: T,
      ref: S,
      children: w,
      dynamicChildren: m,
      shapeFlag: I,
      patchFlag: E,
      dirs: O,
      cacheIndex: L,
      memo: j
    } = f;
    if (E === -2 && (b = !1), S != null && (Ye(), Dt(S, null, p, f, !0), Xe()), L != null && (a.renderCache[L] = void 0), I & 256) {
      a.ctx.deactivate(f);
      return;
    }
    const q = I & 1 && O, W = !Ht(f);
    let ie;
    if (W && (ie = T && T.onVnodeBeforeUnmount) && $e(ie, a, f), I & 6)
      wr(f.component, p, v);
    else {
      if (I & 128) {
        f.suspense.unmount(p, v);
        return;
      }
      q && lt(f, null, a, "beforeUnmount"), I & 64 ? f.type.remove(
        f,
        a,
        p,
        Tt,
        v
      ) : m && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !m.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (g !== xe || E > 0 && E & 64) ? Ct(
        m,
        a,
        p,
        !1,
        !0
      ) : (g === xe && E & 384 || !b && I & 16) && Ct(w, a, p), v && ws(f);
    }
    const oe = j != null && L == null;
    (W && (ie = T && T.onVnodeUnmounted) || q || oe) && _e(() => {
      ie && $e(ie, a, f), q && lt(f, null, a, "unmounted"), oe && (f.el = null);
    }, p);
  }, ws = (f) => {
    const { type: a, el: p, anchor: v, transition: b } = f;
    if (a === xe) {
      xr(p, v);
      return;
    }
    if (a === ln) {
      M(f);
      return;
    }
    const g = () => {
      i(p), b && !b.persisted && b.afterLeave && b.afterLeave();
    };
    if (f.shapeFlag & 1 && b && !b.persisted) {
      const { leave: T, delayLeave: S } = b, w = () => T(p, g);
      S ? S(f.el, g, w) : w();
    } else
      g();
  }, xr = (f, a) => {
    let p;
    for (; f !== a; )
      p = y(f), i(f), f = p;
    i(a);
  }, wr = (f, a, p) => {
    const { bum: v, scope: b, job: g, subTree: T, um: S, m: w, a: m } = f;
    Bs(w), Bs(m), v && Dn(v), b.stop(), g && (g.flags |= 8, Ie(T, f, a, p)), S && _e(S, a), _e(() => {
      f.isUnmounted = !0;
    }, a);
  }, Ct = (f, a, p, v = !1, b = !1, g = 0) => {
    for (let T = g; T < f.length; T++)
      Ie(f[T], a, p, v, b);
  }, Qt = (f) => {
    if (f.shapeFlag & 6)
      return Qt(f.component.subTree);
    if (f.shapeFlag & 128)
      return f.suspense.next();
    const a = y(f.anchor || f.el), p = a && a[vl];
    return p ? y(p) : a;
  };
  let Ln = !1;
  const Ss = (f, a, p) => {
    let v;
    f == null ? a._vnode && (Ie(a._vnode, null, null, !0), v = a._vnode.component) : P(
      a._vnode || null,
      f,
      a,
      null,
      null,
      null,
      p
    ), a._vnode = f, Ln || (Ln = !0, Is(v), Di(), Ln = !1);
  }, Tt = {
    p: P,
    um: Ie,
    m: rt,
    r: ws,
    mt: ue,
    mc: ve,
    pc: G,
    pbc: U,
    n: Qt,
    o: e
  };
  return {
    render: Ss,
    hydrate: void 0,
    createApp: Vl(Ss)
  };
}
function Un({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ot({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function no(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function fr(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (R(s) && R(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = Ge(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && fr(l, o)), o.type === Fn && (o.patchFlag === -1 && (o = i[r] = Ge(o)), o.el = l.el), o.type === me && !o.el && (o.el = l.el);
    }
}
function so(e) {
  const t = e.slice(), n = [0];
  let s, i, r, l, o;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const d = e[s];
    if (d !== 0) {
      if (i = n[n.length - 1], e[i] < d) {
        t[s] = i, n.push(s);
        continue;
      }
      for (r = 0, l = n.length - 1; r < l; )
        o = r + l >> 1, e[n[o]] < d ? r = o + 1 : l = o;
      d < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), n[r] = s);
    }
  }
  for (r = n.length, l = n[r - 1]; r-- > 0; )
    n[r] = l, l = t[l];
  return n;
}
function ur(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : ur(t);
}
function Bs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function ar(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? ar(t.subTree) : null;
}
const dr = (e) => e.__isSuspense;
function io(e, t) {
  t && t.pendingBranch ? R(e) ? t.effects.push(...e) : t.effects.push(e) : hl(e);
}
const xe = /* @__PURE__ */ Symbol.for("v-fgt"), Fn = /* @__PURE__ */ Symbol.for("v-txt"), me = /* @__PURE__ */ Symbol.for("v-cmt"), ln = /* @__PURE__ */ Symbol.for("v-stc"), gt = [];
let Se = null;
function te(e = !1) {
  gt.push(Se = e ? null : []);
}
function hr() {
  gt.pop(), Se = gt[gt.length - 1] || null;
}
let Wt = 1;
function mn(e, t = !1) {
  Wt += e, e < 0 && Se && t && (Se.hasOnce = !0);
}
function pr(e) {
  return e.dynamicChildren = Wt > 0 ? Se || yt : null, hr(), Wt > 0 && Se && Se.push(e), e;
}
function ne(e, t, n, s, i, r) {
  return pr(
    x(
      e,
      t,
      n,
      s,
      i,
      r,
      !0
    )
  );
}
function ro(e, t, n, s, i) {
  return pr(
    fe(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function bn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function dt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const gr = ({ key: e }) => e ?? null, on = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ee(e) || /* @__PURE__ */ de(e) || D(e) ? { i: Ve, r: e, k: t, f: !!n } : e : null);
function x(e, t = null, n = null, s = 0, i = null, r = e === xe ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && gr(t),
    ref: t && on(t),
    scopeId: Ni,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Ve
  };
  return o ? (vn(c, n), r & 128 && e.normalize(c)) : n && (c.shapeFlag |= ee(n) ? 8 : 16), Wt > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Se && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && Se.push(c), c;
}
const fe = lo;
function lo(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Rl) && (e = me), bn(e)) {
    const o = st(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && vn(o, n), Wt > 0 && !r && Se && (o.shapeFlag & 6 ? Se[Se.indexOf(e)] = o : Se.push(o)), o.patchFlag = -2, o;
  }
  if (vo(e) && (e = e.__vccOpts), t) {
    t = oo(t);
    let { class: o, style: c } = t;
    o && !ee(o) && (t.class = Vt(o)), k(c) && (/* @__PURE__ */ bs(c) && !R(c) && (c = re({}, c)), t.style = jt(c));
  }
  const l = ee(e) ? 1 : dr(e) ? 128 : An(e) ? 64 : k(e) ? 4 : D(e) ? 2 : 0;
  return x(
    e,
    t,
    n,
    s,
    i,
    l,
    r,
    !0
  );
}
function oo(e) {
  return e ? /* @__PURE__ */ bs(e) || sr(e) ? re({}, e) : e : null;
}
function st(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: l, children: o, transition: c } = e, d = t ? fo(i || {}, t) : i, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && gr(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? R(r) ? r.concat(on(t)) : [r, on(t)] : on(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: o,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== xe ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: c,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && st(e.ssContent),
    ssFallback: e.ssFallback && st(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return c && s && Ut(
    u,
    c.clone(u)
  ), u;
}
function rs(e = " ", t = 0) {
  return fe(Fn, null, e, t);
}
function sn(e, t) {
  const n = fe(ln, null, e);
  return n.staticCount = t, n;
}
function co(e = "", t = !1) {
  return t ? (te(), ro(me, null, e)) : fe(me, null, e);
}
function Ne(e) {
  return e == null || typeof e == "boolean" ? fe(me) : R(e) ? fe(
    xe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : bn(e) ? Ge(e) : fe(Fn, null, String(e));
}
function Ge(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : st(e);
}
function vn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (R(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), vn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !sr(t) ? t._ctx = Ve : i === 3 && Ve && (Ve.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (D(t)) {
    if (s & 65) {
      vn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ve }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [rs(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function fo(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = Vt([t.class, s.class]));
      else if (i === "style")
        t.style = jt([t.style, s.style]);
      else if (_n(i)) {
        const r = t[i], l = s[i];
        l && r !== l && !(R(r) && r.includes(l)) ? t[i] = r ? [].concat(r, l) : l : l == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !xn(i) && (t[i] = l);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function $e(e, t, n, s = null) {
  Ae(e, t, 7, [
    n,
    s
  ]);
}
const uo = Zi();
let ao = 0;
function ho(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || uo, r = {
    uid: ao++,
    vnode: e,
    type: s,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Dr(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: rr(s, i),
    emitsOptions: Qi(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Y,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Y,
    data: Y,
    props: Y,
    attrs: Y,
    slots: Y,
    refs: Y,
    setupState: Y,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = kl.bind(null, r), e.ce && e.ce(r), r;
}
let be = null;
const mr = () => be || Ve;
let yn, zt;
{
  const e = Sn(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((l) => l(r)) : i[0](r);
    };
  };
  yn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => be = n
  ), zt = t(
    "__VUE_SSR_SETTERS__",
    (n) => qt = n
  );
}
const Xt = (e) => {
  const t = be;
  return yn(e), e.scope.on(), () => {
    e.scope.off(), yn(t);
  };
}, ks = () => {
  be && be.scope.off(), yn(null);
};
function br(e) {
  return e.vnode.shapeFlag & 4;
}
let qt = !1;
function po(e, t = !1, n = !1) {
  t && zt(t);
  const { props: s, children: i } = e.vnode, r = br(e);
  Gl(e, s, r, t), Zl(e, i, n || t);
  const l = r ? go(e, t) : void 0;
  return t && zt(!1), l;
}
function go(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Fl);
  const { setup: s } = n;
  if (s) {
    Ye();
    const i = e.setupContext = s.length > 1 ? bo(e) : null, r = Xt(e), l = Yt(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = ai(l);
    if (Xe(), r(), (o || e.sp) && !Ht(e) && qi(e), o) {
      if (l.then(ks, ks), t)
        return l.then((c) => {
          zt(!0);
          try {
            Ks(e, c, t);
          } finally {
            zt(!1);
          }
        }).catch((c) => {
          En(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Ks(e, l);
  } else
    vr(e);
}
function Ks(e, t, n) {
  D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = Fi(t)), vr(e);
}
function vr(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Be);
  {
    const i = Xt(e);
    Ye();
    try {
      Ll(e);
    } finally {
      Xe(), i();
    }
  }
}
const mo = {
  get(e, t) {
    return ae(e, "get", ""), e[t];
  }
};
function bo(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, mo),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function xs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Fi(nl(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Nt)
        return Nt[n](e);
    },
    has(t, n) {
      return n in t || n in Nt;
    }
  })) : e.proxy;
}
function vo(e) {
  return D(e) && "__vccOpts" in e;
}
const It = (e, t) => /* @__PURE__ */ ol(e, t, qt);
function yo(e, t, n) {
  try {
    mn(-1);
    const s = arguments.length;
    return s === 2 ? k(t) && !R(t) ? bn(t) ? fe(e, null, [t]) : fe(e, t) : fe(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && bn(n) && (n = [n]), fe(e, t, n));
  } finally {
    mn(1);
  }
}
const _o = "3.5.41";
/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ls;
const Us = typeof window < "u" && window.trustedTypes;
if (Us)
  try {
    ls = /* @__PURE__ */ Us.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const yr = ls ? (e) => ls.createHTML(e) : (e) => e, xo = "http://www.w3.org/2000/svg", wo = "http://www.w3.org/1998/Math/MathML", qe = typeof document < "u" ? document : null, Ws = qe && /* @__PURE__ */ qe.createElement("template"), So = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? qe.createElementNS(xo, e) : t === "mathml" ? qe.createElementNS(wo, e) : n ? qe.createElement(e, { is: n }) : qe.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (e) => qe.createTextNode(e),
  createComment: (e) => qe.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => qe.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, i, r) {
    const l = n ? n.previousSibling : t.lastChild;
    if (i && (i === r || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === r || !(i = i.nextSibling)); )
        ;
    else {
      Ws.innerHTML = yr(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Ws.content;
      if (s === "svg" || s === "mathml") {
        const c = o.firstChild;
        for (; c.firstChild; )
          o.appendChild(c.firstChild);
        o.removeChild(c);
      }
      t.insertBefore(o, n);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, et = "transition", Ot = "animation", Gt = /* @__PURE__ */ Symbol("_vtc"), _r = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, Co = /* @__PURE__ */ re(
  {},
  Bi,
  _r
), To = (e) => (e.displayName = "Transition", e.props = Co, e), zs = /* @__PURE__ */ To(
  (e, { slots: t }) => yo(xl, Eo(e), t)
), ct = (e, t = []) => {
  R(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, qs = (e) => e ? R(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Eo(e) {
  const t = {};
  for (const A in e)
    A in _r || (t[A] = e[A]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: i,
    enterFromClass: r = `${n}-enter-from`,
    enterActiveClass: l = `${n}-enter-active`,
    enterToClass: o = `${n}-enter-to`,
    appearFromClass: c = r,
    appearActiveClass: d = l,
    appearToClass: u = o,
    leaveFromClass: h = `${n}-leave-from`,
    leaveActiveClass: y = `${n}-leave-active`,
    leaveToClass: C = `${n}-leave-to`
  } = e, $ = Ao(i), P = $ && $[0], z = $ && $[1], {
    onBeforeEnter: N,
    onEnter: _,
    onEnterCancelled: F,
    onLeave: M,
    onLeaveCancelled: K,
    onBeforeAppear: se = N,
    onAppear: he = _,
    onAppearCancelled: ve = F
  } = t, H = (A, X, ue, Ke) => {
    A._enterCancelled = Ke, ft(A, X ? u : o), ft(A, X ? d : l), ue && ue();
  }, U = (A, X) => {
    A._isLeaving = !1, ft(A, h), ft(A, C), ft(A, y), X && X();
  }, Z = (A) => (X, ue) => {
    const Ke = A ? he : _, le = () => H(X, A, ue);
    ct(Ke, [X, le]), Gs(() => {
      ft(X, A ? c : r), We(X, A ? u : o), qs(Ke) || Js(X, s, P, le);
    });
  };
  return re(t, {
    onBeforeEnter(A) {
      ct(N, [A]), We(A, r), We(A, l);
    },
    onBeforeAppear(A) {
      ct(se, [A]), We(A, c), We(A, d);
    },
    onEnter: Z(!1),
    onAppear: Z(!0),
    onLeave(A, X) {
      A._isLeaving = !0;
      const ue = () => U(A, X);
      We(A, h), A._enterCancelled ? (We(A, y), Zs(A)) : (Zs(A), We(A, y)), Gs(() => {
        A._isLeaving && (ft(A, h), We(A, C), qs(M) || Js(A, s, z, ue));
      }), ct(M, [A, ue]);
    },
    onEnterCancelled(A) {
      H(A, !1, void 0, !0), ct(F, [A]);
    },
    onAppearCancelled(A) {
      H(A, !0, void 0, !0), ct(ve, [A]);
    },
    onLeaveCancelled(A) {
      U(A), ct(K, [A]);
    }
  });
}
function Ao(e) {
  if (e == null)
    return null;
  if (k(e))
    return [Wn(e.enter), Wn(e.leave)];
  {
    const t = Wn(e);
    return [t, t];
  }
}
function Wn(e) {
  return Mr(e);
}
function We(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Gt] || (e[Gt] = /* @__PURE__ */ new Set())).add(t);
}
function ft(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Gt];
  n && (n.delete(t), n.size || (e[Gt] = void 0));
}
function Gs(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Mo = 0;
function Js(e, t, n, s) {
  const i = e._endId = ++Mo, r = () => {
    i === e._endId && s();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: l, timeout: o, propCount: c } = Oo(e, t);
  if (!l)
    return s();
  const d = l + "end";
  let u = 0;
  const h = () => {
    e.removeEventListener(d, y), r();
  }, y = (C) => {
    C.target === e && ++u >= c && h();
  };
  setTimeout(() => {
    u < c && h();
  }, o + 1), e.addEventListener(d, y);
}
function Oo(e, t) {
  const n = window.getComputedStyle(e), s = ($) => (n[$] || "").split(", "), i = s(`${et}Delay`), r = s(`${et}Duration`), l = Ys(i, r), o = s(`${Ot}Delay`), c = s(`${Ot}Duration`), d = Ys(o, c);
  let u = null, h = 0, y = 0;
  t === et ? l > 0 && (u = et, h = l, y = r.length) : t === Ot ? d > 0 && (u = Ot, h = d, y = c.length) : (h = Math.max(l, d), u = h > 0 ? l > d ? et : Ot : null, y = u ? u === et ? r.length : c.length : 0);
  const C = u === et && /\b(?:transform|all)(?:,|$)/.test(
    s(`${et}Property`).toString()
  );
  return {
    type: u,
    timeout: h,
    propCount: y,
    hasTransform: C
  };
}
function Ys(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => Xs(n) + Xs(e[s])));
}
function Xs(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Zs(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Po(e, t, n) {
  const s = e[Gt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Qs = /* @__PURE__ */ Symbol("_vod"), Io = /* @__PURE__ */ Symbol("_vsh"), Ro = /* @__PURE__ */ Symbol(""), Fo = /(?:^|;)\s*display\s*:/;
function Lo(e, t, n) {
  const s = e.style, i = ee(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (ee(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && Rt(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && Rt(s, l, "");
    for (const l in n) {
      l === "display" && (r = !0);
      const o = n[l];
      o != null ? Do(
        e,
        l,
        !ee(t) && t ? t[l] : void 0,
        o
      ) || Rt(s, l, o) : Rt(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[Ro];
      l && (n += ";" + l), s.cssText = n, r = Fo.test(n);
    }
  } else t && e.removeAttribute("style");
  Qs in e && (e[Qs] = r ? s.display : "", e[Io] && (s.display = "none"));
}
const ei = /\s*!important$/;
function Rt(e, t, n) {
  if (R(n))
    n.forEach((s) => Rt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = $o(e, t);
    ei.test(n) ? e.setProperty(
      mt(s),
      n.replace(ei, ""),
      "important"
    ) : e[s] = n;
  }
}
const ti = ["Webkit", "Moz", "ms"], zn = {};
function $o(e, t) {
  const n = zn[t];
  if (n)
    return n;
  let s = Me(t);
  if (s !== "filter" && s in e)
    return zn[t] = s;
  s = pi(s);
  for (let i = 0; i < ti.length; i++) {
    const r = ti[i] + s;
    if (r in e)
      return zn[t] = r;
  }
  return t;
}
function Do(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ee(s) && n === s;
}
const ni = "http://www.w3.org/1999/xlink";
function si(e, t, n, s, i, r = Lr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ni, t.slice(6, t.length)) : e.setAttributeNS(ni, t, n) : n == null || r && !mi(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : ke(n) ? String(n) : n
  );
}
function ii(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? yr(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const o = r === "OPTION" ? e.getAttribute("value") || "" : e.value, c = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (o !== c || !("_value" in e)) && (e.value = c), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const o = typeof e[t];
    o === "boolean" ? n = mi(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function Ho(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function No(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const ri = /* @__PURE__ */ Symbol("_vei");
function jo(e, t, n, s, i = null) {
  const r = e[ri] || (e[ri] = {}), l = r[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = ko(t);
    if (s) {
      const d = r[t] = Wo(
        s,
        i
      );
      Ho(e, o, d, c);
    } else l && (No(e, o, l, c), r[t] = void 0);
  }
}
const Vo = /(Once|Passive|Capture)$/, Bo = /^on:?(?:Once|Passive|Capture)$/;
function ko(e) {
  let t, n;
  for (; (n = e.match(Vo)) && !Bo.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : mt(e.slice(2)), t];
}
let qn = 0;
const Ko = /* @__PURE__ */ Promise.resolve(), Uo = () => qn || (Ko.then(() => qn = 0), qn = Date.now());
function Wo(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (R(i)) {
      const r = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        r.call(s), s._stopped = !0;
      };
      const l = i.slice(), o = [s];
      for (let c = 0; c < l.length && !s._stopped; c++) {
        const d = l[c];
        d && Ae(
          d,
          t,
          5,
          o
        );
      }
    } else
      Ae(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Uo(), n;
}
const li = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, zo = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? Po(e, s, l) : t === "style" ? Lo(e, n, s) : _n(t) ? xn(t) || jo(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : qo(e, t, s, l)) ? (ii(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && si(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Go(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ee(s))) ? ii(e, Me(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), si(e, t, s, l));
};
function qo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && li(t) && D(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return li(t) && ee(n) ? !1 : t in e;
}
function Go(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Me(t);
  return Array.isArray(n) ? n.some((i) => Me(i) === s) : Object.keys(n).some((i) => Me(i) === s);
}
const Jo = /* @__PURE__ */ re({ patchProp: zo }, So);
let oi;
function Yo() {
  return oi || (oi = eo(Jo));
}
const Xo = ((...e) => {
  const t = Yo().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = Qo(s);
    if (!i) return;
    const r = t._component;
    !D(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, Zo(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function Zo(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Qo(e) {
  return ee(e) ? document.querySelector(e) : e;
}
const ec = ["aria-label"], tc = { key: 0 }, nc = { class: "muted-people" }, sc = ["x"], ic = ["x"], rc = { key: 1 }, lc = { key: 2 }, oc = { key: 3 }, cc = { key: 4 }, fc = { key: 5 }, uc = { key: 6 }, ac = { key: 7 }, dc = /* @__PURE__ */ zi({
  __name: "SecretScene",
  props: {
    scene: {},
    title: {}
  },
  setup(e) {
    return (t, n) => (te(), ne("svg", {
      class: "secret-scene",
      viewBox: "0 0 160 110",
      role: "img",
      "aria-label": `${e.title}的像素画面`,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "crowd" ? (te(), ne("g", tc, [
        x("g", nc, [
          (te(), ne(xe, null, pn([16, 42, 68, 94, 120, 140], (s) => x("rect", {
            key: s,
            x: s,
            y: "42",
            width: "8",
            height: "8"
          }, null, 8, sc)), 64)),
          (te(), ne(xe, null, pn([13, 39, 65, 91, 117, 137], (s) => x("rect", {
            key: `b${s}`,
            x: s,
            y: "52",
            width: "14",
            height: "25"
          }, null, 8, ic)), 64))
        ]),
        n[0] || (n[0] = x("rect", {
          class: "point-a",
          x: "52",
          y: "46",
          width: "8",
          height: "8"
        }, null, -1)),
        n[1] || (n[1] = x("rect", {
          class: "point-b",
          x: "106",
          y: "46",
          width: "8",
          height: "8"
        }, null, -1)),
        n[2] || (n[2] = x("rect", {
          class: "ground",
          x: "9",
          y: "80",
          width: "142",
          height: "3"
        }, null, -1))
      ])) : e.scene === "dog" ? (te(), ne("g", rc, [...n[3] || (n[3] = [
        x("path", {
          class: "dog",
          d: "M60 49h38v24H60zM63 40h10v11h16V40h9v11h9v8h-9"
        }, null, -1),
        x("rect", {
          class: "point-a",
          x: "70",
          y: "57",
          width: "5",
          height: "5"
        }, null, -1),
        x("rect", {
          class: "point-b",
          x: "88",
          y: "57",
          width: "5",
          height: "5"
        }, null, -1),
        x("rect", {
          class: "ground",
          x: "28",
          y: "77",
          width: "104",
          height: "3"
        }, null, -1)
      ])])) : e.scene === "cactus" ? (te(), ne("g", lc, [...n[4] || (n[4] = [
        x("path", {
          class: "cactus",
          d: "M70 25h20v60H70zM53 43h17v15H60v13H48V48h5zM90 50h18V36h11v31h-11V57H90z"
        }, null, -1),
        x("rect", {
          class: "pot",
          x: "61",
          y: "85",
          width: "38",
          height: "12"
        }, null, -1),
        x("rect", {
          class: "point-a",
          x: "43",
          y: "35",
          width: "7",
          height: "7"
        }, null, -1),
        x("rect", {
          class: "point-b",
          x: "119",
          y: "28",
          width: "7",
          height: "7"
        }, null, -1)
      ])])) : e.scene === "park" ? (te(), ne("g", oc, [...n[5] || (n[5] = [
        sn('<path class="tree" d="M24 28h26v24H24zM17 39h40v19H17z"></path><rect class="trunk" x="33" y="58" width="8" height="24"></rect><path class="bench" d="M73 59h54v6H73zM78 49h44v8H78zM80 65h6v14h-6zM115 65h6v14h-6z"></path><rect class="point-a" x="84" y="41" width="7" height="7"></rect><rect class="point-b" x="106" y="41" width="7" height="7"></rect><rect class="ground" x="12" y="82" width="136" height="3"></rect>', 6)
      ])])) : e.scene === "track" ? (te(), ne("g", cc, [...n[6] || (n[6] = [
        x("path", {
          class: "track",
          d: "M27 31h106a31 31 0 010 62H27a31 31 0 010-62zm0 12a19 19 0 000 38h106a19 19 0 000-38z"
        }, null, -1),
        x("rect", {
          class: "point-a",
          x: "47",
          y: "36",
          width: "7",
          height: "7"
        }, null, -1),
        x("rect", {
          class: "point-b",
          x: "105",
          y: "81",
          width: "7",
          height: "7"
        }, null, -1)
      ])])) : e.scene === "mountain" ? (te(), ne("g", fc, [...n[7] || (n[7] = [
        sn('<path class="mountain-back" d="M7 89L48 34l23 30 19-25 63 50z"></path><path class="mountain-front" d="M13 91l45-39 22 23 17-13 50 29z"></path><path class="path" d="M42 88l28-18 18 5 22-21"></path><rect class="point-a" x="68" y="66" width="7" height="7"></rect><rect class="point-b" x="106" y="49" width="7" height="7"></rect>', 5)
      ])])) : e.scene === "hotel" ? (te(), ne("g", uc, [...n[8] || (n[8] = [
        sn('<rect class="wall" x="27" y="14" width="106" height="83"></rect><rect class="door" x="57" y="28" width="46" height="69"></rect><rect class="door-line" x="62" y="34" width="36" height="58"></rect><rect class="point-a" x="49" y="57" width="7" height="7"></rect><rect class="point-b" x="108" y="57" width="7" height="7"></rect><rect class="handle" x="88" y="61" width="5" height="5"></rect>', 6)
      ])])) : (te(), ne("g", ac, [...n[9] || (n[9] = [
        sn('<rect class="balance-line" x="25" y="58" width="110" height="3"></rect><rect class="balance-mark" x="78" y="49" width="4" height="21"></rect><rect class="point-a" x="62" y="47" width="9" height="9"></rect><rect class="point-b" x="89" y="47" width="9" height="9"></rect><rect class="shadow-a" x="60" y="71" width="13" height="3"></rect><rect class="shadow-b" x="87" y="71" width="13" height="3"></rect>', 6)
      ])]))
    ], 8, ec));
  }
}), ut = [
  {
    id: "crowd",
    index: "01",
    title: "人海里",
    label: "相遇",
    scene: "crowd",
    distance: 82,
    paragraphs: [
      "那段时间，两个人都过得不轻松，各自背着没有说完的压力，混在人群里照常生活。",
      "相遇起初没有特别之处，只是后来才发现，对方似乎能够听懂那些很难向别人解释的部分。"
    ]
  },
  {
    id: "dog",
    index: "02",
    title: "一只小狗",
    label: "靠近",
    scene: "dog",
    distance: 64,
    paragraphs: [
      "有些话不必从沉重的地方开始。一只路过的小狗，一件很小的事情，也能让两个人暂时从各自的压力里走出来。",
      "慰藉并不总是解决问题，更多时候只是让人知道，此刻不必独自承受。"
    ]
  },
  {
    id: "cactus",
    index: "03",
    title: "仙人掌",
    label: "边界",
    scene: "cactus",
    distance: 56,
    paragraphs: [
      "靠近会带来温度，也会碰到彼此身上的刺。两个人都知道，有些边界不能因为理解而消失。",
      "于是学着在想靠近的时候停一下，在想说更多的时候留下一部分。"
    ]
  },
  {
    id: "park",
    index: "04",
    title: "公园",
    label: "喘息",
    scene: "park",
    distance: 48,
    paragraphs: [
      "公园把城市的声音隔开了一点。树、长椅和走过的人，让短暂的相处显得普通。",
      "没有人急着定义什么，只是在一段并不轻松的日子里，给彼此留出一点可以喘息的空间。"
    ]
  },
  {
    id: "track",
    index: "05",
    title: "田径场",
    label: "循环",
    scene: "track",
    distance: 45,
    paragraphs: [
      "田径场上的路总会绕回原点。很多话题也是这样，说过、放下，过一阵又从另一个方向回来。",
      "关系没有继续向前冲，也没有退回陌生人，只是慢慢找到自己的节奏。"
    ]
  },
  {
    id: "mountain",
    index: "06",
    title: "山路",
    label: "同行",
    scene: "mountain",
    distance: 42,
    paragraphs: [
      "爬山时不需要一直说话。有人走在身边，累的时候停一会儿，已经足够。",
      "山路有明确的起点和终点，人与人的距离却没有。能做的只是看清脚下，再走下一段。"
    ]
  },
  {
    id: "hotel",
    index: "07",
    title: "一扇门",
    label: "克制",
    scene: "hotel",
    distance: 36,
    paragraphs: [
      "有些空间离日常很远，反而会让现实变得更清楚。门可以打开，也必须知道什么时候关上。",
      "真正维持这段关系的，不是毫无顾忌地靠近，而是两个人始终知道什么不能越过。"
    ]
  },
  {
    id: "balance",
    index: "08",
    title: "那一格距离",
    label: "平衡",
    scene: "balance",
    distance: 28,
    paragraphs: [
      "后来，两个人没有试图把这段关系变成一个标准答案。它既不是逃离现实，也不是对未来的许诺。",
      "只是在人海里遇见过，彼此理解过，也在最靠近的时候留下了一格距离。"
    ]
  }
];
function hc({ src: e, storageKey: t, volume: n }) {
  const s = /* @__PURE__ */ cn(!1), i = /* @__PURE__ */ cn("idle");
  let r = null, l = !1;
  try {
    s.value = localStorage.getItem(t) === "true", s.value && (i.value = "muted");
  } catch {
  }
  function o() {
    try {
      localStorage.setItem(t, String(s.value));
    } catch {
    }
  }
  function c() {
    return r || (r = document.createElement("audio"), r.src = e, r.loop = !0, r.preload = "auto", r.volume = n, r.setAttribute("playsinline", ""), r.setAttribute("webkit-playsinline", ""), r.hidden = !0, document.body.append(r), r);
  }
  async function d() {
    if (s.value)
      return i.value = "muted", !1;
    l = !0, i.value = "starting";
    const C = c();
    try {
      const $ = C.play();
      return $ && await $, i.value = "playing", !0;
    } catch {
      return i.value = "blocked", !1;
    }
  }
  function u(C = "idle") {
    l = !1, r == null || r.pause(), i.value = C;
  }
  async function h() {
    if (i.value === "playing" || i.value === "starting") {
      s.value = !0, o(), u("muted");
      return;
    }
    s.value = !1, o(), await d();
  }
  async function y() {
    if (!(document.visibilityState !== "visible" || s.value || !l || !r))
      try {
        const C = r.play();
        C && await C, i.value = "playing";
      } catch {
        i.value = "blocked";
      }
  }
  return Pn(() => document.addEventListener("visibilitychange", y)), In(() => {
    u(), document.removeEventListener("visibilitychange", y), r == null || r.remove(), r = null;
  }), { muted: s, status: i, start: d, toggle: h };
}
function pc() {
  return hc({
    src: "/works/our-secret-world/music.mp3?v=1",
    storageKey: "our-secret-world:muted",
    volume: 0.68
  });
}
const gc = {
  key: "entrance",
  class: "secret-entrance",
  "aria-labelledby": "secret-title"
}, mc = ["aria-label"], bc = {
  key: "world",
  class: "secret-interface"
}, vc = { class: "secret-toolbar" }, yc = ["aria-label"], _c = {
  key: "map",
  class: "secret-map",
  "aria-labelledby": "map-title"
}, xc = { class: "map-heading" }, wc = { class: "distance-chart" }, Sc = ["aria-label", "onClick"], Cc = { class: "chapter-visual" }, Tc = { class: "distance-meter" }, Ec = { "aria-label": "记录切换" }, Ac = ["disabled"], Mc = {
  key: "ending",
  class: "secret-ending",
  "aria-labelledby": "ending-title"
}, Oc = /* @__PURE__ */ zi({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ cn("entrance"), n = /* @__PURE__ */ cn(0), s = /* @__PURE__ */ Tn(/* @__PURE__ */ new Set()), i = It(() => ut[n.value]), { status: r, start: l, toggle: o } = pc(), c = It(
      () => r.value === "playing" || r.value === "starting" ? "关闭背景音乐" : "开启背景音乐"
    ), d = It(() => r.value === "playing" ? "♪" : r.value === "starting" ? "…" : "×"), u = It(() => ({
      idle: "声音待开启",
      starting: "声音启动中",
      playing: "声音播放中",
      muted: "声音已关闭",
      blocked: "点击重试声音"
    })[r.value]);
    function h() {
      l(), t.value = "map";
    }
    function y() {
      t.value = "map";
    }
    function C(N) {
      n.value = N, s.add(ut[N].id), t.value = "chapter";
    }
    function $() {
      n.value > 0 && C(n.value - 1);
    }
    function P() {
      n.value < ut.length - 1 ? C(n.value + 1) : t.value = "ending";
    }
    function z(N) {
      N.key === "Escape" && t.value !== "entrance" && y(), t.value === "chapter" && (N.key === "ArrowLeft" && $(), N.key === "ArrowRight" && P());
    }
    return Pn(() => window.addEventListener("keydown", z)), In(() => window.removeEventListener("keydown", z)), (N, _) => (te(), ne("div", {
      class: Vt(["secret-world", `state-${t.value}`])
    }, [
      _[23] || (_[23] = x("div", {
        class: "secret-grain",
        "aria-hidden": "true"
      }, null, -1)),
      fe(zs, {
        name: "secret-fade",
        mode: "out-in"
      }, {
        default: Qn(() => [
          t.value === "entrance" ? (te(), ne("section", gc, [
            _[3] || (_[3] = x("header", null, [
              x("span", null, "未公开记录"),
              x("span", null, "仅凭链接进入")
            ], -1)),
            _[4] || (_[4] = x("div", {
              class: "entrance-signal",
              "aria-hidden": "true"
            }, [
              x("i"),
              x("span"),
              x("i")
            ], -1)),
            _[5] || (_[5] = x("p", null, "两个信号已建立连接", -1)),
            _[6] || (_[6] = x("h1", { id: "secret-title" }, "我们的秘密世界", -1)),
            _[7] || (_[7] = x("p", { class: "entrance-copy" }, "靠近，停下，再找到合适的距离。", -1)),
            x("button", {
              type: "button",
              class: "secret-button",
              onClick: h
            }, [..._[2] || (_[2] = [
              x("span", { "aria-hidden": "true" }, "●", -1),
              rs(" 读取记录 ", -1)
            ])]),
            x("button", {
              type: "button",
              class: "entrance-sound",
              "aria-label": c.value,
              onClick: _[0] || (_[0] = //@ts-ignore
              (...F) => ze(o) && ze(o)(...F))
            }, ye(u.value), 9, mc)
          ])) : (te(), ne("main", bc, [
            x("header", vc, [
              x("button", {
                type: "button",
                onClick: y
              }, "返回轨迹"),
              _[8] || (_[8] = x("p", null, [
                x("i"),
                rs(" 两个信号保持连接")
              ], -1)),
              x("button", {
                type: "button",
                "aria-label": c.value,
                onClick: _[1] || (_[1] = //@ts-ignore
                (...F) => ze(o) && ze(o)(...F))
              }, ye(d.value), 9, yc)
            ]),
            fe(zs, {
              name: "secret-shift",
              mode: "out-in"
            }, {
              default: Qn(() => [
                t.value === "map" ? (te(), ne("section", _c, [
                  x("div", xc, [
                    _[9] || (_[9] = x("div", null, [
                      x("span", null, "八段未公开记录"),
                      x("h2", { id: "map-title" }, "距离的变化")
                    ], -1)),
                    x("p", null, ye(s.size) + " / " + ye(ze(ut).length) + " 已读取", 1)
                  ]),
                  x("div", wc, [
                    _[11] || (_[11] = x("svg", {
                      viewBox: "0 0 100 100",
                      preserveAspectRatio: "none",
                      "aria-hidden": "true"
                    }, [
                      x("path", { d: "M7 20 C22 27 28 41 40 45 S59 62 69 66 S84 72 93 78" })
                    ], -1)),
                    (te(!0), ne(xe, null, pn(ze(ut), (F, M) => (te(), ne("button", {
                      key: F.id,
                      type: "button",
                      class: Vt(["secret-node", { visited: s.has(F.id) }]),
                      style: jt({ "--node-x": `${7 + M * 12.25}%`, "--node-y": `${20 + M * 8.25}%` }),
                      "aria-label": `${F.index} ${F.title}`,
                      onClick: (K) => C(M)
                    }, [
                      _[10] || (_[10] = x("span", null, [
                        x("i"),
                        x("i")
                      ], -1)),
                      x("strong", null, ye(F.label), 1),
                      x("small", null, ye(F.index), 1)
                    ], 14, Sc))), 128)),
                    _[12] || (_[12] = x("div", { class: "chart-note" }, [
                      x("span", null, "远"),
                      x("i"),
                      x("span", null, "近")
                    ], -1))
                  ]),
                  _[13] || (_[13] = x("p", { class: "map-instruction" }, "选择一个节点，读取当时留下的距离", -1))
                ])) : t.value === "chapter" ? (te(), ne("section", {
                  key: i.value.id,
                  class: "secret-chapter"
                }, [
                  x("div", Cc, [
                    x("header", null, [
                      x("span", null, ye(i.value.index), 1),
                      x("span", null, ye(i.value.label), 1)
                    ]),
                    fe(dc, {
                      scene: i.value.scene,
                      title: i.value.title
                    }, null, 8, ["scene", "title"]),
                    x("div", Tc, [
                      _[14] || (_[14] = x("span", null, "远", -1)),
                      x("div", null, [
                        x("i", {
                          style: jt({ width: `${100 - i.value.distance}%` })
                        }, null, 4)
                      ]),
                      _[15] || (_[15] = x("span", null, "近", -1))
                    ]),
                    _[16] || (_[16] = x("small", null, "仍然保留一格距离", -1))
                  ]),
                  x("article", null, [
                    x("span", null, "记录 " + ye(i.value.index) + " / " + ye(ze(ut).length.toString().padStart(2, "0")), 1),
                    x("h2", null, ye(i.value.title), 1),
                    x("div", null, [
                      (te(!0), ne(xe, null, pn(i.value.paragraphs, (F) => (te(), ne("p", { key: F }, ye(F), 1))), 128))
                    ]),
                    x("nav", Ec, [
                      x("button", {
                        type: "button",
                        disabled: n.value === 0,
                        onClick: $
                      }, "上一段", 8, Ac),
                      x("button", {
                        type: "button",
                        onClick: y
                      }, "查看轨迹"),
                      x("button", {
                        type: "button",
                        onClick: P
                      }, ye(n.value === ze(ut).length - 1 ? "读完" : "下一段"), 1)
                    ])
                  ])
                ])) : (te(), ne("section", Mc, [
                  _[18] || (_[18] = x("div", {
                    class: "ending-points",
                    "aria-hidden": "true"
                  }, [
                    x("i"),
                    x("span"),
                    x("i")
                  ], -1)),
                  _[19] || (_[19] = x("p", null, "距离记录 / 已保存", -1)),
                  _[20] || (_[20] = x("h2", { id: "ending-title" }, "有些关系不需要答案", -1)),
                  _[21] || (_[21] = x("p", null, "谢谢你曾经在人海里看见我，也谢谢我们都没有让这份理解失去边界。", -1)),
                  _[22] || (_[22] = x("strong", null, "七夕快乐", -1)),
                  x("div", null, [
                    x("button", {
                      type: "button",
                      class: "secret-button",
                      onClick: y
                    }, "再次查看"),
                    _[17] || (_[17] = x("a", { href: "/" }, "离开这里", -1))
                  ])
                ]))
              ]),
              _: 1
            })
          ]))
        ]),
        _: 1
      })
    ], 2));
  }
}), ci = document.querySelector("#our-secret-world-app");
ci && Xo(Oc).mount(ci);
