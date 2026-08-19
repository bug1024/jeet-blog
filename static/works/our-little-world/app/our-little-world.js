/**
* @vue/shared v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function fs(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Q = {}, Tt = [], Ue = () => {
}, gr = () => !1, En = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), An = (e) => e.startsWith("onUpdate:"), ce = Object.assign, ds = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Oi = Object.prototype.hasOwnProperty, W = (e, t) => Oi.call(e, t), I = Array.isArray, Et = (e) => Qt(e) === "[object Map]", mr = (e) => Qt(e) === "[object Set]", Ls = (e) => Qt(e) === "[object Date]", D = (e) => typeof e == "function", ie = (e) => typeof e == "string", We = (e) => typeof e == "symbol", z = (e) => e !== null && typeof e == "object", yr = (e) => (z(e) || D(e)) && D(e.then) && D(e.catch), vr = Object.prototype.toString, Qt = (e) => vr.call(e), $i = (e) => Qt(e).slice(8, -1), br = (e) => Qt(e) === "[object Object]", hs = (e) => ie(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, kt = /* @__PURE__ */ fs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Mn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Pi = /-\w/g, Pe = Mn(
  (e) => e.replace(Pi, (t) => t.slice(1).toUpperCase())
), Li = /\B([A-Z])/g, ot = Mn(
  (e) => e.replace(Li, "-$1").toLowerCase()
), xr = Mn((e) => e.charAt(0).toUpperCase() + e.slice(1)), jn = Mn(
  (e) => e ? `on${xr(e)}` : ""
), Ve = (e, t) => !Object.is(e, t), Bn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, wr = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Ii = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Ri = (e) => {
  const t = ie(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Is;
const On = () => Is || (Is = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function en(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = ie(s) ? Di(s) : en(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (ie(e) || z(e))
    return e;
}
const Fi = /;(?![^(]*\))/g, Hi = /:([^]+)/, Ni = /\/\*[^]*?\*\//g;
function Di(e) {
  const t = {};
  return e.replace(Ni, "").split(Fi).forEach((n) => {
    if (n) {
      const s = n.split(Hi);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function tn(e) {
  let t = "";
  if (ie(e))
    t = e;
  else if (I(e))
    for (let n = 0; n < e.length; n++) {
      const s = tn(e[n]);
      s && (t += s + " ");
    }
  else if (z(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const ki = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ji = /* @__PURE__ */ fs(ki);
function _r(e) {
  return !!e || e === "";
}
function Bi(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = ps(e[s], t[s]);
  return n;
}
function ps(e, t) {
  if (e === t) return !0;
  let n = Ls(e), s = Ls(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = We(e), s = We(t), n || s)
    return e === t;
  if (n = I(e), s = I(t), n || s)
    return n && s ? Bi(e, t) : !1;
  if (n = z(e), s = z(t), n || s) {
    if (!n || !s)
      return !1;
    const r = Object.keys(e).length, i = Object.keys(t).length;
    if (r !== i)
      return !1;
    for (const l in e) {
      const o = e.hasOwnProperty(l), c = t.hasOwnProperty(l);
      if (o && !c || !o && c || !ps(e[l], t[l]))
        return !1;
    }
  }
  return String(e) === String(t);
}
const Sr = (e) => !!(e && e.__v_isRef === !0), q = (e) => ie(e) ? e : e == null ? "" : I(e) || z(e) && (e.toString === vr || !D(e.toString)) ? Sr(e) ? q(e.value) : JSON.stringify(e, Cr, 2) : String(e), Cr = (e, t) => Sr(t) ? Cr(e, t.value) : Et(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[Vn(s, i) + " =>"] = r, n),
    {}
  )
} : mr(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Vn(n))
} : We(t) ? Vn(t) : z(t) && !I(t) && !br(t) ? String(t) : t, Vn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    We(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let fe;
class Vi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && fe && (fe.active ? (this.parent = fe, this.index = (fe.scopes || (fe.scopes = [])).push(
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
        const r = this.scopes.slice();
        for (t = 0, n = r.length; t < n; t++)
          r[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, n = s.length; t < n; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = fe;
      try {
        return fe = this, t();
      } finally {
        fe = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = fe, fe = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (fe === this)
        fe = this.prevScope;
      else {
        let t = fe;
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
        const r = this.scopes.slice();
        for (n = 0, s = r.length; n < s; n++)
          r[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Ki() {
  return fe;
}
let Z;
const Kn = /* @__PURE__ */ new WeakSet();
class Tr {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, fe && (fe.active ? fe.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Kn.has(this) && (Kn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ar(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Rs(this), Mr(this);
    const t = Z, n = Le;
    Z = this, Le = !0;
    try {
      return this.fn();
    } finally {
      Or(this), Z = t, Le = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ys(t);
      this.deps = this.depsTail = void 0, Rs(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Kn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    es(this) && this.run();
  }
  get dirty() {
    return es(this);
  }
}
let Er = 0, jt, Bt;
function Ar(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Bt, Bt = e;
    return;
  }
  e.next = jt, jt = e;
}
function gs() {
  Er++;
}
function ms() {
  if (--Er > 0)
    return;
  if (Bt) {
    let t = Bt;
    for (Bt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; jt; ) {
    let t = jt;
    for (jt = void 0; t; ) {
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
function Mr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Or(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), ys(s), Ui(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function es(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && ($r(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function $r(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Wt) || (e.globalVersion = Wt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !es(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Z, s = Le;
  Z = e, Le = !0;
  try {
    Mr(e);
    const r = e.fn(e._value);
    (t.version === 0 || Ve(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    Z = n, Le = s, Or(e), e.flags &= -3;
  }
}
function ys(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      ys(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ui(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Le = !0;
const Pr = [];
function Ze() {
  Pr.push(Le), Le = !1;
}
function Qe() {
  const e = Pr.pop();
  Le = e === void 0 ? !0 : e;
}
function Rs(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Z;
    Z = void 0;
    try {
      t();
    } finally {
      Z = n;
    }
  }
}
let Wt = 0;
class Wi {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class vs {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Z || !Le || Z === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Z)
      n = this.activeLink = new Wi(Z, this), Z.deps ? (n.prevDep = Z.depsTail, Z.depsTail.nextDep = n, Z.depsTail = n) : Z.deps = Z.depsTail = n, Lr(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = Z.depsTail, n.nextDep = void 0, Z.depsTail.nextDep = n, Z.depsTail = n, Z.deps === n && (Z.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Wt++, this.notify(t);
  }
  notify(t) {
    gs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ms();
    }
  }
}
function Lr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Lr(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const ts = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ Symbol(
  ""
), ns = /* @__PURE__ */ Symbol(
  ""
), zt = /* @__PURE__ */ Symbol(
  ""
);
function he(e, t, n) {
  if (Le && Z) {
    let s = ts.get(e);
    s || ts.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new vs()), r.map = s, r.key = n), r.track();
  }
}
function Xe(e, t, n, s, r, i) {
  const l = ts.get(e);
  if (!l) {
    Wt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (gs(), t === "clear")
    l.forEach(o);
  else {
    const c = I(e), d = c && hs(n);
    if (c && n === "length") {
      const u = Number(s);
      l.forEach((h, x) => {
        (x === "length" || x === zt || !We(x) && x >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(zt)), t) {
        case "add":
          c ? d && o(l.get("length")) : (o(l.get(bt)), Et(e) && o(l.get(ns)));
          break;
        case "delete":
          c || (o(l.get(bt)), Et(e) && o(l.get(ns)));
          break;
        case "set":
          Et(e) && o(l.get(bt));
          break;
      }
  }
  ms();
}
function St(e) {
  const t = /* @__PURE__ */ U(e);
  return t === e ? t : (he(t, "iterate", zt), /* @__PURE__ */ Me(e) ? t : t.map(Ie));
}
function $n(e) {
  return he(e = /* @__PURE__ */ U(e), "iterate", zt), e;
}
function je(e, t) {
  return /* @__PURE__ */ et(e) ? Ot(/* @__PURE__ */ xt(e) ? Ie(t) : t) : Ie(t);
}
const zi = {
  __proto__: null,
  [Symbol.iterator]() {
    return Un(this, Symbol.iterator, (e) => je(this, e));
  },
  concat(...e) {
    return St(this).concat(
      ...e.map((t) => I(t) ? St(t) : t)
    );
  },
  entries() {
    return Un(this, "entries", (e) => (e[1] = je(this, e[1]), e));
  },
  every(e, t) {
    return qe(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return qe(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => je(this, s)),
      arguments
    );
  },
  find(e, t) {
    return qe(
      this,
      "find",
      e,
      t,
      (n) => je(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return qe(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return qe(
      this,
      "findLast",
      e,
      t,
      (n) => je(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return qe(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return qe(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Wn(this, "includes", e);
  },
  indexOf(...e) {
    return Wn(this, "indexOf", e);
  },
  join(e) {
    return St(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Wn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return qe(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return It(this, "pop");
  },
  push(...e) {
    return It(this, "push", e);
  },
  reduce(e, ...t) {
    return Fs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Fs(this, "reduceRight", e, t);
  },
  shift() {
    return It(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return qe(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return It(this, "splice", e);
  },
  toReversed() {
    return St(this).toReversed();
  },
  toSorted(e) {
    return St(this).toSorted(e);
  },
  toSpliced(...e) {
    return St(this).toSpliced(...e);
  },
  unshift(...e) {
    return It(this, "unshift", e);
  },
  values() {
    return Un(this, "values", (e) => je(this, e));
  }
};
function Un(e, t, n) {
  const s = $n(e), r = s[t]();
  return s !== e && !/* @__PURE__ */ Me(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.done || (i.value = n(i.value)), i;
  }), r;
}
const qi = Array.prototype;
function qe(e, t, n, s, r, i) {
  const l = $n(e), o = l !== e && !/* @__PURE__ */ Me(e), c = l[t];
  if (c !== qi[t]) {
    const h = c.apply(e, i);
    return o ? Ie(h) : h;
  }
  let d = n;
  l !== e && (o ? d = function(h, x) {
    return n.call(this, je(e, h), x, e);
  } : n.length > 2 && (d = function(h, x) {
    return n.call(this, h, x, e);
  }));
  const u = c.call(l, d, s);
  return o && r ? r(u) : u;
}
function Fs(e, t, n, s) {
  const r = $n(e), i = r !== e && !/* @__PURE__ */ Me(e);
  let l = n, o = !1;
  r !== e && (i ? (o = s.length === 0, l = function(d, u, h) {
    return o && (o = !1, d = je(e, d)), n.call(this, d, je(e, u), h, e);
  }) : n.length > 3 && (l = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const c = r[t](l, ...s);
  return o ? je(e, c) : c;
}
function Wn(e, t, n) {
  const s = /* @__PURE__ */ U(e);
  he(s, "iterate", zt);
  const r = s[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ ws(n[0]) ? (n[0] = /* @__PURE__ */ U(n[0]), s[t](...n)) : r;
}
function It(e, t, n = []) {
  Ze(), gs();
  const s = (/* @__PURE__ */ U(e))[t].apply(e, n);
  return ms(), Qe(), s;
}
const Gi = /* @__PURE__ */ fs("__proto__,__v_isRef,__isVue"), Ir = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(We)
);
function Ji(e) {
  We(e) || (e = String(e));
  const t = /* @__PURE__ */ U(this);
  return he(t, "has", e), t.hasOwnProperty(e);
}
class Rr {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (r ? i ? il : Dr : i ? Nr : Hr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = I(t);
    if (!r) {
      let c;
      if (l && (c = zi[n]))
        return c;
      if (n === "hasOwnProperty")
        return Ji;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ pe(t) ? t : s
    );
    if ((We(n) ? Ir.has(n) : Gi(n)) || (r || he(t, "get", n), i))
      return o;
    if (/* @__PURE__ */ pe(o)) {
      const c = l && hs(n) ? o : o.value;
      return r && z(c) ? /* @__PURE__ */ rs(c) : c;
    }
    return z(o) ? r ? /* @__PURE__ */ rs(o) : /* @__PURE__ */ Pn(o) : o;
  }
}
class Fr extends Rr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    const l = I(t) && hs(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ et(i);
      if (!/* @__PURE__ */ Me(s) && !/* @__PURE__ */ et(s) && (i = /* @__PURE__ */ U(i), s = /* @__PURE__ */ U(s)), !l && /* @__PURE__ */ pe(i) && !/* @__PURE__ */ pe(s))
        return d || (i.value = s), !0;
    }
    const o = l ? Number(n) < t.length : W(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ pe(t) ? t : r
    );
    return t === /* @__PURE__ */ U(r) && c && (o ? Ve(s, i) && Xe(t, "set", n, s) : Xe(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = W(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Xe(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!We(n) || !Ir.has(n)) && he(t, "has", n), s;
  }
  ownKeys(t) {
    return he(
      t,
      "iterate",
      I(t) ? "length" : bt
    ), Reflect.ownKeys(t);
  }
}
class Yi extends Rr {
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
const Xi = /* @__PURE__ */ new Fr(), Zi = /* @__PURE__ */ new Yi(), Qi = /* @__PURE__ */ new Fr(!0);
const ss = (e) => e, cn = (e) => Reflect.getPrototypeOf(e);
function el(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = /* @__PURE__ */ U(r), l = Et(i), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, d = r[e](...s), u = n ? ss : t ? Ot : Ie;
    return !t && he(
      i,
      "iterate",
      c ? ns : bt
    ), ce(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: x } = d.next();
          return x ? { value: h, done: x } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: x
          };
        }
      }
    );
  };
}
function an(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function tl(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ U(i), o = /* @__PURE__ */ U(r);
      e || (Ve(r, o) && he(l, "get", r), he(l, "get", o));
      const { has: c } = cn(l), d = t ? ss : e ? Ot : Ie;
      if (c.call(l, r))
        return d(i.get(r));
      if (c.call(l, o))
        return d(i.get(o));
      i !== l && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && he(/* @__PURE__ */ U(r), "iterate", bt), r.size;
    },
    has(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ U(i), o = /* @__PURE__ */ U(r);
      return e || (Ve(r, o) && he(l, "has", r), he(l, "has", o)), r === o ? i.has(r) : i.has(r) || i.has(o);
    },
    forEach(r, i) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ U(o), d = t ? ss : e ? Ot : Ie;
      return !e && he(c, "iterate", bt), o.forEach((u, h) => r.call(i, d(u), d(h), l));
    }
  };
  return ce(
    n,
    e ? {
      add: an("add"),
      set: an("set"),
      delete: an("delete"),
      clear: an("clear")
    } : {
      add(r) {
        const i = /* @__PURE__ */ U(this), l = cn(i), o = /* @__PURE__ */ U(r), c = !t && !/* @__PURE__ */ Me(r) && !/* @__PURE__ */ et(r) ? o : r;
        return l.has.call(i, c) || Ve(r, c) && l.has.call(i, r) || Ve(o, c) && l.has.call(i, o) || (i.add(c), Xe(i, "add", c, c)), this;
      },
      set(r, i) {
        !t && !/* @__PURE__ */ Me(i) && !/* @__PURE__ */ et(i) && (i = /* @__PURE__ */ U(i));
        const l = /* @__PURE__ */ U(this), { has: o, get: c } = cn(l);
        let d = o.call(l, r);
        d || (r = /* @__PURE__ */ U(r), d = o.call(l, r));
        const u = c.call(l, r);
        return l.set(r, i), d ? Ve(i, u) && Xe(l, "set", r, i) : Xe(l, "add", r, i), this;
      },
      delete(r) {
        const i = /* @__PURE__ */ U(this), { has: l, get: o } = cn(i);
        let c = l.call(i, r);
        c || (r = /* @__PURE__ */ U(r), c = l.call(i, r)), o && o.call(i, r);
        const d = i.delete(r);
        return c && Xe(i, "delete", r, void 0), d;
      },
      clear() {
        const r = /* @__PURE__ */ U(this), i = r.size !== 0, l = r.clear();
        return i && Xe(
          r,
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
  ].forEach((r) => {
    n[r] = el(r, e, t);
  }), n;
}
function bs(e, t) {
  const n = tl(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    W(n, r) && r in s ? n : s,
    r,
    i
  );
}
const nl = {
  get: /* @__PURE__ */ bs(!1, !1)
}, sl = {
  get: /* @__PURE__ */ bs(!1, !0)
}, rl = {
  get: /* @__PURE__ */ bs(!0, !1)
};
const Hr = /* @__PURE__ */ new WeakMap(), Nr = /* @__PURE__ */ new WeakMap(), Dr = /* @__PURE__ */ new WeakMap(), il = /* @__PURE__ */ new WeakMap();
function ll(e) {
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
function Pn(e) {
  return /* @__PURE__ */ et(e) ? e : xs(
    e,
    !1,
    Xi,
    nl,
    Hr
  );
}
// @__NO_SIDE_EFFECTS__
function ol(e) {
  return xs(
    e,
    !1,
    Qi,
    sl,
    Nr
  );
}
// @__NO_SIDE_EFFECTS__
function rs(e) {
  return xs(
    e,
    !0,
    Zi,
    rl,
    Dr
  );
}
function xs(e, t, n, s, r) {
  if (!z(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const l = ll($i(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return r.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function xt(e) {
  return /* @__PURE__ */ et(e) ? /* @__PURE__ */ xt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function et(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Me(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function ws(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ U(t) : e;
}
function cl(e) {
  return !W(e, "__v_skip") && Object.isExtensible(e) && wr(e, "__v_skip", !0), e;
}
const Ie = (e) => z(e) ? /* @__PURE__ */ Pn(e) : e, Ot = (e) => z(e) ? /* @__PURE__ */ rs(e) : e;
// @__NO_SIDE_EFFECTS__
function pe(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function yt(e) {
  return al(e, !1);
}
function al(e, t) {
  return /* @__PURE__ */ pe(e) ? e : new ul(e, t);
}
class ul {
  constructor(t, n) {
    this.dep = new vs(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ U(t), this._value = n ? t : Ie(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Me(t) || /* @__PURE__ */ et(t);
    t = s ? t : /* @__PURE__ */ U(t), Ve(t, n) && (this._rawValue = t, this._value = s ? t : Ie(t), this.dep.trigger());
  }
}
function me(e) {
  return /* @__PURE__ */ pe(e) ? e.value : e;
}
const fl = {
  get: (e, t, n) => t === "__v_raw" ? e : me(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return /* @__PURE__ */ pe(r) && !/* @__PURE__ */ pe(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function kr(e) {
  return /* @__PURE__ */ xt(e) ? e : new Proxy(e, fl);
}
class dl {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new vs(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Wt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Z !== this)
      return Ar(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return $r(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function hl(e, t, n = !1) {
  let s, r;
  return D(e) ? s = e : (s = e.get, r = e.set), new dl(s, r, n);
}
const un = {}, gn = /* @__PURE__ */ new WeakMap();
let gt;
function pl(e, t = !1, n = gt) {
  if (n) {
    let s = gn.get(n);
    s || gn.set(n, s = []), s.push(e);
  }
}
function gl(e, t, n = Q) {
  const { immediate: s, deep: r, once: i, scheduler: l, augmentJob: o, call: c } = n, d = (g) => r ? g : /* @__PURE__ */ Me(g) || r === !1 || r === 0 ? rt(g, 1) : rt(g);
  let u, h, x, _, M = !1, O = !1;
  if (/* @__PURE__ */ pe(e) ? (h = () => e.value, M = /* @__PURE__ */ Me(e)) : /* @__PURE__ */ xt(e) ? (h = () => d(e), M = !0) : I(e) ? (O = !0, M = e.some((g) => /* @__PURE__ */ xt(g) || /* @__PURE__ */ Me(g)), h = () => e.map((g) => {
    if (/* @__PURE__ */ pe(g))
      return g.value;
    if (/* @__PURE__ */ xt(g))
      return d(g);
    if (D(g))
      return c ? c(g, 2) : g();
  })) : D(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (x) {
      Ze();
      try {
        x();
      } finally {
        Qe();
      }
    }
    const g = gt;
    gt = u;
    try {
      return c ? c(e, 3, [_]) : e(_);
    } finally {
      gt = g;
    }
  } : h = Ue, t && r) {
    const g = h, N = r === !0 ? 1 / 0 : r;
    h = () => rt(g(), N);
  }
  const V = Ki(), B = () => {
    u.stop(), V && V.active && ds(V.effects, u);
  };
  if (i && t) {
    const g = t;
    t = (...N) => {
      const le = g(...N);
      return B(), le;
    };
  }
  let k = O ? new Array(e.length).fill(un) : un;
  const H = (g) => {
    if (!(!(u.flags & 1) || !u.dirty && !g))
      if (t) {
        const N = u.run();
        if (g || r || M || (O ? N.some((le, ge) => Ve(le, k[ge])) : Ve(N, k))) {
          x && x();
          const le = gt;
          gt = u;
          try {
            const ge = [
              N,
              // pass undefined as the old value when it's changed for the first time
              k === un ? void 0 : O && k[0] === un ? [] : k,
              _
            ];
            k = N, c ? c(t, 3, ge) : (
              // @ts-expect-error
              t(...ge)
            );
          } finally {
            gt = le;
          }
        }
      } else
        u.run();
  };
  return o && o(H), u = new Tr(h), u.scheduler = l ? () => l(H, !1) : H, _ = (g) => pl(g, !1, u), x = u.onStop = () => {
    const g = gn.get(u);
    if (g) {
      if (c)
        c(g, 4);
      else
        for (const N of g) N();
      gn.delete(u);
    }
  }, t ? s ? H(!0) : k = u.run() : l ? l(H.bind(null, !0), !0) : u.run(), B.pause = u.pause.bind(u), B.resume = u.resume.bind(u), B.stop = B, B;
}
function rt(e, t = 1 / 0, n) {
  if (t <= 0 || !z(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ pe(e))
    rt(e.value, t, n);
  else if (I(e))
    for (let s = 0; s < e.length; s++)
      rt(e[s], t, n);
  else if (mr(e) || Et(e))
    e.forEach((s) => {
      rt(s, t, n);
    });
  else if (br(e)) {
    for (const s in e)
      rt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && rt(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function nn(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    Ln(r, t, n);
  }
}
function Oe(e, t, n, s) {
  if (D(e)) {
    const r = nn(e, t, n, s);
    return r && yr(r) && r.catch((i) => {
      Ln(i, t, n);
    }), r;
  }
  if (I(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push(Oe(e[i], t, n, s));
    return r;
  }
}
function Ln(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || Q;
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
    if (i) {
      Ze(), nn(i, null, 10, [
        e,
        c,
        d
      ]), Qe();
      return;
    }
  }
  ml(e, n, r, s, l);
}
function ml(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const ve = [];
let ke = -1;
const At = [];
let st = null, Ct = 0;
const jr = /* @__PURE__ */ Promise.resolve();
let mn = null;
function yl(e) {
  const t = mn || jr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function vl(e) {
  let t = ke + 1, n = ve.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = ve[s], i = qt(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function _s(e) {
  if (!(e.flags & 1)) {
    const t = qt(e), n = ve[ve.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= qt(n) ? ve.push(e) : ve.splice(vl(t), 0, e), e.flags |= 1, Br();
  }
}
function Br() {
  mn || (mn = jr.then(Kr));
}
function bl(e) {
  if (!I(e))
    st && e.id === -1 ? st.splice(Ct + 1, 0, e) : e.flags & 1 || (At.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      At.push(e[t]);
  Br();
}
function Hs(e, t, n = ke + 1) {
  for (; n < ve.length; n++) {
    const s = ve[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ve.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Vr(e) {
  if (At.length) {
    const t = [...new Set(At)].sort(
      (n, s) => qt(n) - qt(s)
    );
    if (At.length = 0, st) {
      for (let n = 0; n < t.length; n++)
        st.push(t[n]);
      return;
    }
    for (st = t, Ct = 0; Ct < st.length; Ct++) {
      const n = st[Ct];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    st = null, Ct = 0;
  }
}
const qt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Kr(e) {
  try {
    for (ke = 0; ke < ve.length; ke++) {
      const t = ve[ke];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), nn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; ke < ve.length; ke++) {
      const t = ve[ke];
      t && (t.flags &= -2);
    }
    ke = -1, ve.length = 0, Vr(), mn = null, (ve.length || At.length) && Kr();
  }
}
let Ke = null, Ur = null;
function yn(e) {
  const t = Ke;
  return Ke = e, Ur = e && e.type.__scopeId || null, t;
}
function Ht(e, t = Ke, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && wn(-1);
    const i = yn(t), l = wt.length;
    let o;
    try {
      o = e(...r);
    } finally {
      for (let c = wt.length; c > l; c--) vi();
      yn(i), s._d && wn(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function ut(e, t, n, s) {
  const r = e.dirs, i = t && t.dirs;
  for (let l = 0; l < r.length; l++) {
    const o = r[l];
    i && (o.oldValue = i[l].value);
    let c = o.dir[s];
    c && (Ze(), Oe(c, n, 8, [
      e.el,
      o,
      e,
      t
    ]), Qe());
  }
}
function xl(e, t) {
  if (xe) {
    let n = xe.provides;
    const s = xe.parent && xe.parent.provides;
    s === n && (n = xe.provides = Object.create(s)), n[e] = t;
  }
}
function dn(e, t, n = !1) {
  const s = _i();
  if (s || Mt) {
    let r = Mt ? Mt._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && D(t) ? t.call(s && s.proxy) : t;
  }
}
const wl = /* @__PURE__ */ Symbol.for("v-scx"), _l = () => dn(wl);
function zn(e, t, n) {
  return Wr(e, t, n);
}
function Wr(e, t, n = Q) {
  const { immediate: s, deep: r, flush: i, once: l } = n, o = ce({}, n), c = t && s || !t && i !== "post";
  let d;
  if (Xt) {
    if (i === "sync") {
      const _ = _l();
      d = _.__watcherHandles || (_.__watcherHandles = []);
    } else if (!c) {
      const _ = () => {
      };
      return _.stop = Ue, _.resume = Ue, _.pause = Ue, _;
    }
  }
  const u = xe;
  o.call = (_, M, O) => Oe(_, u, M, O);
  let h = !1;
  i === "post" ? o.scheduler = (_) => {
    _e(_, u && u.suspense);
  } : i !== "sync" && (h = !0, o.scheduler = (_, M) => {
    M ? _() : _s(_);
  }), o.augmentJob = (_) => {
    t && (_.flags |= 4), h && (_.flags |= 2, u && (_.id = u.uid, _.i = u));
  };
  const x = gl(e, t, o);
  return Xt && (d ? d.push(x) : c && x()), x;
}
function Sl(e, t, n) {
  const s = this.proxy, r = ie(e) ? e.includes(".") ? zr(s, e) : () => s[e] : e.bind(s, s);
  let i;
  D(t) ? i = t : (i = t.handler, n = t);
  const l = rn(this), o = Wr(r, i.bind(s), n);
  return l(), o;
}
function zr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const Cl = /* @__PURE__ */ Symbol("_vte"), In = (e) => e.__isTeleport, Ae = /* @__PURE__ */ Symbol("_leaveCb"), Rt = /* @__PURE__ */ Symbol("_enterCb");
function Tl() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Hn(() => {
    e.isMounted = !0;
  }), sn(() => {
    e.isUnmounting = !0;
  }), e;
}
const Ee = [Function, Array], qr = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Ee,
  onEnter: Ee,
  onAfterEnter: Ee,
  onEnterCancelled: Ee,
  // leave
  onBeforeLeave: Ee,
  onLeave: Ee,
  onAfterLeave: Ee,
  onLeaveCancelled: Ee,
  // appear
  onBeforeAppear: Ee,
  onAppear: Ee,
  onAfterAppear: Ee,
  onAppearCancelled: Ee
}, Gr = (e) => {
  const t = e.subTree;
  return t.component ? Gr(t.component) : t;
}, El = {
  name: "BaseTransition",
  props: qr,
  setup(e, { slots: t }) {
    const n = _i(), s = Tl();
    return () => {
      const r = t.default && Xr(t.default(), !0), i = r && r.length ? Jr(r) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? vt() : void 0
      );
      if (!i)
        return;
      const l = /* @__PURE__ */ U(e), { mode: o } = l;
      if (s.isLeaving)
        return qn(i);
      const c = vn(i);
      if (!c)
        return qn(i);
      let d = is(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (h) => d = h
      );
      c.type !== be && Gt(c, d);
      let u = n.subTree && vn(n.subTree);
      if (u && u.type !== be && !mt(u, c) && Gr(n).type !== be) {
        let h = is(
          u,
          l,
          s,
          n
        );
        if (Gt(u, h), o === "out-in" && c.type !== be)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave, u = void 0;
          }, qn(i);
        o === "in-out" && c.type !== be ? h.delayLeave = (x, _, M) => {
          const O = Yr(
            s,
            u
          );
          O[String(u.key)] = u, x[Ae] = () => {
            _(), x[Ae] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            M(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return i;
    };
  }
};
function Jr(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== be) {
        t = n;
        break;
      }
  }
  return t;
}
const Al = El;
function Yr(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function is(e, t, n, s, r) {
  const {
    appear: i,
    mode: l,
    persisted: o = !1,
    onBeforeEnter: c,
    onEnter: d,
    onAfterEnter: u,
    onEnterCancelled: h,
    onBeforeLeave: x,
    onLeave: _,
    onAfterLeave: M,
    onLeaveCancelled: O,
    onBeforeAppear: V,
    onAppear: B,
    onAfterAppear: k,
    onAppearCancelled: H
  } = t, g = String(e.key), N = Yr(n, e), le = (j, G) => {
    j && Oe(
      j,
      s,
      9,
      G
    );
  }, ge = (j, G) => {
    const se = G[1];
    le(j, G), I(j) ? j.every((A) => A.length <= 1) && se() : j.length <= 1 && se();
  }, we = {
    mode: l,
    persisted: o,
    beforeEnter(j) {
      let G = c;
      if (!n.isMounted)
        if (i)
          G = V || c;
        else
          return;
      j[Ae] && j[Ae](
        !0
        /* cancelled */
      );
      const se = N[g];
      se && mt(e, se) && se.el[Ae] && se.el[Ae](), le(G, [j]);
    },
    enter(j) {
      if (N[g] === e) return;
      let G = d, se = u, A = h;
      if (!n.isMounted)
        if (i)
          G = B || d, se = k || u, A = H || h;
        else
          return;
      let te = !1;
      j[Rt] = (ze) => {
        te || (te = !0, ze ? le(A, [j]) : le(se, [j]), we.delayedLeave && we.delayedLeave(), j[Rt] = void 0);
      };
      const de = j[Rt].bind(null, !1);
      G ? ge(G, [j, de]) : de();
    },
    leave(j, G) {
      const se = String(e.key);
      if (j[Rt] && j[Rt](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return G();
      le(x, [j]);
      let A = !1;
      j[Ae] = (de) => {
        A || (A = !0, G(), de ? le(O, [j]) : le(M, [j]), j[Ae] = void 0, N[se] === e && delete N[se]);
      };
      const te = j[Ae].bind(null, !1);
      N[se] = e, _ ? ge(_, [j, te]) : te();
    },
    clone(j) {
      const G = is(
        j,
        t,
        n,
        s,
        r
      );
      return r && r(G), G;
    }
  };
  return we;
}
function qn(e) {
  if (Rn(e))
    return e = lt(e), e.children = null, e;
}
function vn(e) {
  if (!Rn(e))
    return In(e.type) && e.children ? Jr(e.children) : e;
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
function Gt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Gt(
      In(n.type) && vn(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Xr(e, t = !1, n) {
  let s = [], r = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : i);
    l.type === ne ? (l.patchFlag & 128 && r++, s = s.concat(
      Xr(l.children, t, o)
    )) : (t || l.type !== be) && s.push(o != null ? lt(l, { key: o }) : l);
  }
  if (r > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function _t(e, t) {
  return D(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ce({ name: e.name }, t, { setup: e })
  ) : e;
}
function Zr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ns(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const bn = /* @__PURE__ */ new WeakMap();
function Vt(e, t, n, s, r = !1) {
  if (I(e)) {
    e.forEach(
      (O, V) => Vt(
        O,
        t && (I(t) ? t[V] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Kt(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Vt(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? Ts(s.component) : s.el, l = r ? null : i, { i: o, r: c } = e, d = t && t.r, u = o.refs === Q ? o.refs = {} : o.refs, h = o.setupState, x = /* @__PURE__ */ U(h), _ = h === Q ? gr : (O) => Ns(u, O) ? !1 : W(x, O), M = (O, V) => !(V && Ns(u, V));
  if (d != null && d !== c) {
    if (Ds(t), ie(d))
      u[d] = null, _(d) && (h[d] = null);
    else if (/* @__PURE__ */ pe(d)) {
      const O = t;
      M(d, O.k) && (d.value = null), O.k && (u[O.k] = null);
    }
  }
  if (D(c))
    nn(c, o, 12, [l, u]);
  else {
    const O = ie(c), V = /* @__PURE__ */ pe(c);
    if (O || V) {
      const B = () => {
        if (e.f) {
          const k = O ? _(c) ? h[c] : u[c] : M() || !e.k ? c.value : u[e.k];
          if (r)
            I(k) && ds(k, i);
          else if (I(k))
            k.includes(i) || k.push(i);
          else if (O)
            u[c] = [i], _(c) && (h[c] = u[c]);
          else {
            const H = [i];
            M(c, e.k) && (c.value = H), e.k && (u[e.k] = H);
          }
        } else O ? (u[c] = l, _(c) && (h[c] = l)) : V && (M(c, e.k) && (c.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const k = () => {
          B(), bn.delete(e);
        };
        k.id = -1, bn.set(e, k), _e(k, n);
      } else
        Ds(e), B();
    }
  }
}
function Ds(e) {
  const t = bn.get(e);
  t && (t.flags |= 8, bn.delete(e));
}
On().requestIdleCallback;
On().cancelIdleCallback;
const Kt = (e) => !!e.type.__asyncLoader, Rn = (e) => e.type.__isKeepAlive;
function Ml(e, t) {
  Qr(e, "a", t);
}
function Ol(e, t) {
  Qr(e, "da", t);
}
function Qr(e, t, n = xe) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Fn(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Rn(r.parent.vnode) && $l(s, t, n, r), r = r.parent;
  }
}
function $l(e, t, n, s) {
  const r = Fn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  ei(() => {
    ds(s[t], r);
  }, n);
}
function Fn(e, t, n = xe, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      Ze();
      const o = rn(n), c = Oe(t, n, e, l);
      return o(), Qe(), c;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const tt = (e) => (t, n = xe) => {
  (!Xt || e === "sp") && Fn(e, (...s) => t(...s), n);
}, Pl = tt("bm"), Hn = tt("m"), Ll = tt(
  "bu"
), Il = tt("u"), sn = tt(
  "bum"
), ei = tt("um"), Rl = tt(
  "sp"
), Fl = tt("rtg"), Hl = tt("rtc");
function Nl(e, t = xe) {
  Fn("ec", e, t);
}
const Dl = /* @__PURE__ */ Symbol.for("v-ndc");
function it(e, t, n, s) {
  let r;
  const i = n, l = I(e);
  if (l || ie(e)) {
    const o = l && /* @__PURE__ */ xt(e);
    let c = !1, d = !1;
    o && (c = !/* @__PURE__ */ Me(e), d = /* @__PURE__ */ et(e), e = $n(e)), r = new Array(e.length);
    for (let u = 0, h = e.length; u < h; u++)
      r[u] = t(
        c ? d ? Ot(Ie(e[u])) : Ie(e[u]) : e[u],
        u,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++)
      r[o] = t(o + 1, o, void 0, i);
  } else if (z(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (o, c) => t(o, c, void 0, i)
      );
    else {
      const o = Object.keys(e);
      r = new Array(o.length);
      for (let c = 0, d = o.length; c < d; c++) {
        const u = o[c];
        r[c] = t(e[u], u, c, i);
      }
    }
  else
    r = [];
  return r;
}
const ls = (e) => e ? Si(e) ? Ts(e) : ls(e.parent) : null, Ut = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ce(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => ls(e.parent),
    $root: (e) => ls(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ni(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      _s(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = yl.bind(e.proxy)),
    $watch: (e) => Sl.bind(e)
  })
), Gn = (e, t) => e !== Q && !e.__isScriptSetup && W(e, t), kl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: i, accessCache: l, type: o, appContext: c } = e;
    if (t[0] !== "$") {
      const x = l[t];
      if (x !== void 0)
        switch (x) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Gn(s, t))
          return l[t] = 1, s[t];
        if (r !== Q && W(r, t))
          return l[t] = 2, r[t];
        if (W(i, t))
          return l[t] = 3, i[t];
        if (n !== Q && W(n, t))
          return l[t] = 4, n[t];
        os && (l[t] = 0);
      }
    }
    const d = Ut[t];
    let u, h;
    if (d)
      return t === "$attrs" && he(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (u = o.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== Q && W(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      h = c.config.globalProperties, W(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Gn(r, t) ? (r[t] = n, !0) : s !== Q && W(s, t) ? (s[t] = n, !0) : W(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, props: i, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== Q && o[0] !== "$" && W(e, o) || Gn(t, o) || W(i, o) || W(s, o) || W(Ut, o) || W(r.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : W(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function ks(e) {
  return I(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let os = !0;
function jl(e) {
  const t = ni(e), n = e.proxy, s = e.ctx;
  os = !1, t.beforeCreate && js(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: l,
    watch: o,
    provide: c,
    inject: d,
    // lifecycle
    created: u,
    beforeMount: h,
    mounted: x,
    beforeUpdate: _,
    updated: M,
    activated: O,
    deactivated: V,
    beforeDestroy: B,
    beforeUnmount: k,
    destroyed: H,
    unmounted: g,
    render: N,
    renderTracked: le,
    renderTriggered: ge,
    errorCaptured: we,
    serverPrefetch: j,
    // public API
    expose: G,
    inheritAttrs: se,
    // assets
    components: A,
    directives: te,
    filters: de
  } = t;
  if (d && Bl(d, s, null), l)
    for (const re in l) {
      const X = l[re];
      D(X) && (s[re] = X.bind(n));
    }
  if (r) {
    const re = r.call(n, n);
    z(re) && (e.data = /* @__PURE__ */ Pn(re));
  }
  if (os = !0, i)
    for (const re in i) {
      const X = i[re], ct = D(X) ? X.bind(n, n) : D(X.get) ? X.get.bind(n, n) : Ue, ln = !D(X) && D(X.set) ? X.set.bind(n) : Ue, at = Tn({
        get: ct,
        set: ln
      });
      Object.defineProperty(s, re, {
        enumerable: !0,
        configurable: !0,
        get: () => at.value,
        set: (Re) => at.value = Re
      });
    }
  if (o)
    for (const re in o)
      ti(o[re], s, n, re);
  if (c) {
    const re = D(c) ? c.call(n) : c;
    Reflect.ownKeys(re).forEach((X) => {
      xl(X, re[X]);
    });
  }
  u && js(u, e, "c");
  function ae(re, X) {
    I(X) ? X.forEach((ct) => re(ct.bind(n))) : X && re(X.bind(n));
  }
  if (ae(Pl, h), ae(Hn, x), ae(Ll, _), ae(Il, M), ae(Ml, O), ae(Ol, V), ae(Nl, we), ae(Hl, le), ae(Fl, ge), ae(sn, k), ae(ei, g), ae(Rl, j), I(G))
    if (G.length) {
      const re = e.exposed || (e.exposed = {});
      G.forEach((X) => {
        Object.defineProperty(re, X, {
          get: () => n[X],
          set: (ct) => n[X] = ct,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  N && e.render === Ue && (e.render = N), se != null && (e.inheritAttrs = se), A && (e.components = A), te && (e.directives = te), j && Zr(e);
}
function Bl(e, t, n = Ue) {
  I(e) && (e = cs(e));
  for (const s in e) {
    const r = e[s];
    let i;
    z(r) ? "default" in r ? i = dn(
      r.from || s,
      r.default,
      !0
    ) : i = dn(r.from || s) : i = dn(r), /* @__PURE__ */ pe(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[s] = i;
  }
}
function js(e, t, n) {
  Oe(
    I(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function ti(e, t, n, s) {
  let r = s.includes(".") ? zr(n, s) : () => n[s];
  if (ie(e)) {
    const i = t[e];
    D(i) && zn(r, i);
  } else if (D(e))
    zn(r, e.bind(n));
  else if (z(e))
    if (I(e))
      e.forEach((i) => ti(i, t, n, s));
    else {
      const i = D(e.handler) ? e.handler.bind(n) : t[e.handler];
      D(i) && zn(r, i, e);
    }
}
function ni(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = i.get(t);
  let c;
  return o ? c = o : !r.length && !n && !s ? c = t : (c = {}, r.length && r.forEach(
    (d) => xn(c, d, l, !0)
  ), xn(c, t, l)), z(t) && i.set(t, c), c;
}
function xn(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && xn(e, i, n, !0), r && r.forEach(
    (l) => xn(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = Vl[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const Vl = {
  data: Bs,
  props: Vs,
  emits: Vs,
  // objects
  methods: Nt,
  computed: Nt,
  // lifecycle
  beforeCreate: ye,
  created: ye,
  beforeMount: ye,
  mounted: ye,
  beforeUpdate: ye,
  updated: ye,
  beforeDestroy: ye,
  beforeUnmount: ye,
  destroyed: ye,
  unmounted: ye,
  activated: ye,
  deactivated: ye,
  errorCaptured: ye,
  serverPrefetch: ye,
  // assets
  components: Nt,
  directives: Nt,
  // watch
  watch: Ul,
  // provide / inject
  provide: Bs,
  inject: Kl
};
function Bs(e, t) {
  return t ? e ? function() {
    return ce(
      D(e) ? e.call(this, this) : e,
      D(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Kl(e, t) {
  return Nt(cs(e), cs(t));
}
function cs(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function ye(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Nt(e, t) {
  return e ? ce(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Vs(e, t) {
  return e ? I(e) && I(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ce(
    /* @__PURE__ */ Object.create(null),
    ks(e),
    ks(t ?? {})
  ) : t;
}
function Ul(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ce(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = ye(e[s], t[s]);
  return n;
}
function si() {
  return {
    app: null,
    config: {
      isNativeTag: gr,
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
let Wl = 0;
function zl(e, t) {
  return function(s, r = null) {
    D(s) || (s = ce({}, s)), r != null && !z(r) && (r = null);
    const i = si(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const d = i.app = {
      _uid: Wl++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Co,
      get config() {
        return i.config;
      },
      set config(u) {
      },
      use(u, ...h) {
        return l.has(u) || (u && D(u.install) ? (l.add(u), u.install(d, ...h)) : D(u) && (l.add(u), u(d, ...h))), d;
      },
      mixin(u) {
        return i.mixins.includes(u) || i.mixins.push(u), d;
      },
      component(u, h) {
        return h ? (i.components[u] = h, d) : i.components[u];
      },
      directive(u, h) {
        return h ? (i.directives[u] = h, d) : i.directives[u];
      },
      mount(u, h, x) {
        if (!c) {
          const _ = d._ceVNode || ee(s, r);
          return _.appContext = i, x === !0 ? x = "svg" : x === !1 && (x = void 0), e(_, u, x), c = !0, d._container = u, u.__vue_app__ = d, Ts(_.component);
        }
      },
      onUnmount(u) {
        o.push(u);
      },
      unmount() {
        c && (Oe(
          o,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(u, h) {
        return i.provides[u] = h, d;
      },
      runWithContext(u) {
        const h = Mt;
        Mt = d;
        try {
          return u();
        } finally {
          Mt = h;
        }
      }
    };
    return d;
  };
}
let Mt = null;
const ql = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Pe(t)}Modifiers`] || e[`${ot(t)}Modifiers`];
function Gl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Q;
  let r = n;
  const i = t.startsWith("update:"), l = i && ql(s, t.slice(7));
  l && (l.trim && (r = n.map((u) => ie(u) ? u.trim() : u)), l.number && (r = n.map(Ii)));
  let o, c = s[o = jn(t)] || // also try camelCase event handler (#2249)
  s[o = jn(Pe(t))];
  !c && i && (c = s[o = jn(ot(t))]), c && Oe(
    c,
    e,
    6,
    r
  );
  const d = s[o + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, Oe(
      d,
      e,
      6,
      r
    );
  }
}
const Jl = /* @__PURE__ */ new WeakMap();
function ri(e, t, n = !1) {
  const s = n ? Jl : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let l = {}, o = !1;
  if (!D(e)) {
    const c = (d) => {
      const u = ri(d, t, !0);
      u && (o = !0, ce(l, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !o ? (z(e) && s.set(e, null), null) : (I(i) ? i.forEach((c) => l[c] = null) : ce(l, i), z(e) && s.set(e, l), l);
}
function Nn(e, t) {
  return !e || !En(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), W(e, t[0].toLowerCase() + t.slice(1)) || W(e, ot(t)) || W(e, t));
}
function Ks(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    propsOptions: [i],
    slots: l,
    attrs: o,
    emit: c,
    render: d,
    renderCache: u,
    props: h,
    data: x,
    setupState: _,
    ctx: M,
    inheritAttrs: O
  } = e, V = yn(e);
  let B, k;
  try {
    if (n.shapeFlag & 4) {
      const g = r || s, N = g;
      B = Be(
        d.call(
          N,
          g,
          u,
          h,
          _,
          x,
          M
        )
      ), k = o;
    } else {
      const g = t;
      B = Be(
        g.length > 1 ? g(
          h,
          { attrs: o, slots: l, emit: c }
        ) : g(
          h,
          null
        )
      ), k = t.props ? o : Yl(o);
    }
  } catch (g) {
    wt.length = 0, Ln(g, e, 1), B = ee(be);
  }
  let H = B;
  if (k && O !== !1) {
    const g = Object.keys(k), { shapeFlag: N } = H;
    g.length && N & 7 && (i && g.some(An) && (k = Xl(
      k,
      i
    )), H = lt(H, k, !1, !0));
  }
  if (n.dirs && (H = lt(H, null, !1, !0), H.dirs = H.dirs ? H.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const g = In(H.type) && vn(H) || H;
    Gt(g, n.transition);
  }
  return B = H, yn(V), B;
}
const Yl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || En(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Xl = (e, t) => {
  const n = {};
  for (const s in e)
    (!An(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Zl(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: l, children: o, patchFlag: c } = t, d = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Us(s, l, d) : !!l;
    if (c & 8) {
      const u = t.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        const x = u[h];
        if (ii(l, s, x) && !Nn(d, x))
          return !0;
      }
    }
  } else
    return (r || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Us(s, l, d) : !0 : !!l;
  return !1;
}
function Us(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (ii(t, e, i) && !Nn(n, i))
      return !0;
  }
  return !1;
}
function ii(e, t, n) {
  const s = e[n], r = t[n];
  return n === "style" && z(s) && z(r) ? !ps(s, r) : s !== r;
}
function Ql({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = s, e = r), r === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const li = {}, oi = () => Object.create(li), ci = (e) => Object.getPrototypeOf(e) === li;
function eo(e, t, n, s = !1) {
  const r = {}, i = oi();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), ai(e, t, r, i);
  for (const l in e.propsOptions[0])
    l in r || (r[l] = void 0);
  n ? e.props = s ? r : /* @__PURE__ */ ol(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function to(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ U(r), [c] = e.propsOptions;
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
        let x = u[h];
        if (Nn(e.emitsOptions, x))
          continue;
        const _ = t[x];
        if (c)
          if (W(i, x))
            _ !== i[x] && (i[x] = _, d = !0);
          else {
            const M = Pe(x);
            r[M] = as(
              c,
              o,
              M,
              _,
              e,
              !1
            );
          }
        else
          _ !== i[x] && (i[x] = _, d = !0);
      }
    }
  } else {
    ai(e, t, r, i) && (d = !0);
    let u;
    for (const h in o)
      (!t || // for camelCase
      !W(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = ot(h)) === h || !W(t, u))) && (c ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[u] !== void 0) && (r[h] = as(
        c,
        o,
        h,
        void 0,
        e,
        !0
      )) : delete r[h]);
    if (i !== o)
      for (const h in i)
        (!t || !W(t, h)) && (delete i[h], d = !0);
  }
  d && Xe(e.attrs, "set", "");
}
function ai(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (kt(c))
        continue;
      const d = t[c];
      let u;
      r && W(r, u = Pe(c)) ? !i || !i.includes(u) ? n[u] = d : (o || (o = {}))[u] = d : Nn(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, l = !0);
    }
  if (i) {
    const c = /* @__PURE__ */ U(n), d = o || Q;
    for (let u = 0; u < i.length; u++) {
      const h = i[u];
      n[h] = as(
        r,
        c,
        h,
        d[h],
        e,
        !W(d, h)
      );
    }
  }
  return l;
}
function as(e, t, n, s, r, i) {
  const l = e[n];
  if (l != null) {
    const o = W(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && D(c)) {
        const { propsDefaults: d } = r;
        if (n in d)
          s = d[n];
        else {
          const u = rn(r);
          s = d[n] = c.call(
            null,
            t
          ), u();
        }
      } else
        s = c;
      r.ce && r.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (i && !o ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === ot(n)) && (s = !0));
  }
  return s;
}
const no = /* @__PURE__ */ new WeakMap();
function ui(e, t, n = !1) {
  const s = n ? no : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, l = {}, o = [];
  let c = !1;
  if (!D(e)) {
    const u = (h) => {
      c = !0;
      const [x, _] = ui(h, t, !0);
      ce(l, x), _ && o.push(..._);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!i && !c)
    return z(e) && s.set(e, Tt), Tt;
  if (I(i))
    for (let u = 0; u < i.length; u++) {
      const h = Pe(i[u]);
      Ws(h) && (l[h] = Q);
    }
  else if (i)
    for (const u in i) {
      const h = Pe(u);
      if (Ws(h)) {
        const x = i[u], _ = l[h] = I(x) || D(x) ? { type: x } : ce({}, x), M = _.type;
        let O = !1, V = !0;
        if (I(M))
          for (let B = 0; B < M.length; ++B) {
            const k = M[B], H = D(k) && k.name;
            if (H === "Boolean") {
              O = !0;
              break;
            } else H === "String" && (V = !1);
          }
        else
          O = D(M) && M.name === "Boolean";
        _[
          0
          /* shouldCast */
        ] = O, _[
          1
          /* shouldCastTrue */
        ] = V, (O || W(_, "default")) && o.push(h);
      }
    }
  const d = [l, o];
  return z(e) && s.set(e, d), d;
}
function Ws(e) {
  return e[0] !== "$" && !kt(e);
}
const Ss = (e) => e === "_" || e === "_ctx" || e === "$stable", Cs = (e) => I(e) ? e.map(Be) : [Be(e)], so = (e, t, n) => {
  if (t._n)
    return t;
  const s = Ht((...r) => Cs(t(...r)), n);
  return s._c = !1, s;
}, fi = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (Ss(r)) continue;
    const i = e[r];
    if (D(i))
      t[r] = so(r, i, s);
    else if (i != null) {
      const l = Cs(i);
      t[r] = () => l;
    }
  }
}, di = (e, t) => {
  const n = Cs(t);
  e.slots.default = () => n;
}, hi = (e, t, n) => {
  for (const s in t)
    (n || !Ss(s)) && (e[s] = t[s]);
}, ro = (e, t, n) => {
  const s = e.slots = oi();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (hi(s, t, n), n && wr(s, "_", r, !0)) : fi(t, s);
  } else t && di(e, t);
}, io = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, l = Q;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? i = !1 : hi(r, t, n) : (i = !t.$stable, fi(t, r)), l = t;
  } else t && (di(e, t), l = { default: 1 });
  if (i)
    for (const o in r)
      !Ss(o) && l[o] == null && delete r[o];
}, _e = uo;
function lo(e) {
  return oo(e);
}
function oo(e, t) {
  const n = On();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: i,
    createElement: l,
    createText: o,
    createComment: c,
    setText: d,
    setElementText: u,
    parentNode: h,
    nextSibling: x,
    setScopeId: _ = Ue,
    insertStaticContent: M
  } = e, O = (a, f, p, w = null, b = null, y = null, T = void 0, C = null, S = !!f.dynamicChildren) => {
    if (a === f)
      return;
    a && !mt(a, f) && (w = on(a), Re(a, b, y, !0), a = null), f.patchFlag === -2 && (S = !1, f.dynamicChildren = null);
    const { type: v, ref: P, shapeFlag: E } = f;
    switch (v) {
      case Dn:
        V(a, f, p, w);
        break;
      case be:
        B(a, f, p, w);
        break;
      case hn:
        a == null && k(f, p, w, T);
        break;
      case ne:
        A(
          a,
          f,
          p,
          w,
          b,
          y,
          T,
          C,
          S
        );
        break;
      default:
        E & 1 ? N(
          a,
          f,
          p,
          w,
          b,
          y,
          T,
          C,
          S
        ) : E & 6 ? te(
          a,
          f,
          p,
          w,
          b,
          y,
          T,
          C,
          S
        ) : (E & 64 || E & 128) && v.process(
          a,
          f,
          p,
          w,
          b,
          y,
          T,
          C,
          S,
          Pt
        );
    }
    P != null && b ? Vt(P, a && a.ref, y, f || a, !f) : P == null && a && a.ref != null && Vt(a.ref, null, y, a, !0);
  }, V = (a, f, p, w) => {
    if (a == null)
      s(
        f.el = o(f.children),
        p,
        w
      );
    else {
      const b = f.el = a.el;
      f.children !== a.children && d(b, f.children);
    }
  }, B = (a, f, p, w) => {
    a == null ? s(
      f.el = c(f.children || ""),
      p,
      w
    ) : f.el = a.el;
  }, k = (a, f, p, w) => {
    [a.el, a.anchor] = M(
      a.children,
      f,
      p,
      w,
      a.el,
      a.anchor
    );
  }, H = ({ el: a, anchor: f }, p, w) => {
    let b;
    for (; a && a !== f; )
      b = x(a), s(a, p, w), a = b;
    s(f, p, w);
  }, g = ({ el: a, anchor: f }) => {
    let p;
    for (; a && a !== f; )
      p = x(a), r(a), a = p;
    r(f);
  }, N = (a, f, p, w, b, y, T, C, S) => {
    if (f.type === "svg" ? T = "svg" : f.type === "math" && (T = "mathml"), a == null)
      le(
        f,
        p,
        w,
        b,
        y,
        T,
        C,
        S
      );
    else {
      const v = a.el && a.el._isVueCE ? a.el : null;
      try {
        v && v._beginPatch(), j(
          a,
          f,
          b,
          y,
          T,
          C,
          S
        );
      } finally {
        v && v._endPatch();
      }
    }
  }, le = (a, f, p, w, b, y, T, C) => {
    let S, v;
    const { props: P, shapeFlag: E, transition: $, dirs: F } = a;
    if (S = a.el = l(
      a.type,
      y,
      P && P.is,
      P
    ), E & 8 ? u(S, a.children) : E & 16 && we(
      a.children,
      S,
      null,
      w,
      b,
      Jn(a, y),
      T,
      C
    ), F && ut(a, null, w, "created"), ge(S, a, a.scopeId, T, w), P) {
      for (const Y in P)
        Y !== "value" && !kt(Y) && i(S, Y, null, P[Y], y, w);
      "value" in P && i(S, "value", null, P.value, y), (v = P.onVnodeBeforeMount) && De(v, w, a);
    }
    F && ut(a, null, w, "beforeMount");
    const K = co(b, $);
    K && $.beforeEnter(S), s(S, f, p), ((v = P && P.onVnodeMounted) || K || F) && _e(() => {
      try {
        v && De(v, w, a), K && $.enter(S), F && ut(a, null, w, "mounted");
      } finally {
      }
    }, b);
  }, ge = (a, f, p, w, b) => {
    if (p && _(a, p), w)
      for (let y = 0; y < w.length; y++)
        _(a, w[y]);
    if (b) {
      let y = b.subTree;
      if (f === y || yi(y.type) && (y.ssContent === f || y.ssFallback === f)) {
        const T = b.vnode;
        ge(
          a,
          T,
          T.scopeId,
          T.slotScopeIds,
          b.parent
        );
      }
    }
  }, we = (a, f, p, w, b, y, T, C, S = 0) => {
    for (let v = S; v < a.length; v++) {
      const P = a[v] = C ? Ye(a[v]) : Be(a[v]);
      O(
        null,
        P,
        f,
        p,
        w,
        b,
        y,
        T,
        C
      );
    }
  }, j = (a, f, p, w, b, y, T) => {
    const C = f.el = a.el;
    let { patchFlag: S, dynamicChildren: v, dirs: P } = f;
    S |= a.patchFlag & 16;
    const E = a.props || Q, $ = f.props || Q;
    let F;
    if (p && ft(p, !1), (F = $.onVnodeBeforeUpdate) && De(F, p, f, a), P && ut(f, a, p, "beforeUpdate"), p && ft(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    v && (!a.dynamicChildren || a.dynamicChildren.length !== v.length) && (S = 0, T = !1, v = null), (E.innerHTML && $.innerHTML == null || E.textContent && $.textContent == null) && u(C, ""), v ? G(
      a.dynamicChildren,
      v,
      C,
      p,
      w,
      Jn(f, b),
      y
    ) : T || X(
      a,
      f,
      C,
      null,
      p,
      w,
      Jn(f, b),
      y,
      !1
    ), S > 0) {
      if (S & 16)
        se(C, E, $, p, b);
      else if (S & 2 && E.class !== $.class && i(C, "class", null, $.class, b), S & 4 && i(C, "style", E.style, $.style, b), S & 8) {
        const K = f.dynamicProps;
        for (let Y = 0; Y < K.length; Y++) {
          const J = K[Y], oe = E[J], ue = $[J];
          (ue !== oe || J === "value") && i(C, J, oe, ue, b, p);
        }
      }
      S & 1 && a.children !== f.children && u(C, f.children);
    } else !T && v == null && se(C, E, $, p, b);
    ((F = $.onVnodeUpdated) || P) && _e(() => {
      F && De(F, p, f, a), P && ut(f, a, p, "updated");
    }, w);
  }, G = (a, f, p, w, b, y, T) => {
    for (let C = 0; C < f.length; C++) {
      const S = a[C], v = f[C], P = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        S.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (S.type === ne || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !mt(S, v) || // - In the case of a component, it could contain anything.
        S.shapeFlag & 198) ? h(S.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      O(
        S,
        v,
        P,
        null,
        w,
        b,
        y,
        T,
        !0
      );
    }
  }, se = (a, f, p, w, b) => {
    if (f !== p) {
      if (f !== Q)
        for (const y in f)
          !kt(y) && !(y in p) && i(
            a,
            y,
            f[y],
            null,
            b,
            w
          );
      for (const y in p) {
        if (kt(y)) continue;
        const T = p[y], C = f[y];
        T !== C && y !== "value" && i(a, y, C, T, b, w);
      }
      "value" in p && i(a, "value", f.value, p.value, b);
    }
  }, A = (a, f, p, w, b, y, T, C, S) => {
    const v = f.el = a ? a.el : o(""), P = f.anchor = a ? a.anchor : o("");
    let { patchFlag: E, dynamicChildren: $, slotScopeIds: F } = f;
    F && (C = C ? C.concat(F) : F), a == null ? (s(v, p, w), s(P, p, w), we(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      p,
      P,
      b,
      y,
      T,
      C,
      S
    )) : E > 0 && E & 64 && $ && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    a.dynamicChildren && a.dynamicChildren.length === $.length ? (G(
      a.dynamicChildren,
      $,
      p,
      b,
      y,
      T,
      C
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || b && f === b.subTree) && pi(
      a,
      f,
      !0
      /* shallow */
    )) : X(
      a,
      f,
      p,
      P,
      b,
      y,
      T,
      C,
      S
    );
  }, te = (a, f, p, w, b, y, T, C, S) => {
    f.slotScopeIds = C, a == null ? f.shapeFlag & 512 ? b.ctx.activate(
      f,
      p,
      w,
      T,
      S
    ) : de(
      f,
      p,
      w,
      b,
      y,
      T,
      S
    ) : ze(a, f, S);
  }, de = (a, f, p, w, b, y, T) => {
    const C = a.component = yo(
      a,
      w,
      b
    );
    if (Rn(a) && (C.ctx.renderer = Pt), vo(C, !1, T), C.asyncDep) {
      if (b && b.registerDep(C, ae, T), !a.el) {
        const S = C.subTree = ee(be);
        B(null, S, f, p), a.placeholder = S.el;
      }
    } else
      ae(
        C,
        a,
        f,
        p,
        b,
        y,
        T
      );
  }, ze = (a, f, p) => {
    const w = f.component = a.component;
    if (Zl(a, f, p))
      if (w.asyncDep && !w.asyncResolved) {
        re(w, f, p);
        return;
      } else
        w.next = f, w.update();
    else
      f.el = a.el, w.vnode = f;
  }, ae = (a, f, p, w, b, y, T) => {
    const C = () => {
      if (a.isMounted) {
        let { next: E, bu: $, u: F, parent: K, vnode: Y } = a;
        {
          const He = gi(a);
          if (He) {
            E && (E.el = Y.el, re(a, E, T)), He.asyncDep.then(() => {
              _e(() => {
                a.isUnmounted || v();
              }, b);
            });
            return;
          }
        }
        let J = E, oe;
        ft(a, !1), E ? (E.el = Y.el, re(a, E, T)) : E = Y, $ && Bn($), (oe = E.props && E.props.onVnodeBeforeUpdate) && De(oe, K, E, Y), ft(a, !0);
        const ue = Ks(a), Fe = a.subTree;
        a.subTree = ue, O(
          Fe,
          ue,
          // parent may have changed if it's in a teleport
          h(Fe.el),
          // anchor may have changed if it's in a fragment
          on(Fe),
          a,
          b,
          y
        ), E.el = ue.el, J === null && Ql(a, ue.el), F && _e(F, b), (oe = E.props && E.props.onVnodeUpdated) && _e(
          () => De(oe, K, E, Y),
          b
        );
      } else {
        let E;
        const { el: $, props: F } = f, { bm: K, m: Y, parent: J, root: oe, type: ue } = a, Fe = Kt(f);
        ft(a, !1), K && Bn(K), !Fe && (E = F && F.onVnodeBeforeMount) && De(E, J, f), ft(a, !0);
        {
          oe.ce && oe.ce._hasShadowRoot() && oe.ce._injectChildStyle(
            ue,
            a.parent ? a.parent.type : void 0
          );
          const He = a.subTree = Ks(a);
          O(
            null,
            He,
            p,
            w,
            a,
            b,
            y
          ), f.el = He.el;
        }
        if (Y && _e(Y, b), !Fe && (E = F && F.onVnodeMounted)) {
          const He = f;
          _e(
            () => De(E, J, He),
            b
          );
        }
        (f.shapeFlag & 256 || J && Kt(J.vnode) && J.vnode.shapeFlag & 256) && a.a && _e(a.a, b), a.isMounted = !0, f = p = w = null;
      }
    };
    a.scope.on();
    const S = a.effect = new Tr(C);
    a.scope.off();
    const v = a.update = S.run.bind(S), P = a.job = S.runIfDirty.bind(S);
    P.i = a, P.id = a.uid, S.scheduler = () => _s(P), ft(a, !0), v();
  }, re = (a, f, p) => {
    f.component = a;
    const w = a.vnode.props;
    a.vnode = f, a.next = null, to(a, f.props, w, p), io(a, f.children, p), Ze(), Hs(a), Qe();
  }, X = (a, f, p, w, b, y, T, C, S = !1) => {
    const v = a && a.children, P = a ? a.shapeFlag : 0, E = f.children, { patchFlag: $, shapeFlag: F } = f;
    if ($ > 0) {
      if ($ & 128) {
        ln(
          v,
          E,
          p,
          w,
          b,
          y,
          T,
          C,
          S
        );
        return;
      } else if ($ & 256) {
        ct(
          v,
          E,
          p,
          w,
          b,
          y,
          T,
          C,
          S
        );
        return;
      }
    }
    F & 8 ? (P & 16 && $t(v, b, y), E !== v && u(p, E)) : P & 16 ? F & 16 ? ln(
      v,
      E,
      p,
      w,
      b,
      y,
      T,
      C,
      S
    ) : $t(v, b, y, !0) : (P & 8 && u(p, ""), F & 16 && we(
      E,
      p,
      w,
      b,
      y,
      T,
      C,
      S
    ));
  }, ct = (a, f, p, w, b, y, T, C, S) => {
    a = a || Tt, f = f || Tt;
    const v = a.length, P = f.length, E = Math.min(v, P);
    let $;
    for ($ = 0; $ < E; $++) {
      const F = f[$] = S ? Ye(f[$]) : Be(f[$]);
      O(
        a[$],
        F,
        p,
        null,
        b,
        y,
        T,
        C,
        S
      );
    }
    v > P ? $t(
      a,
      b,
      y,
      !0,
      !1,
      E
    ) : we(
      f,
      p,
      w,
      b,
      y,
      T,
      C,
      S,
      E
    );
  }, ln = (a, f, p, w, b, y, T, C, S) => {
    let v = 0;
    const P = f.length;
    let E = a.length - 1, $ = P - 1;
    for (; v <= E && v <= $; ) {
      const F = a[v], K = f[v] = S ? Ye(f[v]) : Be(f[v]);
      if (mt(F, K))
        O(
          F,
          K,
          p,
          null,
          b,
          y,
          T,
          C,
          S
        );
      else
        break;
      v++;
    }
    for (; v <= E && v <= $; ) {
      const F = a[E], K = f[$] = S ? Ye(f[$]) : Be(f[$]);
      if (mt(F, K))
        O(
          F,
          K,
          p,
          null,
          b,
          y,
          T,
          C,
          S
        );
      else
        break;
      E--, $--;
    }
    if (v > E) {
      if (v <= $) {
        const F = $ + 1, K = F < P ? f[F].el : w;
        for (; v <= $; )
          O(
            null,
            f[v] = S ? Ye(f[v]) : Be(f[v]),
            p,
            K,
            b,
            y,
            T,
            C,
            S
          ), v++;
      }
    } else if (v > $)
      for (; v <= E; )
        Re(a[v], b, y, !0), v++;
    else {
      const F = v, K = v, Y = /* @__PURE__ */ new Map();
      for (v = K; v <= $; v++) {
        const Se = f[v] = S ? Ye(f[v]) : Be(f[v]);
        Se.key != null && Y.set(Se.key, v);
      }
      let J, oe = 0;
      const ue = $ - K + 1;
      let Fe = !1, He = 0;
      const Lt = new Array(ue);
      for (v = 0; v < ue; v++) Lt[v] = 0;
      for (v = F; v <= E; v++) {
        const Se = a[v];
        if (oe >= ue) {
          Re(Se, b, y, !0);
          continue;
        }
        let Ne;
        if (Se.key != null)
          Ne = Y.get(Se.key);
        else
          for (J = K; J <= $; J++)
            if (Lt[J - K] === 0 && mt(Se, f[J])) {
              Ne = J;
              break;
            }
        Ne === void 0 ? Re(Se, b, y, !0) : (Lt[Ne - K] = v + 1, Ne >= He ? He = Ne : Fe = !0, O(
          Se,
          f[Ne],
          p,
          null,
          b,
          y,
          T,
          C,
          S
        ), oe++);
      }
      const Os = Fe ? ao(Lt) : Tt;
      for (J = Os.length - 1, v = ue - 1; v >= 0; v--) {
        const Se = K + v, Ne = f[Se], $s = f[Se + 1], Ps = Se + 1 < P ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          $s.el || mi($s)
        ) : w;
        Lt[v] === 0 ? O(
          null,
          Ne,
          p,
          Ps,
          b,
          y,
          T,
          C,
          S
        ) : Fe && (J < 0 || v !== Os[J] ? at(Ne, p, Ps, 2) : J--);
      }
    }
  }, at = (a, f, p, w, b = null) => {
    const { el: y, type: T, transition: C, children: S, shapeFlag: v } = a;
    if (v & 6) {
      at(a.component.subTree, f, p, w);
      return;
    }
    if (v & 128) {
      a.suspense.move(f, p, w);
      return;
    }
    if (v & 64) {
      T.move(a, f, p, Pt);
      return;
    }
    if (T === ne) {
      s(y, f, p);
      for (let E = 0; E < S.length; E++)
        at(S[E], f, p, w);
      s(a.anchor, f, p);
      return;
    }
    if (T === hn) {
      H(a, f, p);
      return;
    }
    if (w !== 2 && v & 1 && C)
      if (w === 0)
        C.persisted && !y[Ae] ? s(y, f, p) : (C.beforeEnter(y), s(y, f, p), _e(() => C.enter(y), b));
      else {
        const { leave: E, delayLeave: $, afterLeave: F } = C, K = () => {
          a.ctx.isUnmounted ? r(y) : s(y, f, p);
        }, Y = () => {
          const J = y._isLeaving || !!y[Ae];
          y._isLeaving && y[Ae](
            !0
            /* cancelled */
          ), C.persisted && !J ? K() : E(y, () => {
            K(), F && F();
          });
        };
        $ ? $(y, K, Y) : Y();
      }
    else
      s(y, f, p);
  }, Re = (a, f, p, w = !1, b = !1) => {
    const {
      type: y,
      props: T,
      ref: C,
      children: S,
      dynamicChildren: v,
      shapeFlag: P,
      patchFlag: E,
      dirs: $,
      cacheIndex: F,
      memo: K
    } = a;
    if (E === -2 && (b = !1), C != null && (Ze(), Vt(C, null, p, a, !0), Qe()), F != null && (f.renderCache[F] = void 0), P & 256) {
      f.ctx.deactivate(a);
      return;
    }
    const Y = P & 1 && $, J = !Kt(a);
    let oe;
    if (J && (oe = T && T.onVnodeBeforeUnmount) && De(oe, f, a), P & 6)
      Mi(a.component, p, w);
    else {
      if (P & 128) {
        a.suspense.unmount(p, w);
        return;
      }
      Y && ut(a, null, f, "beforeUnmount"), P & 64 ? a.type.remove(
        a,
        f,
        p,
        Pt,
        w
      ) : v && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !v.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (y !== ne || E > 0 && E & 64) ? $t(
        v,
        f,
        p,
        !1,
        !0
      ) : (y === ne && E & 384 || !b && P & 16) && $t(S, f, p), w && As(a);
    }
    const ue = K != null && F == null;
    (J && (oe = T && T.onVnodeUnmounted) || Y || ue) && _e(() => {
      oe && De(oe, f, a), Y && ut(a, null, f, "unmounted"), ue && (a.el = null);
    }, p);
  }, As = (a) => {
    const { type: f, el: p, anchor: w, transition: b } = a;
    if (f === ne) {
      Ai(p, w);
      return;
    }
    if (f === hn) {
      g(a);
      return;
    }
    const y = () => {
      r(p), b && !b.persisted && b.afterLeave && b.afterLeave();
    };
    if (a.shapeFlag & 1 && b && !b.persisted) {
      const { leave: T, delayLeave: C } = b, S = () => T(p, y);
      C ? C(a.el, y, S) : S();
    } else
      y();
  }, Ai = (a, f) => {
    let p;
    for (; a !== f; )
      p = x(a), r(a), a = p;
    r(f);
  }, Mi = (a, f, p) => {
    const { bum: w, scope: b, job: y, subTree: T, um: C, m: S, a: v } = a;
    zs(S), zs(v), w && Bn(w), b.stop(), y && (y.flags |= 8, Re(T, a, f, p)), C && _e(C, f), _e(() => {
      a.isUnmounted = !0;
    }, f);
  }, $t = (a, f, p, w = !1, b = !1, y = 0) => {
    for (let T = y; T < a.length; T++)
      Re(a[T], f, p, w, b);
  }, on = (a) => {
    if (a.shapeFlag & 6)
      return on(a.component.subTree);
    if (a.shapeFlag & 128)
      return a.suspense.next();
    const f = x(a.anchor || a.el), p = f && f[Cl];
    return p ? x(p) : f;
  };
  let kn = !1;
  const Ms = (a, f, p) => {
    let w;
    a == null ? f._vnode && (Re(f._vnode, null, null, !0), w = f._vnode.component) : O(
      f._vnode || null,
      a,
      f,
      null,
      null,
      null,
      p
    ), f._vnode = a, kn || (kn = !0, Hs(w), Vr(), kn = !1);
  }, Pt = {
    p: O,
    um: Re,
    m: at,
    r: As,
    mt: de,
    mc: we,
    pc: X,
    pbc: G,
    n: on,
    o: e
  };
  return {
    render: Ms,
    hydrate: void 0,
    createApp: zl(Ms)
  };
}
function Jn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ft({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function co(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function pi(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (I(s) && I(r))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let o = r[i];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = r[i] = Ye(r[i]), o.el = l.el), !n && o.patchFlag !== -2 && pi(l, o)), o.type === Dn && (o.patchFlag === -1 && (o = r[i] = Ye(o)), o.el = l.el), o.type === be && !o.el && (o.el = l.el);
    }
}
function ao(e) {
  const t = e.slice(), n = [0];
  let s, r, i, l, o;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const d = e[s];
    if (d !== 0) {
      if (r = n[n.length - 1], e[r] < d) {
        t[s] = r, n.push(s);
        continue;
      }
      for (i = 0, l = n.length - 1; i < l; )
        o = i + l >> 1, e[n[o]] < d ? i = o + 1 : l = o;
      d < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, l = n[i - 1]; i-- > 0; )
    n[i] = l, l = t[l];
  return n;
}
function gi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : gi(t);
}
function zs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function mi(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? mi(t.subTree) : null;
}
const yi = (e) => e.__isSuspense;
function uo(e, t) {
  t && t.pendingBranch ? I(e) ? t.effects.push(...e) : t.effects.push(e) : bl(e);
}
const ne = /* @__PURE__ */ Symbol.for("v-fgt"), Dn = /* @__PURE__ */ Symbol.for("v-txt"), be = /* @__PURE__ */ Symbol.for("v-cmt"), hn = /* @__PURE__ */ Symbol.for("v-stc"), wt = [];
let Te = null;
function L(e = !1) {
  wt.push(Te = e ? null : []);
}
function vi() {
  wt.pop(), Te = wt[wt.length - 1] || null;
}
let Jt = 1;
function wn(e, t = !1) {
  Jt += e, e < 0 && Te && t && (Te.hasOnce = !0);
}
function bi(e) {
  return e.dynamicChildren = Jt > 0 ? Te || Tt : null, vi(), Jt > 0 && Te && Te.push(e), e;
}
function R(e, t, n, s, r, i) {
  return bi(
    m(
      e,
      t,
      n,
      s,
      r,
      i,
      !0
    )
  );
}
function xi(e, t, n, s, r) {
  return bi(
    ee(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function _n(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function mt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const wi = ({ key: e }) => e ?? null, pn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ie(e) || /* @__PURE__ */ pe(e) || D(e) ? { i: Ke, r: e, k: t, f: !!n } : e : null);
function m(e, t = null, n = null, s = 0, r = null, i = e === ne ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && wi(t),
    ref: t && pn(t),
    scopeId: Ur,
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
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Ke
  };
  return o ? (Sn(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= ie(n) ? 8 : 16), Jt > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Te && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && Te.push(c), c;
}
const ee = fo;
function fo(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === Dl) && (e = be), _n(e)) {
    const o = lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Sn(o, n), Jt > 0 && !i && Te && (o.shapeFlag & 6 ? Te[Te.indexOf(e)] = o : Te.push(o)), o.patchFlag = -2, o;
  }
  if (_o(e) && (e = e.__vccOpts), t) {
    t = ho(t);
    let { class: o, style: c } = t;
    o && !ie(o) && (t.class = tn(o)), z(c) && (/* @__PURE__ */ ws(c) && !I(c) && (c = ce({}, c)), t.style = en(c));
  }
  const l = ie(e) ? 1 : yi(e) ? 128 : In(e) ? 64 : z(e) ? 4 : D(e) ? 2 : 0;
  return m(
    e,
    t,
    n,
    s,
    r,
    l,
    i,
    !0
  );
}
function ho(e) {
  return e ? /* @__PURE__ */ ws(e) || ci(e) ? ce({}, e) : e : null;
}
function lt(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: l, children: o, transition: c } = e, d = t ? po(r || {}, t) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && wi(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? I(i) ? i.concat(pn(t)) : [i, pn(t)] : pn(t)
    ) : i,
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
    patchFlag: t && e.type !== ne ? l === -1 ? 16 : l | 16 : l,
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
    ssContent: e.ssContent && lt(e.ssContent),
    ssFallback: e.ssFallback && lt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return c && s && Gt(
    u,
    c.clone(u)
  ), u;
}
function $e(e = " ", t = 0) {
  return ee(Dn, null, e, t);
}
function Ce(e, t) {
  const n = ee(hn, null, e);
  return n.staticCount = t, n;
}
function vt(e = "", t = !1) {
  return t ? (L(), xi(be, null, e)) : ee(be, null, e);
}
function Be(e) {
  return e == null || typeof e == "boolean" ? ee(be) : I(e) ? ee(
    ne,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : _n(e) ? Ye(e) : ee(Dn, null, String(e));
}
function Ye(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : lt(e);
}
function Sn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (I(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Sn(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !ci(t) ? t._ctx = Ke : r === 3 && Ke && (Ke.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (D(t)) {
    if (s & 65) {
      Sn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ke }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [$e(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function po(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = tn([t.class, s.class]));
      else if (r === "style")
        t.style = en([t.style, s.style]);
      else if (En(r)) {
        const i = t[r], l = s[r];
        l && i !== l && !(I(i) && i.includes(l)) ? t[r] = i ? [].concat(i, l) : l : l == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !An(r) && (t[r] = l);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function De(e, t, n, s = null) {
  Oe(e, t, 7, [
    n,
    s
  ]);
}
const go = si();
let mo = 0;
function yo(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || go, i = {
    uid: mo++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Vi(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: ui(s, r),
    emitsOptions: ri(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Q,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Q,
    data: Q,
    props: Q,
    attrs: Q,
    slots: Q,
    refs: Q,
    setupState: Q,
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = Gl.bind(null, i), e.ce && e.ce(i), i;
}
let xe = null;
const _i = () => xe || Ke;
let Cn, Yt;
{
  const e = On(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((l) => l(i)) : r[0](i);
    };
  };
  Cn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => xe = n
  ), Yt = t(
    "__VUE_SSR_SETTERS__",
    (n) => Xt = n
  );
}
const rn = (e) => {
  const t = xe;
  return Cn(e), e.scope.on(), () => {
    e.scope.off(), Cn(t);
  };
}, qs = () => {
  xe && xe.scope.off(), Cn(null);
};
function Si(e) {
  return e.vnode.shapeFlag & 4;
}
let Xt = !1;
function vo(e, t = !1, n = !1) {
  t && Yt(t);
  const { props: s, children: r } = e.vnode, i = Si(e);
  eo(e, s, i, t), ro(e, r, n || t);
  const l = i ? bo(e, t) : void 0;
  return t && Yt(!1), l;
}
function bo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, kl);
  const { setup: s } = n;
  if (s) {
    Ze();
    const r = e.setupContext = s.length > 1 ? wo(e) : null, i = rn(e), l = nn(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), o = yr(l);
    if (Qe(), i(), (o || e.sp) && !Kt(e) && Zr(e), o) {
      if (l.then(qs, qs), t)
        return l.then((c) => {
          Yt(!0);
          try {
            Gs(e, c, t);
          } finally {
            Yt(!1);
          }
        }).catch((c) => {
          Ln(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Gs(e, l);
  } else
    Ci(e);
}
function Gs(e, t, n) {
  D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : z(t) && (e.setupState = kr(t)), Ci(e);
}
function Ci(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Ue);
  {
    const r = rn(e);
    Ze();
    try {
      jl(e);
    } finally {
      Qe(), r();
    }
  }
}
const xo = {
  get(e, t) {
    return he(e, "get", ""), e[t];
  }
};
function wo(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, xo),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Ts(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(kr(cl(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Ut)
        return Ut[n](e);
    },
    has(t, n) {
      return n in t || n in Ut;
    }
  })) : e.proxy;
}
function _o(e) {
  return D(e) && "__vccOpts" in e;
}
const Tn = (e, t) => /* @__PURE__ */ hl(e, t, Xt);
function So(e, t, n) {
  try {
    wn(-1);
    const s = arguments.length;
    return s === 2 ? z(t) && !I(t) ? _n(t) ? ee(e, null, [t]) : ee(e, t) : ee(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && _n(n) && (n = [n]), ee(e, t, n));
  } finally {
    wn(1);
  }
}
const Co = "3.5.41";
/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let us;
const Js = typeof window < "u" && window.trustedTypes;
if (Js)
  try {
    us = /* @__PURE__ */ Js.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Ti = us ? (e) => us.createHTML(e) : (e) => e, To = "http://www.w3.org/2000/svg", Eo = "http://www.w3.org/1998/Math/MathML", Je = typeof document < "u" ? document : null, Ys = Je && /* @__PURE__ */ Je.createElement("template"), Ao = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? Je.createElementNS(To, e) : t === "mathml" ? Je.createElementNS(Eo, e) : n ? Je.createElement(e, { is: n }) : Je.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => Je.createTextNode(e),
  createComment: (e) => Je.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Je.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, r, i) {
    const l = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      Ys.innerHTML = Ti(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Ys.content;
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
}, nt = "transition", Ft = "animation", Zt = /* @__PURE__ */ Symbol("_vtc"), Ei = {
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
}, Mo = /* @__PURE__ */ ce(
  {},
  qr,
  Ei
), Oo = (e) => (e.displayName = "Transition", e.props = Mo, e), fn = /* @__PURE__ */ Oo(
  (e, { slots: t }) => So(Al, $o(e), t)
), dt = (e, t = []) => {
  I(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Xs = (e) => e ? I(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function $o(e) {
  const t = {};
  for (const A in e)
    A in Ei || (t[A] = e[A]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: r,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: l = `${n}-enter-active`,
    enterToClass: o = `${n}-enter-to`,
    appearFromClass: c = i,
    appearActiveClass: d = l,
    appearToClass: u = o,
    leaveFromClass: h = `${n}-leave-from`,
    leaveActiveClass: x = `${n}-leave-active`,
    leaveToClass: _ = `${n}-leave-to`
  } = e, M = Po(r), O = M && M[0], V = M && M[1], {
    onBeforeEnter: B,
    onEnter: k,
    onEnterCancelled: H,
    onLeave: g,
    onLeaveCancelled: N,
    onBeforeAppear: le = B,
    onAppear: ge = k,
    onAppearCancelled: we = H
  } = t, j = (A, te, de, ze) => {
    A._enterCancelled = ze, ht(A, te ? u : o), ht(A, te ? d : l), de && de();
  }, G = (A, te) => {
    A._isLeaving = !1, ht(A, h), ht(A, _), ht(A, x), te && te();
  }, se = (A) => (te, de) => {
    const ze = A ? ge : k, ae = () => j(te, A, de);
    dt(ze, [te, ae]), Zs(() => {
      ht(te, A ? c : i), Ge(te, A ? u : o), Xs(ze) || Qs(te, s, O, ae);
    });
  };
  return ce(t, {
    onBeforeEnter(A) {
      dt(B, [A]), Ge(A, i), Ge(A, l);
    },
    onBeforeAppear(A) {
      dt(le, [A]), Ge(A, c), Ge(A, d);
    },
    onEnter: se(!1),
    onAppear: se(!0),
    onLeave(A, te) {
      A._isLeaving = !0;
      const de = () => G(A, te);
      Ge(A, h), A._enterCancelled ? (Ge(A, x), nr(A)) : (nr(A), Ge(A, x)), Zs(() => {
        A._isLeaving && (ht(A, h), Ge(A, _), Xs(g) || Qs(A, s, V, de));
      }), dt(g, [A, de]);
    },
    onEnterCancelled(A) {
      j(A, !1, void 0, !0), dt(H, [A]);
    },
    onAppearCancelled(A) {
      j(A, !0, void 0, !0), dt(we, [A]);
    },
    onLeaveCancelled(A) {
      G(A), dt(N, [A]);
    }
  });
}
function Po(e) {
  if (e == null)
    return null;
  if (z(e))
    return [Yn(e.enter), Yn(e.leave)];
  {
    const t = Yn(e);
    return [t, t];
  }
}
function Yn(e) {
  return Ri(e);
}
function Ge(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Zt] || (e[Zt] = /* @__PURE__ */ new Set())).add(t);
}
function ht(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Zt];
  n && (n.delete(t), n.size || (e[Zt] = void 0));
}
function Zs(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Lo = 0;
function Qs(e, t, n, s) {
  const r = e._endId = ++Lo, i = () => {
    r === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: l, timeout: o, propCount: c } = Io(e, t);
  if (!l)
    return s();
  const d = l + "end";
  let u = 0;
  const h = () => {
    e.removeEventListener(d, x), i();
  }, x = (_) => {
    _.target === e && ++u >= c && h();
  };
  setTimeout(() => {
    u < c && h();
  }, o + 1), e.addEventListener(d, x);
}
function Io(e, t) {
  const n = window.getComputedStyle(e), s = (M) => (n[M] || "").split(", "), r = s(`${nt}Delay`), i = s(`${nt}Duration`), l = er(r, i), o = s(`${Ft}Delay`), c = s(`${Ft}Duration`), d = er(o, c);
  let u = null, h = 0, x = 0;
  t === nt ? l > 0 && (u = nt, h = l, x = i.length) : t === Ft ? d > 0 && (u = Ft, h = d, x = c.length) : (h = Math.max(l, d), u = h > 0 ? l > d ? nt : Ft : null, x = u ? u === nt ? i.length : c.length : 0);
  const _ = u === nt && /\b(?:transform|all)(?:,|$)/.test(
    s(`${nt}Property`).toString()
  );
  return {
    type: u,
    timeout: h,
    propCount: x,
    hasTransform: _
  };
}
function er(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => tr(n) + tr(e[s])));
}
function tr(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function nr(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Ro(e, t, n) {
  const s = e[Zt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const sr = /* @__PURE__ */ Symbol("_vod"), Fo = /* @__PURE__ */ Symbol("_vsh"), Ho = /* @__PURE__ */ Symbol(""), No = /(?:^|;)\s*display\s*:/;
function Do(e, t, n) {
  const s = e.style, r = ie(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (ie(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && Dt(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && Dt(s, l, "");
    for (const l in n) {
      l === "display" && (i = !0);
      const o = n[l];
      o != null ? jo(
        e,
        l,
        !ie(t) && t ? t[l] : void 0,
        o
      ) || Dt(s, l, o) : Dt(s, l, "");
    }
  } else if (r) {
    if (t !== n) {
      const l = s[Ho];
      l && (n += ";" + l), s.cssText = n, i = No.test(n);
    }
  } else t && e.removeAttribute("style");
  sr in e && (e[sr] = i ? s.display : "", e[Fo] && (s.display = "none"));
}
const rr = /\s*!important$/;
function Dt(e, t, n) {
  if (I(n))
    n.forEach((s) => Dt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = ko(e, t);
    rr.test(n) ? e.setProperty(
      ot(s),
      n.replace(rr, ""),
      "important"
    ) : e[s] = n;
  }
}
const ir = ["Webkit", "Moz", "ms"], Xn = {};
function ko(e, t) {
  const n = Xn[t];
  if (n)
    return n;
  let s = Pe(t);
  if (s !== "filter" && s in e)
    return Xn[t] = s;
  s = xr(s);
  for (let r = 0; r < ir.length; r++) {
    const i = ir[r] + s;
    if (i in e)
      return Xn[t] = i;
  }
  return t;
}
function jo(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ie(s) && n === s;
}
const lr = "http://www.w3.org/1999/xlink";
function or(e, t, n, s, r, i = ji(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(lr, t.slice(6, t.length)) : e.setAttributeNS(lr, t, n) : n == null || i && !_r(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : We(n) ? String(n) : n
  );
}
function cr(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Ti(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const o = i === "OPTION" ? e.getAttribute("value") || "" : e.value, c = n == null ? (
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
    o === "boolean" ? n = _r(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(r || t);
}
function Bo(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Vo(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const ar = /* @__PURE__ */ Symbol("_vei");
function Ko(e, t, n, s, r = null) {
  const i = e[ar] || (e[ar] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = zo(t);
    if (s) {
      const d = i[t] = Jo(
        s,
        r
      );
      Bo(e, o, d, c);
    } else l && (Vo(e, o, l, c), i[t] = void 0);
  }
}
const Uo = /(Once|Passive|Capture)$/, Wo = /^on:?(?:Once|Passive|Capture)$/;
function zo(e) {
  let t, n;
  for (; (n = e.match(Uo)) && !Wo.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : ot(e.slice(2)), t];
}
let Zn = 0;
const qo = /* @__PURE__ */ Promise.resolve(), Go = () => Zn || (qo.then(() => Zn = 0), Zn = Date.now());
function Jo(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const r = n.value;
    if (I(r)) {
      const i = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        i.call(s), s._stopped = !0;
      };
      const l = r.slice(), o = [s];
      for (let c = 0; c < l.length && !s._stopped; c++) {
        const d = l[c];
        d && Oe(
          d,
          t,
          5,
          o
        );
      }
    } else
      Oe(
        r,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Go(), n;
}
const ur = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Yo = (e, t, n, s, r, i) => {
  const l = r === "svg";
  t === "class" ? Ro(e, s, l) : t === "style" ? Do(e, n, s) : En(t) ? An(t) || Ko(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Xo(e, t, s, l)) ? (cr(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && or(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Zo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ie(s))) ? cr(e, Pe(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), or(e, t, s, l));
};
function Xo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ur(t) && D(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ur(t) && ie(n) ? !1 : t in e;
}
function Zo(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Pe(t);
  return Array.isArray(n) ? n.some((r) => Pe(r) === s) : Object.keys(n).some((r) => Pe(r) === s);
}
const Qo = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, ec = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = ((r) => {
    if (!("key" in r))
      return;
    const i = ot(r.key);
    if (t.some(
      (l) => l === i || Qo[l] === i
    ))
      return e(r);
  }));
}, tc = /* @__PURE__ */ ce({ patchProp: Yo }, Ao);
let fr;
function nc() {
  return fr || (fr = lo(tc));
}
const sc = ((...e) => {
  const t = nc().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = ic(s);
    if (!r) return;
    const i = t._component;
    !D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const l = n(r, !1, rc(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), l;
  }, t;
});
function rc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function ic(e) {
  return ie(e) ? document.querySelector(e) : e;
}
const lc = ["aria-label"], Es = /* @__PURE__ */ _t({
  __name: "PixelCharacter",
  props: {
    scene: {},
    name: {}
  },
  setup(e) {
    const t = e, n = {
      couple: "两个人",
      cat: "丫丫",
      house: "家",
      girl: "女孩",
      travel: "旅行",
      future: "未来"
    }, s = Tn(() => t.name ? `${t.name}的像素画面` : `${n[t.scene]}的像素画面`);
    return (r, i) => (L(), R("svg", {
      class: "pixel-scene",
      viewBox: "0 0 96 72",
      role: "img",
      "aria-label": s.value,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "couple" ? (L(), R(ne, { key: 0 }, [
        i[0] || (i[0] = Ce('<rect class="ground" x="13" y="59" width="70" height="3"></rect><g class="person-one"><rect x="25" y="26" width="12" height="12"></rect><rect x="22" y="39" width="18" height="15"></rect><rect x="22" y="54" width="6" height="8"></rect><rect x="34" y="54" width="6" height="8"></rect></g><g class="person-two"><rect x="59" y="25" width="12" height="13"></rect><rect x="56" y="39" width="18" height="15"></rect><rect x="56" y="54" width="6" height="8"></rect><rect x="68" y="54" width="6" height="8"></rect></g><rect class="pixel-star" x="45" y="16" width="5" height="5"></rect>', 4))
      ], 64)) : e.scene === "cat" ? (L(), R(ne, { key: 1 }, [
        i[1] || (i[1] = Ce('<g class="cat-body"><rect x="31" y="28" width="34" height="26"></rect><rect x="34" y="21" width="9" height="11"></rect><rect x="54" y="21" width="9" height="11"></rect><rect x="25" y="47" width="10" height="6"></rect><rect x="22" y="42" width="6" height="8"></rect></g><rect class="pixel-warm" x="39" y="36" width="5" height="5"></rect><rect class="pixel-warm" x="53" y="36" width="5" height="5"></rect><rect class="pixel-ink" x="46" y="43" width="5" height="4"></rect><rect class="ground" x="18" y="57" width="62" height="3"></rect>', 5))
      ], 64)) : e.scene === "house" ? (L(), R(ne, { key: 2 }, [
        i[2] || (i[2] = Ce('<path class="house-roof" d="M18 34h8v-7h8v-7h28v7h8v7h8v6H18z"></path><rect class="house-wall" x="25" y="40" width="46" height="24"></rect><rect class="pixel-warm window-glow" x="34" y="47" width="10" height="9"></rect><rect class="pixel-warm window-glow" x="52" y="47" width="10" height="9"></rect><rect class="pixel-door" x="44" y="51" width="9" height="13"></rect><rect class="ground" x="13" y="64" width="70" height="3"></rect>', 6))
      ], 64)) : e.scene === "girl" ? (L(), R(ne, { key: 3 }, [
        i[3] || (i[3] = Ce('<rect class="pixel-star" x="19" y="18" width="4" height="4"></rect><rect class="pixel-star" x="73" y="24" width="3" height="3"></rect><g class="person-two"><rect x="42" y="20" width="13" height="13"></rect><rect x="39" y="34" width="19" height="18"></rect><rect x="41" y="52" width="6" height="10"></rect><rect x="51" y="52" width="6" height="10"></rect></g><rect class="pixel-warm" x="45" y="24" width="3" height="3"></rect><rect class="pixel-warm" x="51" y="24" width="3" height="3"></rect><rect class="ground" x="25" y="62" width="48" height="3"></rect>', 6))
      ], 64)) : e.scene === "travel" ? (L(), R(ne, { key: 4 }, [
        i[4] || (i[4] = Ce('<path class="map-land" d="M16 22h24v7h17v-5h23v35H57v-6H40v6H16z"></path><path class="map-route" d="M25 49L40 37L53 46L70 31"></path><rect class="pixel-warm" x="22" y="46" width="6" height="6"></rect><rect class="pixel-warm" x="37" y="34" width="6" height="6"></rect><rect class="pixel-warm" x="50" y="43" width="6" height="6"></rect><rect class="pixel-warm" x="67" y="28" width="6" height="6"></rect>', 6))
      ], 64)) : (L(), R(ne, { key: 5 }, [
        i[5] || (i[5] = m("rect", {
          class: "future-line",
          x: "14",
          y: "52",
          width: "68",
          height: "3"
        }, null, -1)),
        i[6] || (i[6] = m("rect", {
          class: "pixel-warm",
          x: "17",
          y: "45",
          width: "8",
          height: "7"
        }, null, -1)),
        i[7] || (i[7] = m("rect", {
          class: "future-sun",
          x: "69",
          y: "34",
          width: "13",
          height: "13"
        }, null, -1)),
        i[8] || (i[8] = m("text", {
          class: "future-mark",
          x: "44",
          y: "31"
        }, "?", -1))
      ], 64))
    ], 8, lc));
  }
}), oc = ["aria-label"], cc = { key: 0 }, ac = { key: 1 }, uc = { key: 2 }, fc = { key: 3 }, dc = { key: 4 }, hc = { key: 5 }, pc = { key: 6 }, gc = { key: 7 }, mc = /* @__PURE__ */ _t({
  __name: "PixelMemory",
  props: {
    scene: {},
    label: {}
  },
  setup(e) {
    return (t, n) => (L(), R("svg", {
      class: "pixel-memory",
      viewBox: "0 0 160 70",
      role: "img",
      "aria-label": e.label,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "meeting" ? (L(), R("g", cc, [...n[0] || (n[0] = [
        Ce('<rect class="pm-ground" x="15" y="57" width="130" height="3"></rect><path class="pm-blue" d="M28 31h10v-6h28v6h10v4H28z"></path><rect class="pm-one" x="43" y="35" width="12" height="18"></rect><path class="pm-rose" d="M84 29h10v-6h28v6h10v4H84z"></path><rect class="pm-two" x="99" y="33" width="12" height="20"></rect><rect class="pm-warm" x="76" y="17" width="5" height="5"></rect>', 6)
      ])])) : e.scene === "cat-arrival" ? (L(), R("g", ac, [...n[1] || (n[1] = [
        Ce('<path class="pm-box" d="M47 34h66v25H47zM40 28h33l7 6H47zM120 28H87l-7 6h33z"></path><path class="pm-cat" d="M64 21h8v7h16v-7h8v25H64z"></path><rect class="pm-warm" x="70" y="32" width="4" height="4"></rect><rect class="pm-warm" x="87" y="32" width="4" height="4"></rect><rect class="pm-ink" x="78" y="39" width="5" height="3"></rect>', 5)
      ])])) : e.scene === "cat-life" ? (L(), R("g", uc, [...n[2] || (n[2] = [
        Ce('<rect class="pm-ground" x="18" y="56" width="124" height="3"></rect><path class="pm-cat" d="M26 35h29v18H26zM29 28h8v8h11v-8h7v8"></path><path class="pm-blue" d="M77 45h28l-5 11H82z"></path><rect class="pm-warm" x="112" y="31" width="8" height="8"></rect><rect class="pm-line" x="119" y="36" width="18" height="3"></rect>', 5)
      ])])) : e.scene === "marriage" ? (L(), R("g", fc, [...n[3] || (n[3] = [
        Ce('<rect class="pm-paper" x="43" y="13" width="74" height="47"></rect><rect class="pm-blue" x="43" y="13" width="74" height="9"></rect><rect class="pm-line" x="53" y="29" width="18" height="3"></rect><rect class="pm-line" x="89" y="29" width="18" height="3"></rect><rect class="pm-rose" x="73" y="36" width="7" height="7"></rect><rect class="pm-rose" x="80" y="43" width="7" height="7"></rect><rect class="pm-rose" x="87" y="36" width="7" height="7"></rect>', 7)
      ])])) : e.scene === "wedding" ? (L(), R("g", dc, [...n[4] || (n[4] = [
        Ce('<path class="pm-house" d="M33 34h10v-8h10v-7h54v7h10v8h10v5H33z"></path><rect class="pm-wall" x="43" y="39" width="74" height="21"></rect><rect class="pm-warm" x="56" y="46" width="12" height="9"></rect><rect class="pm-warm" x="92" y="46" width="12" height="9"></rect><rect class="pm-door" x="75" y="46" width="11" height="14"></rect>', 5)
      ])])) : e.scene === "birth" ? (L(), R("g", hc, [...n[5] || (n[5] = [
        Ce('<rect class="pm-ground" x="29" y="57" width="102" height="3"></rect><path class="pm-blue" d="M50 38h62v17H50zM54 32h8v8h42v-8h8v8"></path><rect class="pm-rose" x="71" y="39" width="20" height="12"></rect><rect class="pm-warm" x="76" y="19" width="8" height="8"></rect><rect class="pm-warm" x="78" y="16" width="4" height="14"></rect><rect class="pm-warm" x="73" y="21" width="14" height="4"></rect>', 6)
      ])])) : e.scene === "growing" ? (L(), R("g", pc, [...n[6] || (n[6] = [
        Ce('<rect class="pm-line" x="35" y="14" width="3" height="45"></rect><rect class="pm-line" x="38" y="20" width="10" height="2"></rect><rect class="pm-line" x="38" y="30" width="7" height="2"></rect><rect class="pm-line" x="38" y="40" width="10" height="2"></rect><g class="pm-two"><rect x="68" y="25" width="14" height="14"></rect><rect x="64" y="40" width="22" height="18"></rect></g><rect class="pm-warm" x="104" y="43" width="14" height="14"></rect><rect class="pm-blue" x="118" y="49" width="10" height="8"></rect>', 7)
      ])])) : (L(), R("g", gc, [...n[7] || (n[7] = [
        Ce('<path class="pm-route" d="M24 51L55 28L83 44L131 19"></path><rect class="pm-warm" x="20" y="47" width="8" height="8"></rect><rect class="pm-blue" x="51" y="24" width="8" height="8"></rect><rect class="pm-rose" x="79" y="40" width="8" height="8"></rect><rect class="pm-warm" x="127" y="15" width="8" height="8"></rect><path class="pm-case" d="M66 49h28v14H66zM72 44h16v5H72z"></path>', 6)
      ])]))
    ], 8, oc));
  }
}), yc = ["aria-labelledby"], vc = { class: "chapter-scene" }, bc = { class: "chapter-copy" }, xc = ["id"], wc = { class: "chapter-paragraphs" }, _c = {
  key: 0,
  class: "destination-list",
  "aria-label": "去过的地方"
}, Sc = {
  key: 1,
  class: "future-list",
  "aria-label": "未来清单"
}, Cc = {
  key: 2,
  class: "memory-slots"
}, Tc = /* @__PURE__ */ _t({
  __name: "ChapterCard",
  props: {
    chapter: {},
    index: {},
    total: {}
  },
  emits: ["letter"],
  setup(e) {
    return (t, n) => (L(), R("article", {
      class: "chapter-card",
      "aria-labelledby": `chapter-${e.chapter.id}`
    }, [
      m("div", vc, [
        m("p", null, [
          n[1] || (n[1] = m("span", null, "记忆", -1)),
          m("span", null, q(e.chapter.year), 1)
        ]),
        ee(Es, {
          scene: e.chapter.scene,
          name: e.chapter.title
        }, null, 8, ["scene", "name"]),
        m("small", null, q(e.chapter.subtitle), 1)
      ]),
      m("div", bc, [
        m("header", null, [
          m("span", null, q(String(e.index + 1).padStart(2, "0")) + " / " + q(String(e.total).padStart(2, "0")), 1),
          m("p", null, q(e.chapter.year), 1)
        ]),
        m("h2", {
          id: `chapter-${e.chapter.id}`
        }, q(e.chapter.title), 9, xc),
        m("div", wc, [
          (L(!0), R(ne, null, it(e.chapter.paragraphs, (s) => (L(), R("p", { key: s }, q(s), 1))), 128))
        ]),
        e.chapter.destinations ? (L(), R("ul", _c, [
          (L(!0), R(ne, null, it(e.chapter.destinations, (s) => (L(), R("li", { key: s }, q(s), 1))), 128))
        ])) : vt("", !0),
        e.chapter.futureList ? (L(), R("ul", Sc, [
          (L(!0), R(ne, null, it(e.chapter.futureList, (s) => (L(), R("li", { key: s }, [
            n[2] || (n[2] = m("i", { "aria-hidden": "true" }, null, -1)),
            $e(q(s), 1)
          ]))), 128))
        ])) : vt("", !0),
        e.chapter.memorySlots ? (L(), R("div", Cc, [
          (L(!0), R(ne, null, it(e.chapter.memorySlots, (s) => (L(), R("figure", {
            key: s.label
          }, [
            ee(mc, {
              scene: s.scene,
              label: s.label
            }, null, 8, ["scene", "label"]),
            m("figcaption", null, q(s.label), 1)
          ]))), 128))
        ])) : vt("", !0),
        e.chapter.id === "future" ? (L(), R("button", {
          key: 3,
          class: "text-command",
          type: "button",
          onClick: n[0] || (n[0] = (s) => t.$emit("letter"))
        }, [...n[3] || (n[3] = [
          $e(" 读取 2040 留言 ", -1),
          m("span", { "aria-hidden": "true" }, "→", -1)
        ])])) : vt("", !0)
      ])
    ], 8, yc));
  }
}), Ec = {
  class: "character-panel",
  "aria-labelledby": "character-title"
}, Ac = { class: "character-grid" }, Mc = { class: "character-avatar" }, Oc = { class: "character-level" }, $c = { class: "character-class" }, Pc = { class: "character-skill" }, Lc = { class: "character-description" }, Ic = /* @__PURE__ */ _t({
  __name: "CharacterPanel",
  props: {
    characters: {}
  },
  emits: ["close"],
  setup(e) {
    return (t, n) => (L(), R("aside", Ec, [
      m("header", null, [
        n[1] || (n[1] = m("div", null, [
          m("span", null, "同行成员 / 02"),
          m("h2", { id: "character-title" }, "同行角色")
        ], -1)),
        m("button", {
          type: "button",
          "aria-label": "关闭角色卡",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        }, "×")
      ]),
      m("div", Ac, [
        (L(!0), R(ne, null, it(e.characters, (s) => (L(), R("article", {
          key: s.id
        }, [
          m("div", Mc, [
            ee(Es, {
              scene: s.scene,
              name: s.name
            }, null, 8, ["scene", "name"])
          ]),
          m("p", Oc, "等级 " + q(s.level), 1),
          m("h3", null, q(s.name), 1),
          m("p", $c, q(s.className), 1),
          m("dl", null, [
            (L(!0), R(ne, null, it(s.attributes, (r) => (L(), R("div", {
              key: r.label
            }, [
              m("dt", null, q(r.label), 1),
              m("dd", null, [
                m("i", {
                  style: en({ width: `${r.value}%` })
                }, null, 4),
                m("span", null, q(r.value), 1)
              ])
            ]))), 128))
          ]),
          m("p", Pc, [
            n[2] || (n[2] = m("span", null, "特别能力", -1)),
            $e(q(s.skill), 1)
          ]),
          m("p", Lc, q(s.description), 1)
        ]))), 128))
      ])
    ]));
  }
}), Rc = {
  class: "world-map",
  "aria-labelledby": "world-map-title"
}, Fc = { class: "world-map-head" }, Hc = { class: "map-board" }, Nc = ["aria-label", "onClick"], Dc = /* @__PURE__ */ _t({
  __name: "PixelWorld",
  props: {
    chapters: {},
    visited: {}
  },
  emits: ["select"],
  setup(e) {
    return (t, n) => (L(), R("section", Rc, [
      m("header", Fc, [
        n[0] || (n[0] = m("div", null, [
          m("span", null, "家庭存档 / 01"),
          m("h1", { id: "world-map-title" }, "我们的小世界")
        ], -1)),
        m("p", null, q(e.visited.size) + " / " + q(e.chapters.length) + " 已读取", 1)
      ]),
      m("div", Hc, [
        n[2] || (n[2] = m("svg", {
          class: "map-route-lines",
          viewBox: "0 0 100 100",
          preserveAspectRatio: "none",
          "aria-hidden": "true"
        }, [
          m("path", { d: "M15 31 L32 17 L49 40 L67 20 L82 47 L61 75" })
        ], -1)),
        n[3] || (n[3] = m("div", {
          class: "map-house-light",
          "aria-hidden": "true"
        }, [
          m("i"),
          m("i"),
          m("i"),
          m("i")
        ], -1)),
        (L(!0), R(ne, null, it(e.chapters, (s, r) => (L(), R("button", {
          key: s.id,
          class: tn(["map-node", { visited: e.visited.has(s.id), future: s.id === "future" }]),
          style: en({ "--map-x": `${s.x}%`, "--map-y": `${s.y}%` }),
          type: "button",
          "aria-label": `${s.year} ${s.mapLabel}`,
          onClick: (i) => t.$emit("select", r)
        }, [
          n[1] || (n[1] = m("span", { class: "map-node-beacon" }, [
            m("i")
          ], -1)),
          m("strong", null, q(s.mapLabel), 1),
          m("small", null, q(s.year), 1)
        ], 14, Nc))), 128)),
        n[4] || (n[4] = m("p", { class: "map-hint" }, "选择一个地点，读取这一段存档", -1))
      ])
    ]));
  }
}), kc = /* @__PURE__ */ _t({
  __name: "StarBackground",
  setup(e) {
    const t = /* @__PURE__ */ yt(null);
    let n = null, s = [], r = 0, i, l = 0, o = 0, c = !1;
    function d() {
      const x = Math.min(150, Math.max(55, Math.round(l * o / 10500)));
      s = Array.from({ length: x }, (_, M) => ({
        x: M * 83.17 % 100 / 100 * l,
        y: (M * 47.63 + 13) % 100 / 100 * o,
        size: M % 19 === 0 ? 2 : M % 5 === 0 ? 1.5 : 1,
        alpha: 0.25 + M * 17 % 60 / 100,
        speed: 0.5 + M % 7 * 0.12,
        phase: M * 0.63
      }));
    }
    function u() {
      if (!t.value) return;
      const x = t.value.getBoundingClientRect(), _ = Math.min(window.devicePixelRatio || 1, 2);
      l = x.width, o = x.height, t.value.width = Math.round(l * _), t.value.height = Math.round(o * _), n = t.value.getContext("2d"), n == null || n.setTransform(_, 0, 0, _, 0, 0), d(), h(0);
    }
    function h(x) {
      if (n) {
        n.clearRect(0, 0, l, o);
        for (const _ of s) {
          const M = c ? 1 : 0.72 + Math.sin(x * 1e-3 * _.speed + _.phase) * 0.28;
          n.fillStyle = `rgba(237, 229, 203, ${_.alpha * M})`, n.fillRect(Math.round(_.x), Math.round(_.y), _.size, _.size);
        }
        c || (r = requestAnimationFrame(h));
      }
    }
    return Hn(() => {
      c = window.matchMedia("(prefers-reduced-motion: reduce)").matches, i = new ResizeObserver(u), t.value && i.observe(t.value), c || (r = requestAnimationFrame(h));
    }), sn(() => {
      i == null || i.disconnect(), cancelAnimationFrame(r);
    }), (x, _) => (L(), R("canvas", {
      ref_key: "canvas",
      ref: t,
      class: "world-stars",
      "aria-hidden": "true"
    }, null, 512));
  }
}), pt = [
  {
    id: "beginning",
    year: "2018",
    mapLabel: "相遇",
    title: "我们相遇",
    subtitle: "两个人的开始",
    scene: "couple",
    x: 15,
    y: 31,
    paragraphs: [
      "那一年，我遇见了一个和我完全不同的人。",
      "我习惯思考世界，而你让我更多地感受到它。"
    ],
    memorySlots: [{ label: "第一次并肩", scene: "meeting" }]
  },
  {
    id: "yaya",
    year: "2019",
    mapLabel: "丫丫",
    title: "丫丫来了",
    subtitle: "从两个人，到三个人",
    scene: "cat",
    x: 32,
    y: 17,
    paragraphs: [
      "丫丫来到家里以后，我们第一次需要一起照顾另一个小生命。",
      "屋子里多了猫粮、猫砂和随处可见的猫毛，偶尔还混着猫尿猫屎的味道。照顾另一个生命，大概就是从这些具体而琐碎的事情开始。"
    ],
    memorySlots: [{ label: "初来乍到", scene: "cat-arrival" }, { label: "家里的日常", scene: "cat-life" }]
  },
  {
    id: "home",
    year: "2020",
    mapLabel: "成家",
    title: "我们成为一家人",
    subtitle: "有了共同的方向",
    scene: "house",
    x: 49,
    y: 40,
    paragraphs: [
      "2020 年，我们成为夫妻。",
      "从这一天开始，很多决定不再只考虑自己，我们也真正开始经营同一个家。"
    ],
    memorySlots: [{ label: "共同的日期", scene: "marriage" }, { label: "亮灯的家", scene: "wedding" }]
  },
  {
    id: "little-star",
    year: "2021",
    mapLabel: "小星星",
    title: "一颗新星来到",
    subtitle: "爸爸和妈妈",
    scene: "girl",
    x: 67,
    y: 20,
    paragraphs: [
      "2021 年 7 月 29 日，王卿梧来到我们的世界。",
      "我们的身份又多了两个，从此开始学习怎样做爸爸和妈妈。"
    ],
    memorySlots: [{ label: "初次见面", scene: "birth" }, { label: "慢慢长大", scene: "growing" }]
  },
  {
    id: "explorer",
    year: "2022—2026",
    mapLabel: "去远方",
    title: "妈妈的远行",
    subtitle: "你们去看更远的地方",
    scene: "travel",
    x: 82,
    y: 47,
    paragraphs: [
      "有时我还在自己的事情里，你已经带着女儿去了新的地方。",
      "陕西、香港、新加坡、贵州和云南，这些路程最后都变成了她小时候的记忆。"
    ],
    destinations: ["陕西", "香港", "新加坡", "贵州", "云南"],
    memorySlots: [{ label: "地图上的脚步", scene: "journey" }]
  },
  {
    id: "future",
    year: "2026—",
    mapLabel: "未完待续",
    title: "未来的旅程",
    subtitle: "地图还没有画完",
    scene: "future",
    x: 61,
    y: 75,
    paragraphs: [
      "以后还会去哪里，现在不用急着决定。",
      "这张地图留一部分空白，等我们一起慢慢补上。"
    ],
    futureList: [
      "看一次极光",
      "和卿梧继续探索世界",
      "去一个没有提前计划过的地方",
      "等卿梧长大，也让她带我们出发",
      "等我们老一点，再回来读取这份存档",
      "一些现在还不知道的旅程"
    ]
  }
], jc = [
  {
    id: "ms-wu",
    name: "吴女士",
    level: 35,
    className: "家庭守护者",
    scene: "girl",
    attributes: [
      { label: "善良", value: 99 },
      { label: "共情", value: 98 },
      { label: "探索", value: 95 },
      { label: "母亲", value: 100 }
    ],
    skill: "让家温暖",
    description: "温柔、善良，愿意理解别人，也总能把一家人的生活照顾得妥帖。"
  },
  {
    id: "yaya",
    name: "丫丫",
    level: 7,
    className: "小小伙伴",
    scene: "cat",
    attributes: [
      { label: "可爱", value: 100 },
      { label: "温暖", value: 95 },
      { label: "恋家", value: 99 }
    ],
    skill: "让家热闹起来",
    description: "一只三花猫，也是这个家最早加入的新成员。"
  }
], Qn = {
  year: "2040",
  title: "来自未来的我",
  paragraphs: [
    "谢谢你陪我走过这么多年，也让一个总在思考世界的人，有了一个可以回去的小世界。",
    "希望到了那时，我们仍然会一起出门，一起回家，也仍然愿意听对方说当天发生的事。"
  ]
}, dr = "our-little-world:muted", hr = 12.8, Bc = [
  { beat: 0, note: 587.33, length: 1.15 },
  { beat: 1.6, note: 440, length: 0.75 },
  { beat: 2.6, note: 369.99, length: 1.1 },
  { beat: 4.2, note: 440, length: 0.7 },
  { beat: 5.2, note: 493.88, length: 1.15 },
  { beat: 7.1, note: 440, length: 0.7 },
  { beat: 8.1, note: 329.63, length: 1.05 },
  { beat: 10.2, note: 369.99, length: 1.45 }
];
function Vc() {
  const e = /* @__PURE__ */ yt(!1), t = /* @__PURE__ */ yt(!1);
  let n = null, s = null, r = null;
  try {
    e.value = localStorage.getItem(dr) === "true";
  } catch {
  }
  function i(u, h, x, _) {
    if (!n || !s) return;
    const M = n.createOscillator(), O = n.createOscillator(), V = n.createGain(), B = n.createGain();
    M.type = "triangle", M.frequency.value = h, O.type = "sine", O.frequency.value = h * 2, V.gain.setValueAtTime(1e-4, u), V.gain.exponentialRampToValueAtTime(_, u + 0.08), V.gain.exponentialRampToValueAtTime(1e-4, u + x), B.gain.value = 0.09, M.connect(V), O.connect(B).connect(V), V.connect(s), M.start(u), O.start(u), M.stop(u + x + 0.05), O.stop(u + x + 0.05);
  }
  function l(u) {
    Bc.forEach(({ beat: h, note: x, length: _ }) => i(u + h, x, _, 0.18)), [146.83, 220, 293.66].forEach((h, x) => {
      i(u + x * 0.04, h, hr - 0.7, 0.025);
    });
  }
  async function o() {
    e.value || (n || (n = new AudioContext(), s = n.createGain(), s.gain.value = 0.28, s.connect(n.destination)), await n.resume(), !t.value && (t.value = !0, l(n.currentTime + 0.08), r = window.setInterval(() => {
      (n == null ? void 0 : n.state) === "running" && l(n.currentTime + 0.08);
    }, hr * 1e3)));
  }
  function c() {
    r !== null && window.clearInterval(r), r = null, t.value = !1, n == null || n.close(), n = null, s = null;
  }
  async function d() {
    e.value = !e.value;
    try {
      localStorage.setItem(dr, String(e.value));
    } catch {
    }
    e.value ? c() : await o();
  }
  return sn(() => {
    c();
  }), { muted: e, playing: t, start: o, toggle: d };
}
const Kc = {
  key: "boot",
  class: "boot-screen",
  "aria-labelledby": "world-title"
}, Uc = ["aria-label"], Wc = { "aria-hidden": "true" }, zc = {
  key: "world",
  class: "world-interface"
}, qc = { class: "world-toolbar" }, Gc = { class: "toolbar-actions" }, Jc = ["aria-label"], Yc = { "aria-hidden": "true" }, Xc = {
  key: "chapter",
  class: "chapter-screen"
}, Zc = {
  class: "chapter-nav",
  "aria-label": "章节切换"
}, Qc = ["disabled"], ea = {
  key: "ending",
  class: "ending-screen",
  "aria-labelledby": "ending-title"
}, ta = {
  class: "ending-house",
  "aria-hidden": "true"
}, na = {
  key: 0,
  class: "world-overlay",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "同行角色"
}, sa = {
  key: 0,
  class: "world-overlay letter-overlay",
  role: "dialog",
  "aria-modal": "true",
  "aria-labelledby": "letter-title"
}, ra = { class: "future-letter" }, ia = { id: "letter-title" }, la = /* @__PURE__ */ _t({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ yt("boot"), n = /* @__PURE__ */ yt(0), s = /* @__PURE__ */ yt(!1), r = /* @__PURE__ */ yt(!1), i = /* @__PURE__ */ Pn(/* @__PURE__ */ new Set()), l = Tn(() => pt[n.value]), { muted: o, start: c, toggle: d } = Vc(), u = Tn(() => o.value ? "开启背景音乐" : "关闭背景音乐");
    function h() {
      try {
        localStorage.setItem("our-little-world:visited", JSON.stringify([...i]));
      } catch {
      }
    }
    function x() {
      c(), t.value = "map";
    }
    function _() {
      t.value = "map", r.value = !1;
    }
    function M(H) {
      n.value = H, i.add(pt[H].id), h(), t.value = "chapter";
    }
    function O() {
      n.value > 0 && M(n.value - 1);
    }
    function V() {
      if (n.value < pt.length - 1) {
        M(n.value + 1);
        return;
      }
      t.value = "ending";
    }
    function B() {
      r.value ? r.value = !1 : s.value ? s.value = !1 : (t.value === "chapter" || t.value === "ending") && _();
    }
    function k(H) {
      H.key === "Escape" && B(), !(t.value !== "chapter" || s.value || r.value) && (H.key === "ArrowLeft" && O(), H.key === "ArrowRight" && V());
    }
    return Hn(() => {
      try {
        JSON.parse(localStorage.getItem("our-little-world:visited") || "[]").filter((g) => pt.some((N) => N.id === g)).forEach((g) => i.add(g));
      } catch {
      }
      window.addEventListener("keydown", k);
    }), sn(() => window.removeEventListener("keydown", k)), (H, g) => (L(), R("div", {
      class: tn(["little-world", `screen-${t.value}`]),
      onKeydown: ec(B, ["esc"])
    }, [
      ee(kc),
      g[27] || (g[27] = m("div", {
        class: "world-vignette",
        "aria-hidden": "true"
      }, null, -1)),
      ee(fn, {
        name: "world-fade",
        mode: "out-in"
      }, {
        default: Ht(() => [
          t.value === "boot" ? (L(), R("section", Kc, [
            g[9] || (g[9] = m("div", { class: "boot-save" }, [
              m("span", null, "家庭存档 01"),
              m("span", null, "2018—2026")
            ], -1)),
            m("button", {
              class: "sound-toggle boot-sound",
              type: "button",
              "aria-label": u.value,
              onClick: g[0] || (g[0] = //@ts-ignore
              (...N) => me(d) && me(d)(...N))
            }, [
              m("span", Wc, q(me(o) ? "×" : "♪"), 1),
              $e(q(me(o) ? "声音关闭" : "声音开启"), 1)
            ], 8, Uc),
            g[10] || (g[10] = m("pre", {
              class: "ascii-house",
              "aria-hidden": "true"
            }, `          ·
       ▄▄▄▄▄
      ▀     ▀
     ▀       ▀
    █▄▄▄▄▄▄▄▄▄█
    █  ▣   ▣  █
    █    ▄    █
    █▄▄▄▄▄▄▄▄▄█`, -1)),
            g[11] || (g[11] = m("p", { class: "boot-status" }, [
              m("i"),
              $e(" 世界已载入")
            ], -1)),
            g[12] || (g[12] = m("h1", { id: "world-title" }, "我们的小世界", -1)),
            g[13] || (g[13] = m("p", { class: "boot-names" }, "W × W", -1)),
            m("button", {
              class: "pixel-button boot-enter",
              type: "button",
              onClick: x
            }, [...g[8] || (g[8] = [
              m("span", { "aria-hidden": "true" }, "▶", -1),
              $e(" 进入 ", -1)
            ])]),
            g[14] || (g[14] = m("p", { class: "boot-note" }, "一份用代码完成的家庭礼物", -1))
          ])) : (L(), R("div", zc, [
            m("header", qc, [
              m("button", {
                type: "button",
                class: "toolbar-home",
                onClick: _
              }, [...g[15] || (g[15] = [
                m("span", { "aria-hidden": "true" }, "⌂", -1),
                m("span", null, "世界地图", -1)
              ])]),
              g[17] || (g[17] = m("p", null, [
                m("i"),
                $e(" 我们的小世界 "),
                m("small", null, "/ 运行中")
              ], -1)),
              m("div", Gc, [
                m("button", {
                  class: "sound-toggle",
                  type: "button",
                  "aria-label": u.value,
                  onClick: g[1] || (g[1] = //@ts-ignore
                  (...N) => me(d) && me(d)(...N))
                }, [
                  m("span", Yc, q(me(o) ? "×" : "♪"), 1)
                ], 8, Jc),
                m("button", {
                  type: "button",
                  class: "toolbar-party",
                  onClick: g[2] || (g[2] = (N) => s.value = !0)
                }, [...g[16] || (g[16] = [
                  $e(" 同行角色 ", -1),
                  m("span", null, "02", -1)
                ])])
              ])
            ]),
            ee(fn, {
              name: "scene-shift",
              mode: "out-in"
            }, {
              default: Ht(() => [
                t.value === "map" ? (L(), xi(Dc, {
                  key: "map",
                  chapters: me(pt),
                  visited: i,
                  onSelect: M
                }, null, 8, ["chapters", "visited"])) : t.value === "chapter" && l.value ? (L(), R("section", Xc, [
                  ee(Tc, {
                    chapter: l.value,
                    index: n.value,
                    total: me(pt).length,
                    onLetter: g[3] || (g[3] = (N) => r.value = !0)
                  }, null, 8, ["chapter", "index", "total"]),
                  m("nav", Zc, [
                    m("button", {
                      type: "button",
                      disabled: n.value === 0,
                      onClick: O
                    }, [...g[18] || (g[18] = [
                      m("span", { "aria-hidden": "true" }, "←", -1),
                      $e(" 上一段 ", -1)
                    ])], 8, Qc),
                    m("button", {
                      type: "button",
                      onClick: _
                    }, "返回地图"),
                    m("button", {
                      type: "button",
                      onClick: V
                    }, [
                      $e(q(n.value === me(pt).length - 1 ? "完成探索" : "下一段") + " ", 1),
                      g[19] || (g[19] = m("span", { "aria-hidden": "true" }, "→", -1))
                    ])
                  ])
                ])) : (L(), R("section", ea, [
                  m("div", ta, [
                    ee(Es, { scene: "house" })
                  ]),
                  g[21] || (g[21] = m("p", null, "家庭存档 / 已完成", -1)),
                  g[22] || (g[22] = m("h2", { id: "ending-title" }, "谢谢你", -1)),
                  g[23] || (g[23] = m("p", { class: "ending-copy" }, "谢谢你一直和我一起生活，也一起照顾这个越来越热闹的小世界。", -1)),
                  g[24] || (g[24] = m("strong", null, "七夕快乐", -1)),
                  m("div", { class: "ending-actions" }, [
                    m("button", {
                      class: "pixel-button",
                      type: "button",
                      onClick: _
                    }, "再次查看地图"),
                    g[20] || (g[20] = m("a", { href: "/works/" }, "返回作品列表", -1))
                  ])
                ]))
              ]),
              _: 1
            })
          ]))
        ]),
        _: 1
      }),
      ee(fn, { name: "panel-slide" }, {
        default: Ht(() => [
          s.value ? (L(), R("div", na, [
            m("button", {
              class: "overlay-backdrop",
              type: "button",
              "aria-label": "关闭角色卡",
              onClick: g[4] || (g[4] = (N) => s.value = !1)
            }),
            ee(Ic, {
              characters: me(jc),
              onClose: g[5] || (g[5] = (N) => s.value = !1)
            }, null, 8, ["characters"])
          ])) : vt("", !0)
        ]),
        _: 1
      }),
      ee(fn, { name: "panel-slide" }, {
        default: Ht(() => [
          r.value ? (L(), R("div", sa, [
            m("button", {
              class: "overlay-backdrop",
              type: "button",
              "aria-label": "关闭未来留言",
              onClick: g[6] || (g[6] = (N) => r.value = !1)
            }),
            m("article", ra, [
              m("header", null, [
                m("span", null, q(me(Qn).year), 1),
                m("button", {
                  type: "button",
                  "aria-label": "关闭未来留言",
                  onClick: g[7] || (g[7] = (N) => r.value = !1)
                }, "×")
              ]),
              g[25] || (g[25] = m("p", null, "私人留言", -1)),
              m("h2", ia, q(me(Qn).title), 1),
              m("div", null, [
                (L(!0), R(ne, null, it(me(Qn).paragraphs, (N) => (L(), R("p", { key: N }, q(N), 1))), 128))
              ]),
              g[26] || (g[26] = m("small", null, "这封信先保存在未来，到时候再回来看看。", -1))
            ])
          ])) : vt("", !0)
        ]),
        _: 1
      })
    ], 34));
  }
}), pr = document.querySelector("#our-little-world-app");
pr && sc(la).mount(pr);
