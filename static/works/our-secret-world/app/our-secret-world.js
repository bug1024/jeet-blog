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
const Y = {}, yt = [], ke = () => {
}, ai = () => !1, vn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), yn = (e) => e.startsWith("onUpdate:"), re = Object.assign, cs = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Tr = Object.prototype.hasOwnProperty, k = (e, t) => Tr.call(e, t), F = Array.isArray, _t = (e) => Gt(e) === "[object Map]", di = (e) => Gt(e) === "[object Set]", Ms = (e) => Gt(e) === "[object Date]", D = (e) => typeof e == "function", ee = (e) => typeof e == "string", Ke = (e) => typeof e == "symbol", K = (e) => e !== null && typeof e == "object", hi = (e) => (K(e) || D(e)) && D(e.then) && D(e.catch), pi = Object.prototype.toString, Gt = (e) => pi.call(e), Er = (e) => Gt(e).slice(8, -1), gi = (e) => Gt(e) === "[object Object]", fs = (e) => ee(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Rt = /* @__PURE__ */ os(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), _n = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Ar = /-\w/g, Oe = _n(
  (e) => e.replace(Ar, (t) => t.slice(1).toUpperCase())
), Mr = /\B([A-Z])/g, mt = _n(
  (e) => e.replace(Mr, "-$1").toLowerCase()
), mi = _n((e) => e.charAt(0).toUpperCase() + e.slice(1)), Rn = _n(
  (e) => e ? `on${mi(e)}` : ""
), Ve = (e, t) => !Object.is(e, t), Fn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, bi = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Or = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Pr = (e) => {
  const t = ee(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Os;
const xn = () => Os || (Os = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Nt(e) {
  if (F(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = ee(s) ? Lr(s) : Nt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (ee(e) || K(e))
    return e;
}
const Ir = /;(?![^(]*\))/g, Rr = /:([^]+)/, Fr = /\/\*[^]*?\*\//g;
function Lr(e) {
  const t = {};
  return e.replace(Fr, "").split(Ir).forEach((n) => {
    if (n) {
      const s = n.split(Rr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function jt(e) {
  let t = "";
  if (ee(e))
    t = e;
  else if (F(e))
    for (let n = 0; n < e.length; n++) {
      const s = jt(e[n]);
      s && (t += s + " ");
    }
  else if (K(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const $r = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Dr = /* @__PURE__ */ os($r);
function vi(e) {
  return !!e || e === "";
}
function Hr(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = us(e[s], t[s]);
  return n;
}
function us(e, t) {
  if (e === t) return !0;
  let n = Ms(e), s = Ms(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = Ke(e), s = Ke(t), n || s)
    return e === t;
  if (n = F(e), s = F(t), n || s)
    return n && s ? Hr(e, t) : !1;
  if (n = K(e), s = K(t), n || s) {
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
const yi = (e) => !!(e && e.__v_isRef === !0), ye = (e) => ee(e) ? e : e == null ? "" : F(e) || K(e) && (e.toString === pi || !D(e.toString)) ? yi(e) ? ye(e.value) : JSON.stringify(e, _i, 2) : String(e), _i = (e, t) => yi(t) ? _i(e, t.value) : _t(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[Ln(s, r) + " =>"] = i, n),
    {}
  )
} : di(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Ln(n))
} : Ke(t) ? Ln(t) : K(t) && !F(t) && !gi(t) ? String(t) : t, Ln = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Ke(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ce;
class Nr {
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
function jr() {
  return ce;
}
let J;
const $n = /* @__PURE__ */ new WeakSet();
class xi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ce && (ce.active ? ce.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, $n.has(this) && ($n.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Si(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ps(this), Ci(this);
    const t = J, n = Pe;
    J = this, Pe = !0;
    try {
      return this.fn();
    } finally {
      Ti(this), J = t, Pe = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        hs(t);
      this.deps = this.depsTail = void 0, Ps(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? $n.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    zn(this) && this.run();
  }
  get dirty() {
    return zn(this);
  }
}
let wi = 0, Ft, Lt;
function Si(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Lt, Lt = e;
    return;
  }
  e.next = Ft, Ft = e;
}
function as() {
  wi++;
}
function ds() {
  if (--wi > 0)
    return;
  if (Lt) {
    let t = Lt;
    for (Lt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Ft; ) {
    let t = Ft;
    for (Ft = void 0; t; ) {
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
function Ci(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ti(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), hs(s), Vr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function zn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ei(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ei(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Vt) || (e.globalVersion = Vt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !zn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = J, s = Pe;
  J = e, Pe = !0;
  try {
    Ci(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ve(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    J = n, Pe = s, Ti(e), e.flags &= -3;
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
function Vr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Pe = !0;
const Ai = [];
function Ye() {
  Ai.push(Pe), Pe = !1;
}
function Xe() {
  const e = Ai.pop();
  Pe = e === void 0 ? !0 : e;
}
function Ps(e) {
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
let Vt = 0;
class Br {
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
    if (!J || !Pe || J === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== J)
      n = this.activeLink = new Br(J, this), J.deps ? (n.prevDep = J.depsTail, J.depsTail.nextDep = n, J.depsTail = n) : J.deps = J.depsTail = n, Mi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = J.depsTail, n.nextDep = void 0, J.depsTail.nextDep = n, J.depsTail = n, J.deps === n && (J.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Vt++, this.notify(t);
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
function Mi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Mi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const qn = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ Symbol(
  ""
), Gn = /* @__PURE__ */ Symbol(
  ""
), Bt = /* @__PURE__ */ Symbol(
  ""
);
function ae(e, t, n) {
  if (Pe && J) {
    let s = qn.get(e);
    s || qn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new ps()), i.map = s, i.key = n), i.track();
  }
}
function Je(e, t, n, s, i, r) {
  const l = qn.get(e);
  if (!l) {
    Vt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (as(), t === "clear")
    l.forEach(o);
  else {
    const c = F(e), d = c && fs(n);
    if (c && n === "length") {
      const u = Number(s);
      l.forEach((h, y) => {
        (y === "length" || y === Bt || !Ke(y) && y >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(Bt)), t) {
        case "add":
          c ? d && o(l.get("length")) : (o(l.get(ht)), _t(e) && o(l.get(Gn)));
          break;
        case "delete":
          c || (o(l.get(ht)), _t(e) && o(l.get(Gn)));
          break;
        case "set":
          _t(e) && o(l.get(ht));
          break;
      }
  }
  ds();
}
function bt(e) {
  const t = /* @__PURE__ */ B(e);
  return t === e ? t : (ae(t, "iterate", Bt), /* @__PURE__ */ Ee(e) ? t : t.map(Ie));
}
function wn(e) {
  return ae(e = /* @__PURE__ */ B(e), "iterate", Bt), e;
}
function Ne(e, t) {
  return /* @__PURE__ */ Ze(e) ? St(/* @__PURE__ */ pt(e) ? Ie(t) : t) : Ie(t);
}
const kr = {
  __proto__: null,
  [Symbol.iterator]() {
    return Dn(this, Symbol.iterator, (e) => Ne(this, e));
  },
  concat(...e) {
    return bt(this).concat(
      ...e.map((t) => F(t) ? bt(t) : t)
    );
  },
  entries() {
    return Dn(this, "entries", (e) => (e[1] = Ne(this, e[1]), e));
  },
  every(e, t) {
    return We(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return We(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => Ne(this, s)),
      arguments
    );
  },
  find(e, t) {
    return We(
      this,
      "find",
      e,
      t,
      (n) => Ne(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return We(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return We(
      this,
      "findLast",
      e,
      t,
      (n) => Ne(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return We(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return We(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Hn(this, "includes", e);
  },
  indexOf(...e) {
    return Hn(this, "indexOf", e);
  },
  join(e) {
    return bt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Hn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return We(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return At(this, "pop");
  },
  push(...e) {
    return At(this, "push", e);
  },
  reduce(e, ...t) {
    return Is(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Is(this, "reduceRight", e, t);
  },
  shift() {
    return At(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return We(this, "some", e, t, void 0, arguments);
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
    return Dn(this, "values", (e) => Ne(this, e));
  }
};
function Dn(e, t, n) {
  const s = wn(e), i = s[t]();
  return s !== e && !/* @__PURE__ */ Ee(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
const Kr = Array.prototype;
function We(e, t, n, s, i, r) {
  const l = wn(e), o = l !== e && !/* @__PURE__ */ Ee(e), c = l[t];
  if (c !== Kr[t]) {
    const h = c.apply(e, r);
    return o ? Ie(h) : h;
  }
  let d = n;
  l !== e && (o ? d = function(h, y) {
    return n.call(this, Ne(e, h), y, e);
  } : n.length > 2 && (d = function(h, y) {
    return n.call(this, h, y, e);
  }));
  const u = c.call(l, d, s);
  return o && i ? i(u) : u;
}
function Is(e, t, n, s) {
  const i = wn(e), r = i !== e && !/* @__PURE__ */ Ee(e);
  let l = n, o = !1;
  i !== e && (r ? (o = s.length === 0, l = function(d, u, h) {
    return o && (o = !1, d = Ne(e, d)), n.call(this, d, Ne(e, u), h, e);
  }) : n.length > 3 && (l = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const c = i[t](l, ...s);
  return o ? Ne(e, c) : c;
}
function Hn(e, t, n) {
  const s = /* @__PURE__ */ B(e);
  ae(s, "iterate", Bt);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ bs(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), s[t](...n)) : i;
}
function At(e, t, n = []) {
  Ye(), as();
  const s = (/* @__PURE__ */ B(e))[t].apply(e, n);
  return ds(), Xe(), s;
}
const Ur = /* @__PURE__ */ os("__proto__,__v_isRef,__isVue"), Oi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ke)
);
function Wr(e) {
  Ke(e) || (e = String(e));
  const t = /* @__PURE__ */ B(this);
  return ae(t, "has", e), t.hasOwnProperty(e);
}
class Pi {
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
      return s === (i ? r ? tl : Li : r ? Fi : Ri).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = F(t);
    if (!i) {
      let c;
      if (l && (c = kr[n]))
        return c;
      if (n === "hasOwnProperty")
        return Wr;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ de(t) ? t : s
    );
    if ((Ke(n) ? Oi.has(n) : Ur(n)) || (i || ae(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ de(o)) {
      const c = l && fs(n) ? o : o.value;
      return i && K(c) ? /* @__PURE__ */ Yn(c) : c;
    }
    return K(o) ? i ? /* @__PURE__ */ Yn(o) : /* @__PURE__ */ Sn(o) : o;
  }
}
class Ii extends Pi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = F(t) && fs(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ Ze(r);
      if (!/* @__PURE__ */ Ee(s) && !/* @__PURE__ */ Ze(s) && (r = /* @__PURE__ */ B(r), s = /* @__PURE__ */ B(s)), !l && /* @__PURE__ */ de(r) && !/* @__PURE__ */ de(s))
        return d || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : k(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ de(t) ? t : i
    );
    return t === /* @__PURE__ */ B(i) && c && (o ? Ve(s, r) && Je(t, "set", n, s) : Je(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = k(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && Je(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Ke(n) || !Oi.has(n)) && ae(t, "has", n), s;
  }
  ownKeys(t) {
    return ae(
      t,
      "iterate",
      F(t) ? "length" : ht
    ), Reflect.ownKeys(t);
  }
}
class zr extends Pi {
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
const qr = /* @__PURE__ */ new Ii(), Gr = /* @__PURE__ */ new zr(), Jr = /* @__PURE__ */ new Ii(!0);
const Jn = (e) => e, Qt = (e) => Reflect.getPrototypeOf(e);
function Yr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ B(i), l = _t(r), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, d = i[e](...s), u = n ? Jn : t ? St : Ie;
    return !t && ae(
      r,
      "iterate",
      c ? Gn : ht
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
function en(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Xr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ B(r), o = /* @__PURE__ */ B(i);
      e || (Ve(i, o) && ae(l, "get", i), ae(l, "get", o));
      const { has: c } = Qt(l), d = t ? Jn : e ? St : Ie;
      if (c.call(l, i))
        return d(r.get(i));
      if (c.call(l, o))
        return d(r.get(o));
      r !== l && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && ae(/* @__PURE__ */ B(i), "iterate", ht), i.size;
    },
    has(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ B(r), o = /* @__PURE__ */ B(i);
      return e || (Ve(i, o) && ae(l, "has", i), ae(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ B(o), d = t ? Jn : e ? St : Ie;
      return !e && ae(c, "iterate", ht), o.forEach((u, h) => i.call(r, d(u), d(h), l));
    }
  };
  return re(
    n,
    e ? {
      add: en("add"),
      set: en("set"),
      delete: en("delete"),
      clear: en("clear")
    } : {
      add(i) {
        const r = /* @__PURE__ */ B(this), l = Qt(r), o = /* @__PURE__ */ B(i), c = !t && !/* @__PURE__ */ Ee(i) && !/* @__PURE__ */ Ze(i) ? o : i;
        return l.has.call(r, c) || Ve(i, c) && l.has.call(r, i) || Ve(o, c) && l.has.call(r, o) || (r.add(c), Je(r, "add", c, c)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ Ee(r) && !/* @__PURE__ */ Ze(r) && (r = /* @__PURE__ */ B(r));
        const l = /* @__PURE__ */ B(this), { has: o, get: c } = Qt(l);
        let d = o.call(l, i);
        d || (i = /* @__PURE__ */ B(i), d = o.call(l, i));
        const u = c.call(l, i);
        return l.set(i, r), d ? Ve(r, u) && Je(l, "set", i, r) : Je(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ B(this), { has: l, get: o } = Qt(r);
        let c = l.call(r, i);
        c || (i = /* @__PURE__ */ B(i), c = l.call(r, i)), o && o.call(r, i);
        const d = r.delete(i);
        return c && Je(r, "delete", i, void 0), d;
      },
      clear() {
        const i = /* @__PURE__ */ B(this), r = i.size !== 0, l = i.clear();
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
    n[i] = Yr(i, e, t);
  }), n;
}
function gs(e, t) {
  const n = Xr(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    k(n, i) && i in s ? n : s,
    i,
    r
  );
}
const Zr = {
  get: /* @__PURE__ */ gs(!1, !1)
}, Qr = {
  get: /* @__PURE__ */ gs(!1, !0)
}, el = {
  get: /* @__PURE__ */ gs(!0, !1)
};
const Ri = /* @__PURE__ */ new WeakMap(), Fi = /* @__PURE__ */ new WeakMap(), Li = /* @__PURE__ */ new WeakMap(), tl = /* @__PURE__ */ new WeakMap();
function nl(e) {
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
function Sn(e) {
  return /* @__PURE__ */ Ze(e) ? e : ms(
    e,
    !1,
    qr,
    Zr,
    Ri
  );
}
// @__NO_SIDE_EFFECTS__
function sl(e) {
  return ms(
    e,
    !1,
    Jr,
    Qr,
    Fi
  );
}
// @__NO_SIDE_EFFECTS__
function Yn(e) {
  return ms(
    e,
    !0,
    Gr,
    el,
    Li
  );
}
function ms(e, t, n, s, i) {
  if (!K(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = nl(Er(e));
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
function B(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ B(t) : e;
}
function il(e) {
  return !k(e, "__v_skip") && Object.isExtensible(e) && bi(e, "__v_skip", !0), e;
}
const Ie = (e) => K(e) ? /* @__PURE__ */ Sn(e) : e, St = (e) => K(e) ? /* @__PURE__ */ Yn(e) : e;
// @__NO_SIDE_EFFECTS__
function de(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Xn(e) {
  return rl(e, !1);
}
function rl(e, t) {
  return /* @__PURE__ */ de(e) ? e : new ll(e, t);
}
class ll {
  constructor(t, n) {
    this.dep = new ps(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ B(t), this._value = n ? t : Ie(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Ee(t) || /* @__PURE__ */ Ze(t);
    t = s ? t : /* @__PURE__ */ B(t), Ve(t, n) && (this._rawValue = t, this._value = s ? t : Ie(t), this.dep.trigger());
  }
}
function Me(e) {
  return /* @__PURE__ */ de(e) ? e.value : e;
}
const ol = {
  get: (e, t, n) => t === "__v_raw" ? e : Me(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ de(i) && !/* @__PURE__ */ de(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function $i(e) {
  return /* @__PURE__ */ pt(e) ? e : new Proxy(e, ol);
}
class cl {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ps(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Vt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    J !== this)
      return Si(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Ei(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function fl(e, t, n = !1) {
  let s, i;
  return D(e) ? s = e : (s = e.get, i = e.set), new cl(s, i, n);
}
const tn = {}, on = /* @__PURE__ */ new WeakMap();
let at;
function ul(e, t = !1, n = at) {
  if (n) {
    let s = on.get(n);
    s || on.set(n, s = []), s.push(e);
  }
}
function al(e, t, n = Y) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: c } = n, d = (O) => i ? O : /* @__PURE__ */ Ee(O) || i === !1 || i === 0 ? nt(O, 1) : nt(O);
  let u, h, y, T, R = !1, A = !1;
  if (/* @__PURE__ */ de(e) ? (h = () => e.value, R = /* @__PURE__ */ Ee(e)) : /* @__PURE__ */ pt(e) ? (h = () => d(e), R = !0) : F(e) ? (A = !0, R = e.some((O) => /* @__PURE__ */ pt(O) || /* @__PURE__ */ Ee(O)), h = () => e.map((O) => {
    if (/* @__PURE__ */ de(O))
      return O.value;
    if (/* @__PURE__ */ pt(O))
      return d(O);
    if (D(O))
      return c ? c(O, 2) : O();
  })) : D(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (y) {
      Ye();
      try {
        y();
      } finally {
        Xe();
      }
    }
    const O = at;
    at = u;
    try {
      return c ? c(e, 3, [T]) : e(T);
    } finally {
      at = O;
    }
  } : h = ke, t && i) {
    const O = h, z = i === !0 ? 1 / 0 : i;
    h = () => nt(O(), z);
  }
  const S = jr(), $ = () => {
    u.stop(), S && S.active && cs(S.effects, u);
  };
  if (r && t) {
    const O = t;
    t = (...z) => {
      const se = O(...z);
      return $(), se;
    };
  }
  let H = A ? new Array(e.length).fill(tn) : tn;
  const j = (O) => {
    if (!(!(u.flags & 1) || !u.dirty && !O))
      if (t) {
        const z = u.run();
        if (O || i || R || (A ? z.some((se, he) => Ve(se, H[he])) : Ve(z, H))) {
          y && y();
          const se = at;
          at = u;
          try {
            const he = [
              z,
              // pass undefined as the old value when it's changed for the first time
              H === tn ? void 0 : A && H[0] === tn ? [] : H,
              T
            ];
            H = z, c ? c(t, 3, he) : (
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
  return o && o(j), u = new xi(h), u.scheduler = l ? () => l(j, !1) : j, T = (O) => ul(O, !1, u), y = u.onStop = () => {
    const O = on.get(u);
    if (O) {
      if (c)
        c(O, 4);
      else
        for (const z of O) z();
      on.delete(u);
    }
  }, t ? s ? j(!0) : H = u.run() : l ? l(j.bind(null, !0), !0) : u.run(), $.pause = u.pause.bind(u), $.resume = u.resume.bind(u), $.stop = $, $;
}
function nt(e, t = 1 / 0, n) {
  if (t <= 0 || !K(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ de(e))
    nt(e.value, t, n);
  else if (F(e))
    for (let s = 0; s < e.length; s++)
      nt(e[s], t, n);
  else if (di(e) || _t(e))
    e.forEach((s) => {
      nt(s, t, n);
    });
  else if (gi(e)) {
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
function Jt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    Cn(i, t, n);
  }
}
function Ae(e, t, n, s) {
  if (D(e)) {
    const i = Jt(e, t, n, s);
    return i && hi(i) && i.catch((r) => {
      Cn(r, t, n);
    }), i;
  }
  if (F(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(Ae(e[r], t, n, s));
    return i;
  }
}
function Cn(e, t, n, s = !0) {
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
      Ye(), Jt(r, null, 10, [
        e,
        c,
        d
      ]), Xe();
      return;
    }
  }
  dl(e, n, i, s, l);
}
function dl(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const ge = [];
let He = -1;
const xt = [];
let tt = null, vt = 0;
const Di = /* @__PURE__ */ Promise.resolve();
let cn = null;
function hl(e) {
  const t = cn || Di;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function pl(e) {
  let t = He + 1, n = ge.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = ge[s], r = kt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function vs(e) {
  if (!(e.flags & 1)) {
    const t = kt(e), n = ge[ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= kt(n) ? ge.push(e) : ge.splice(pl(t), 0, e), e.flags |= 1, Hi();
  }
}
function Hi() {
  cn || (cn = Di.then(ji));
}
function gl(e) {
  if (!F(e))
    tt && e.id === -1 ? tt.splice(vt + 1, 0, e) : e.flags & 1 || (xt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      xt.push(e[t]);
  Hi();
}
function Rs(e, t, n = He + 1) {
  for (; n < ge.length; n++) {
    const s = ge[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ge.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Ni(e) {
  if (xt.length) {
    const t = [...new Set(xt)].sort(
      (n, s) => kt(n) - kt(s)
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
const kt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function ji(e) {
  try {
    for (He = 0; He < ge.length; He++) {
      const t = ge[He];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Jt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; He < ge.length; He++) {
      const t = ge[He];
      t && (t.flags &= -2);
    }
    He = -1, ge.length = 0, Ni(), cn = null, (ge.length || xt.length) && ji();
  }
}
let Be = null, Vi = null;
function fn(e) {
  const t = Be;
  return Be = e, Vi = e && e.type.__scopeId || null, t;
}
function Zn(e, t = Be, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && pn(-1);
    const r = fn(t), l = gt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let c = gt.length; c > l; c--) gr();
      fn(r), s._d && pn(1);
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
function ml(e, t) {
  if (be) {
    let n = be.provides;
    const s = be.parent && be.parent.provides;
    s === n && (n = be.provides = Object.create(s)), n[e] = t;
  }
}
function sn(e, t, n = !1) {
  const s = vr();
  if (s || wt) {
    let i = wt ? wt._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && D(t) ? t.call(s && s.proxy) : t;
  }
}
const bl = /* @__PURE__ */ Symbol.for("v-scx"), vl = () => sn(bl);
function Nn(e, t, n) {
  return Bi(e, t, n);
}
function Bi(e, t, n = Y) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = re({}, n), c = t && s || !t && r !== "post";
  let d;
  if (zt) {
    if (r === "sync") {
      const T = vl();
      d = T.__watcherHandles || (T.__watcherHandles = []);
    } else if (!c) {
      const T = () => {
      };
      return T.stop = ke, T.resume = ke, T.pause = ke, T;
    }
  }
  const u = be;
  o.call = (T, R, A) => Ae(T, u, R, A);
  let h = !1;
  r === "post" ? o.scheduler = (T) => {
    _e(T, u && u.suspense);
  } : r !== "sync" && (h = !0, o.scheduler = (T, R) => {
    R ? T() : vs(T);
  }), o.augmentJob = (T) => {
    t && (T.flags |= 4), h && (T.flags |= 2, u && (T.id = u.uid, T.i = u));
  };
  const y = al(e, t, o);
  return zt && (d ? d.push(y) : c && y()), y;
}
function yl(e, t, n) {
  const s = this.proxy, i = ee(e) ? e.includes(".") ? ki(s, e) : () => s[e] : e.bind(s, s);
  let r;
  D(t) ? r = t : (r = t.handler, n = t);
  const l = Yt(this), o = Bi(i, r.bind(s), n);
  return l(), o;
}
function ki(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const _l = /* @__PURE__ */ Symbol("_vte"), Tn = (e) => e.__isTeleport, Te = /* @__PURE__ */ Symbol("_leaveCb"), Mt = /* @__PURE__ */ Symbol("_enterCb");
function xl() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return ys(() => {
    e.isMounted = !0;
  }), Mn(() => {
    e.isUnmounting = !0;
  }), e;
}
const Ce = [Function, Array], Ki = {
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
}, Ui = (e) => {
  const t = e.subTree;
  return t.component ? Ui(t.component) : t;
}, wl = {
  name: "BaseTransition",
  props: Ki,
  setup(e, { slots: t }) {
    const n = vr(), s = xl();
    return () => {
      const i = t.default && qi(t.default(), !0), r = i && i.length ? Wi(i) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? uo() : void 0
      );
      if (!r)
        return;
      const l = /* @__PURE__ */ B(e), { mode: o } = l;
      if (s.isLeaving)
        return jn(r);
      const c = un(r);
      if (!c)
        return jn(r);
      let d = Qn(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (h) => d = h
      );
      c.type !== me && Kt(c, d);
      let u = n.subTree && un(n.subTree);
      if (u && u.type !== me && !dt(u, c) && Ui(n).type !== me) {
        let h = Qn(
          u,
          l,
          s,
          n
        );
        if (Kt(u, h), o === "out-in" && c.type !== me)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave, u = void 0;
          }, jn(r);
        o === "in-out" && c.type !== me ? h.delayLeave = (y, T, R) => {
          const A = zi(
            s,
            u
          );
          A[String(u.key)] = u, y[Te] = () => {
            T(), y[Te] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            R(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return r;
    };
  }
};
function Wi(e) {
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
const Sl = wl;
function zi(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function Qn(e, t, n, s, i) {
  const {
    appear: r,
    mode: l,
    persisted: o = !1,
    onBeforeEnter: c,
    onEnter: d,
    onAfterEnter: u,
    onEnterCancelled: h,
    onBeforeLeave: y,
    onLeave: T,
    onAfterLeave: R,
    onLeaveCancelled: A,
    onBeforeAppear: S,
    onAppear: $,
    onAfterAppear: H,
    onAppearCancelled: j
  } = t, O = String(e.key), z = zi(n, e), se = (N, U) => {
    N && Ae(
      N,
      s,
      9,
      U
    );
  }, he = (N, U) => {
    const Z = U[1];
    se(N, U), F(N) ? N.every((M) => M.length <= 1) && Z() : N.length <= 1 && Z();
  }, ve = {
    mode: l,
    persisted: o,
    beforeEnter(N) {
      let U = c;
      if (!n.isMounted)
        if (r)
          U = S || c;
        else
          return;
      N[Te] && N[Te](
        !0
        /* cancelled */
      );
      const Z = z[O];
      Z && dt(e, Z) && Z.el[Te] && Z.el[Te](), se(U, [N]);
    },
    enter(N) {
      if (z[O] === e) return;
      let U = d, Z = u, M = h;
      if (!n.isMounted)
        if (r)
          U = $ || d, Z = H || u, M = j || h;
        else
          return;
      let X = !1;
      N[Mt] = (Ue) => {
        X || (X = !0, Ue ? se(M, [N]) : se(Z, [N]), ve.delayedLeave && ve.delayedLeave(), N[Mt] = void 0);
      };
      const ue = N[Mt].bind(null, !1);
      U ? he(U, [N, ue]) : ue();
    },
    leave(N, U) {
      const Z = String(e.key);
      if (N[Mt] && N[Mt](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return U();
      se(y, [N]);
      let M = !1;
      N[Te] = (ue) => {
        M || (M = !0, U(), ue ? se(A, [N]) : se(R, [N]), N[Te] = void 0, z[Z] === e && delete z[Z]);
      };
      const X = N[Te].bind(null, !1);
      z[Z] = e, T ? he(T, [N, X]) : X();
    },
    clone(N) {
      const U = Qn(
        N,
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
function jn(e) {
  if (En(e))
    return e = st(e), e.children = null, e;
}
function un(e) {
  if (!En(e))
    return Tn(e.type) && e.children ? Wi(e.children) : e;
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
function Kt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Kt(
      Tn(n.type) && un(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function qi(e, t = !1, n) {
  let s = [], i = 0;
  for (let r = 0; r < e.length; r++) {
    let l = e[r];
    const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : r);
    l.type === xe ? (l.patchFlag & 128 && i++, s = s.concat(
      qi(l.children, t, o)
    )) : (t || l.type !== me) && s.push(o != null ? st(l, { key: o }) : l);
  }
  if (i > 1)
    for (let r = 0; r < s.length; r++)
      s[r].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function Gi(e, t) {
  return D(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    re({ name: e.name }, t, { setup: e })
  ) : e;
}
function Ji(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Fs(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const an = /* @__PURE__ */ new WeakMap();
function $t(e, t, n, s, i = !1) {
  if (F(e)) {
    e.forEach(
      (A, S) => $t(
        A,
        t && (F(t) ? t[S] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (Dt(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && $t(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? ws(s.component) : s.el, l = i ? null : r, { i: o, r: c } = e, d = t && t.r, u = o.refs === Y ? o.refs = {} : o.refs, h = o.setupState, y = /* @__PURE__ */ B(h), T = h === Y ? ai : (A) => Fs(u, A) ? !1 : k(y, A), R = (A, S) => !(S && Fs(u, S));
  if (d != null && d !== c) {
    if (Ls(t), ee(d))
      u[d] = null, T(d) && (h[d] = null);
    else if (/* @__PURE__ */ de(d)) {
      const A = t;
      R(d, A.k) && (d.value = null), A.k && (u[A.k] = null);
    }
  }
  if (D(c))
    Jt(c, o, 12, [l, u]);
  else {
    const A = ee(c), S = /* @__PURE__ */ de(c);
    if (A || S) {
      const $ = () => {
        if (e.f) {
          const H = A ? T(c) ? h[c] : u[c] : R() || !e.k ? c.value : u[e.k];
          if (i)
            F(H) && cs(H, r);
          else if (F(H))
            H.includes(r) || H.push(r);
          else if (A)
            u[c] = [r], T(c) && (h[c] = u[c]);
          else {
            const j = [r];
            R(c, e.k) && (c.value = j), e.k && (u[e.k] = j);
          }
        } else A ? (u[c] = l, T(c) && (h[c] = l)) : S && (R(c, e.k) && (c.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const H = () => {
          $(), an.delete(e);
        };
        H.id = -1, an.set(e, H), _e(H, n);
      } else
        Ls(e), $();
    }
  }
}
function Ls(e) {
  const t = an.get(e);
  t && (t.flags |= 8, an.delete(e));
}
xn().requestIdleCallback;
xn().cancelIdleCallback;
const Dt = (e) => !!e.type.__asyncLoader, En = (e) => e.type.__isKeepAlive;
function Cl(e, t) {
  Yi(e, "a", t);
}
function Tl(e, t) {
  Yi(e, "da", t);
}
function Yi(e, t, n = be) {
  const s = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (An(t, s, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      En(i.parent.vnode) && El(s, t, n, i), i = i.parent;
  }
}
function El(e, t, n, s) {
  const i = An(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Xi(() => {
    cs(s[t], i);
  }, n);
}
function An(e, t, n = be, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...l) => {
      Ye();
      const o = Yt(n), c = Ae(t, n, e, l);
      return o(), Xe(), c;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const Qe = (e) => (t, n = be) => {
  (!zt || e === "sp") && An(e, (...s) => t(...s), n);
}, Al = Qe("bm"), ys = Qe("m"), Ml = Qe(
  "bu"
), Ol = Qe("u"), Mn = Qe(
  "bum"
), Xi = Qe("um"), Pl = Qe(
  "sp"
), Il = Qe("rtg"), Rl = Qe("rtc");
function Fl(e, t = be) {
  An("ec", e, t);
}
const Ll = /* @__PURE__ */ Symbol.for("v-ndc");
function dn(e, t, n, s) {
  let i;
  const r = n, l = F(e);
  if (l || ee(e)) {
    const o = l && /* @__PURE__ */ pt(e);
    let c = !1, d = !1;
    o && (c = !/* @__PURE__ */ Ee(e), d = /* @__PURE__ */ Ze(e), e = wn(e)), i = new Array(e.length);
    for (let u = 0, h = e.length; u < h; u++)
      i[u] = t(
        c ? d ? St(Ie(e[u])) : Ie(e[u]) : e[u],
        u,
        void 0,
        r
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let o = 0; o < e; o++)
      i[o] = t(o + 1, o, void 0, r);
  } else if (K(e))
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
const es = (e) => e ? yr(e) ? ws(e) : es(e.parent) : null, Ht = (
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
    $parent: (e) => es(e.parent),
    $root: (e) => es(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Qi(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      vs(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = hl.bind(e.proxy)),
    $watch: (e) => yl.bind(e)
  })
), Vn = (e, t) => e !== Y && !e.__isScriptSetup && k(e, t), $l = {
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
        if (Vn(s, t))
          return l[t] = 1, s[t];
        if (i !== Y && k(i, t))
          return l[t] = 2, i[t];
        if (k(r, t))
          return l[t] = 3, r[t];
        if (n !== Y && k(n, t))
          return l[t] = 4, n[t];
        ts && (l[t] = 0);
      }
    }
    const d = Ht[t];
    let u, h;
    if (d)
      return t === "$attrs" && ae(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (u = o.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== Y && k(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      h = c.config.globalProperties, k(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Vn(i, t) ? (i[t] = n, !0) : s !== Y && k(s, t) ? (s[t] = n, !0) : k(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== Y && o[0] !== "$" && k(e, o) || Vn(t, o) || k(r, o) || k(s, o) || k(Ht, o) || k(i.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : k(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function $s(e) {
  return F(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let ts = !0;
function Dl(e) {
  const t = Qi(e), n = e.proxy, s = e.ctx;
  ts = !1, t.beforeCreate && Ds(t.beforeCreate, e, "bc");
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
    beforeUpdate: T,
    updated: R,
    activated: A,
    deactivated: S,
    beforeDestroy: $,
    beforeUnmount: H,
    destroyed: j,
    unmounted: O,
    render: z,
    renderTracked: se,
    renderTriggered: he,
    errorCaptured: ve,
    serverPrefetch: N,
    // public API
    expose: U,
    inheritAttrs: Z,
    // assets
    components: M,
    directives: X,
    filters: ue
  } = t;
  if (d && Hl(d, s, null), l)
    for (const Q in l) {
      const G = l[Q];
      D(G) && (s[Q] = G.bind(n));
    }
  if (i) {
    const Q = i.call(n, n);
    K(Q) && (e.data = /* @__PURE__ */ Sn(Q));
  }
  if (ts = !0, r)
    for (const Q in r) {
      const G = r[Q], it = D(G) ? G.bind(n, n) : D(G.get) ? G.get.bind(n, n) : ke, Xt = !D(G) && D(G.set) ? G.set.bind(n) : ke, rt = rs({
        get: it,
        set: Xt
      });
      Object.defineProperty(s, Q, {
        enumerable: !0,
        configurable: !0,
        get: () => rt.value,
        set: (Re) => rt.value = Re
      });
    }
  if (o)
    for (const Q in o)
      Zi(o[Q], s, n, Q);
  if (c) {
    const Q = D(c) ? c.call(n) : c;
    Reflect.ownKeys(Q).forEach((G) => {
      ml(G, Q[G]);
    });
  }
  u && Ds(u, e, "c");
  function le(Q, G) {
    F(G) ? G.forEach((it) => Q(it.bind(n))) : G && Q(G.bind(n));
  }
  if (le(Al, h), le(ys, y), le(Ml, T), le(Ol, R), le(Cl, A), le(Tl, S), le(Fl, ve), le(Rl, se), le(Il, he), le(Mn, H), le(Xi, O), le(Pl, N), F(U))
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
  z && e.render === ke && (e.render = z), Z != null && (e.inheritAttrs = Z), M && (e.components = M), X && (e.directives = X), N && Ji(e);
}
function Hl(e, t, n = ke) {
  F(e) && (e = ns(e));
  for (const s in e) {
    const i = e[s];
    let r;
    K(i) ? "default" in i ? r = sn(
      i.from || s,
      i.default,
      !0
    ) : r = sn(i.from || s) : r = sn(i), /* @__PURE__ */ de(r) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (l) => r.value = l
    }) : t[s] = r;
  }
}
function Ds(e, t, n) {
  Ae(
    F(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Zi(e, t, n, s) {
  let i = s.includes(".") ? ki(n, s) : () => n[s];
  if (ee(e)) {
    const r = t[e];
    D(r) && Nn(i, r);
  } else if (D(e))
    Nn(i, e.bind(n));
  else if (K(e))
    if (F(e))
      e.forEach((r) => Zi(r, t, n, s));
    else {
      const r = D(e.handler) ? e.handler.bind(n) : t[e.handler];
      D(r) && Nn(i, r, e);
    }
}
function Qi(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = r.get(t);
  let c;
  return o ? c = o : !i.length && !n && !s ? c = t : (c = {}, i.length && i.forEach(
    (d) => hn(c, d, l, !0)
  ), hn(c, t, l)), K(t) && r.set(t, c), c;
}
function hn(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && hn(e, r, n, !0), i && i.forEach(
    (l) => hn(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = Nl[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const Nl = {
  data: Hs,
  props: Ns,
  emits: Ns,
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
  watch: Vl,
  // provide / inject
  provide: Hs,
  inject: jl
};
function Hs(e, t) {
  return t ? e ? function() {
    return re(
      D(e) ? e.call(this, this) : e,
      D(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function jl(e, t) {
  return Pt(ns(e), ns(t));
}
function ns(e) {
  if (F(e)) {
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
function Ns(e, t) {
  return e ? F(e) && F(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : re(
    /* @__PURE__ */ Object.create(null),
    $s(e),
    $s(t ?? {})
  ) : t;
}
function Vl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = re(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = pe(e[s], t[s]);
  return n;
}
function er() {
  return {
    app: null,
    config: {
      isNativeTag: ai,
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
let Bl = 0;
function kl(e, t) {
  return function(s, i = null) {
    D(s) || (s = re({}, s)), i != null && !K(i) && (i = null);
    const r = er(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const d = r.app = {
      _uid: Bl++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: wo,
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
          const T = d._ceVNode || fe(s, i);
          return T.appContext = r, y === !0 ? y = "svg" : y === !1 && (y = void 0), e(T, u, y), c = !0, d._container = u, u.__vue_app__ = d, ws(T.component);
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
const Kl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Oe(t)}Modifiers`] || e[`${mt(t)}Modifiers`];
function Ul(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Y;
  let i = n;
  const r = t.startsWith("update:"), l = r && Kl(s, t.slice(7));
  l && (l.trim && (i = n.map((u) => ee(u) ? u.trim() : u)), l.number && (i = n.map(Or)));
  let o, c = s[o = Rn(t)] || // also try camelCase event handler (#2249)
  s[o = Rn(Oe(t))];
  !c && r && (c = s[o = Rn(mt(t))]), c && Ae(
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
const Wl = /* @__PURE__ */ new WeakMap();
function tr(e, t, n = !1) {
  const s = n ? Wl : t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let l = {}, o = !1;
  if (!D(e)) {
    const c = (d) => {
      const u = tr(d, t, !0);
      u && (o = !0, re(l, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !r && !o ? (K(e) && s.set(e, null), null) : (F(r) ? r.forEach((c) => l[c] = null) : re(l, r), K(e) && s.set(e, l), l);
}
function On(e, t) {
  return !e || !vn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), k(e, t[0].toLowerCase() + t.slice(1)) || k(e, mt(t)) || k(e, t));
}
function js(e) {
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
    setupState: T,
    ctx: R,
    inheritAttrs: A
  } = e, S = fn(e);
  let $, H;
  try {
    if (n.shapeFlag & 4) {
      const O = i || s, z = O;
      $ = je(
        d.call(
          z,
          O,
          u,
          h,
          T,
          y,
          R
        )
      ), H = o;
    } else {
      const O = t;
      $ = je(
        O.length > 1 ? O(
          h,
          { attrs: o, slots: l, emit: c }
        ) : O(
          h,
          null
        )
      ), H = t.props ? o : zl(o);
    }
  } catch (O) {
    gt.length = 0, Cn(O, e, 1), $ = fe(me);
  }
  let j = $;
  if (H && A !== !1) {
    const O = Object.keys(H), { shapeFlag: z } = j;
    O.length && z & 7 && (r && O.some(yn) && (H = ql(
      H,
      r
    )), j = st(j, H, !1, !0));
  }
  if (n.dirs && (j = st(j, null, !1, !0), j.dirs = j.dirs ? j.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const O = Tn(j.type) && un(j) || j;
    Kt(O, n.transition);
  }
  return $ = j, fn(S), $;
}
const zl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || vn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, ql = (e, t) => {
  const n = {};
  for (const s in e)
    (!yn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Gl(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: l, children: o, patchFlag: c } = t, d = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Vs(s, l, d) : !!l;
    if (c & 8) {
      const u = t.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        const y = u[h];
        if (nr(l, s, y) && !On(d, y))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Vs(s, l, d) : !0 : !!l;
  return !1;
}
function Vs(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (nr(t, e, r) && !On(n, r))
      return !0;
  }
  return !1;
}
function nr(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && K(s) && K(i) ? !us(s, i) : s !== i;
}
function Jl({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const sr = {}, ir = () => Object.create(sr), rr = (e) => Object.getPrototypeOf(e) === sr;
function Yl(e, t, n, s = !1) {
  const i = {}, r = ir();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), lr(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ sl(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Xl(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ B(i), [c] = e.propsOptions;
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
        if (On(e.emitsOptions, y))
          continue;
        const T = t[y];
        if (c)
          if (k(r, y))
            T !== r[y] && (r[y] = T, d = !0);
          else {
            const R = Oe(y);
            i[R] = ss(
              c,
              o,
              R,
              T,
              e,
              !1
            );
          }
        else
          T !== r[y] && (r[y] = T, d = !0);
      }
    }
  } else {
    lr(e, t, i, r) && (d = !0);
    let u;
    for (const h in o)
      (!t || // for camelCase
      !k(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = mt(h)) === h || !k(t, u))) && (c ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[u] !== void 0) && (i[h] = ss(
        c,
        o,
        h,
        void 0,
        e,
        !0
      )) : delete i[h]);
    if (r !== o)
      for (const h in r)
        (!t || !k(t, h)) && (delete r[h], d = !0);
  }
  d && Je(e.attrs, "set", "");
}
function lr(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (Rt(c))
        continue;
      const d = t[c];
      let u;
      i && k(i, u = Oe(c)) ? !r || !r.includes(u) ? n[u] = d : (o || (o = {}))[u] = d : On(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, l = !0);
    }
  if (r) {
    const c = /* @__PURE__ */ B(n), d = o || Y;
    for (let u = 0; u < r.length; u++) {
      const h = r[u];
      n[h] = ss(
        i,
        c,
        h,
        d[h],
        e,
        !k(d, h)
      );
    }
  }
  return l;
}
function ss(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = k(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && D(c)) {
        const { propsDefaults: d } = i;
        if (n in d)
          s = d[n];
        else {
          const u = Yt(i);
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
const Zl = /* @__PURE__ */ new WeakMap();
function or(e, t, n = !1) {
  const s = n ? Zl : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, l = {}, o = [];
  let c = !1;
  if (!D(e)) {
    const u = (h) => {
      c = !0;
      const [y, T] = or(h, t, !0);
      re(l, y), T && o.push(...T);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!r && !c)
    return K(e) && s.set(e, yt), yt;
  if (F(r))
    for (let u = 0; u < r.length; u++) {
      const h = Oe(r[u]);
      Bs(h) && (l[h] = Y);
    }
  else if (r)
    for (const u in r) {
      const h = Oe(u);
      if (Bs(h)) {
        const y = r[u], T = l[h] = F(y) || D(y) ? { type: y } : re({}, y), R = T.type;
        let A = !1, S = !0;
        if (F(R))
          for (let $ = 0; $ < R.length; ++$) {
            const H = R[$], j = D(H) && H.name;
            if (j === "Boolean") {
              A = !0;
              break;
            } else j === "String" && (S = !1);
          }
        else
          A = D(R) && R.name === "Boolean";
        T[
          0
          /* shouldCast */
        ] = A, T[
          1
          /* shouldCastTrue */
        ] = S, (A || k(T, "default")) && o.push(h);
      }
    }
  const d = [l, o];
  return K(e) && s.set(e, d), d;
}
function Bs(e) {
  return e[0] !== "$" && !Rt(e);
}
const _s = (e) => e === "_" || e === "_ctx" || e === "$stable", xs = (e) => F(e) ? e.map(je) : [je(e)], Ql = (e, t, n) => {
  if (t._n)
    return t;
  const s = Zn((...i) => xs(t(...i)), n);
  return s._c = !1, s;
}, cr = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (_s(i)) continue;
    const r = e[i];
    if (D(r))
      t[i] = Ql(i, r, s);
    else if (r != null) {
      const l = xs(r);
      t[i] = () => l;
    }
  }
}, fr = (e, t) => {
  const n = xs(t);
  e.slots.default = () => n;
}, ur = (e, t, n) => {
  for (const s in t)
    (n || !_s(s)) && (e[s] = t[s]);
}, eo = (e, t, n) => {
  const s = e.slots = ir();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (ur(s, t, n), n && bi(s, "_", i, !0)) : cr(t, s);
  } else t && fr(e, t);
}, to = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = Y;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : ur(i, t, n) : (r = !t.$stable, cr(t, i)), l = t;
  } else t && (fr(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !_s(o) && l[o] == null && delete i[o];
}, _e = lo;
function no(e) {
  return so(e);
}
function so(e, t) {
  const n = xn();
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
    setScopeId: T = ke,
    insertStaticContent: R
  } = e, A = (f, a, p, v = null, b = null, g = null, C = void 0, w = null, x = !!a.dynamicChildren) => {
    if (f === a)
      return;
    f && !dt(f, a) && (v = Zt(f), Re(f, b, g, !0), f = null), a.patchFlag === -2 && (x = !1, a.dynamicChildren = null);
    const { type: m, ref: I, shapeFlag: E } = a;
    switch (m) {
      case Pn:
        S(f, a, p, v);
        break;
      case me:
        $(f, a, p, v);
        break;
      case rn:
        f == null && H(a, p, v, C);
        break;
      case xe:
        M(
          f,
          a,
          p,
          v,
          b,
          g,
          C,
          w,
          x
        );
        break;
      default:
        E & 1 ? z(
          f,
          a,
          p,
          v,
          b,
          g,
          C,
          w,
          x
        ) : E & 6 ? X(
          f,
          a,
          p,
          v,
          b,
          g,
          C,
          w,
          x
        ) : (E & 64 || E & 128) && m.process(
          f,
          a,
          p,
          v,
          b,
          g,
          C,
          w,
          x,
          Tt
        );
    }
    I != null && b ? $t(I, f && f.ref, g, a || f, !a) : I == null && f && f.ref != null && $t(f.ref, null, g, f, !0);
  }, S = (f, a, p, v) => {
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
  }, $ = (f, a, p, v) => {
    f == null ? s(
      a.el = c(a.children || ""),
      p,
      v
    ) : a.el = f.el;
  }, H = (f, a, p, v) => {
    [f.el, f.anchor] = R(
      f.children,
      a,
      p,
      v,
      f.el,
      f.anchor
    );
  }, j = ({ el: f, anchor: a }, p, v) => {
    let b;
    for (; f && f !== a; )
      b = y(f), s(f, p, v), f = b;
    s(a, p, v);
  }, O = ({ el: f, anchor: a }) => {
    let p;
    for (; f && f !== a; )
      p = y(f), i(f), f = p;
    i(a);
  }, z = (f, a, p, v, b, g, C, w, x) => {
    if (a.type === "svg" ? C = "svg" : a.type === "math" && (C = "mathml"), f == null)
      se(
        a,
        p,
        v,
        b,
        g,
        C,
        w,
        x
      );
    else {
      const m = f.el && f.el._isVueCE ? f.el : null;
      try {
        m && m._beginPatch(), N(
          f,
          a,
          b,
          g,
          C,
          w,
          x
        );
      } finally {
        m && m._endPatch();
      }
    }
  }, se = (f, a, p, v, b, g, C, w) => {
    let x, m;
    const { props: I, shapeFlag: E, transition: P, dirs: L } = f;
    if (x = f.el = l(
      f.type,
      g,
      I && I.is,
      I
    ), E & 8 ? u(x, f.children) : E & 16 && ve(
      f.children,
      x,
      null,
      v,
      b,
      Bn(f, g),
      C,
      w
    ), L && lt(f, null, v, "created"), he(x, f, f.scopeId, C, v), I) {
      for (const q in I)
        q !== "value" && !Rt(q) && r(x, q, null, I[q], g, v);
      "value" in I && r(x, "value", null, I.value, g), (m = I.onVnodeBeforeMount) && De(m, v, f);
    }
    L && lt(f, null, v, "beforeMount");
    const V = io(b, P);
    V && P.beforeEnter(x), s(x, a, p), ((m = I && I.onVnodeMounted) || V || L) && _e(() => {
      try {
        m && De(m, v, f), V && P.enter(x), L && lt(f, null, v, "mounted");
      } finally {
      }
    }, b);
  }, he = (f, a, p, v, b) => {
    if (p && T(f, p), v)
      for (let g = 0; g < v.length; g++)
        T(f, v[g]);
    if (b) {
      let g = b.subTree;
      if (a === g || pr(g.type) && (g.ssContent === a || g.ssFallback === a)) {
        const C = b.vnode;
        he(
          f,
          C,
          C.scopeId,
          C.slotScopeIds,
          b.parent
        );
      }
    }
  }, ve = (f, a, p, v, b, g, C, w, x = 0) => {
    for (let m = x; m < f.length; m++) {
      const I = f[m] = w ? Ge(f[m]) : je(f[m]);
      A(
        null,
        I,
        a,
        p,
        v,
        b,
        g,
        C,
        w
      );
    }
  }, N = (f, a, p, v, b, g, C) => {
    const w = a.el = f.el;
    let { patchFlag: x, dynamicChildren: m, dirs: I } = a;
    x |= f.patchFlag & 16;
    const E = f.props || Y, P = a.props || Y;
    let L;
    if (p && ot(p, !1), (L = P.onVnodeBeforeUpdate) && De(L, p, a, f), I && lt(a, f, p, "beforeUpdate"), p && ot(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    m && (!f.dynamicChildren || f.dynamicChildren.length !== m.length) && (x = 0, C = !1, m = null), (E.innerHTML && P.innerHTML == null || E.textContent && P.textContent == null) && u(w, ""), m ? U(
      f.dynamicChildren,
      m,
      w,
      p,
      v,
      Bn(a, b),
      g
    ) : C || G(
      f,
      a,
      w,
      null,
      p,
      v,
      Bn(a, b),
      g,
      !1
    ), x > 0) {
      if (x & 16)
        Z(w, E, P, p, b);
      else if (x & 2 && E.class !== P.class && r(w, "class", null, P.class, b), x & 4 && r(w, "style", E.style, P.style, b), x & 8) {
        const V = a.dynamicProps;
        for (let q = 0; q < V.length; q++) {
          const W = V[q], ie = E[W], oe = P[W];
          (oe !== ie || W === "value") && r(w, W, ie, oe, b, p);
        }
      }
      x & 1 && f.children !== a.children && u(w, a.children);
    } else !C && m == null && Z(w, E, P, p, b);
    ((L = P.onVnodeUpdated) || I) && _e(() => {
      L && De(L, p, a, f), I && lt(a, f, p, "updated");
    }, v);
  }, U = (f, a, p, v, b, g, C) => {
    for (let w = 0; w < a.length; w++) {
      const x = f[w], m = a[w], I = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        x.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (x.type === xe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !dt(x, m) || // - In the case of a component, it could contain anything.
        x.shapeFlag & 198) ? h(x.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      A(
        x,
        m,
        I,
        null,
        v,
        b,
        g,
        C,
        !0
      );
    }
  }, Z = (f, a, p, v, b) => {
    if (a !== p) {
      if (a !== Y)
        for (const g in a)
          !Rt(g) && !(g in p) && r(
            f,
            g,
            a[g],
            null,
            b,
            v
          );
      for (const g in p) {
        if (Rt(g)) continue;
        const C = p[g], w = a[g];
        C !== w && g !== "value" && r(f, g, w, C, b, v);
      }
      "value" in p && r(f, "value", a.value, p.value, b);
    }
  }, M = (f, a, p, v, b, g, C, w, x) => {
    const m = a.el = f ? f.el : o(""), I = a.anchor = f ? f.anchor : o("");
    let { patchFlag: E, dynamicChildren: P, slotScopeIds: L } = a;
    L && (w = w ? w.concat(L) : L), f == null ? (s(m, p, v), s(I, p, v), ve(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      a.children || [],
      p,
      I,
      b,
      g,
      C,
      w,
      x
    )) : E > 0 && E & 64 && P && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren && f.dynamicChildren.length === P.length ? (U(
      f.dynamicChildren,
      P,
      p,
      b,
      g,
      C,
      w
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (a.key != null || b && a === b.subTree) && ar(
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
      C,
      w,
      x
    );
  }, X = (f, a, p, v, b, g, C, w, x) => {
    a.slotScopeIds = w, f == null ? a.shapeFlag & 512 ? b.ctx.activate(
      a,
      p,
      v,
      C,
      x
    ) : ue(
      a,
      p,
      v,
      b,
      g,
      C,
      x
    ) : Ue(f, a, x);
  }, ue = (f, a, p, v, b, g, C) => {
    const w = f.component = go(
      f,
      v,
      b
    );
    if (En(f) && (w.ctx.renderer = Tt), mo(w, !1, C), w.asyncDep) {
      if (b && b.registerDep(w, le, C), !f.el) {
        const x = w.subTree = fe(me);
        $(null, x, a, p), f.placeholder = x.el;
      }
    } else
      le(
        w,
        f,
        a,
        p,
        b,
        g,
        C
      );
  }, Ue = (f, a, p) => {
    const v = a.component = f.component;
    if (Gl(f, a, p))
      if (v.asyncDep && !v.asyncResolved) {
        Q(v, a, p);
        return;
      } else
        v.next = a, v.update();
    else
      a.el = f.el, v.vnode = a;
  }, le = (f, a, p, v, b, g, C) => {
    const w = () => {
      if (f.isMounted) {
        let { next: E, bu: P, u: L, parent: V, vnode: q } = f;
        {
          const Le = dr(f);
          if (Le) {
            E && (E.el = q.el, Q(f, E, C)), Le.asyncDep.then(() => {
              _e(() => {
                f.isUnmounted || m();
              }, b);
            });
            return;
          }
        }
        let W = E, ie;
        ot(f, !1), E ? (E.el = q.el, Q(f, E, C)) : E = q, P && Fn(P), (ie = E.props && E.props.onVnodeBeforeUpdate) && De(ie, V, E, q), ot(f, !0);
        const oe = js(f), Fe = f.subTree;
        f.subTree = oe, A(
          Fe,
          oe,
          // parent may have changed if it's in a teleport
          h(Fe.el),
          // anchor may have changed if it's in a fragment
          Zt(Fe),
          f,
          b,
          g
        ), E.el = oe.el, W === null && Jl(f, oe.el), L && _e(L, b), (ie = E.props && E.props.onVnodeUpdated) && _e(
          () => De(ie, V, E, q),
          b
        );
      } else {
        let E;
        const { el: P, props: L } = a, { bm: V, m: q, parent: W, root: ie, type: oe } = f, Fe = Dt(a);
        ot(f, !1), V && Fn(V), !Fe && (E = L && L.onVnodeBeforeMount) && De(E, W, a), ot(f, !0);
        {
          ie.ce && ie.ce._hasShadowRoot() && ie.ce._injectChildStyle(
            oe,
            f.parent ? f.parent.type : void 0
          );
          const Le = f.subTree = js(f);
          A(
            null,
            Le,
            p,
            v,
            f,
            b,
            g
          ), a.el = Le.el;
        }
        if (q && _e(q, b), !Fe && (E = L && L.onVnodeMounted)) {
          const Le = a;
          _e(
            () => De(E, W, Le),
            b
          );
        }
        (a.shapeFlag & 256 || W && Dt(W.vnode) && W.vnode.shapeFlag & 256) && f.a && _e(f.a, b), f.isMounted = !0, a = p = v = null;
      }
    };
    f.scope.on();
    const x = f.effect = new xi(w);
    f.scope.off();
    const m = f.update = x.run.bind(x), I = f.job = x.runIfDirty.bind(x);
    I.i = f, I.id = f.uid, x.scheduler = () => vs(I), ot(f, !0), m();
  }, Q = (f, a, p) => {
    a.component = f;
    const v = f.vnode.props;
    f.vnode = a, f.next = null, Xl(f, a.props, v, p), to(f, a.children, p), Ye(), Rs(f), Xe();
  }, G = (f, a, p, v, b, g, C, w, x = !1) => {
    const m = f && f.children, I = f ? f.shapeFlag : 0, E = a.children, { patchFlag: P, shapeFlag: L } = a;
    if (P > 0) {
      if (P & 128) {
        Xt(
          m,
          E,
          p,
          v,
          b,
          g,
          C,
          w,
          x
        );
        return;
      } else if (P & 256) {
        it(
          m,
          E,
          p,
          v,
          b,
          g,
          C,
          w,
          x
        );
        return;
      }
    }
    L & 8 ? (I & 16 && Ct(m, b, g), E !== m && u(p, E)) : I & 16 ? L & 16 ? Xt(
      m,
      E,
      p,
      v,
      b,
      g,
      C,
      w,
      x
    ) : Ct(m, b, g, !0) : (I & 8 && u(p, ""), L & 16 && ve(
      E,
      p,
      v,
      b,
      g,
      C,
      w,
      x
    ));
  }, it = (f, a, p, v, b, g, C, w, x) => {
    f = f || yt, a = a || yt;
    const m = f.length, I = a.length, E = Math.min(m, I);
    let P;
    for (P = 0; P < E; P++) {
      const L = a[P] = x ? Ge(a[P]) : je(a[P]);
      A(
        f[P],
        L,
        p,
        null,
        b,
        g,
        C,
        w,
        x
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
      C,
      w,
      x,
      E
    );
  }, Xt = (f, a, p, v, b, g, C, w, x) => {
    let m = 0;
    const I = a.length;
    let E = f.length - 1, P = I - 1;
    for (; m <= E && m <= P; ) {
      const L = f[m], V = a[m] = x ? Ge(a[m]) : je(a[m]);
      if (dt(L, V))
        A(
          L,
          V,
          p,
          null,
          b,
          g,
          C,
          w,
          x
        );
      else
        break;
      m++;
    }
    for (; m <= E && m <= P; ) {
      const L = f[E], V = a[P] = x ? Ge(a[P]) : je(a[P]);
      if (dt(L, V))
        A(
          L,
          V,
          p,
          null,
          b,
          g,
          C,
          w,
          x
        );
      else
        break;
      E--, P--;
    }
    if (m > E) {
      if (m <= P) {
        const L = P + 1, V = L < I ? a[L].el : v;
        for (; m <= P; )
          A(
            null,
            a[m] = x ? Ge(a[m]) : je(a[m]),
            p,
            V,
            b,
            g,
            C,
            w,
            x
          ), m++;
      }
    } else if (m > P)
      for (; m <= E; )
        Re(f[m], b, g, !0), m++;
    else {
      const L = m, V = m, q = /* @__PURE__ */ new Map();
      for (m = V; m <= P; m++) {
        const we = a[m] = x ? Ge(a[m]) : je(a[m]);
        we.key != null && q.set(we.key, m);
      }
      let W, ie = 0;
      const oe = P - V + 1;
      let Fe = !1, Le = 0;
      const Et = new Array(oe);
      for (m = 0; m < oe; m++) Et[m] = 0;
      for (m = L; m <= E; m++) {
        const we = f[m];
        if (ie >= oe) {
          Re(we, b, g, !0);
          continue;
        }
        let $e;
        if (we.key != null)
          $e = q.get(we.key);
        else
          for (W = V; W <= P; W++)
            if (Et[W - V] === 0 && dt(we, a[W])) {
              $e = W;
              break;
            }
        $e === void 0 ? Re(we, b, g, !0) : (Et[$e - V] = m + 1, $e >= Le ? Le = $e : Fe = !0, A(
          we,
          a[$e],
          p,
          null,
          b,
          g,
          C,
          w,
          x
        ), ie++);
      }
      const Ts = Fe ? ro(Et) : yt;
      for (W = Ts.length - 1, m = oe - 1; m >= 0; m--) {
        const we = V + m, $e = a[we], Es = a[we + 1], As = we + 1 < I ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Es.el || hr(Es)
        ) : v;
        Et[m] === 0 ? A(
          null,
          $e,
          p,
          As,
          b,
          g,
          C,
          w,
          x
        ) : Fe && (W < 0 || m !== Ts[W] ? rt($e, p, As, 2) : W--);
      }
    }
  }, rt = (f, a, p, v, b = null) => {
    const { el: g, type: C, transition: w, children: x, shapeFlag: m } = f;
    if (m & 6) {
      rt(f.component.subTree, a, p, v);
      return;
    }
    if (m & 128) {
      f.suspense.move(a, p, v);
      return;
    }
    if (m & 64) {
      C.move(f, a, p, Tt);
      return;
    }
    if (C === xe) {
      s(g, a, p);
      for (let E = 0; E < x.length; E++)
        rt(x[E], a, p, v);
      s(f.anchor, a, p);
      return;
    }
    if (C === rn) {
      j(f, a, p);
      return;
    }
    if (v !== 2 && m & 1 && w)
      if (v === 0)
        w.persisted && !g[Te] ? s(g, a, p) : (w.beforeEnter(g), s(g, a, p), _e(() => w.enter(g), b));
      else {
        const { leave: E, delayLeave: P, afterLeave: L } = w, V = () => {
          f.ctx.isUnmounted ? i(g) : s(g, a, p);
        }, q = () => {
          const W = g._isLeaving || !!g[Te];
          g._isLeaving && g[Te](
            !0
            /* cancelled */
          ), w.persisted && !W ? V() : E(g, () => {
            V(), L && L();
          });
        };
        P ? P(g, V, q) : q();
      }
    else
      s(g, a, p);
  }, Re = (f, a, p, v = !1, b = !1) => {
    const {
      type: g,
      props: C,
      ref: w,
      children: x,
      dynamicChildren: m,
      shapeFlag: I,
      patchFlag: E,
      dirs: P,
      cacheIndex: L,
      memo: V
    } = f;
    if (E === -2 && (b = !1), w != null && (Ye(), $t(w, null, p, f, !0), Xe()), L != null && (a.renderCache[L] = void 0), I & 256) {
      a.ctx.deactivate(f);
      return;
    }
    const q = I & 1 && P, W = !Dt(f);
    let ie;
    if (W && (ie = C && C.onVnodeBeforeUnmount) && De(ie, a, f), I & 6)
      Cr(f.component, p, v);
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
      ) : (g === xe && E & 384 || !b && I & 16) && Ct(x, a, p), v && Ss(f);
    }
    const oe = V != null && L == null;
    (W && (ie = C && C.onVnodeUnmounted) || q || oe) && _e(() => {
      ie && De(ie, a, f), q && lt(f, null, a, "unmounted"), oe && (f.el = null);
    }, p);
  }, Ss = (f) => {
    const { type: a, el: p, anchor: v, transition: b } = f;
    if (a === xe) {
      Sr(p, v);
      return;
    }
    if (a === rn) {
      O(f);
      return;
    }
    const g = () => {
      i(p), b && !b.persisted && b.afterLeave && b.afterLeave();
    };
    if (f.shapeFlag & 1 && b && !b.persisted) {
      const { leave: C, delayLeave: w } = b, x = () => C(p, g);
      w ? w(f.el, g, x) : x();
    } else
      g();
  }, Sr = (f, a) => {
    let p;
    for (; f !== a; )
      p = y(f), i(f), f = p;
    i(a);
  }, Cr = (f, a, p) => {
    const { bum: v, scope: b, job: g, subTree: C, um: w, m: x, a: m } = f;
    ks(x), ks(m), v && Fn(v), b.stop(), g && (g.flags |= 8, Re(C, f, a, p)), w && _e(w, a), _e(() => {
      f.isUnmounted = !0;
    }, a);
  }, Ct = (f, a, p, v = !1, b = !1, g = 0) => {
    for (let C = g; C < f.length; C++)
      Re(f[C], a, p, v, b);
  }, Zt = (f) => {
    if (f.shapeFlag & 6)
      return Zt(f.component.subTree);
    if (f.shapeFlag & 128)
      return f.suspense.next();
    const a = y(f.anchor || f.el), p = a && a[_l];
    return p ? y(p) : a;
  };
  let In = !1;
  const Cs = (f, a, p) => {
    let v;
    f == null ? a._vnode && (Re(a._vnode, null, null, !0), v = a._vnode.component) : A(
      a._vnode || null,
      f,
      a,
      null,
      null,
      null,
      p
    ), a._vnode = f, In || (In = !0, Rs(v), Ni(), In = !1);
  }, Tt = {
    p: A,
    um: Re,
    m: rt,
    r: Ss,
    mt: ue,
    mc: ve,
    pc: G,
    pbc: U,
    n: Zt,
    o: e
  };
  return {
    render: Cs,
    hydrate: void 0,
    createApp: kl(Cs)
  };
}
function Bn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ot({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function io(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ar(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (F(s) && F(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = Ge(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && ar(l, o)), o.type === Pn && (o.patchFlag === -1 && (o = i[r] = Ge(o)), o.el = l.el), o.type === me && !o.el && (o.el = l.el);
    }
}
function ro(e) {
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
function dr(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : dr(t);
}
function ks(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function hr(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? hr(t.subTree) : null;
}
const pr = (e) => e.__isSuspense;
function lo(e, t) {
  t && t.pendingBranch ? F(e) ? t.effects.push(...e) : t.effects.push(e) : gl(e);
}
const xe = /* @__PURE__ */ Symbol.for("v-fgt"), Pn = /* @__PURE__ */ Symbol.for("v-txt"), me = /* @__PURE__ */ Symbol.for("v-cmt"), rn = /* @__PURE__ */ Symbol.for("v-stc"), gt = [];
let Se = null;
function te(e = !1) {
  gt.push(Se = e ? null : []);
}
function gr() {
  gt.pop(), Se = gt[gt.length - 1] || null;
}
let Ut = 1;
function pn(e, t = !1) {
  Ut += e, e < 0 && Se && t && (Se.hasOnce = !0);
}
function mr(e) {
  return e.dynamicChildren = Ut > 0 ? Se || yt : null, gr(), Ut > 0 && Se && Se.push(e), e;
}
function ne(e, t, n, s, i, r) {
  return mr(
    _(
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
function oo(e, t, n, s, i) {
  return mr(
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
function gn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function dt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const br = ({ key: e }) => e ?? null, ln = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ee(e) || /* @__PURE__ */ de(e) || D(e) ? { i: Be, r: e, k: t, f: !!n } : e : null);
function _(e, t = null, n = null, s = 0, i = null, r = e === xe ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && br(t),
    ref: t && ln(t),
    scopeId: Vi,
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
    ctx: Be
  };
  return o ? (mn(c, n), r & 128 && e.normalize(c)) : n && (c.shapeFlag |= ee(n) ? 8 : 16), Ut > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Se && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && Se.push(c), c;
}
const fe = co;
function co(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Ll) && (e = me), gn(e)) {
    const o = st(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && mn(o, n), Ut > 0 && !r && Se && (o.shapeFlag & 6 ? Se[Se.indexOf(e)] = o : Se.push(o)), o.patchFlag = -2, o;
  }
  if (_o(e) && (e = e.__vccOpts), t) {
    t = fo(t);
    let { class: o, style: c } = t;
    o && !ee(o) && (t.class = jt(o)), K(c) && (/* @__PURE__ */ bs(c) && !F(c) && (c = re({}, c)), t.style = Nt(c));
  }
  const l = ee(e) ? 1 : pr(e) ? 128 : Tn(e) ? 64 : K(e) ? 4 : D(e) ? 2 : 0;
  return _(
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
function fo(e) {
  return e ? /* @__PURE__ */ bs(e) || rr(e) ? re({}, e) : e : null;
}
function st(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: l, children: o, transition: c } = e, d = t ? ao(i || {}, t) : i, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && br(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? F(r) ? r.concat(ln(t)) : [r, ln(t)] : ln(t)
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
  return c && s && Kt(
    u,
    c.clone(u)
  ), u;
}
function is(e = " ", t = 0) {
  return fe(Pn, null, e, t);
}
function nn(e, t) {
  const n = fe(rn, null, e);
  return n.staticCount = t, n;
}
function uo(e = "", t = !1) {
  return t ? (te(), oo(me, null, e)) : fe(me, null, e);
}
function je(e) {
  return e == null || typeof e == "boolean" ? fe(me) : F(e) ? fe(
    xe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : gn(e) ? Ge(e) : fe(Pn, null, String(e));
}
function Ge(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : st(e);
}
function mn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (F(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), mn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !rr(t) ? t._ctx = Be : i === 3 && Be && (Be.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (D(t)) {
    if (s & 65) {
      mn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Be }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [is(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function ao(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = jt([t.class, s.class]));
      else if (i === "style")
        t.style = Nt([t.style, s.style]);
      else if (vn(i)) {
        const r = t[i], l = s[i];
        l && r !== l && !(F(r) && r.includes(l)) ? t[i] = r ? [].concat(r, l) : l : l == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !yn(i) && (t[i] = l);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function De(e, t, n, s = null) {
  Ae(e, t, 7, [
    n,
    s
  ]);
}
const ho = er();
let po = 0;
function go(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || ho, r = {
    uid: po++,
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
    scope: new Nr(
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
    propsOptions: or(s, i),
    emitsOptions: tr(s, i),
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
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = Ul.bind(null, r), e.ce && e.ce(r), r;
}
let be = null;
const vr = () => be || Be;
let bn, Wt;
{
  const e = xn(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((l) => l(r)) : i[0](r);
    };
  };
  bn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => be = n
  ), Wt = t(
    "__VUE_SSR_SETTERS__",
    (n) => zt = n
  );
}
const Yt = (e) => {
  const t = be;
  return bn(e), e.scope.on(), () => {
    e.scope.off(), bn(t);
  };
}, Ks = () => {
  be && be.scope.off(), bn(null);
};
function yr(e) {
  return e.vnode.shapeFlag & 4;
}
let zt = !1;
function mo(e, t = !1, n = !1) {
  t && Wt(t);
  const { props: s, children: i } = e.vnode, r = yr(e);
  Yl(e, s, r, t), eo(e, i, n || t);
  const l = r ? bo(e, t) : void 0;
  return t && Wt(!1), l;
}
function bo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, $l);
  const { setup: s } = n;
  if (s) {
    Ye();
    const i = e.setupContext = s.length > 1 ? yo(e) : null, r = Yt(e), l = Jt(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = hi(l);
    if (Xe(), r(), (o || e.sp) && !Dt(e) && Ji(e), o) {
      if (l.then(Ks, Ks), t)
        return l.then((c) => {
          Wt(!0);
          try {
            Us(e, c, t);
          } finally {
            Wt(!1);
          }
        }).catch((c) => {
          Cn(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Us(e, l);
  } else
    _r(e);
}
function Us(e, t, n) {
  D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : K(t) && (e.setupState = $i(t)), _r(e);
}
function _r(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || ke);
  {
    const i = Yt(e);
    Ye();
    try {
      Dl(e);
    } finally {
      Xe(), i();
    }
  }
}
const vo = {
  get(e, t) {
    return ae(e, "get", ""), e[t];
  }
};
function yo(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, vo),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function ws(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy($i(il(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Ht)
        return Ht[n](e);
    },
    has(t, n) {
      return n in t || n in Ht;
    }
  })) : e.proxy;
}
function _o(e) {
  return D(e) && "__vccOpts" in e;
}
const rs = (e, t) => /* @__PURE__ */ fl(e, t, zt);
function xo(e, t, n) {
  try {
    pn(-1);
    const s = arguments.length;
    return s === 2 ? K(t) && !F(t) ? gn(t) ? fe(e, null, [t]) : fe(e, t) : fe(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && gn(n) && (n = [n]), fe(e, t, n));
  } finally {
    pn(1);
  }
}
const wo = "3.5.41";
/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ls;
const Ws = typeof window < "u" && window.trustedTypes;
if (Ws)
  try {
    ls = /* @__PURE__ */ Ws.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const xr = ls ? (e) => ls.createHTML(e) : (e) => e, So = "http://www.w3.org/2000/svg", Co = "http://www.w3.org/1998/Math/MathML", qe = typeof document < "u" ? document : null, zs = qe && /* @__PURE__ */ qe.createElement("template"), To = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? qe.createElementNS(So, e) : t === "mathml" ? qe.createElementNS(Co, e) : n ? qe.createElement(e, { is: n }) : qe.createElement(e);
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
      zs.innerHTML = xr(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = zs.content;
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
}, et = "transition", Ot = "animation", qt = /* @__PURE__ */ Symbol("_vtc"), wr = {
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
}, Eo = /* @__PURE__ */ re(
  {},
  Ki,
  wr
), Ao = (e) => (e.displayName = "Transition", e.props = Eo, e), qs = /* @__PURE__ */ Ao(
  (e, { slots: t }) => xo(Sl, Mo(e), t)
), ct = (e, t = []) => {
  F(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Gs = (e) => e ? F(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Mo(e) {
  const t = {};
  for (const M in e)
    M in wr || (t[M] = e[M]);
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
    leaveToClass: T = `${n}-leave-to`
  } = e, R = Oo(i), A = R && R[0], S = R && R[1], {
    onBeforeEnter: $,
    onEnter: H,
    onEnterCancelled: j,
    onLeave: O,
    onLeaveCancelled: z,
    onBeforeAppear: se = $,
    onAppear: he = H,
    onAppearCancelled: ve = j
  } = t, N = (M, X, ue, Ue) => {
    M._enterCancelled = Ue, ft(M, X ? u : o), ft(M, X ? d : l), ue && ue();
  }, U = (M, X) => {
    M._isLeaving = !1, ft(M, h), ft(M, T), ft(M, y), X && X();
  }, Z = (M) => (X, ue) => {
    const Ue = M ? he : H, le = () => N(X, M, ue);
    ct(Ue, [X, le]), Js(() => {
      ft(X, M ? c : r), ze(X, M ? u : o), Gs(Ue) || Ys(X, s, A, le);
    });
  };
  return re(t, {
    onBeforeEnter(M) {
      ct($, [M]), ze(M, r), ze(M, l);
    },
    onBeforeAppear(M) {
      ct(se, [M]), ze(M, c), ze(M, d);
    },
    onEnter: Z(!1),
    onAppear: Z(!0),
    onLeave(M, X) {
      M._isLeaving = !0;
      const ue = () => U(M, X);
      ze(M, h), M._enterCancelled ? (ze(M, y), Qs(M)) : (Qs(M), ze(M, y)), Js(() => {
        M._isLeaving && (ft(M, h), ze(M, T), Gs(O) || Ys(M, s, S, ue));
      }), ct(O, [M, ue]);
    },
    onEnterCancelled(M) {
      N(M, !1, void 0, !0), ct(j, [M]);
    },
    onAppearCancelled(M) {
      N(M, !0, void 0, !0), ct(ve, [M]);
    },
    onLeaveCancelled(M) {
      U(M), ct(z, [M]);
    }
  });
}
function Oo(e) {
  if (e == null)
    return null;
  if (K(e))
    return [kn(e.enter), kn(e.leave)];
  {
    const t = kn(e);
    return [t, t];
  }
}
function kn(e) {
  return Pr(e);
}
function ze(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[qt] || (e[qt] = /* @__PURE__ */ new Set())).add(t);
}
function ft(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[qt];
  n && (n.delete(t), n.size || (e[qt] = void 0));
}
function Js(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Po = 0;
function Ys(e, t, n, s) {
  const i = e._endId = ++Po, r = () => {
    i === e._endId && s();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: l, timeout: o, propCount: c } = Io(e, t);
  if (!l)
    return s();
  const d = l + "end";
  let u = 0;
  const h = () => {
    e.removeEventListener(d, y), r();
  }, y = (T) => {
    T.target === e && ++u >= c && h();
  };
  setTimeout(() => {
    u < c && h();
  }, o + 1), e.addEventListener(d, y);
}
function Io(e, t) {
  const n = window.getComputedStyle(e), s = (R) => (n[R] || "").split(", "), i = s(`${et}Delay`), r = s(`${et}Duration`), l = Xs(i, r), o = s(`${Ot}Delay`), c = s(`${Ot}Duration`), d = Xs(o, c);
  let u = null, h = 0, y = 0;
  t === et ? l > 0 && (u = et, h = l, y = r.length) : t === Ot ? d > 0 && (u = Ot, h = d, y = c.length) : (h = Math.max(l, d), u = h > 0 ? l > d ? et : Ot : null, y = u ? u === et ? r.length : c.length : 0);
  const T = u === et && /\b(?:transform|all)(?:,|$)/.test(
    s(`${et}Property`).toString()
  );
  return {
    type: u,
    timeout: h,
    propCount: y,
    hasTransform: T
  };
}
function Xs(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => Zs(n) + Zs(e[s])));
}
function Zs(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Qs(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Ro(e, t, n) {
  const s = e[qt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ei = /* @__PURE__ */ Symbol("_vod"), Fo = /* @__PURE__ */ Symbol("_vsh"), Lo = /* @__PURE__ */ Symbol(""), $o = /(?:^|;)\s*display\s*:/;
function Do(e, t, n) {
  const s = e.style, i = ee(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (ee(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && It(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && It(s, l, "");
    for (const l in n) {
      l === "display" && (r = !0);
      const o = n[l];
      o != null ? No(
        e,
        l,
        !ee(t) && t ? t[l] : void 0,
        o
      ) || It(s, l, o) : It(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[Lo];
      l && (n += ";" + l), s.cssText = n, r = $o.test(n);
    }
  } else t && e.removeAttribute("style");
  ei in e && (e[ei] = r ? s.display : "", e[Fo] && (s.display = "none"));
}
const ti = /\s*!important$/;
function It(e, t, n) {
  if (F(n))
    n.forEach((s) => It(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Ho(e, t);
    ti.test(n) ? e.setProperty(
      mt(s),
      n.replace(ti, ""),
      "important"
    ) : e[s] = n;
  }
}
const ni = ["Webkit", "Moz", "ms"], Kn = {};
function Ho(e, t) {
  const n = Kn[t];
  if (n)
    return n;
  let s = Oe(t);
  if (s !== "filter" && s in e)
    return Kn[t] = s;
  s = mi(s);
  for (let i = 0; i < ni.length; i++) {
    const r = ni[i] + s;
    if (r in e)
      return Kn[t] = r;
  }
  return t;
}
function No(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ee(s) && n === s;
}
const si = "http://www.w3.org/1999/xlink";
function ii(e, t, n, s, i, r = Dr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(si, t.slice(6, t.length)) : e.setAttributeNS(si, t, n) : n == null || r && !vi(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : Ke(n) ? String(n) : n
  );
}
function ri(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? xr(n) : n);
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
    o === "boolean" ? n = vi(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function jo(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Vo(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const li = /* @__PURE__ */ Symbol("_vei");
function Bo(e, t, n, s, i = null) {
  const r = e[li] || (e[li] = {}), l = r[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = Uo(t);
    if (s) {
      const d = r[t] = qo(
        s,
        i
      );
      jo(e, o, d, c);
    } else l && (Vo(e, o, l, c), r[t] = void 0);
  }
}
const ko = /(Once|Passive|Capture)$/, Ko = /^on:?(?:Once|Passive|Capture)$/;
function Uo(e) {
  let t, n;
  for (; (n = e.match(ko)) && !Ko.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : mt(e.slice(2)), t];
}
let Un = 0;
const Wo = /* @__PURE__ */ Promise.resolve(), zo = () => Un || (Wo.then(() => Un = 0), Un = Date.now());
function qo(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (F(i)) {
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
  return n.value = e, n.attached = zo(), n;
}
const oi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Go = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? Ro(e, s, l) : t === "style" ? Do(e, n, s) : vn(t) ? yn(t) || Bo(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Jo(e, t, s, l)) ? (ri(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ii(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Yo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ee(s))) ? ri(e, Oe(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), ii(e, t, s, l));
};
function Jo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && oi(t) && D(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return oi(t) && ee(n) ? !1 : t in e;
}
function Yo(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Oe(t);
  return Array.isArray(n) ? n.some((i) => Oe(i) === s) : Object.keys(n).some((i) => Oe(i) === s);
}
const Xo = /* @__PURE__ */ re({ patchProp: Go }, To);
let ci;
function Zo() {
  return ci || (ci = no(Xo));
}
const Qo = ((...e) => {
  const t = Zo().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = tc(s);
    if (!i) return;
    const r = t._component;
    !D(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, ec(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function ec(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function tc(e) {
  return ee(e) ? document.querySelector(e) : e;
}
const nc = ["aria-label"], sc = { key: 0 }, ic = { class: "muted-people" }, rc = ["x"], lc = ["x"], oc = { key: 1 }, cc = { key: 2 }, fc = { key: 3 }, uc = { key: 4 }, ac = { key: 5 }, dc = { key: 6 }, hc = { key: 7 }, pc = /* @__PURE__ */ Gi({
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
      e.scene === "crowd" ? (te(), ne("g", sc, [
        _("g", ic, [
          (te(), ne(xe, null, dn([16, 42, 68, 94, 120, 140], (s) => _("rect", {
            key: s,
            x: s,
            y: "42",
            width: "8",
            height: "8"
          }, null, 8, rc)), 64)),
          (te(), ne(xe, null, dn([13, 39, 65, 91, 117, 137], (s) => _("rect", {
            key: `b${s}`,
            x: s,
            y: "52",
            width: "14",
            height: "25"
          }, null, 8, lc)), 64))
        ]),
        n[0] || (n[0] = _("rect", {
          class: "point-a",
          x: "52",
          y: "46",
          width: "8",
          height: "8"
        }, null, -1)),
        n[1] || (n[1] = _("rect", {
          class: "point-b",
          x: "106",
          y: "46",
          width: "8",
          height: "8"
        }, null, -1)),
        n[2] || (n[2] = _("rect", {
          class: "ground",
          x: "9",
          y: "80",
          width: "142",
          height: "3"
        }, null, -1))
      ])) : e.scene === "dog" ? (te(), ne("g", oc, [...n[3] || (n[3] = [
        _("path", {
          class: "dog",
          d: "M60 49h38v24H60zM63 40h10v11h16V40h9v11h9v8h-9"
        }, null, -1),
        _("rect", {
          class: "point-a",
          x: "70",
          y: "57",
          width: "5",
          height: "5"
        }, null, -1),
        _("rect", {
          class: "point-b",
          x: "88",
          y: "57",
          width: "5",
          height: "5"
        }, null, -1),
        _("rect", {
          class: "ground",
          x: "28",
          y: "77",
          width: "104",
          height: "3"
        }, null, -1)
      ])])) : e.scene === "cactus" ? (te(), ne("g", cc, [...n[4] || (n[4] = [
        _("path", {
          class: "cactus",
          d: "M70 25h20v60H70zM53 43h17v15H60v13H48V48h5zM90 50h18V36h11v31h-11V57H90z"
        }, null, -1),
        _("rect", {
          class: "pot",
          x: "61",
          y: "85",
          width: "38",
          height: "12"
        }, null, -1),
        _("rect", {
          class: "point-a",
          x: "43",
          y: "35",
          width: "7",
          height: "7"
        }, null, -1),
        _("rect", {
          class: "point-b",
          x: "119",
          y: "28",
          width: "7",
          height: "7"
        }, null, -1)
      ])])) : e.scene === "park" ? (te(), ne("g", fc, [...n[5] || (n[5] = [
        nn('<path class="tree" d="M24 28h26v24H24zM17 39h40v19H17z"></path><rect class="trunk" x="33" y="58" width="8" height="24"></rect><path class="bench" d="M73 59h54v6H73zM78 49h44v8H78zM80 65h6v14h-6zM115 65h6v14h-6z"></path><rect class="point-a" x="84" y="41" width="7" height="7"></rect><rect class="point-b" x="106" y="41" width="7" height="7"></rect><rect class="ground" x="12" y="82" width="136" height="3"></rect>', 6)
      ])])) : e.scene === "track" ? (te(), ne("g", uc, [...n[6] || (n[6] = [
        _("path", {
          class: "track",
          d: "M27 31h106a31 31 0 010 62H27a31 31 0 010-62zm0 12a19 19 0 000 38h106a19 19 0 000-38z"
        }, null, -1),
        _("rect", {
          class: "point-a",
          x: "47",
          y: "36",
          width: "7",
          height: "7"
        }, null, -1),
        _("rect", {
          class: "point-b",
          x: "105",
          y: "81",
          width: "7",
          height: "7"
        }, null, -1)
      ])])) : e.scene === "mountain" ? (te(), ne("g", ac, [...n[7] || (n[7] = [
        nn('<path class="mountain-back" d="M7 89L48 34l23 30 19-25 63 50z"></path><path class="mountain-front" d="M13 91l45-39 22 23 17-13 50 29z"></path><path class="path" d="M42 88l28-18 18 5 22-21"></path><rect class="point-a" x="68" y="66" width="7" height="7"></rect><rect class="point-b" x="106" y="49" width="7" height="7"></rect>', 5)
      ])])) : e.scene === "hotel" ? (te(), ne("g", dc, [...n[8] || (n[8] = [
        nn('<rect class="wall" x="27" y="14" width="106" height="83"></rect><rect class="door" x="57" y="28" width="46" height="69"></rect><rect class="door-line" x="62" y="34" width="36" height="58"></rect><rect class="point-a" x="49" y="57" width="7" height="7"></rect><rect class="point-b" x="108" y="57" width="7" height="7"></rect><rect class="handle" x="88" y="61" width="5" height="5"></rect>', 6)
      ])])) : (te(), ne("g", hc, [...n[9] || (n[9] = [
        nn('<rect class="balance-line" x="25" y="58" width="110" height="3"></rect><rect class="balance-mark" x="78" y="49" width="4" height="21"></rect><rect class="point-a" x="62" y="47" width="9" height="9"></rect><rect class="point-b" x="89" y="47" width="9" height="9"></rect><rect class="shadow-a" x="60" y="71" width="13" height="3"></rect><rect class="shadow-b" x="87" y="71" width="13" height="3"></rect>', 6)
      ])]))
    ], 8, nc));
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
], fi = "our-secret-world:muted", Wn = 14.4, gc = [
  [0, 329.63, 1.8],
  [1.8, 392, 1.2],
  [3.6, 440, 2.1],
  [6.2, 392, 1.4],
  [8.2, 293.66, 1.8],
  [10.3, 329.63, 1.2],
  [12, 261.63, 2.1]
];
function mc() {
  const e = /* @__PURE__ */ Xn(!1);
  let t = null, n = null, s = null;
  try {
    e.value = localStorage.getItem(fi) === "true";
  } catch {
  }
  function i(d, u, h, y, T) {
    if (!t || !n) return;
    const R = t.createOscillator(), A = t.createGain(), S = t.createStereoPanner();
    R.type = "sine", R.frequency.value = u, S.pan.value = T, A.gain.setValueAtTime(1e-4, d), A.gain.exponentialRampToValueAtTime(y, d + 0.18), A.gain.exponentialRampToValueAtTime(1e-4, d + h), R.connect(A).connect(S).connect(n), R.start(d), R.stop(d + h + 0.05);
  }
  function r(d) {
    gc.forEach(([u, h, y], T) => {
      i(d + u, h, y, 0.15, T % 2 === 0 ? -0.32 : 0.32);
    }), i(d, 130.81, Wn - 0.5, 0.028, -0.18), i(d + 0.06, 196, Wn - 0.5, 0.022, 0.18);
  }
  async function l() {
    e.value || (t || (t = new AudioContext(), n = t.createGain(), n.gain.value = 0.24, n.connect(t.destination)), await t.resume(), s === null && (r(t.currentTime + 0.1), s = window.setInterval(() => t && r(t.currentTime + 0.1), Wn * 1e3)));
  }
  function o() {
    s !== null && window.clearInterval(s), s = null, t == null || t.close(), t = null, n = null;
  }
  async function c() {
    e.value = !e.value;
    try {
      localStorage.setItem(fi, String(e.value));
    } catch {
    }
    e.value ? o() : await l();
  }
  return Mn(o), { muted: e, start: l, toggle: c };
}
const bc = {
  key: "entrance",
  class: "secret-entrance",
  "aria-labelledby": "secret-title"
}, vc = ["aria-label"], yc = {
  key: "world",
  class: "secret-interface"
}, _c = { class: "secret-toolbar" }, xc = ["aria-label"], wc = {
  key: "map",
  class: "secret-map",
  "aria-labelledby": "map-title"
}, Sc = { class: "map-heading" }, Cc = { class: "distance-chart" }, Tc = ["aria-label", "onClick"], Ec = { class: "chapter-visual" }, Ac = { class: "distance-meter" }, Mc = { "aria-label": "记录切换" }, Oc = ["disabled"], Pc = {
  key: "ending",
  class: "secret-ending",
  "aria-labelledby": "ending-title"
}, Ic = /* @__PURE__ */ Gi({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ Xn("entrance"), n = /* @__PURE__ */ Xn(0), s = /* @__PURE__ */ Sn(/* @__PURE__ */ new Set()), i = rs(() => ut[n.value]), { muted: r, start: l, toggle: o } = mc(), c = rs(() => r.value ? "开启背景音乐" : "关闭背景音乐");
    function d() {
      l(), t.value = "map";
    }
    function u() {
      t.value = "map";
    }
    function h(A) {
      n.value = A, s.add(ut[A].id), t.value = "chapter";
    }
    function y() {
      n.value > 0 && h(n.value - 1);
    }
    function T() {
      n.value < ut.length - 1 ? h(n.value + 1) : t.value = "ending";
    }
    function R(A) {
      A.key === "Escape" && t.value !== "entrance" && u(), t.value === "chapter" && (A.key === "ArrowLeft" && y(), A.key === "ArrowRight" && T());
    }
    return ys(() => window.addEventListener("keydown", R)), Mn(() => window.removeEventListener("keydown", R)), (A, S) => (te(), ne("div", {
      class: jt(["secret-world", `state-${t.value}`])
    }, [
      S[23] || (S[23] = _("div", {
        class: "secret-grain",
        "aria-hidden": "true"
      }, null, -1)),
      fe(qs, {
        name: "secret-fade",
        mode: "out-in"
      }, {
        default: Zn(() => [
          t.value === "entrance" ? (te(), ne("section", bc, [
            S[3] || (S[3] = _("header", null, [
              _("span", null, "未公开记录"),
              _("span", null, "仅凭链接进入")
            ], -1)),
            S[4] || (S[4] = _("div", {
              class: "entrance-signal",
              "aria-hidden": "true"
            }, [
              _("i"),
              _("span"),
              _("i")
            ], -1)),
            S[5] || (S[5] = _("p", null, "两个信号已建立连接", -1)),
            S[6] || (S[6] = _("h1", { id: "secret-title" }, "我们的秘密世界", -1)),
            S[7] || (S[7] = _("p", { class: "entrance-copy" }, "靠近，停下，再找到合适的距离。", -1)),
            _("button", {
              type: "button",
              class: "secret-button",
              onClick: d
            }, [...S[2] || (S[2] = [
              _("span", { "aria-hidden": "true" }, "●", -1),
              is(" 读取记录 ", -1)
            ])]),
            _("button", {
              type: "button",
              class: "entrance-sound",
              "aria-label": c.value,
              onClick: S[0] || (S[0] = //@ts-ignore
              (...$) => Me(o) && Me(o)(...$))
            }, ye(Me(r) ? "声音关闭" : "声音开启"), 9, vc)
          ])) : (te(), ne("main", yc, [
            _("header", _c, [
              _("button", {
                type: "button",
                onClick: u
              }, "返回轨迹"),
              S[8] || (S[8] = _("p", null, [
                _("i"),
                is(" 两个信号保持连接")
              ], -1)),
              _("button", {
                type: "button",
                "aria-label": c.value,
                onClick: S[1] || (S[1] = //@ts-ignore
                (...$) => Me(o) && Me(o)(...$))
              }, ye(Me(r) ? "×" : "♪"), 9, xc)
            ]),
            fe(qs, {
              name: "secret-shift",
              mode: "out-in"
            }, {
              default: Zn(() => [
                t.value === "map" ? (te(), ne("section", wc, [
                  _("div", Sc, [
                    S[9] || (S[9] = _("div", null, [
                      _("span", null, "八段未公开记录"),
                      _("h2", { id: "map-title" }, "距离的变化")
                    ], -1)),
                    _("p", null, ye(s.size) + " / " + ye(Me(ut).length) + " 已读取", 1)
                  ]),
                  _("div", Cc, [
                    S[11] || (S[11] = _("svg", {
                      viewBox: "0 0 100 100",
                      preserveAspectRatio: "none",
                      "aria-hidden": "true"
                    }, [
                      _("path", { d: "M7 20 C22 27 28 41 40 45 S59 62 69 66 S84 72 93 78" })
                    ], -1)),
                    (te(!0), ne(xe, null, dn(Me(ut), ($, H) => (te(), ne("button", {
                      key: $.id,
                      type: "button",
                      class: jt(["secret-node", { visited: s.has($.id) }]),
                      style: Nt({ "--node-x": `${7 + H * 12.25}%`, "--node-y": `${20 + H * 8.25}%` }),
                      "aria-label": `${$.index} ${$.title}`,
                      onClick: (j) => h(H)
                    }, [
                      S[10] || (S[10] = _("span", null, [
                        _("i"),
                        _("i")
                      ], -1)),
                      _("strong", null, ye($.label), 1),
                      _("small", null, ye($.index), 1)
                    ], 14, Tc))), 128)),
                    S[12] || (S[12] = _("div", { class: "chart-note" }, [
                      _("span", null, "远"),
                      _("i"),
                      _("span", null, "近")
                    ], -1))
                  ]),
                  S[13] || (S[13] = _("p", { class: "map-instruction" }, "选择一个节点，读取当时留下的距离", -1))
                ])) : t.value === "chapter" ? (te(), ne("section", {
                  key: i.value.id,
                  class: "secret-chapter"
                }, [
                  _("div", Ec, [
                    _("header", null, [
                      _("span", null, ye(i.value.index), 1),
                      _("span", null, ye(i.value.label), 1)
                    ]),
                    fe(pc, {
                      scene: i.value.scene,
                      title: i.value.title
                    }, null, 8, ["scene", "title"]),
                    _("div", Ac, [
                      S[14] || (S[14] = _("span", null, "远", -1)),
                      _("div", null, [
                        _("i", {
                          style: Nt({ width: `${100 - i.value.distance}%` })
                        }, null, 4)
                      ]),
                      S[15] || (S[15] = _("span", null, "近", -1))
                    ]),
                    S[16] || (S[16] = _("small", null, "仍然保留一格距离", -1))
                  ]),
                  _("article", null, [
                    _("span", null, "记录 " + ye(i.value.index) + " / " + ye(Me(ut).length.toString().padStart(2, "0")), 1),
                    _("h2", null, ye(i.value.title), 1),
                    _("div", null, [
                      (te(!0), ne(xe, null, dn(i.value.paragraphs, ($) => (te(), ne("p", { key: $ }, ye($), 1))), 128))
                    ]),
                    _("nav", Mc, [
                      _("button", {
                        type: "button",
                        disabled: n.value === 0,
                        onClick: y
                      }, "上一段", 8, Oc),
                      _("button", {
                        type: "button",
                        onClick: u
                      }, "查看轨迹"),
                      _("button", {
                        type: "button",
                        onClick: T
                      }, ye(n.value === Me(ut).length - 1 ? "读完" : "下一段"), 1)
                    ])
                  ])
                ])) : (te(), ne("section", Pc, [
                  S[18] || (S[18] = _("div", {
                    class: "ending-points",
                    "aria-hidden": "true"
                  }, [
                    _("i"),
                    _("span"),
                    _("i")
                  ], -1)),
                  S[19] || (S[19] = _("p", null, "距离记录 / 已保存", -1)),
                  S[20] || (S[20] = _("h2", { id: "ending-title" }, "有些关系不需要答案", -1)),
                  S[21] || (S[21] = _("p", null, "谢谢你曾经在人海里看见我，也谢谢我们都没有让这份理解失去边界。", -1)),
                  S[22] || (S[22] = _("strong", null, "七夕快乐", -1)),
                  _("div", null, [
                    _("button", {
                      type: "button",
                      class: "secret-button",
                      onClick: u
                    }, "再次查看"),
                    S[17] || (S[17] = _("a", { href: "/" }, "离开这里", -1))
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
}), ui = document.querySelector("#our-secret-world-app");
ui && Qo(Ic).mount(ui);
