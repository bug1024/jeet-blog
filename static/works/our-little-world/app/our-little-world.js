/**
* @vue/shared v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function ds(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const te = {}, At = [], Ue = () => {
}, yr = () => !1, En = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Mn = (e) => e.startsWith("onUpdate:"), ae = Object.assign, hs = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Pi = Object.prototype.hasOwnProperty, q = (e, t) => Pi.call(e, t), R = Array.isArray, Et = (e) => en(e) === "[object Map]", vr = (e) => en(e) === "[object Set]", Is = (e) => en(e) === "[object Date]", D = (e) => typeof e == "function", oe = (e) => typeof e == "string", We = (e) => typeof e == "symbol", G = (e) => e !== null && typeof e == "object", br = (e) => (G(e) || D(e)) && D(e.then) && D(e.catch), xr = Object.prototype.toString, en = (e) => xr.call(e), Li = (e) => en(e).slice(8, -1), wr = (e) => en(e) === "[object Object]", ps = (e) => oe(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, jt = /* @__PURE__ */ ds(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), On = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Ii = /-\w/g, Pe = On(
  (e) => e.replace(Ii, (t) => t.slice(1).toUpperCase())
), Ri = /\B([A-Z])/g, ot = On(
  (e) => e.replace(Ri, "-$1").toLowerCase()
), _r = On((e) => e.charAt(0).toUpperCase() + e.slice(1)), jn = On(
  (e) => e ? `on${_r(e)}` : ""
), Ve = (e, t) => !Object.is(e, t), Bn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Sr = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Fi = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Hi = (e) => {
  const t = oe(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Rs;
const $n = () => Rs || (Rs = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function tn(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = oe(s) ? ji(s) : tn(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (oe(e) || G(e))
    return e;
}
const Ni = /;(?![^(]*\))/g, Di = /:([^]+)/, ki = /\/\*[^]*?\*\//g;
function ji(e) {
  const t = {};
  return e.replace(ki, "").split(Ni).forEach((n) => {
    if (n) {
      const s = n.split(Di);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function nn(e) {
  let t = "";
  if (oe(e))
    t = e;
  else if (R(e))
    for (let n = 0; n < e.length; n++) {
      const s = nn(e[n]);
      s && (t += s + " ");
    }
  else if (G(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Bi = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Vi = /* @__PURE__ */ ds(Bi);
function Cr(e) {
  return !!e || e === "";
}
function Ki(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = gs(e[s], t[s]);
  return n;
}
function gs(e, t) {
  if (e === t) return !0;
  let n = Is(e), s = Is(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = We(e), s = We(t), n || s)
    return e === t;
  if (n = R(e), s = R(t), n || s)
    return n && s ? Ki(e, t) : !1;
  if (n = G(e), s = G(t), n || s) {
    if (!n || !s)
      return !1;
    const r = Object.keys(e).length, i = Object.keys(t).length;
    if (r !== i)
      return !1;
    for (const l in e) {
      const o = e.hasOwnProperty(l), c = t.hasOwnProperty(l);
      if (o && !c || !o && c || !gs(e[l], t[l]))
        return !1;
    }
  }
  return String(e) === String(t);
}
const Tr = (e) => !!(e && e.__v_isRef === !0), J = (e) => oe(e) ? e : e == null ? "" : R(e) || G(e) && (e.toString === xr || !D(e.toString)) ? Tr(e) ? J(e.value) : JSON.stringify(e, Ar, 2) : String(e), Ar = (e, t) => Tr(t) ? Ar(e, t.value) : Et(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[Vn(s, i) + " =>"] = r, n),
    {}
  )
} : vr(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Vn(n))
} : We(t) ? Vn(t) : G(t) && !R(t) && !wr(t) ? String(t) : t, Vn = (e, t = "") => {
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
let de;
class Ui {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && de && (de.active ? (this.parent = de, this.index = (de.scopes || (de.scopes = [])).push(
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
      const n = de;
      try {
        return de = this, t();
      } finally {
        de = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = de, de = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (de === this)
        de = this.prevScope;
      else {
        let t = de;
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
function Wi() {
  return de;
}
let ee;
const Kn = /* @__PURE__ */ new WeakSet();
class Er {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, de && (de.active ? de.effects.push(this) : this.flags &= -2);
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Or(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Fs(this), $r(this);
    const t = ee, n = Le;
    ee = this, Le = !0;
    try {
      return this.fn();
    } finally {
      Pr(this), ee = t, Le = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        vs(t);
      this.deps = this.depsTail = void 0, Fs(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Kn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ts(this) && this.run();
  }
  get dirty() {
    return ts(this);
  }
}
let Mr = 0, Bt, Vt;
function Or(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Vt, Vt = e;
    return;
  }
  e.next = Bt, Bt = e;
}
function ms() {
  Mr++;
}
function ys() {
  if (--Mr > 0)
    return;
  if (Vt) {
    let t = Vt;
    for (Vt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Bt; ) {
    let t = Bt;
    for (Bt = void 0; t; ) {
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
function $r(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pr(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), vs(s), zi(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function ts(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Lr(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Lr(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === zt) || (e.globalVersion = zt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ts(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ee, s = Le;
  ee = e, Le = !0;
  try {
    $r(e);
    const r = e.fn(e._value);
    (t.version === 0 || Ve(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    ee = n, Le = s, Pr(e), e.flags &= -3;
  }
}
function vs(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      vs(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function zi(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Le = !0;
const Ir = [];
function Ze() {
  Ir.push(Le), Le = !1;
}
function Qe() {
  const e = Ir.pop();
  Le = e === void 0 ? !0 : e;
}
function Fs(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = ee;
    ee = void 0;
    try {
      t();
    } finally {
      ee = n;
    }
  }
}
let zt = 0;
class qi {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class bs {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!ee || !Le || ee === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ee)
      n = this.activeLink = new qi(ee, this), ee.deps ? (n.prevDep = ee.depsTail, ee.depsTail.nextDep = n, ee.depsTail = n) : ee.deps = ee.depsTail = n, Rr(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = ee.depsTail, n.nextDep = void 0, ee.depsTail.nextDep = n, ee.depsTail = n, ee.deps === n && (ee.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, zt++, this.notify(t);
  }
  notify(t) {
    ms();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ys();
    }
  }
}
function Rr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Rr(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const ns = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ Symbol(
  ""
), ss = /* @__PURE__ */ Symbol(
  ""
), qt = /* @__PURE__ */ Symbol(
  ""
);
function pe(e, t, n) {
  if (Le && ee) {
    let s = ns.get(e);
    s || ns.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new bs()), r.map = s, r.key = n), r.track();
  }
}
function Xe(e, t, n, s, r, i) {
  const l = ns.get(e);
  if (!l) {
    zt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (ms(), t === "clear")
    l.forEach(o);
  else {
    const c = R(e), d = c && ps(n);
    if (c && n === "length") {
      const u = Number(s);
      l.forEach((h, m) => {
        (m === "length" || m === qt || !We(m) && m >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(qt)), t) {
        case "add":
          c ? d && o(l.get("length")) : (o(l.get(xt)), Et(e) && o(l.get(ss)));
          break;
        case "delete":
          c || (o(l.get(xt)), Et(e) && o(l.get(ss)));
          break;
        case "set":
          Et(e) && o(l.get(xt));
          break;
      }
  }
  ys();
}
function Ct(e) {
  const t = /* @__PURE__ */ W(e);
  return t === e ? t : (pe(t, "iterate", qt), /* @__PURE__ */ Me(e) ? t : t.map(Ie));
}
function Pn(e) {
  return pe(e = /* @__PURE__ */ W(e), "iterate", qt), e;
}
function je(e, t) {
  return /* @__PURE__ */ et(e) ? $t(/* @__PURE__ */ wt(e) ? Ie(t) : t) : Ie(t);
}
const Gi = {
  __proto__: null,
  [Symbol.iterator]() {
    return Un(this, Symbol.iterator, (e) => je(this, e));
  },
  concat(...e) {
    return Ct(this).concat(
      ...e.map((t) => R(t) ? Ct(t) : t)
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
    return Ct(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Wn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return qe(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Rt(this, "pop");
  },
  push(...e) {
    return Rt(this, "push", e);
  },
  reduce(e, ...t) {
    return Hs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Hs(this, "reduceRight", e, t);
  },
  shift() {
    return Rt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return qe(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Rt(this, "splice", e);
  },
  toReversed() {
    return Ct(this).toReversed();
  },
  toSorted(e) {
    return Ct(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ct(this).toSpliced(...e);
  },
  unshift(...e) {
    return Rt(this, "unshift", e);
  },
  values() {
    return Un(this, "values", (e) => je(this, e));
  }
};
function Un(e, t, n) {
  const s = Pn(e), r = s[t]();
  return s !== e && !/* @__PURE__ */ Me(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.done || (i.value = n(i.value)), i;
  }), r;
}
const Ji = Array.prototype;
function qe(e, t, n, s, r, i) {
  const l = Pn(e), o = l !== e && !/* @__PURE__ */ Me(e), c = l[t];
  if (c !== Ji[t]) {
    const h = c.apply(e, i);
    return o ? Ie(h) : h;
  }
  let d = n;
  l !== e && (o ? d = function(h, m) {
    return n.call(this, je(e, h), m, e);
  } : n.length > 2 && (d = function(h, m) {
    return n.call(this, h, m, e);
  }));
  const u = c.call(l, d, s);
  return o && r ? r(u) : u;
}
function Hs(e, t, n, s) {
  const r = Pn(e), i = r !== e && !/* @__PURE__ */ Me(e);
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
  const s = /* @__PURE__ */ W(e);
  pe(s, "iterate", qt);
  const r = s[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ _s(n[0]) ? (n[0] = /* @__PURE__ */ W(n[0]), s[t](...n)) : r;
}
function Rt(e, t, n = []) {
  Ze(), ms();
  const s = (/* @__PURE__ */ W(e))[t].apply(e, n);
  return ys(), Qe(), s;
}
const Yi = /* @__PURE__ */ ds("__proto__,__v_isRef,__isVue"), Fr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(We)
);
function Xi(e) {
  We(e) || (e = String(e));
  const t = /* @__PURE__ */ W(this);
  return pe(t, "has", e), t.hasOwnProperty(e);
}
class Hr {
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
      return s === (r ? i ? ol : jr : i ? kr : Dr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = R(t);
    if (!r) {
      let c;
      if (l && (c = Gi[n]))
        return c;
      if (n === "hasOwnProperty")
        return Xi;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ ge(t) ? t : s
    );
    if ((We(n) ? Fr.has(n) : Yi(n)) || (r || pe(t, "get", n), i))
      return o;
    if (/* @__PURE__ */ ge(o)) {
      const c = l && ps(n) ? o : o.value;
      return r && G(c) ? /* @__PURE__ */ is(c) : c;
    }
    return G(o) ? r ? /* @__PURE__ */ is(o) : /* @__PURE__ */ Ln(o) : o;
  }
}
class Nr extends Hr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    const l = R(t) && ps(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ et(i);
      if (!/* @__PURE__ */ Me(s) && !/* @__PURE__ */ et(s) && (i = /* @__PURE__ */ W(i), s = /* @__PURE__ */ W(s)), !l && /* @__PURE__ */ ge(i) && !/* @__PURE__ */ ge(s))
        return d || (i.value = s), !0;
    }
    const o = l ? Number(n) < t.length : q(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ ge(t) ? t : r
    );
    return t === /* @__PURE__ */ W(r) && c && (o ? Ve(s, i) && Xe(t, "set", n, s) : Xe(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = q(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Xe(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!We(n) || !Fr.has(n)) && pe(t, "has", n), s;
  }
  ownKeys(t) {
    return pe(
      t,
      "iterate",
      R(t) ? "length" : xt
    ), Reflect.ownKeys(t);
  }
}
class Zi extends Hr {
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
const Qi = /* @__PURE__ */ new Nr(), el = /* @__PURE__ */ new Zi(), tl = /* @__PURE__ */ new Nr(!0);
const rs = (e) => e, un = (e) => Reflect.getPrototypeOf(e);
function nl(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = /* @__PURE__ */ W(r), l = Et(i), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, d = r[e](...s), u = n ? rs : t ? $t : Ie;
    return !t && pe(
      i,
      "iterate",
      c ? ss : xt
    ), ae(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: m } = d.next();
          return m ? { value: h, done: m } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: m
          };
        }
      }
    );
  };
}
function fn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function sl(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ W(i), o = /* @__PURE__ */ W(r);
      e || (Ve(r, o) && pe(l, "get", r), pe(l, "get", o));
      const { has: c } = un(l), d = t ? rs : e ? $t : Ie;
      if (c.call(l, r))
        return d(i.get(r));
      if (c.call(l, o))
        return d(i.get(o));
      i !== l && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && pe(/* @__PURE__ */ W(r), "iterate", xt), r.size;
    },
    has(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ W(i), o = /* @__PURE__ */ W(r);
      return e || (Ve(r, o) && pe(l, "has", r), pe(l, "has", o)), r === o ? i.has(r) : i.has(r) || i.has(o);
    },
    forEach(r, i) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ W(o), d = t ? rs : e ? $t : Ie;
      return !e && pe(c, "iterate", xt), o.forEach((u, h) => r.call(i, d(u), d(h), l));
    }
  };
  return ae(
    n,
    e ? {
      add: fn("add"),
      set: fn("set"),
      delete: fn("delete"),
      clear: fn("clear")
    } : {
      add(r) {
        const i = /* @__PURE__ */ W(this), l = un(i), o = /* @__PURE__ */ W(r), c = !t && !/* @__PURE__ */ Me(r) && !/* @__PURE__ */ et(r) ? o : r;
        return l.has.call(i, c) || Ve(r, c) && l.has.call(i, r) || Ve(o, c) && l.has.call(i, o) || (i.add(c), Xe(i, "add", c, c)), this;
      },
      set(r, i) {
        !t && !/* @__PURE__ */ Me(i) && !/* @__PURE__ */ et(i) && (i = /* @__PURE__ */ W(i));
        const l = /* @__PURE__ */ W(this), { has: o, get: c } = un(l);
        let d = o.call(l, r);
        d || (r = /* @__PURE__ */ W(r), d = o.call(l, r));
        const u = c.call(l, r);
        return l.set(r, i), d ? Ve(i, u) && Xe(l, "set", r, i) : Xe(l, "add", r, i), this;
      },
      delete(r) {
        const i = /* @__PURE__ */ W(this), { has: l, get: o } = un(i);
        let c = l.call(i, r);
        c || (r = /* @__PURE__ */ W(r), c = l.call(i, r)), o && o.call(i, r);
        const d = i.delete(r);
        return c && Xe(i, "delete", r, void 0), d;
      },
      clear() {
        const r = /* @__PURE__ */ W(this), i = r.size !== 0, l = r.clear();
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
    n[r] = nl(r, e, t);
  }), n;
}
function xs(e, t) {
  const n = sl(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    q(n, r) && r in s ? n : s,
    r,
    i
  );
}
const rl = {
  get: /* @__PURE__ */ xs(!1, !1)
}, il = {
  get: /* @__PURE__ */ xs(!1, !0)
}, ll = {
  get: /* @__PURE__ */ xs(!0, !1)
};
const Dr = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), jr = /* @__PURE__ */ new WeakMap(), ol = /* @__PURE__ */ new WeakMap();
function cl(e) {
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
function Ln(e) {
  return /* @__PURE__ */ et(e) ? e : ws(
    e,
    !1,
    Qi,
    rl,
    Dr
  );
}
// @__NO_SIDE_EFFECTS__
function al(e) {
  return ws(
    e,
    !1,
    tl,
    il,
    kr
  );
}
// @__NO_SIDE_EFFECTS__
function is(e) {
  return ws(
    e,
    !0,
    el,
    ll,
    jr
  );
}
function ws(e, t, n, s, r) {
  if (!G(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const l = cl(Li(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return r.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function wt(e) {
  return /* @__PURE__ */ et(e) ? /* @__PURE__ */ wt(e.__v_raw) : !!(e && e.__v_isReactive);
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
function _s(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function W(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ W(t) : e;
}
function ul(e) {
  return !q(e, "__v_skip") && Object.isExtensible(e) && Sr(e, "__v_skip", !0), e;
}
const Ie = (e) => G(e) ? /* @__PURE__ */ Ln(e) : e, $t = (e) => G(e) ? /* @__PURE__ */ is(e) : e;
// @__NO_SIDE_EFFECTS__
function ge(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function yt(e) {
  return fl(e, !1);
}
function fl(e, t) {
  return /* @__PURE__ */ ge(e) ? e : new dl(e, t);
}
class dl {
  constructor(t, n) {
    this.dep = new bs(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ W(t), this._value = n ? t : Ie(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Me(t) || /* @__PURE__ */ et(t);
    t = s ? t : /* @__PURE__ */ W(t), Ve(t, n) && (this._rawValue = t, this._value = s ? t : Ie(t), this.dep.trigger());
  }
}
function Ae(e) {
  return /* @__PURE__ */ ge(e) ? e.value : e;
}
const hl = {
  get: (e, t, n) => t === "__v_raw" ? e : Ae(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return /* @__PURE__ */ ge(r) && !/* @__PURE__ */ ge(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Br(e) {
  return /* @__PURE__ */ wt(e) ? e : new Proxy(e, hl);
}
class pl {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new bs(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = zt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ee !== this)
      return Or(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Lr(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function gl(e, t, n = !1) {
  let s, r;
  return D(e) ? s = e : (s = e.get, r = e.set), new pl(s, r, n);
}
const dn = {}, yn = /* @__PURE__ */ new WeakMap();
let gt;
function ml(e, t = !1, n = gt) {
  if (n) {
    let s = yn.get(n);
    s || yn.set(n, s = []), s.push(e);
  }
}
function yl(e, t, n = te) {
  const { immediate: s, deep: r, once: i, scheduler: l, augmentJob: o, call: c } = n, d = ($) => r ? $ : /* @__PURE__ */ Me($) || r === !1 || r === 0 ? rt($, 1) : rt($);
  let u, h, m, w, M = !1, O = !1;
  if (/* @__PURE__ */ ge(e) ? (h = () => e.value, M = /* @__PURE__ */ Me(e)) : /* @__PURE__ */ wt(e) ? (h = () => d(e), M = !0) : R(e) ? (O = !0, M = e.some(($) => /* @__PURE__ */ wt($) || /* @__PURE__ */ Me($)), h = () => e.map(($) => {
    if (/* @__PURE__ */ ge($))
      return $.value;
    if (/* @__PURE__ */ wt($))
      return d($);
    if (D($))
      return c ? c($, 2) : $();
  })) : D(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (m) {
      Ze();
      try {
        m();
      } finally {
        Qe();
      }
    }
    const $ = gt;
    gt = u;
    try {
      return c ? c(e, 3, [w]) : e(w);
    } finally {
      gt = $;
    }
  } : h = Ue, t && r) {
    const $ = h, V = r === !0 ? 1 / 0 : r;
    h = () => rt($(), V);
  }
  const K = Wi(), B = () => {
    u.stop(), K && K.active && hs(K.effects, u);
  };
  if (i && t) {
    const $ = t;
    t = (...V) => {
      const S = $(...V);
      return B(), S;
    };
  }
  let F = O ? new Array(e.length).fill(dn) : dn;
  const k = ($) => {
    if (!(!(u.flags & 1) || !u.dirty && !$))
      if (t) {
        const V = u.run();
        if ($ || r || M || (O ? V.some((S, z) => Ve(S, F[z])) : Ve(V, F))) {
          m && m();
          const S = gt;
          gt = u;
          try {
            const z = [
              V,
              // pass undefined as the old value when it's changed for the first time
              F === dn ? void 0 : O && F[0] === dn ? [] : F,
              w
            ];
            F = V, c ? c(t, 3, z) : (
              // @ts-expect-error
              t(...z)
            );
          } finally {
            gt = S;
          }
        }
      } else
        u.run();
  };
  return o && o(k), u = new Er(h), u.scheduler = l ? () => l(k, !1) : k, w = ($) => ml($, !1, u), m = u.onStop = () => {
    const $ = yn.get(u);
    if ($) {
      if (c)
        c($, 4);
      else
        for (const V of $) V();
      yn.delete(u);
    }
  }, t ? s ? k(!0) : F = u.run() : l ? l(k.bind(null, !0), !0) : u.run(), B.pause = u.pause.bind(u), B.resume = u.resume.bind(u), B.stop = B, B;
}
function rt(e, t = 1 / 0, n) {
  if (t <= 0 || !G(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ ge(e))
    rt(e.value, t, n);
  else if (R(e))
    for (let s = 0; s < e.length; s++)
      rt(e[s], t, n);
  else if (vr(e) || Et(e))
    e.forEach((s) => {
      rt(s, t, n);
    });
  else if (wr(e)) {
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
function sn(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    In(r, t, n);
  }
}
function Oe(e, t, n, s) {
  if (D(e)) {
    const r = sn(e, t, n, s);
    return r && br(r) && r.catch((i) => {
      In(i, t, n);
    }), r;
  }
  if (R(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push(Oe(e[i], t, n, s));
    return r;
  }
}
function In(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || te;
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
      Ze(), sn(i, null, 10, [
        e,
        c,
        d
      ]), Qe();
      return;
    }
  }
  vl(e, n, r, s, l);
}
function vl(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const ye = [];
let ke = -1;
const Mt = [];
let st = null, Tt = 0;
const Vr = /* @__PURE__ */ Promise.resolve();
let vn = null;
function bl(e) {
  const t = vn || Vr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function xl(e) {
  let t = ke + 1, n = ye.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = ye[s], i = Gt(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function Ss(e) {
  if (!(e.flags & 1)) {
    const t = Gt(e), n = ye[ye.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Gt(n) ? ye.push(e) : ye.splice(xl(t), 0, e), e.flags |= 1, Kr();
  }
}
function Kr() {
  vn || (vn = Vr.then(Wr));
}
function wl(e) {
  if (!R(e))
    st && e.id === -1 ? st.splice(Tt + 1, 0, e) : e.flags & 1 || (Mt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Mt.push(e[t]);
  Kr();
}
function Ns(e, t, n = ke + 1) {
  for (; n < ye.length; n++) {
    const s = ye[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ye.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Ur(e) {
  if (Mt.length) {
    const t = [...new Set(Mt)].sort(
      (n, s) => Gt(n) - Gt(s)
    );
    if (Mt.length = 0, st) {
      for (let n = 0; n < t.length; n++)
        st.push(t[n]);
      return;
    }
    for (st = t, Tt = 0; Tt < st.length; Tt++) {
      const n = st[Tt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    st = null, Tt = 0;
  }
}
const Gt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Wr(e) {
  try {
    for (ke = 0; ke < ye.length; ke++) {
      const t = ye[ke];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), sn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; ke < ye.length; ke++) {
      const t = ye[ke];
      t && (t.flags &= -2);
    }
    ke = -1, ye.length = 0, Ur(), vn = null, (ye.length || Mt.length) && Wr();
  }
}
let Ke = null, zr = null;
function bn(e) {
  const t = Ke;
  return Ke = e, zr = e && e.type.__scopeId || null, t;
}
function Nt(e, t = Ke, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Sn(-1);
    const i = bn(t), l = _t.length;
    let o;
    try {
      o = e(...r);
    } finally {
      for (let c = _t.length; c > l; c--) xi();
      bn(i), s._d && Sn(1);
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
function _l(e, t) {
  if (be) {
    let n = be.provides;
    const s = be.parent && be.parent.provides;
    s === n && (n = be.provides = Object.create(s)), n[e] = t;
  }
}
function pn(e, t, n = !1) {
  const s = Ci();
  if (s || Ot) {
    let r = Ot ? Ot._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && D(t) ? t.call(s && s.proxy) : t;
  }
}
const Sl = /* @__PURE__ */ Symbol.for("v-scx"), Cl = () => pn(Sl);
function zn(e, t, n) {
  return qr(e, t, n);
}
function qr(e, t, n = te) {
  const { immediate: s, deep: r, flush: i, once: l } = n, o = ae({}, n), c = t && s || !t && i !== "post";
  let d;
  if (Zt) {
    if (i === "sync") {
      const w = Cl();
      d = w.__watcherHandles || (w.__watcherHandles = []);
    } else if (!c) {
      const w = () => {
      };
      return w.stop = Ue, w.resume = Ue, w.pause = Ue, w;
    }
  }
  const u = be;
  o.call = (w, M, O) => Oe(w, u, M, O);
  let h = !1;
  i === "post" ? o.scheduler = (w) => {
    we(w, u && u.suspense);
  } : i !== "sync" && (h = !0, o.scheduler = (w, M) => {
    M ? w() : Ss(w);
  }), o.augmentJob = (w) => {
    t && (w.flags |= 4), h && (w.flags |= 2, u && (w.id = u.uid, w.i = u));
  };
  const m = yl(e, t, o);
  return Zt && (d ? d.push(m) : c && m()), m;
}
function Tl(e, t, n) {
  const s = this.proxy, r = oe(e) ? e.includes(".") ? Gr(s, e) : () => s[e] : e.bind(s, s);
  let i;
  D(t) ? i = t : (i = t.handler, n = t);
  const l = on(this), o = qr(r, i.bind(s), n);
  return l(), o;
}
function Gr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const Al = /* @__PURE__ */ Symbol("_vte"), Rn = (e) => e.__isTeleport, Ee = /* @__PURE__ */ Symbol("_leaveCb"), Ft = /* @__PURE__ */ Symbol("_enterCb");
function El() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return rn(() => {
    e.isMounted = !0;
  }), ln(() => {
    e.isUnmounting = !0;
  }), e;
}
const Te = [Function, Array], Jr = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Te,
  onEnter: Te,
  onAfterEnter: Te,
  onEnterCancelled: Te,
  // leave
  onBeforeLeave: Te,
  onLeave: Te,
  onAfterLeave: Te,
  onLeaveCancelled: Te,
  // appear
  onBeforeAppear: Te,
  onAppear: Te,
  onAfterAppear: Te,
  onAppearCancelled: Te
}, Yr = (e) => {
  const t = e.subTree;
  return t.component ? Yr(t.component) : t;
}, Ml = {
  name: "BaseTransition",
  props: Jr,
  setup(e, { slots: t }) {
    const n = Ci(), s = El();
    return () => {
      const r = t.default && Qr(t.default(), !0), i = r && r.length ? Xr(r) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? vt() : void 0
      );
      if (!i)
        return;
      const l = /* @__PURE__ */ W(e), { mode: o } = l;
      if (s.isLeaving)
        return qn(i);
      const c = xn(i);
      if (!c)
        return qn(i);
      let d = ls(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (h) => d = h
      );
      c.type !== ve && Jt(c, d);
      let u = n.subTree && xn(n.subTree);
      if (u && u.type !== ve && !mt(u, c) && Yr(n).type !== ve) {
        let h = ls(
          u,
          l,
          s,
          n
        );
        if (Jt(u, h), o === "out-in" && c.type !== ve)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave, u = void 0;
          }, qn(i);
        o === "in-out" && c.type !== ve ? h.delayLeave = (m, w, M) => {
          const O = Zr(
            s,
            u
          );
          O[String(u.key)] = u, m[Ee] = () => {
            w(), m[Ee] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            M(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return i;
    };
  }
};
function Xr(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ve) {
        t = n;
        break;
      }
  }
  return t;
}
const Ol = Ml;
function Zr(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function ls(e, t, n, s, r) {
  const {
    appear: i,
    mode: l,
    persisted: o = !1,
    onBeforeEnter: c,
    onEnter: d,
    onAfterEnter: u,
    onEnterCancelled: h,
    onBeforeLeave: m,
    onLeave: w,
    onAfterLeave: M,
    onLeaveCancelled: O,
    onBeforeAppear: K,
    onAppear: B,
    onAfterAppear: F,
    onAppearCancelled: k
  } = t, $ = String(e.key), V = Zr(n, e), S = (j, Y) => {
    j && Oe(
      j,
      s,
      9,
      Y
    );
  }, z = (j, Y) => {
    const ie = Y[1];
    S(j, Y), R(j) ? j.every((E) => E.length <= 1) && ie() : j.length <= 1 && ie();
  }, xe = {
    mode: l,
    persisted: o,
    beforeEnter(j) {
      let Y = c;
      if (!n.isMounted)
        if (i)
          Y = K || c;
        else
          return;
      j[Ee] && j[Ee](
        !0
        /* cancelled */
      );
      const ie = V[$];
      ie && mt(e, ie) && ie.el[Ee] && ie.el[Ee](), S(Y, [j]);
    },
    enter(j) {
      if (V[$] === e) return;
      let Y = d, ie = u, E = h;
      if (!n.isMounted)
        if (i)
          Y = B || d, ie = F || u, E = k || h;
        else
          return;
      let se = !1;
      j[Ft] = (ze) => {
        se || (se = !0, ze ? S(E, [j]) : S(ie, [j]), xe.delayedLeave && xe.delayedLeave(), j[Ft] = void 0);
      };
      const he = j[Ft].bind(null, !1);
      Y ? z(Y, [j, he]) : he();
    },
    leave(j, Y) {
      const ie = String(e.key);
      if (j[Ft] && j[Ft](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return Y();
      S(m, [j]);
      let E = !1;
      j[Ee] = (he) => {
        E || (E = !0, Y(), he ? S(O, [j]) : S(M, [j]), j[Ee] = void 0, V[ie] === e && delete V[ie]);
      };
      const se = j[Ee].bind(null, !1);
      V[ie] = e, w ? z(w, [j, se]) : se();
    },
    clone(j) {
      const Y = ls(
        j,
        t,
        n,
        s,
        r
      );
      return r && r(Y), Y;
    }
  };
  return xe;
}
function qn(e) {
  if (Fn(e))
    return e = lt(e), e.children = null, e;
}
function xn(e) {
  if (!Fn(e))
    return Rn(e.type) && e.children ? Xr(e.children) : e;
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
function Jt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Jt(
      Rn(n.type) && xn(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Qr(e, t = !1, n) {
  let s = [], r = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : i);
    l.type === re ? (l.patchFlag & 128 && r++, s = s.concat(
      Qr(l.children, t, o)
    )) : (t || l.type !== ve) && s.push(o != null ? lt(l, { key: o }) : l);
  }
  if (r > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function St(e, t) {
  return D(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ae({ name: e.name }, t, { setup: e })
  ) : e;
}
function ei(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ds(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const wn = /* @__PURE__ */ new WeakMap();
function Kt(e, t, n, s, r = !1) {
  if (R(e)) {
    e.forEach(
      (O, K) => Kt(
        O,
        t && (R(t) ? t[K] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Ut(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Kt(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? As(s.component) : s.el, l = r ? null : i, { i: o, r: c } = e, d = t && t.r, u = o.refs === te ? o.refs = {} : o.refs, h = o.setupState, m = /* @__PURE__ */ W(h), w = h === te ? yr : (O) => Ds(u, O) ? !1 : q(m, O), M = (O, K) => !(K && Ds(u, K));
  if (d != null && d !== c) {
    if (ks(t), oe(d))
      u[d] = null, w(d) && (h[d] = null);
    else if (/* @__PURE__ */ ge(d)) {
      const O = t;
      M(d, O.k) && (d.value = null), O.k && (u[O.k] = null);
    }
  }
  if (D(c))
    sn(c, o, 12, [l, u]);
  else {
    const O = oe(c), K = /* @__PURE__ */ ge(c);
    if (O || K) {
      const B = () => {
        if (e.f) {
          const F = O ? w(c) ? h[c] : u[c] : M() || !e.k ? c.value : u[e.k];
          if (r)
            R(F) && hs(F, i);
          else if (R(F))
            F.includes(i) || F.push(i);
          else if (O)
            u[c] = [i], w(c) && (h[c] = u[c]);
          else {
            const k = [i];
            M(c, e.k) && (c.value = k), e.k && (u[e.k] = k);
          }
        } else O ? (u[c] = l, w(c) && (h[c] = l)) : K && (M(c, e.k) && (c.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const F = () => {
          B(), wn.delete(e);
        };
        F.id = -1, wn.set(e, F), we(F, n);
      } else
        ks(e), B();
    }
  }
}
function ks(e) {
  const t = wn.get(e);
  t && (t.flags |= 8, wn.delete(e));
}
$n().requestIdleCallback;
$n().cancelIdleCallback;
const Ut = (e) => !!e.type.__asyncLoader, Fn = (e) => e.type.__isKeepAlive;
function $l(e, t) {
  ti(e, "a", t);
}
function Pl(e, t) {
  ti(e, "da", t);
}
function ti(e, t, n = be) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Hn(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Fn(r.parent.vnode) && Ll(s, t, n, r), r = r.parent;
  }
}
function Ll(e, t, n, s) {
  const r = Hn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  ni(() => {
    hs(s[t], r);
  }, n);
}
function Hn(e, t, n = be, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      Ze();
      const o = on(n), c = Oe(t, n, e, l);
      return o(), Qe(), c;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const tt = (e) => (t, n = be) => {
  (!Zt || e === "sp") && Hn(e, (...s) => t(...s), n);
}, Il = tt("bm"), rn = tt("m"), Rl = tt(
  "bu"
), Fl = tt("u"), ln = tt(
  "bum"
), ni = tt("um"), Hl = tt(
  "sp"
), Nl = tt("rtg"), Dl = tt("rtc");
function kl(e, t = be) {
  Hn("ec", e, t);
}
const jl = /* @__PURE__ */ Symbol.for("v-ndc");
function it(e, t, n, s) {
  let r;
  const i = n, l = R(e);
  if (l || oe(e)) {
    const o = l && /* @__PURE__ */ wt(e);
    let c = !1, d = !1;
    o && (c = !/* @__PURE__ */ Me(e), d = /* @__PURE__ */ et(e), e = Pn(e)), r = new Array(e.length);
    for (let u = 0, h = e.length; u < h; u++)
      r[u] = t(
        c ? d ? $t(Ie(e[u])) : Ie(e[u]) : e[u],
        u,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++)
      r[o] = t(o + 1, o, void 0, i);
  } else if (G(e))
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
const os = (e) => e ? Ti(e) ? As(e) : os(e.parent) : null, Wt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ae(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => os(e.parent),
    $root: (e) => os(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ri(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Ss(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = bl.bind(e.proxy)),
    $watch: (e) => Tl.bind(e)
  })
), Gn = (e, t) => e !== te && !e.__isScriptSetup && q(e, t), Bl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: i, accessCache: l, type: o, appContext: c } = e;
    if (t[0] !== "$") {
      const m = l[t];
      if (m !== void 0)
        switch (m) {
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
        if (r !== te && q(r, t))
          return l[t] = 2, r[t];
        if (q(i, t))
          return l[t] = 3, i[t];
        if (n !== te && q(n, t))
          return l[t] = 4, n[t];
        cs && (l[t] = 0);
      }
    }
    const d = Wt[t];
    let u, h;
    if (d)
      return t === "$attrs" && pe(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (u = o.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== te && q(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      h = c.config.globalProperties, q(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Gn(r, t) ? (r[t] = n, !0) : s !== te && q(s, t) ? (s[t] = n, !0) : q(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, props: i, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== te && o[0] !== "$" && q(e, o) || Gn(t, o) || q(i, o) || q(s, o) || q(Wt, o) || q(r.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : q(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function js(e) {
  return R(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let cs = !0;
function Vl(e) {
  const t = ri(e), n = e.proxy, s = e.ctx;
  cs = !1, t.beforeCreate && Bs(t.beforeCreate, e, "bc");
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
    mounted: m,
    beforeUpdate: w,
    updated: M,
    activated: O,
    deactivated: K,
    beforeDestroy: B,
    beforeUnmount: F,
    destroyed: k,
    unmounted: $,
    render: V,
    renderTracked: S,
    renderTriggered: z,
    errorCaptured: xe,
    serverPrefetch: j,
    // public API
    expose: Y,
    inheritAttrs: ie,
    // assets
    components: E,
    directives: se,
    filters: he
  } = t;
  if (d && Kl(d, s, null), l)
    for (const le in l) {
      const Q = l[le];
      D(Q) && (s[le] = Q.bind(n));
    }
  if (r) {
    const le = r.call(n, n);
    G(le) && (e.data = /* @__PURE__ */ Ln(le));
  }
  if (cs = !0, i)
    for (const le in i) {
      const Q = i[le], ct = D(Q) ? Q.bind(n, n) : D(Q.get) ? Q.get.bind(n, n) : Ue, cn = !D(Q) && D(Q.set) ? Q.set.bind(n) : Ue, at = bt({
        get: ct,
        set: cn
      });
      Object.defineProperty(s, le, {
        enumerable: !0,
        configurable: !0,
        get: () => at.value,
        set: (Re) => at.value = Re
      });
    }
  if (o)
    for (const le in o)
      si(o[le], s, n, le);
  if (c) {
    const le = D(c) ? c.call(n) : c;
    Reflect.ownKeys(le).forEach((Q) => {
      _l(Q, le[Q]);
    });
  }
  u && Bs(u, e, "c");
  function ue(le, Q) {
    R(Q) ? Q.forEach((ct) => le(ct.bind(n))) : Q && le(Q.bind(n));
  }
  if (ue(Il, h), ue(rn, m), ue(Rl, w), ue(Fl, M), ue($l, O), ue(Pl, K), ue(kl, xe), ue(Dl, S), ue(Nl, z), ue(ln, F), ue(ni, $), ue(Hl, j), R(Y))
    if (Y.length) {
      const le = e.exposed || (e.exposed = {});
      Y.forEach((Q) => {
        Object.defineProperty(le, Q, {
          get: () => n[Q],
          set: (ct) => n[Q] = ct,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  V && e.render === Ue && (e.render = V), ie != null && (e.inheritAttrs = ie), E && (e.components = E), se && (e.directives = se), j && ei(e);
}
function Kl(e, t, n = Ue) {
  R(e) && (e = as(e));
  for (const s in e) {
    const r = e[s];
    let i;
    G(r) ? "default" in r ? i = pn(
      r.from || s,
      r.default,
      !0
    ) : i = pn(r.from || s) : i = pn(r), /* @__PURE__ */ ge(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[s] = i;
  }
}
function Bs(e, t, n) {
  Oe(
    R(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function si(e, t, n, s) {
  let r = s.includes(".") ? Gr(n, s) : () => n[s];
  if (oe(e)) {
    const i = t[e];
    D(i) && zn(r, i);
  } else if (D(e))
    zn(r, e.bind(n));
  else if (G(e))
    if (R(e))
      e.forEach((i) => si(i, t, n, s));
    else {
      const i = D(e.handler) ? e.handler.bind(n) : t[e.handler];
      D(i) && zn(r, i, e);
    }
}
function ri(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = i.get(t);
  let c;
  return o ? c = o : !r.length && !n && !s ? c = t : (c = {}, r.length && r.forEach(
    (d) => _n(c, d, l, !0)
  ), _n(c, t, l)), G(t) && i.set(t, c), c;
}
function _n(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && _n(e, i, n, !0), r && r.forEach(
    (l) => _n(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = Ul[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const Ul = {
  data: Vs,
  props: Ks,
  emits: Ks,
  // objects
  methods: Dt,
  computed: Dt,
  // lifecycle
  beforeCreate: me,
  created: me,
  beforeMount: me,
  mounted: me,
  beforeUpdate: me,
  updated: me,
  beforeDestroy: me,
  beforeUnmount: me,
  destroyed: me,
  unmounted: me,
  activated: me,
  deactivated: me,
  errorCaptured: me,
  serverPrefetch: me,
  // assets
  components: Dt,
  directives: Dt,
  // watch
  watch: zl,
  // provide / inject
  provide: Vs,
  inject: Wl
};
function Vs(e, t) {
  return t ? e ? function() {
    return ae(
      D(e) ? e.call(this, this) : e,
      D(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Wl(e, t) {
  return Dt(as(e), as(t));
}
function as(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function me(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Dt(e, t) {
  return e ? ae(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ks(e, t) {
  return e ? R(e) && R(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ae(
    /* @__PURE__ */ Object.create(null),
    js(e),
    js(t ?? {})
  ) : t;
}
function zl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ae(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = me(e[s], t[s]);
  return n;
}
function ii() {
  return {
    app: null,
    config: {
      isNativeTag: yr,
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
let ql = 0;
function Gl(e, t) {
  return function(s, r = null) {
    D(s) || (s = ae({}, s)), r != null && !G(r) && (r = null);
    const i = ii(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const d = i.app = {
      _uid: ql++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Ao,
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
      mount(u, h, m) {
        if (!c) {
          const w = d._ceVNode || ne(s, r);
          return w.appContext = i, m === !0 ? m = "svg" : m === !1 && (m = void 0), e(w, u, m), c = !0, d._container = u, u.__vue_app__ = d, As(w.component);
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
        const h = Ot;
        Ot = d;
        try {
          return u();
        } finally {
          Ot = h;
        }
      }
    };
    return d;
  };
}
let Ot = null;
const Jl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Pe(t)}Modifiers`] || e[`${ot(t)}Modifiers`];
function Yl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || te;
  let r = n;
  const i = t.startsWith("update:"), l = i && Jl(s, t.slice(7));
  l && (l.trim && (r = n.map((u) => oe(u) ? u.trim() : u)), l.number && (r = n.map(Fi)));
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
const Xl = /* @__PURE__ */ new WeakMap();
function li(e, t, n = !1) {
  const s = n ? Xl : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let l = {}, o = !1;
  if (!D(e)) {
    const c = (d) => {
      const u = li(d, t, !0);
      u && (o = !0, ae(l, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !o ? (G(e) && s.set(e, null), null) : (R(i) ? i.forEach((c) => l[c] = null) : ae(l, i), G(e) && s.set(e, l), l);
}
function Nn(e, t) {
  return !e || !En(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), q(e, t[0].toLowerCase() + t.slice(1)) || q(e, ot(t)) || q(e, t));
}
function Us(e) {
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
    data: m,
    setupState: w,
    ctx: M,
    inheritAttrs: O
  } = e, K = bn(e);
  let B, F;
  try {
    if (n.shapeFlag & 4) {
      const $ = r || s, V = $;
      B = Be(
        d.call(
          V,
          $,
          u,
          h,
          w,
          m,
          M
        )
      ), F = o;
    } else {
      const $ = t;
      B = Be(
        $.length > 1 ? $(
          h,
          { attrs: o, slots: l, emit: c }
        ) : $(
          h,
          null
        )
      ), F = t.props ? o : Zl(o);
    }
  } catch ($) {
    _t.length = 0, In($, e, 1), B = ne(ve);
  }
  let k = B;
  if (F && O !== !1) {
    const $ = Object.keys(F), { shapeFlag: V } = k;
    $.length && V & 7 && (i && $.some(Mn) && (F = Ql(
      F,
      i
    )), k = lt(k, F, !1, !0));
  }
  if (n.dirs && (k = lt(k, null, !1, !0), k.dirs = k.dirs ? k.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const $ = Rn(k.type) && xn(k) || k;
    Jt($, n.transition);
  }
  return B = k, bn(K), B;
}
const Zl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || En(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Ql = (e, t) => {
  const n = {};
  for (const s in e)
    (!Mn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function eo(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: l, children: o, patchFlag: c } = t, d = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Ws(s, l, d) : !!l;
    if (c & 8) {
      const u = t.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        const m = u[h];
        if (oi(l, s, m) && !Nn(d, m))
          return !0;
      }
    }
  } else
    return (r || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Ws(s, l, d) : !0 : !!l;
  return !1;
}
function Ws(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (oi(t, e, i) && !Nn(n, i))
      return !0;
  }
  return !1;
}
function oi(e, t, n) {
  const s = e[n], r = t[n];
  return n === "style" && G(s) && G(r) ? !gs(s, r) : s !== r;
}
function to({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = s, e = r), r === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const ci = {}, ai = () => Object.create(ci), ui = (e) => Object.getPrototypeOf(e) === ci;
function no(e, t, n, s = !1) {
  const r = {}, i = ai();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), fi(e, t, r, i);
  for (const l in e.propsOptions[0])
    l in r || (r[l] = void 0);
  n ? e.props = s ? r : /* @__PURE__ */ al(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function so(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ W(r), [c] = e.propsOptions;
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
        let m = u[h];
        if (Nn(e.emitsOptions, m))
          continue;
        const w = t[m];
        if (c)
          if (q(i, m))
            w !== i[m] && (i[m] = w, d = !0);
          else {
            const M = Pe(m);
            r[M] = us(
              c,
              o,
              M,
              w,
              e,
              !1
            );
          }
        else
          w !== i[m] && (i[m] = w, d = !0);
      }
    }
  } else {
    fi(e, t, r, i) && (d = !0);
    let u;
    for (const h in o)
      (!t || // for camelCase
      !q(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = ot(h)) === h || !q(t, u))) && (c ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[u] !== void 0) && (r[h] = us(
        c,
        o,
        h,
        void 0,
        e,
        !0
      )) : delete r[h]);
    if (i !== o)
      for (const h in i)
        (!t || !q(t, h)) && (delete i[h], d = !0);
  }
  d && Xe(e.attrs, "set", "");
}
function fi(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (jt(c))
        continue;
      const d = t[c];
      let u;
      r && q(r, u = Pe(c)) ? !i || !i.includes(u) ? n[u] = d : (o || (o = {}))[u] = d : Nn(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, l = !0);
    }
  if (i) {
    const c = /* @__PURE__ */ W(n), d = o || te;
    for (let u = 0; u < i.length; u++) {
      const h = i[u];
      n[h] = us(
        r,
        c,
        h,
        d[h],
        e,
        !q(d, h)
      );
    }
  }
  return l;
}
function us(e, t, n, s, r, i) {
  const l = e[n];
  if (l != null) {
    const o = q(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && D(c)) {
        const { propsDefaults: d } = r;
        if (n in d)
          s = d[n];
        else {
          const u = on(r);
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
const ro = /* @__PURE__ */ new WeakMap();
function di(e, t, n = !1) {
  const s = n ? ro : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, l = {}, o = [];
  let c = !1;
  if (!D(e)) {
    const u = (h) => {
      c = !0;
      const [m, w] = di(h, t, !0);
      ae(l, m), w && o.push(...w);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!i && !c)
    return G(e) && s.set(e, At), At;
  if (R(i))
    for (let u = 0; u < i.length; u++) {
      const h = Pe(i[u]);
      zs(h) && (l[h] = te);
    }
  else if (i)
    for (const u in i) {
      const h = Pe(u);
      if (zs(h)) {
        const m = i[u], w = l[h] = R(m) || D(m) ? { type: m } : ae({}, m), M = w.type;
        let O = !1, K = !0;
        if (R(M))
          for (let B = 0; B < M.length; ++B) {
            const F = M[B], k = D(F) && F.name;
            if (k === "Boolean") {
              O = !0;
              break;
            } else k === "String" && (K = !1);
          }
        else
          O = D(M) && M.name === "Boolean";
        w[
          0
          /* shouldCast */
        ] = O, w[
          1
          /* shouldCastTrue */
        ] = K, (O || q(w, "default")) && o.push(h);
      }
    }
  const d = [l, o];
  return G(e) && s.set(e, d), d;
}
function zs(e) {
  return e[0] !== "$" && !jt(e);
}
const Cs = (e) => e === "_" || e === "_ctx" || e === "$stable", Ts = (e) => R(e) ? e.map(Be) : [Be(e)], io = (e, t, n) => {
  if (t._n)
    return t;
  const s = Nt((...r) => Ts(t(...r)), n);
  return s._c = !1, s;
}, hi = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (Cs(r)) continue;
    const i = e[r];
    if (D(i))
      t[r] = io(r, i, s);
    else if (i != null) {
      const l = Ts(i);
      t[r] = () => l;
    }
  }
}, pi = (e, t) => {
  const n = Ts(t);
  e.slots.default = () => n;
}, gi = (e, t, n) => {
  for (const s in t)
    (n || !Cs(s)) && (e[s] = t[s]);
}, lo = (e, t, n) => {
  const s = e.slots = ai();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (gi(s, t, n), n && Sr(s, "_", r, !0)) : hi(t, s);
  } else t && pi(e, t);
}, oo = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, l = te;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? i = !1 : gi(r, t, n) : (i = !t.$stable, hi(t, r)), l = t;
  } else t && (pi(e, t), l = { default: 1 });
  if (i)
    for (const o in r)
      !Cs(o) && l[o] == null && delete r[o];
}, we = ho;
function co(e) {
  return ao(e);
}
function ao(e, t) {
  const n = $n();
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
    nextSibling: m,
    setScopeId: w = Ue,
    insertStaticContent: M
  } = e, O = (a, f, p, x = null, b = null, y = null, T = void 0, C = null, _ = !!f.dynamicChildren) => {
    if (a === f)
      return;
    a && !mt(a, f) && (x = an(a), Re(a, b, y, !0), a = null), f.patchFlag === -2 && (_ = !1, f.dynamicChildren = null);
    const { type: v, ref: L, shapeFlag: A } = f;
    switch (v) {
      case Dn:
        K(a, f, p, x);
        break;
      case ve:
        B(a, f, p, x);
        break;
      case gn:
        a == null && F(f, p, x, T);
        break;
      case re:
        E(
          a,
          f,
          p,
          x,
          b,
          y,
          T,
          C,
          _
        );
        break;
      default:
        A & 1 ? V(
          a,
          f,
          p,
          x,
          b,
          y,
          T,
          C,
          _
        ) : A & 6 ? se(
          a,
          f,
          p,
          x,
          b,
          y,
          T,
          C,
          _
        ) : (A & 64 || A & 128) && v.process(
          a,
          f,
          p,
          x,
          b,
          y,
          T,
          C,
          _,
          Lt
        );
    }
    L != null && b ? Kt(L, a && a.ref, y, f || a, !f) : L == null && a && a.ref != null && Kt(a.ref, null, y, a, !0);
  }, K = (a, f, p, x) => {
    if (a == null)
      s(
        f.el = o(f.children),
        p,
        x
      );
    else {
      const b = f.el = a.el;
      f.children !== a.children && d(b, f.children);
    }
  }, B = (a, f, p, x) => {
    a == null ? s(
      f.el = c(f.children || ""),
      p,
      x
    ) : f.el = a.el;
  }, F = (a, f, p, x) => {
    [a.el, a.anchor] = M(
      a.children,
      f,
      p,
      x,
      a.el,
      a.anchor
    );
  }, k = ({ el: a, anchor: f }, p, x) => {
    let b;
    for (; a && a !== f; )
      b = m(a), s(a, p, x), a = b;
    s(f, p, x);
  }, $ = ({ el: a, anchor: f }) => {
    let p;
    for (; a && a !== f; )
      p = m(a), r(a), a = p;
    r(f);
  }, V = (a, f, p, x, b, y, T, C, _) => {
    if (f.type === "svg" ? T = "svg" : f.type === "math" && (T = "mathml"), a == null)
      S(
        f,
        p,
        x,
        b,
        y,
        T,
        C,
        _
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
          _
        );
      } finally {
        v && v._endPatch();
      }
    }
  }, S = (a, f, p, x, b, y, T, C) => {
    let _, v;
    const { props: L, shapeFlag: A, transition: P, dirs: N } = a;
    if (_ = a.el = l(
      a.type,
      y,
      L && L.is,
      L
    ), A & 8 ? u(_, a.children) : A & 16 && xe(
      a.children,
      _,
      null,
      x,
      b,
      Jn(a, y),
      T,
      C
    ), N && ut(a, null, x, "created"), z(_, a, a.scopeId, T, x), L) {
      for (const Z in L)
        Z !== "value" && !jt(Z) && i(_, Z, null, L[Z], y, x);
      "value" in L && i(_, "value", null, L.value, y), (v = L.onVnodeBeforeMount) && De(v, x, a);
    }
    N && ut(a, null, x, "beforeMount");
    const U = uo(b, P);
    U && P.beforeEnter(_), s(_, f, p), ((v = L && L.onVnodeMounted) || U || N) && we(() => {
      try {
        v && De(v, x, a), U && P.enter(_), N && ut(a, null, x, "mounted");
      } finally {
      }
    }, b);
  }, z = (a, f, p, x, b) => {
    if (p && w(a, p), x)
      for (let y = 0; y < x.length; y++)
        w(a, x[y]);
    if (b) {
      let y = b.subTree;
      if (f === y || bi(y.type) && (y.ssContent === f || y.ssFallback === f)) {
        const T = b.vnode;
        z(
          a,
          T,
          T.scopeId,
          T.slotScopeIds,
          b.parent
        );
      }
    }
  }, xe = (a, f, p, x, b, y, T, C, _ = 0) => {
    for (let v = _; v < a.length; v++) {
      const L = a[v] = C ? Ye(a[v]) : Be(a[v]);
      O(
        null,
        L,
        f,
        p,
        x,
        b,
        y,
        T,
        C
      );
    }
  }, j = (a, f, p, x, b, y, T) => {
    const C = f.el = a.el;
    let { patchFlag: _, dynamicChildren: v, dirs: L } = f;
    _ |= a.patchFlag & 16;
    const A = a.props || te, P = f.props || te;
    let N;
    if (p && ft(p, !1), (N = P.onVnodeBeforeUpdate) && De(N, p, f, a), L && ut(f, a, p, "beforeUpdate"), p && ft(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    v && (!a.dynamicChildren || a.dynamicChildren.length !== v.length) && (_ = 0, T = !1, v = null), (A.innerHTML && P.innerHTML == null || A.textContent && P.textContent == null) && u(C, ""), v ? Y(
      a.dynamicChildren,
      v,
      C,
      p,
      x,
      Jn(f, b),
      y
    ) : T || Q(
      a,
      f,
      C,
      null,
      p,
      x,
      Jn(f, b),
      y,
      !1
    ), _ > 0) {
      if (_ & 16)
        ie(C, A, P, p, b);
      else if (_ & 2 && A.class !== P.class && i(C, "class", null, P.class, b), _ & 4 && i(C, "style", A.style, P.style, b), _ & 8) {
        const U = f.dynamicProps;
        for (let Z = 0; Z < U.length; Z++) {
          const X = U[Z], ce = A[X], fe = P[X];
          (fe !== ce || X === "value") && i(C, X, ce, fe, b, p);
        }
      }
      _ & 1 && a.children !== f.children && u(C, f.children);
    } else !T && v == null && ie(C, A, P, p, b);
    ((N = P.onVnodeUpdated) || L) && we(() => {
      N && De(N, p, f, a), L && ut(f, a, p, "updated");
    }, x);
  }, Y = (a, f, p, x, b, y, T) => {
    for (let C = 0; C < f.length; C++) {
      const _ = a[C], v = f[C], L = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        _.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (_.type === re || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !mt(_, v) || // - In the case of a component, it could contain anything.
        _.shapeFlag & 198) ? h(_.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      O(
        _,
        v,
        L,
        null,
        x,
        b,
        y,
        T,
        !0
      );
    }
  }, ie = (a, f, p, x, b) => {
    if (f !== p) {
      if (f !== te)
        for (const y in f)
          !jt(y) && !(y in p) && i(
            a,
            y,
            f[y],
            null,
            b,
            x
          );
      for (const y in p) {
        if (jt(y)) continue;
        const T = p[y], C = f[y];
        T !== C && y !== "value" && i(a, y, C, T, b, x);
      }
      "value" in p && i(a, "value", f.value, p.value, b);
    }
  }, E = (a, f, p, x, b, y, T, C, _) => {
    const v = f.el = a ? a.el : o(""), L = f.anchor = a ? a.anchor : o("");
    let { patchFlag: A, dynamicChildren: P, slotScopeIds: N } = f;
    N && (C = C ? C.concat(N) : N), a == null ? (s(v, p, x), s(L, p, x), xe(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      p,
      L,
      b,
      y,
      T,
      C,
      _
    )) : A > 0 && A & 64 && P && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    a.dynamicChildren && a.dynamicChildren.length === P.length ? (Y(
      a.dynamicChildren,
      P,
      p,
      b,
      y,
      T,
      C
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || b && f === b.subTree) && mi(
      a,
      f,
      !0
      /* shallow */
    )) : Q(
      a,
      f,
      p,
      L,
      b,
      y,
      T,
      C,
      _
    );
  }, se = (a, f, p, x, b, y, T, C, _) => {
    f.slotScopeIds = C, a == null ? f.shapeFlag & 512 ? b.ctx.activate(
      f,
      p,
      x,
      T,
      _
    ) : he(
      f,
      p,
      x,
      b,
      y,
      T,
      _
    ) : ze(a, f, _);
  }, he = (a, f, p, x, b, y, T) => {
    const C = a.component = bo(
      a,
      x,
      b
    );
    if (Fn(a) && (C.ctx.renderer = Lt), xo(C, !1, T), C.asyncDep) {
      if (b && b.registerDep(C, ue, T), !a.el) {
        const _ = C.subTree = ne(ve);
        B(null, _, f, p), a.placeholder = _.el;
      }
    } else
      ue(
        C,
        a,
        f,
        p,
        b,
        y,
        T
      );
  }, ze = (a, f, p) => {
    const x = f.component = a.component;
    if (eo(a, f, p))
      if (x.asyncDep && !x.asyncResolved) {
        le(x, f, p);
        return;
      } else
        x.next = f, x.update();
    else
      f.el = a.el, x.vnode = f;
  }, ue = (a, f, p, x, b, y, T) => {
    const C = () => {
      if (a.isMounted) {
        let { next: A, bu: P, u: N, parent: U, vnode: Z } = a;
        {
          const He = yi(a);
          if (He) {
            A && (A.el = Z.el, le(a, A, T)), He.asyncDep.then(() => {
              we(() => {
                a.isUnmounted || v();
              }, b);
            });
            return;
          }
        }
        let X = A, ce;
        ft(a, !1), A ? (A.el = Z.el, le(a, A, T)) : A = Z, P && Bn(P), (ce = A.props && A.props.onVnodeBeforeUpdate) && De(ce, U, A, Z), ft(a, !0);
        const fe = Us(a), Fe = a.subTree;
        a.subTree = fe, O(
          Fe,
          fe,
          // parent may have changed if it's in a teleport
          h(Fe.el),
          // anchor may have changed if it's in a fragment
          an(Fe),
          a,
          b,
          y
        ), A.el = fe.el, X === null && to(a, fe.el), N && we(N, b), (ce = A.props && A.props.onVnodeUpdated) && we(
          () => De(ce, U, A, Z),
          b
        );
      } else {
        let A;
        const { el: P, props: N } = f, { bm: U, m: Z, parent: X, root: ce, type: fe } = a, Fe = Ut(f);
        ft(a, !1), U && Bn(U), !Fe && (A = N && N.onVnodeBeforeMount) && De(A, X, f), ft(a, !0);
        {
          ce.ce && ce.ce._hasShadowRoot() && ce.ce._injectChildStyle(
            fe,
            a.parent ? a.parent.type : void 0
          );
          const He = a.subTree = Us(a);
          O(
            null,
            He,
            p,
            x,
            a,
            b,
            y
          ), f.el = He.el;
        }
        if (Z && we(Z, b), !Fe && (A = N && N.onVnodeMounted)) {
          const He = f;
          we(
            () => De(A, X, He),
            b
          );
        }
        (f.shapeFlag & 256 || X && Ut(X.vnode) && X.vnode.shapeFlag & 256) && a.a && we(a.a, b), a.isMounted = !0, f = p = x = null;
      }
    };
    a.scope.on();
    const _ = a.effect = new Er(C);
    a.scope.off();
    const v = a.update = _.run.bind(_), L = a.job = _.runIfDirty.bind(_);
    L.i = a, L.id = a.uid, _.scheduler = () => Ss(L), ft(a, !0), v();
  }, le = (a, f, p) => {
    f.component = a;
    const x = a.vnode.props;
    a.vnode = f, a.next = null, so(a, f.props, x, p), oo(a, f.children, p), Ze(), Ns(a), Qe();
  }, Q = (a, f, p, x, b, y, T, C, _ = !1) => {
    const v = a && a.children, L = a ? a.shapeFlag : 0, A = f.children, { patchFlag: P, shapeFlag: N } = f;
    if (P > 0) {
      if (P & 128) {
        cn(
          v,
          A,
          p,
          x,
          b,
          y,
          T,
          C,
          _
        );
        return;
      } else if (P & 256) {
        ct(
          v,
          A,
          p,
          x,
          b,
          y,
          T,
          C,
          _
        );
        return;
      }
    }
    N & 8 ? (L & 16 && Pt(v, b, y), A !== v && u(p, A)) : L & 16 ? N & 16 ? cn(
      v,
      A,
      p,
      x,
      b,
      y,
      T,
      C,
      _
    ) : Pt(v, b, y, !0) : (L & 8 && u(p, ""), N & 16 && xe(
      A,
      p,
      x,
      b,
      y,
      T,
      C,
      _
    ));
  }, ct = (a, f, p, x, b, y, T, C, _) => {
    a = a || At, f = f || At;
    const v = a.length, L = f.length, A = Math.min(v, L);
    let P;
    for (P = 0; P < A; P++) {
      const N = f[P] = _ ? Ye(f[P]) : Be(f[P]);
      O(
        a[P],
        N,
        p,
        null,
        b,
        y,
        T,
        C,
        _
      );
    }
    v > L ? Pt(
      a,
      b,
      y,
      !0,
      !1,
      A
    ) : xe(
      f,
      p,
      x,
      b,
      y,
      T,
      C,
      _,
      A
    );
  }, cn = (a, f, p, x, b, y, T, C, _) => {
    let v = 0;
    const L = f.length;
    let A = a.length - 1, P = L - 1;
    for (; v <= A && v <= P; ) {
      const N = a[v], U = f[v] = _ ? Ye(f[v]) : Be(f[v]);
      if (mt(N, U))
        O(
          N,
          U,
          p,
          null,
          b,
          y,
          T,
          C,
          _
        );
      else
        break;
      v++;
    }
    for (; v <= A && v <= P; ) {
      const N = a[A], U = f[P] = _ ? Ye(f[P]) : Be(f[P]);
      if (mt(N, U))
        O(
          N,
          U,
          p,
          null,
          b,
          y,
          T,
          C,
          _
        );
      else
        break;
      A--, P--;
    }
    if (v > A) {
      if (v <= P) {
        const N = P + 1, U = N < L ? f[N].el : x;
        for (; v <= P; )
          O(
            null,
            f[v] = _ ? Ye(f[v]) : Be(f[v]),
            p,
            U,
            b,
            y,
            T,
            C,
            _
          ), v++;
      }
    } else if (v > P)
      for (; v <= A; )
        Re(a[v], b, y, !0), v++;
    else {
      const N = v, U = v, Z = /* @__PURE__ */ new Map();
      for (v = U; v <= P; v++) {
        const _e = f[v] = _ ? Ye(f[v]) : Be(f[v]);
        _e.key != null && Z.set(_e.key, v);
      }
      let X, ce = 0;
      const fe = P - U + 1;
      let Fe = !1, He = 0;
      const It = new Array(fe);
      for (v = 0; v < fe; v++) It[v] = 0;
      for (v = N; v <= A; v++) {
        const _e = a[v];
        if (ce >= fe) {
          Re(_e, b, y, !0);
          continue;
        }
        let Ne;
        if (_e.key != null)
          Ne = Z.get(_e.key);
        else
          for (X = U; X <= P; X++)
            if (It[X - U] === 0 && mt(_e, f[X])) {
              Ne = X;
              break;
            }
        Ne === void 0 ? Re(_e, b, y, !0) : (It[Ne - U] = v + 1, Ne >= He ? He = Ne : Fe = !0, O(
          _e,
          f[Ne],
          p,
          null,
          b,
          y,
          T,
          C,
          _
        ), ce++);
      }
      const $s = Fe ? fo(It) : At;
      for (X = $s.length - 1, v = fe - 1; v >= 0; v--) {
        const _e = U + v, Ne = f[_e], Ps = f[_e + 1], Ls = _e + 1 < L ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Ps.el || vi(Ps)
        ) : x;
        It[v] === 0 ? O(
          null,
          Ne,
          p,
          Ls,
          b,
          y,
          T,
          C,
          _
        ) : Fe && (X < 0 || v !== $s[X] ? at(Ne, p, Ls, 2) : X--);
      }
    }
  }, at = (a, f, p, x, b = null) => {
    const { el: y, type: T, transition: C, children: _, shapeFlag: v } = a;
    if (v & 6) {
      at(a.component.subTree, f, p, x);
      return;
    }
    if (v & 128) {
      a.suspense.move(f, p, x);
      return;
    }
    if (v & 64) {
      T.move(a, f, p, Lt);
      return;
    }
    if (T === re) {
      s(y, f, p);
      for (let A = 0; A < _.length; A++)
        at(_[A], f, p, x);
      s(a.anchor, f, p);
      return;
    }
    if (T === gn) {
      k(a, f, p);
      return;
    }
    if (x !== 2 && v & 1 && C)
      if (x === 0)
        C.persisted && !y[Ee] ? s(y, f, p) : (C.beforeEnter(y), s(y, f, p), we(() => C.enter(y), b));
      else {
        const { leave: A, delayLeave: P, afterLeave: N } = C, U = () => {
          a.ctx.isUnmounted ? r(y) : s(y, f, p);
        }, Z = () => {
          const X = y._isLeaving || !!y[Ee];
          y._isLeaving && y[Ee](
            !0
            /* cancelled */
          ), C.persisted && !X ? U() : A(y, () => {
            U(), N && N();
          });
        };
        P ? P(y, U, Z) : Z();
      }
    else
      s(y, f, p);
  }, Re = (a, f, p, x = !1, b = !1) => {
    const {
      type: y,
      props: T,
      ref: C,
      children: _,
      dynamicChildren: v,
      shapeFlag: L,
      patchFlag: A,
      dirs: P,
      cacheIndex: N,
      memo: U
    } = a;
    if (A === -2 && (b = !1), C != null && (Ze(), Kt(C, null, p, a, !0), Qe()), N != null && (f.renderCache[N] = void 0), L & 256) {
      f.ctx.deactivate(a);
      return;
    }
    const Z = L & 1 && P, X = !Ut(a);
    let ce;
    if (X && (ce = T && T.onVnodeBeforeUnmount) && De(ce, f, a), L & 6)
      $i(a.component, p, x);
    else {
      if (L & 128) {
        a.suspense.unmount(p, x);
        return;
      }
      Z && ut(a, null, f, "beforeUnmount"), L & 64 ? a.type.remove(
        a,
        f,
        p,
        Lt,
        x
      ) : v && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !v.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (y !== re || A > 0 && A & 64) ? Pt(
        v,
        f,
        p,
        !1,
        !0
      ) : (y === re && A & 384 || !b && L & 16) && Pt(_, f, p), x && Ms(a);
    }
    const fe = U != null && N == null;
    (X && (ce = T && T.onVnodeUnmounted) || Z || fe) && we(() => {
      ce && De(ce, f, a), Z && ut(a, null, f, "unmounted"), fe && (a.el = null);
    }, p);
  }, Ms = (a) => {
    const { type: f, el: p, anchor: x, transition: b } = a;
    if (f === re) {
      Oi(p, x);
      return;
    }
    if (f === gn) {
      $(a);
      return;
    }
    const y = () => {
      r(p), b && !b.persisted && b.afterLeave && b.afterLeave();
    };
    if (a.shapeFlag & 1 && b && !b.persisted) {
      const { leave: T, delayLeave: C } = b, _ = () => T(p, y);
      C ? C(a.el, y, _) : _();
    } else
      y();
  }, Oi = (a, f) => {
    let p;
    for (; a !== f; )
      p = m(a), r(a), a = p;
    r(f);
  }, $i = (a, f, p) => {
    const { bum: x, scope: b, job: y, subTree: T, um: C, m: _, a: v } = a;
    qs(_), qs(v), x && Bn(x), b.stop(), y && (y.flags |= 8, Re(T, a, f, p)), C && we(C, f), we(() => {
      a.isUnmounted = !0;
    }, f);
  }, Pt = (a, f, p, x = !1, b = !1, y = 0) => {
    for (let T = y; T < a.length; T++)
      Re(a[T], f, p, x, b);
  }, an = (a) => {
    if (a.shapeFlag & 6)
      return an(a.component.subTree);
    if (a.shapeFlag & 128)
      return a.suspense.next();
    const f = m(a.anchor || a.el), p = f && f[Al];
    return p ? m(p) : f;
  };
  let kn = !1;
  const Os = (a, f, p) => {
    let x;
    a == null ? f._vnode && (Re(f._vnode, null, null, !0), x = f._vnode.component) : O(
      f._vnode || null,
      a,
      f,
      null,
      null,
      null,
      p
    ), f._vnode = a, kn || (kn = !0, Ns(x), Ur(), kn = !1);
  }, Lt = {
    p: O,
    um: Re,
    m: at,
    r: Ms,
    mt: he,
    mc: xe,
    pc: Q,
    pbc: Y,
    n: an,
    o: e
  };
  return {
    render: Os,
    hydrate: void 0,
    createApp: Gl(Os)
  };
}
function Jn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ft({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function uo(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function mi(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (R(s) && R(r))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let o = r[i];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = r[i] = Ye(r[i]), o.el = l.el), !n && o.patchFlag !== -2 && mi(l, o)), o.type === Dn && (o.patchFlag === -1 && (o = r[i] = Ye(o)), o.el = l.el), o.type === ve && !o.el && (o.el = l.el);
    }
}
function fo(e) {
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
function yi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : yi(t);
}
function qs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function vi(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? vi(t.subTree) : null;
}
const bi = (e) => e.__isSuspense;
function ho(e, t) {
  t && t.pendingBranch ? R(e) ? t.effects.push(...e) : t.effects.push(e) : wl(e);
}
const re = /* @__PURE__ */ Symbol.for("v-fgt"), Dn = /* @__PURE__ */ Symbol.for("v-txt"), ve = /* @__PURE__ */ Symbol.for("v-cmt"), gn = /* @__PURE__ */ Symbol.for("v-stc"), _t = [];
let Ce = null;
function I(e = !1) {
  _t.push(Ce = e ? null : []);
}
function xi() {
  _t.pop(), Ce = _t[_t.length - 1] || null;
}
let Yt = 1;
function Sn(e, t = !1) {
  Yt += e, e < 0 && Ce && t && (Ce.hasOnce = !0);
}
function wi(e) {
  return e.dynamicChildren = Yt > 0 ? Ce || At : null, xi(), Yt > 0 && Ce && Ce.push(e), e;
}
function H(e, t, n, s, r, i) {
  return wi(
    g(
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
function _i(e, t, n, s, r) {
  return wi(
    ne(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function Cn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function mt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Si = ({ key: e }) => e ?? null, mn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? oe(e) || /* @__PURE__ */ ge(e) || D(e) ? { i: Ke, r: e, k: t, f: !!n } : e : null);
function g(e, t = null, n = null, s = 0, r = null, i = e === re ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Si(t),
    ref: t && mn(t),
    scopeId: zr,
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
  return o ? (Tn(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= oe(n) ? 8 : 16), Yt > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Ce && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && Ce.push(c), c;
}
const ne = po;
function po(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === jl) && (e = ve), Cn(e)) {
    const o = lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Tn(o, n), Yt > 0 && !i && Ce && (o.shapeFlag & 6 ? Ce[Ce.indexOf(e)] = o : Ce.push(o)), o.patchFlag = -2, o;
  }
  if (Co(e) && (e = e.__vccOpts), t) {
    t = go(t);
    let { class: o, style: c } = t;
    o && !oe(o) && (t.class = nn(o)), G(c) && (/* @__PURE__ */ _s(c) && !R(c) && (c = ae({}, c)), t.style = tn(c));
  }
  const l = oe(e) ? 1 : bi(e) ? 128 : Rn(e) ? 64 : G(e) ? 4 : D(e) ? 2 : 0;
  return g(
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
function go(e) {
  return e ? /* @__PURE__ */ _s(e) || ui(e) ? ae({}, e) : e : null;
}
function lt(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: l, children: o, transition: c } = e, d = t ? mo(r || {}, t) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && Si(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? R(i) ? i.concat(mn(t)) : [i, mn(t)] : mn(t)
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
    patchFlag: t && e.type !== re ? l === -1 ? 16 : l | 16 : l,
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
  return c && s && Jt(
    u,
    c.clone(u)
  ), u;
}
function $e(e = " ", t = 0) {
  return ne(Dn, null, e, t);
}
function Se(e, t) {
  const n = ne(gn, null, e);
  return n.staticCount = t, n;
}
function vt(e = "", t = !1) {
  return t ? (I(), _i(ve, null, e)) : ne(ve, null, e);
}
function Be(e) {
  return e == null || typeof e == "boolean" ? ne(ve) : R(e) ? ne(
    re,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Cn(e) ? Ye(e) : ne(Dn, null, String(e));
}
function Ye(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : lt(e);
}
function Tn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (R(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Tn(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !ui(t) ? t._ctx = Ke : r === 3 && Ke && (Ke.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (D(t)) {
    if (s & 65) {
      Tn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ke }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [$e(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function mo(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = nn([t.class, s.class]));
      else if (r === "style")
        t.style = tn([t.style, s.style]);
      else if (En(r)) {
        const i = t[r], l = s[r];
        l && i !== l && !(R(i) && i.includes(l)) ? t[r] = i ? [].concat(i, l) : l : l == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Mn(r) && (t[r] = l);
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
const yo = ii();
let vo = 0;
function bo(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || yo, i = {
    uid: vo++,
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
    scope: new Ui(
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
    propsOptions: di(s, r),
    emitsOptions: li(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: te,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: te,
    data: te,
    props: te,
    attrs: te,
    slots: te,
    refs: te,
    setupState: te,
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = Yl.bind(null, i), e.ce && e.ce(i), i;
}
let be = null;
const Ci = () => be || Ke;
let An, Xt;
{
  const e = $n(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((l) => l(i)) : r[0](i);
    };
  };
  An = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => be = n
  ), Xt = t(
    "__VUE_SSR_SETTERS__",
    (n) => Zt = n
  );
}
const on = (e) => {
  const t = be;
  return An(e), e.scope.on(), () => {
    e.scope.off(), An(t);
  };
}, Gs = () => {
  be && be.scope.off(), An(null);
};
function Ti(e) {
  return e.vnode.shapeFlag & 4;
}
let Zt = !1;
function xo(e, t = !1, n = !1) {
  t && Xt(t);
  const { props: s, children: r } = e.vnode, i = Ti(e);
  no(e, s, i, t), lo(e, r, n || t);
  const l = i ? wo(e, t) : void 0;
  return t && Xt(!1), l;
}
function wo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Bl);
  const { setup: s } = n;
  if (s) {
    Ze();
    const r = e.setupContext = s.length > 1 ? So(e) : null, i = on(e), l = sn(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), o = br(l);
    if (Qe(), i(), (o || e.sp) && !Ut(e) && ei(e), o) {
      if (l.then(Gs, Gs), t)
        return l.then((c) => {
          Xt(!0);
          try {
            Js(e, c, t);
          } finally {
            Xt(!1);
          }
        }).catch((c) => {
          In(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Js(e, l);
  } else
    Ai(e);
}
function Js(e, t, n) {
  D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : G(t) && (e.setupState = Br(t)), Ai(e);
}
function Ai(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Ue);
  {
    const r = on(e);
    Ze();
    try {
      Vl(e);
    } finally {
      Qe(), r();
    }
  }
}
const _o = {
  get(e, t) {
    return pe(e, "get", ""), e[t];
  }
};
function So(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, _o),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function As(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Br(ul(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Wt)
        return Wt[n](e);
    },
    has(t, n) {
      return n in t || n in Wt;
    }
  })) : e.proxy;
}
function Co(e) {
  return D(e) && "__vccOpts" in e;
}
const bt = (e, t) => /* @__PURE__ */ gl(e, t, Zt);
function To(e, t, n) {
  try {
    Sn(-1);
    const s = arguments.length;
    return s === 2 ? G(t) && !R(t) ? Cn(t) ? ne(e, null, [t]) : ne(e, t) : ne(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && Cn(n) && (n = [n]), ne(e, t, n));
  } finally {
    Sn(1);
  }
}
const Ao = "3.5.41";
/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let fs;
const Ys = typeof window < "u" && window.trustedTypes;
if (Ys)
  try {
    fs = /* @__PURE__ */ Ys.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Ei = fs ? (e) => fs.createHTML(e) : (e) => e, Eo = "http://www.w3.org/2000/svg", Mo = "http://www.w3.org/1998/Math/MathML", Je = typeof document < "u" ? document : null, Xs = Je && /* @__PURE__ */ Je.createElement("template"), Oo = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? Je.createElementNS(Eo, e) : t === "mathml" ? Je.createElementNS(Mo, e) : n ? Je.createElement(e, { is: n }) : Je.createElement(e);
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
      Xs.innerHTML = Ei(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Xs.content;
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
}, nt = "transition", Ht = "animation", Qt = /* @__PURE__ */ Symbol("_vtc"), Mi = {
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
}, $o = /* @__PURE__ */ ae(
  {},
  Jr,
  Mi
), Po = (e) => (e.displayName = "Transition", e.props = $o, e), hn = /* @__PURE__ */ Po(
  (e, { slots: t }) => To(Ol, Lo(e), t)
), dt = (e, t = []) => {
  R(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Zs = (e) => e ? R(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Lo(e) {
  const t = {};
  for (const E in e)
    E in Mi || (t[E] = e[E]);
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
    leaveActiveClass: m = `${n}-leave-active`,
    leaveToClass: w = `${n}-leave-to`
  } = e, M = Io(r), O = M && M[0], K = M && M[1], {
    onBeforeEnter: B,
    onEnter: F,
    onEnterCancelled: k,
    onLeave: $,
    onLeaveCancelled: V,
    onBeforeAppear: S = B,
    onAppear: z = F,
    onAppearCancelled: xe = k
  } = t, j = (E, se, he, ze) => {
    E._enterCancelled = ze, ht(E, se ? u : o), ht(E, se ? d : l), he && he();
  }, Y = (E, se) => {
    E._isLeaving = !1, ht(E, h), ht(E, w), ht(E, m), se && se();
  }, ie = (E) => (se, he) => {
    const ze = E ? z : F, ue = () => j(se, E, he);
    dt(ze, [se, ue]), Qs(() => {
      ht(se, E ? c : i), Ge(se, E ? u : o), Zs(ze) || er(se, s, O, ue);
    });
  };
  return ae(t, {
    onBeforeEnter(E) {
      dt(B, [E]), Ge(E, i), Ge(E, l);
    },
    onBeforeAppear(E) {
      dt(S, [E]), Ge(E, c), Ge(E, d);
    },
    onEnter: ie(!1),
    onAppear: ie(!0),
    onLeave(E, se) {
      E._isLeaving = !0;
      const he = () => Y(E, se);
      Ge(E, h), E._enterCancelled ? (Ge(E, m), sr(E)) : (sr(E), Ge(E, m)), Qs(() => {
        E._isLeaving && (ht(E, h), Ge(E, w), Zs($) || er(E, s, K, he));
      }), dt($, [E, he]);
    },
    onEnterCancelled(E) {
      j(E, !1, void 0, !0), dt(k, [E]);
    },
    onAppearCancelled(E) {
      j(E, !0, void 0, !0), dt(xe, [E]);
    },
    onLeaveCancelled(E) {
      Y(E), dt(V, [E]);
    }
  });
}
function Io(e) {
  if (e == null)
    return null;
  if (G(e))
    return [Yn(e.enter), Yn(e.leave)];
  {
    const t = Yn(e);
    return [t, t];
  }
}
function Yn(e) {
  return Hi(e);
}
function Ge(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Qt] || (e[Qt] = /* @__PURE__ */ new Set())).add(t);
}
function ht(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Qt];
  n && (n.delete(t), n.size || (e[Qt] = void 0));
}
function Qs(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Ro = 0;
function er(e, t, n, s) {
  const r = e._endId = ++Ro, i = () => {
    r === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: l, timeout: o, propCount: c } = Fo(e, t);
  if (!l)
    return s();
  const d = l + "end";
  let u = 0;
  const h = () => {
    e.removeEventListener(d, m), i();
  }, m = (w) => {
    w.target === e && ++u >= c && h();
  };
  setTimeout(() => {
    u < c && h();
  }, o + 1), e.addEventListener(d, m);
}
function Fo(e, t) {
  const n = window.getComputedStyle(e), s = (M) => (n[M] || "").split(", "), r = s(`${nt}Delay`), i = s(`${nt}Duration`), l = tr(r, i), o = s(`${Ht}Delay`), c = s(`${Ht}Duration`), d = tr(o, c);
  let u = null, h = 0, m = 0;
  t === nt ? l > 0 && (u = nt, h = l, m = i.length) : t === Ht ? d > 0 && (u = Ht, h = d, m = c.length) : (h = Math.max(l, d), u = h > 0 ? l > d ? nt : Ht : null, m = u ? u === nt ? i.length : c.length : 0);
  const w = u === nt && /\b(?:transform|all)(?:,|$)/.test(
    s(`${nt}Property`).toString()
  );
  return {
    type: u,
    timeout: h,
    propCount: m,
    hasTransform: w
  };
}
function tr(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => nr(n) + nr(e[s])));
}
function nr(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function sr(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Ho(e, t, n) {
  const s = e[Qt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const rr = /* @__PURE__ */ Symbol("_vod"), No = /* @__PURE__ */ Symbol("_vsh"), Do = /* @__PURE__ */ Symbol(""), ko = /(?:^|;)\s*display\s*:/;
function jo(e, t, n) {
  const s = e.style, r = oe(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (oe(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && kt(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && kt(s, l, "");
    for (const l in n) {
      l === "display" && (i = !0);
      const o = n[l];
      o != null ? Vo(
        e,
        l,
        !oe(t) && t ? t[l] : void 0,
        o
      ) || kt(s, l, o) : kt(s, l, "");
    }
  } else if (r) {
    if (t !== n) {
      const l = s[Do];
      l && (n += ";" + l), s.cssText = n, i = ko.test(n);
    }
  } else t && e.removeAttribute("style");
  rr in e && (e[rr] = i ? s.display : "", e[No] && (s.display = "none"));
}
const ir = /\s*!important$/;
function kt(e, t, n) {
  if (R(n))
    n.forEach((s) => kt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Bo(e, t);
    ir.test(n) ? e.setProperty(
      ot(s),
      n.replace(ir, ""),
      "important"
    ) : e[s] = n;
  }
}
const lr = ["Webkit", "Moz", "ms"], Xn = {};
function Bo(e, t) {
  const n = Xn[t];
  if (n)
    return n;
  let s = Pe(t);
  if (s !== "filter" && s in e)
    return Xn[t] = s;
  s = _r(s);
  for (let r = 0; r < lr.length; r++) {
    const i = lr[r] + s;
    if (i in e)
      return Xn[t] = i;
  }
  return t;
}
function Vo(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && oe(s) && n === s;
}
const or = "http://www.w3.org/1999/xlink";
function cr(e, t, n, s, r, i = Vi(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(or, t.slice(6, t.length)) : e.setAttributeNS(or, t, n) : n == null || i && !Cr(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : We(n) ? String(n) : n
  );
}
function ar(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Ei(n) : n);
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
    o === "boolean" ? n = Cr(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(r || t);
}
function Ko(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Uo(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const ur = /* @__PURE__ */ Symbol("_vei");
function Wo(e, t, n, s, r = null) {
  const i = e[ur] || (e[ur] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = Go(t);
    if (s) {
      const d = i[t] = Xo(
        s,
        r
      );
      Ko(e, o, d, c);
    } else l && (Uo(e, o, l, c), i[t] = void 0);
  }
}
const zo = /(Once|Passive|Capture)$/, qo = /^on:?(?:Once|Passive|Capture)$/;
function Go(e) {
  let t, n;
  for (; (n = e.match(zo)) && !qo.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : ot(e.slice(2)), t];
}
let Zn = 0;
const Jo = /* @__PURE__ */ Promise.resolve(), Yo = () => Zn || (Jo.then(() => Zn = 0), Zn = Date.now());
function Xo(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const r = n.value;
    if (R(r)) {
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
  return n.value = e, n.attached = Yo(), n;
}
const fr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Zo = (e, t, n, s, r, i) => {
  const l = r === "svg";
  t === "class" ? Ho(e, s, l) : t === "style" ? jo(e, n, s) : En(t) ? Mn(t) || Wo(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Qo(e, t, s, l)) ? (ar(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && cr(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (ec(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !oe(s))) ? ar(e, Pe(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), cr(e, t, s, l));
};
function Qo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && fr(t) && D(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return fr(t) && oe(n) ? !1 : t in e;
}
function ec(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Pe(t);
  return Array.isArray(n) ? n.some((r) => Pe(r) === s) : Object.keys(n).some((r) => Pe(r) === s);
}
const tc = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, nc = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = ((r) => {
    if (!("key" in r))
      return;
    const i = ot(r.key);
    if (t.some(
      (l) => l === i || tc[l] === i
    ))
      return e(r);
  }));
}, sc = /* @__PURE__ */ ae({ patchProp: Zo }, Oo);
let dr;
function rc() {
  return dr || (dr = co(sc));
}
const ic = ((...e) => {
  const t = rc().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = oc(s);
    if (!r) return;
    const i = t._component;
    !D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const l = n(r, !1, lc(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), l;
  }, t;
});
function lc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function oc(e) {
  return oe(e) ? document.querySelector(e) : e;
}
const cc = ["aria-label"], Es = /* @__PURE__ */ St({
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
    }, s = bt(() => t.name ? `${t.name}的像素画面` : `${n[t.scene]}的像素画面`);
    return (r, i) => (I(), H("svg", {
      class: "pixel-scene",
      viewBox: "0 0 96 72",
      role: "img",
      "aria-label": s.value,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "couple" ? (I(), H(re, { key: 0 }, [
        i[0] || (i[0] = Se('<rect class="ground" x="13" y="59" width="70" height="3"></rect><g class="person-one"><rect x="25" y="26" width="12" height="12"></rect><rect x="22" y="39" width="18" height="15"></rect><rect x="22" y="54" width="6" height="8"></rect><rect x="34" y="54" width="6" height="8"></rect></g><g class="person-two"><rect x="59" y="25" width="12" height="13"></rect><rect x="56" y="39" width="18" height="15"></rect><rect x="56" y="54" width="6" height="8"></rect><rect x="68" y="54" width="6" height="8"></rect></g><rect class="pixel-star" x="45" y="16" width="5" height="5"></rect>', 4))
      ], 64)) : e.scene === "cat" ? (I(), H(re, { key: 1 }, [
        i[1] || (i[1] = Se('<g class="cat-body"><rect x="31" y="28" width="34" height="26"></rect><rect x="34" y="21" width="9" height="11"></rect><rect x="54" y="21" width="9" height="11"></rect><rect x="25" y="47" width="10" height="6"></rect><rect x="22" y="42" width="6" height="8"></rect></g><rect class="pixel-warm" x="39" y="36" width="5" height="5"></rect><rect class="pixel-warm" x="53" y="36" width="5" height="5"></rect><rect class="pixel-ink" x="46" y="43" width="5" height="4"></rect><rect class="ground" x="18" y="57" width="62" height="3"></rect>', 5))
      ], 64)) : e.scene === "house" ? (I(), H(re, { key: 2 }, [
        i[2] || (i[2] = Se('<path class="house-roof" d="M18 34h8v-7h8v-7h28v7h8v7h8v6H18z"></path><rect class="house-wall" x="25" y="40" width="46" height="24"></rect><rect class="pixel-warm window-glow" x="34" y="47" width="10" height="9"></rect><rect class="pixel-warm window-glow" x="52" y="47" width="10" height="9"></rect><rect class="pixel-door" x="44" y="51" width="9" height="13"></rect><rect class="ground" x="13" y="64" width="70" height="3"></rect>', 6))
      ], 64)) : e.scene === "girl" ? (I(), H(re, { key: 3 }, [
        i[3] || (i[3] = Se('<rect class="pixel-star" x="19" y="18" width="4" height="4"></rect><rect class="pixel-star" x="73" y="24" width="3" height="3"></rect><g class="person-two"><rect x="42" y="20" width="13" height="13"></rect><rect x="39" y="34" width="19" height="18"></rect><rect x="41" y="52" width="6" height="10"></rect><rect x="51" y="52" width="6" height="10"></rect></g><rect class="pixel-warm" x="45" y="24" width="3" height="3"></rect><rect class="pixel-warm" x="51" y="24" width="3" height="3"></rect><rect class="ground" x="25" y="62" width="48" height="3"></rect>', 6))
      ], 64)) : e.scene === "travel" ? (I(), H(re, { key: 4 }, [
        i[4] || (i[4] = Se('<path class="map-land" d="M16 22h24v7h17v-5h23v35H57v-6H40v6H16z"></path><path class="map-route" d="M25 49L40 37L53 46L70 31"></path><rect class="pixel-warm" x="22" y="46" width="6" height="6"></rect><rect class="pixel-warm" x="37" y="34" width="6" height="6"></rect><rect class="pixel-warm" x="50" y="43" width="6" height="6"></rect><rect class="pixel-warm" x="67" y="28" width="6" height="6"></rect>', 6))
      ], 64)) : (I(), H(re, { key: 5 }, [
        i[5] || (i[5] = g("rect", {
          class: "future-line",
          x: "14",
          y: "52",
          width: "68",
          height: "3"
        }, null, -1)),
        i[6] || (i[6] = g("rect", {
          class: "pixel-warm",
          x: "17",
          y: "45",
          width: "8",
          height: "7"
        }, null, -1)),
        i[7] || (i[7] = g("rect", {
          class: "future-sun",
          x: "69",
          y: "34",
          width: "13",
          height: "13"
        }, null, -1)),
        i[8] || (i[8] = g("text", {
          class: "future-mark",
          x: "44",
          y: "31"
        }, "?", -1))
      ], 64))
    ], 8, cc));
  }
}), ac = ["aria-label"], uc = { key: 0 }, fc = { key: 1 }, dc = { key: 2 }, hc = { key: 3 }, pc = { key: 4 }, gc = { key: 5 }, mc = { key: 6 }, yc = { key: 7 }, vc = /* @__PURE__ */ St({
  __name: "PixelMemory",
  props: {
    scene: {},
    label: {}
  },
  setup(e) {
    return (t, n) => (I(), H("svg", {
      class: "pixel-memory",
      viewBox: "0 0 160 70",
      role: "img",
      "aria-label": e.label,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "meeting" ? (I(), H("g", uc, [...n[0] || (n[0] = [
        Se('<rect class="pm-ground" x="15" y="57" width="130" height="3"></rect><path class="pm-blue" d="M28 31h10v-6h28v6h10v4H28z"></path><rect class="pm-one" x="43" y="35" width="12" height="18"></rect><path class="pm-rose" d="M84 29h10v-6h28v6h10v4H84z"></path><rect class="pm-two" x="99" y="33" width="12" height="20"></rect><rect class="pm-warm" x="76" y="17" width="5" height="5"></rect>', 6)
      ])])) : e.scene === "cat-arrival" ? (I(), H("g", fc, [...n[1] || (n[1] = [
        Se('<path class="pm-box" d="M47 34h66v25H47zM40 28h33l7 6H47zM120 28H87l-7 6h33z"></path><path class="pm-cat" d="M64 21h8v7h16v-7h8v25H64z"></path><rect class="pm-warm" x="70" y="32" width="4" height="4"></rect><rect class="pm-warm" x="87" y="32" width="4" height="4"></rect><rect class="pm-ink" x="78" y="39" width="5" height="3"></rect>', 5)
      ])])) : e.scene === "cat-life" ? (I(), H("g", dc, [...n[2] || (n[2] = [
        Se('<rect class="pm-ground" x="18" y="56" width="124" height="3"></rect><path class="pm-cat" d="M26 35h29v18H26zM29 28h8v8h11v-8h7v8"></path><path class="pm-blue" d="M77 45h28l-5 11H82z"></path><rect class="pm-warm" x="112" y="31" width="8" height="8"></rect><rect class="pm-line" x="119" y="36" width="18" height="3"></rect>', 5)
      ])])) : e.scene === "marriage" ? (I(), H("g", hc, [...n[3] || (n[3] = [
        Se('<rect class="pm-paper" x="43" y="13" width="74" height="47"></rect><rect class="pm-blue" x="43" y="13" width="74" height="9"></rect><rect class="pm-line" x="53" y="29" width="18" height="3"></rect><rect class="pm-line" x="89" y="29" width="18" height="3"></rect><rect class="pm-rose" x="73" y="36" width="7" height="7"></rect><rect class="pm-rose" x="80" y="43" width="7" height="7"></rect><rect class="pm-rose" x="87" y="36" width="7" height="7"></rect>', 7)
      ])])) : e.scene === "wedding" ? (I(), H("g", pc, [...n[4] || (n[4] = [
        Se('<path class="pm-house" d="M33 34h10v-8h10v-7h54v7h10v8h10v5H33z"></path><rect class="pm-wall" x="43" y="39" width="74" height="21"></rect><rect class="pm-warm" x="56" y="46" width="12" height="9"></rect><rect class="pm-warm" x="92" y="46" width="12" height="9"></rect><rect class="pm-door" x="75" y="46" width="11" height="14"></rect>', 5)
      ])])) : e.scene === "birth" ? (I(), H("g", gc, [...n[5] || (n[5] = [
        Se('<rect class="pm-ground" x="29" y="57" width="102" height="3"></rect><path class="pm-blue" d="M50 38h62v17H50zM54 32h8v8h42v-8h8v8"></path><rect class="pm-rose" x="71" y="39" width="20" height="12"></rect><rect class="pm-warm" x="76" y="19" width="8" height="8"></rect><rect class="pm-warm" x="78" y="16" width="4" height="14"></rect><rect class="pm-warm" x="73" y="21" width="14" height="4"></rect>', 6)
      ])])) : e.scene === "growing" ? (I(), H("g", mc, [...n[6] || (n[6] = [
        Se('<rect class="pm-line" x="35" y="14" width="3" height="45"></rect><rect class="pm-line" x="38" y="20" width="10" height="2"></rect><rect class="pm-line" x="38" y="30" width="7" height="2"></rect><rect class="pm-line" x="38" y="40" width="10" height="2"></rect><g class="pm-two"><rect x="68" y="25" width="14" height="14"></rect><rect x="64" y="40" width="22" height="18"></rect></g><rect class="pm-warm" x="104" y="43" width="14" height="14"></rect><rect class="pm-blue" x="118" y="49" width="10" height="8"></rect>', 7)
      ])])) : (I(), H("g", yc, [...n[7] || (n[7] = [
        Se('<path class="pm-route" d="M24 51L55 28L83 44L131 19"></path><rect class="pm-warm" x="20" y="47" width="8" height="8"></rect><rect class="pm-blue" x="51" y="24" width="8" height="8"></rect><rect class="pm-rose" x="79" y="40" width="8" height="8"></rect><rect class="pm-warm" x="127" y="15" width="8" height="8"></rect><path class="pm-case" d="M66 49h28v14H66zM72 44h16v5H72z"></path>', 6)
      ])]))
    ], 8, ac));
  }
}), bc = ["aria-labelledby"], xc = { class: "chapter-scene" }, wc = { class: "chapter-copy" }, _c = ["id"], Sc = { class: "chapter-paragraphs" }, Cc = {
  key: 0,
  class: "destination-list",
  "aria-label": "去过的地方"
}, Tc = {
  key: 1,
  class: "future-list",
  "aria-label": "未来清单"
}, Ac = {
  key: 2,
  class: "memory-slots"
}, Ec = /* @__PURE__ */ St({
  __name: "ChapterCard",
  props: {
    chapter: {},
    index: {},
    total: {}
  },
  emits: ["letter"],
  setup(e) {
    return (t, n) => (I(), H("article", {
      class: "chapter-card",
      "aria-labelledby": `chapter-${e.chapter.id}`
    }, [
      g("div", xc, [
        g("p", null, [
          n[1] || (n[1] = g("span", null, "记忆", -1)),
          g("span", null, J(e.chapter.year), 1)
        ]),
        ne(Es, {
          scene: e.chapter.scene,
          name: e.chapter.title
        }, null, 8, ["scene", "name"]),
        g("small", null, J(e.chapter.subtitle), 1)
      ]),
      g("div", wc, [
        g("header", null, [
          g("span", null, J(String(e.index + 1).padStart(2, "0")) + " / " + J(String(e.total).padStart(2, "0")), 1),
          g("p", null, J(e.chapter.year), 1)
        ]),
        g("h2", {
          id: `chapter-${e.chapter.id}`
        }, J(e.chapter.title), 9, _c),
        g("div", Sc, [
          (I(!0), H(re, null, it(e.chapter.paragraphs, (s) => (I(), H("p", { key: s }, J(s), 1))), 128))
        ]),
        e.chapter.destinations ? (I(), H("ul", Cc, [
          (I(!0), H(re, null, it(e.chapter.destinations, (s) => (I(), H("li", { key: s }, J(s), 1))), 128))
        ])) : vt("", !0),
        e.chapter.futureList ? (I(), H("ul", Tc, [
          (I(!0), H(re, null, it(e.chapter.futureList, (s) => (I(), H("li", { key: s }, [
            n[2] || (n[2] = g("i", { "aria-hidden": "true" }, null, -1)),
            $e(J(s), 1)
          ]))), 128))
        ])) : vt("", !0),
        e.chapter.memorySlots ? (I(), H("div", Ac, [
          (I(!0), H(re, null, it(e.chapter.memorySlots, (s) => (I(), H("figure", {
            key: s.label
          }, [
            ne(vc, {
              scene: s.scene,
              label: s.label
            }, null, 8, ["scene", "label"]),
            g("figcaption", null, J(s.label), 1)
          ]))), 128))
        ])) : vt("", !0),
        e.chapter.id === "future" ? (I(), H("button", {
          key: 3,
          class: "text-command",
          type: "button",
          onClick: n[0] || (n[0] = (s) => t.$emit("letter"))
        }, [...n[3] || (n[3] = [
          $e(" 读取 2040 留言 ", -1),
          g("span", { "aria-hidden": "true" }, "→", -1)
        ])])) : vt("", !0)
      ])
    ], 8, bc));
  }
}), Mc = {
  class: "character-panel",
  "aria-labelledby": "character-title"
}, Oc = { class: "character-grid" }, $c = { class: "character-avatar" }, Pc = { class: "character-level" }, Lc = { class: "character-class" }, Ic = { class: "character-skill" }, Rc = { class: "character-description" }, Fc = /* @__PURE__ */ St({
  __name: "CharacterPanel",
  props: {
    characters: {}
  },
  emits: ["close"],
  setup(e) {
    return (t, n) => (I(), H("aside", Mc, [
      g("header", null, [
        n[1] || (n[1] = g("div", null, [
          g("span", null, "同行成员 / 02"),
          g("h2", { id: "character-title" }, "同行角色")
        ], -1)),
        g("button", {
          type: "button",
          "aria-label": "关闭角色卡",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        }, "×")
      ]),
      g("div", Oc, [
        (I(!0), H(re, null, it(e.characters, (s) => (I(), H("article", {
          key: s.id
        }, [
          g("div", $c, [
            ne(Es, {
              scene: s.scene,
              name: s.name
            }, null, 8, ["scene", "name"])
          ]),
          g("p", Pc, "等级 " + J(s.level), 1),
          g("h3", null, J(s.name), 1),
          g("p", Lc, J(s.className), 1),
          g("dl", null, [
            (I(!0), H(re, null, it(s.attributes, (r) => (I(), H("div", {
              key: r.label
            }, [
              g("dt", null, J(r.label), 1),
              g("dd", null, [
                g("i", {
                  style: tn({ width: `${r.value}%` })
                }, null, 4),
                g("span", null, J(r.value), 1)
              ])
            ]))), 128))
          ]),
          g("p", Ic, [
            n[2] || (n[2] = g("span", null, "特别能力", -1)),
            $e(J(s.skill), 1)
          ]),
          g("p", Rc, J(s.description), 1)
        ]))), 128))
      ])
    ]));
  }
}), Hc = {
  class: "world-map",
  "aria-labelledby": "world-map-title"
}, Nc = { class: "world-map-head" }, Dc = { class: "map-board" }, kc = ["aria-label", "onClick"], jc = /* @__PURE__ */ St({
  __name: "PixelWorld",
  props: {
    chapters: {},
    visited: {}
  },
  emits: ["select"],
  setup(e) {
    return (t, n) => (I(), H("section", Hc, [
      g("header", Nc, [
        n[0] || (n[0] = g("div", null, [
          g("span", null, "家庭存档 / 01"),
          g("h1", { id: "world-map-title" }, "我们的小世界")
        ], -1)),
        g("p", null, J(e.visited.size) + " / " + J(e.chapters.length) + " 已读取", 1)
      ]),
      g("div", Dc, [
        n[2] || (n[2] = g("svg", {
          class: "map-route-lines",
          viewBox: "0 0 100 100",
          preserveAspectRatio: "none",
          "aria-hidden": "true"
        }, [
          g("path", { d: "M15 31 L32 17 L49 40 L67 20 L82 47 L61 75" })
        ], -1)),
        n[3] || (n[3] = g("div", {
          class: "map-house-light",
          "aria-hidden": "true"
        }, [
          g("i"),
          g("i"),
          g("i"),
          g("i")
        ], -1)),
        (I(!0), H(re, null, it(e.chapters, (s, r) => (I(), H("button", {
          key: s.id,
          class: nn(["map-node", { visited: e.visited.has(s.id), future: s.id === "future" }]),
          style: tn({ "--map-x": `${s.x}%`, "--map-y": `${s.y}%` }),
          type: "button",
          "aria-label": `${s.year} ${s.mapLabel}`,
          onClick: (i) => t.$emit("select", r)
        }, [
          n[1] || (n[1] = g("span", { class: "map-node-beacon" }, [
            g("i")
          ], -1)),
          g("strong", null, J(s.mapLabel), 1),
          g("small", null, J(s.year), 1)
        ], 14, kc))), 128)),
        n[4] || (n[4] = g("p", { class: "map-hint" }, "选择一个地点，读取这一段存档", -1))
      ])
    ]));
  }
}), Bc = /* @__PURE__ */ St({
  __name: "StarBackground",
  setup(e) {
    const t = /* @__PURE__ */ yt(null);
    let n = null, s = [], r = 0, i, l = 0, o = 0, c = !1;
    function d() {
      const m = Math.min(150, Math.max(55, Math.round(l * o / 10500)));
      s = Array.from({ length: m }, (w, M) => ({
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
      const m = t.value.getBoundingClientRect(), w = Math.min(window.devicePixelRatio || 1, 2);
      l = m.width, o = m.height, t.value.width = Math.round(l * w), t.value.height = Math.round(o * w), n = t.value.getContext("2d"), n == null || n.setTransform(w, 0, 0, w, 0, 0), d(), h(0);
    }
    function h(m) {
      if (n) {
        n.clearRect(0, 0, l, o);
        for (const w of s) {
          const M = c ? 1 : 0.72 + Math.sin(m * 1e-3 * w.speed + w.phase) * 0.28;
          n.fillStyle = `rgba(237, 229, 203, ${w.alpha * M})`, n.fillRect(Math.round(w.x), Math.round(w.y), w.size, w.size);
        }
        c || (r = requestAnimationFrame(h));
      }
    }
    return rn(() => {
      c = window.matchMedia("(prefers-reduced-motion: reduce)").matches, i = new ResizeObserver(u), t.value && i.observe(t.value), c || (r = requestAnimationFrame(h));
    }), ln(() => {
      i == null || i.disconnect(), cancelAnimationFrame(r);
    }), (m, w) => (I(), H("canvas", {
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
], Vc = [
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
};
function Kc() {
  const e = window.AudioContext || window.webkitAudioContext;
  if (!e) return null;
  try {
    return new e();
  } catch {
    return null;
  }
}
function Uc(e) {
  const t = e.createBuffer(1, 1, e.sampleRate), n = e.createBufferSource();
  n.buffer = t, n.connect(e.destination), n.start(0);
}
async function hr(e) {
  if (e.state === "closed") return !1;
  try {
    return Uc(e), e.state !== "running" && await e.resume(), e.state === "running";
  } catch {
    return !1;
  }
}
function pr(e, t) {
  try {
    localStorage.setItem(e, String(t));
  } catch {
  }
}
const es = "our-little-world:muted", gr = 12.8, Wc = [
  { beat: 0, note: 587.33, length: 1.15 },
  { beat: 1.6, note: 440, length: 0.75 },
  { beat: 2.6, note: 369.99, length: 1.1 },
  { beat: 4.2, note: 440, length: 0.7 },
  { beat: 5.2, note: 493.88, length: 1.15 },
  { beat: 7.1, note: 440, length: 0.7 },
  { beat: 8.1, note: 329.63, length: 1.05 },
  { beat: 10.2, note: 369.99, length: 1.45 }
];
function zc() {
  const e = /* @__PURE__ */ yt(!1), t = /* @__PURE__ */ yt("idle"), n = bt(() => t.value === "playing");
  let s = null, r = null, i = null;
  try {
    e.value = localStorage.getItem(es) === "true", e.value && (t.value = "muted");
  } catch {
  }
  function l(m, w, M, O) {
    if (!s || !r) return;
    const K = s.createOscillator(), B = s.createOscillator(), F = s.createGain(), k = s.createGain();
    K.type = "triangle", K.frequency.value = w, B.type = "sine", B.frequency.value = w * 2, F.gain.setValueAtTime(1e-4, m), F.gain.exponentialRampToValueAtTime(O, m + 0.08), F.gain.exponentialRampToValueAtTime(1e-4, m + M), k.gain.value = 0.09, K.connect(F), B.connect(k).connect(F), F.connect(r), K.start(m), B.start(m), K.stop(m + M + 0.05), B.stop(m + M + 0.05);
  }
  function o(m) {
    Wc.forEach(({ beat: w, note: M, length: O }) => l(m + w, M, O, 0.18)), [146.83, 220, 293.66].forEach((w, M) => {
      l(m + M * 0.04, w, gr - 0.7, 0.025);
    });
  }
  async function c() {
    if (e.value)
      return t.value = "muted", !1;
    if (t.value = "starting", !s) {
      if (s = Kc(), !s)
        return t.value = "blocked", !1;
      r = s.createGain(), r.gain.value = 0.36, r.connect(s.destination);
    }
    return await hr(s) ? i !== null ? (t.value = "playing", !0) : (t.value = "playing", o(s.currentTime + 0.08), i = window.setInterval(() => {
      (s == null ? void 0 : s.state) === "running" && o(s.currentTime + 0.08);
    }, gr * 1e3), !0) : (t.value = "blocked", !1);
  }
  function d(m = "idle") {
    i !== null && window.clearInterval(i), i = null, s == null || s.close(), s = null, r = null, t.value = m;
  }
  async function u() {
    if (t.value === "playing" || t.value === "starting") {
      e.value = !0, pr(es, !0), d("muted");
      return;
    }
    e.value = !1, pr(es, !1), await c();
  }
  async function h() {
    if (document.visibilityState !== "visible" || e.value || !s || i === null) return;
    const m = await hr(s);
    t.value = m ? "playing" : "blocked";
  }
  return rn(() => document.addEventListener("visibilitychange", h)), ln(() => {
    d(), document.removeEventListener("visibilitychange", h);
  }), { muted: e, playing: n, status: t, start: c, toggle: u };
}
const qc = {
  key: "boot",
  class: "boot-screen",
  "aria-labelledby": "world-title"
}, Gc = ["aria-label"], Jc = { "aria-hidden": "true" }, Yc = {
  key: "world",
  class: "world-interface"
}, Xc = { class: "world-toolbar" }, Zc = { class: "toolbar-actions" }, Qc = ["aria-label"], ea = { "aria-hidden": "true" }, ta = {
  key: "chapter",
  class: "chapter-screen"
}, na = {
  class: "chapter-nav",
  "aria-label": "章节切换"
}, sa = ["disabled"], ra = {
  key: "ending",
  class: "ending-screen",
  "aria-labelledby": "ending-title"
}, ia = {
  class: "ending-house",
  "aria-hidden": "true"
}, la = {
  key: 0,
  class: "world-overlay",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "同行角色"
}, oa = {
  key: 0,
  class: "world-overlay letter-overlay",
  role: "dialog",
  "aria-modal": "true",
  "aria-labelledby": "letter-title"
}, ca = { class: "future-letter" }, aa = { id: "letter-title" }, ua = /* @__PURE__ */ St({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ yt("boot"), n = /* @__PURE__ */ yt(0), s = /* @__PURE__ */ yt(!1), r = /* @__PURE__ */ yt(!1), i = /* @__PURE__ */ Ln(/* @__PURE__ */ new Set()), l = bt(() => pt[n.value]), { status: o, start: c, toggle: d } = zc(), u = bt(
      () => o.value === "playing" || o.value === "starting" ? "关闭背景音乐" : "开启背景音乐"
    ), h = bt(() => o.value === "playing" ? "♪" : o.value === "starting" ? "…" : "×"), m = bt(() => ({
      idle: "声音待开启",
      starting: "声音启动中",
      playing: "声音播放中",
      muted: "声音已关闭",
      blocked: "点击重试声音"
    })[o.value]);
    function w() {
      try {
        localStorage.setItem("our-little-world:visited", JSON.stringify([...i]));
      } catch {
      }
    }
    function M() {
      c(), t.value = "map";
    }
    function O() {
      t.value = "map", r.value = !1;
    }
    function K(V) {
      n.value = V, i.add(pt[V].id), w(), t.value = "chapter";
    }
    function B() {
      n.value > 0 && K(n.value - 1);
    }
    function F() {
      if (n.value < pt.length - 1) {
        K(n.value + 1);
        return;
      }
      t.value = "ending";
    }
    function k() {
      r.value ? r.value = !1 : s.value ? s.value = !1 : (t.value === "chapter" || t.value === "ending") && O();
    }
    function $(V) {
      V.key === "Escape" && k(), !(t.value !== "chapter" || s.value || r.value) && (V.key === "ArrowLeft" && B(), V.key === "ArrowRight" && F());
    }
    return rn(() => {
      try {
        JSON.parse(localStorage.getItem("our-little-world:visited") || "[]").filter((S) => pt.some((z) => z.id === S)).forEach((S) => i.add(S));
      } catch {
      }
      window.addEventListener("keydown", $);
    }), ln(() => window.removeEventListener("keydown", $)), (V, S) => (I(), H("div", {
      class: nn(["little-world", `screen-${t.value}`]),
      onKeydown: nc(k, ["esc"])
    }, [
      ne(Bc),
      S[27] || (S[27] = g("div", {
        class: "world-vignette",
        "aria-hidden": "true"
      }, null, -1)),
      ne(hn, {
        name: "world-fade",
        mode: "out-in"
      }, {
        default: Nt(() => [
          t.value === "boot" ? (I(), H("section", qc, [
            S[9] || (S[9] = g("div", { class: "boot-save" }, [
              g("span", null, "家庭存档 01"),
              g("span", null, "2018—2026")
            ], -1)),
            g("button", {
              class: "sound-toggle boot-sound",
              type: "button",
              "aria-label": u.value,
              onClick: S[0] || (S[0] = //@ts-ignore
              (...z) => Ae(d) && Ae(d)(...z))
            }, [
              g("span", Jc, J(h.value), 1),
              $e(J(m.value), 1)
            ], 8, Gc),
            S[10] || (S[10] = g("pre", {
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
            S[11] || (S[11] = g("p", { class: "boot-status" }, [
              g("i"),
              $e(" 世界已载入")
            ], -1)),
            S[12] || (S[12] = g("h1", { id: "world-title" }, "我们的小世界", -1)),
            S[13] || (S[13] = g("p", { class: "boot-names" }, "W × W", -1)),
            g("button", {
              class: "pixel-button boot-enter",
              type: "button",
              onClick: M
            }, [...S[8] || (S[8] = [
              g("span", { "aria-hidden": "true" }, "▶", -1),
              $e(" 进入 ", -1)
            ])]),
            S[14] || (S[14] = g("p", { class: "boot-note" }, "一份用代码完成的家庭礼物", -1))
          ])) : (I(), H("div", Yc, [
            g("header", Xc, [
              g("button", {
                type: "button",
                class: "toolbar-home",
                onClick: O
              }, [...S[15] || (S[15] = [
                g("span", { "aria-hidden": "true" }, "⌂", -1),
                g("span", null, "世界地图", -1)
              ])]),
              S[17] || (S[17] = g("p", null, [
                g("i"),
                $e(" 我们的小世界 "),
                g("small", null, "/ 运行中")
              ], -1)),
              g("div", Zc, [
                g("button", {
                  class: "sound-toggle",
                  type: "button",
                  "aria-label": u.value,
                  onClick: S[1] || (S[1] = //@ts-ignore
                  (...z) => Ae(d) && Ae(d)(...z))
                }, [
                  g("span", ea, J(h.value), 1)
                ], 8, Qc),
                g("button", {
                  type: "button",
                  class: "toolbar-party",
                  onClick: S[2] || (S[2] = (z) => s.value = !0)
                }, [...S[16] || (S[16] = [
                  $e(" 同行角色 ", -1),
                  g("span", null, "02", -1)
                ])])
              ])
            ]),
            ne(hn, {
              name: "scene-shift",
              mode: "out-in"
            }, {
              default: Nt(() => [
                t.value === "map" ? (I(), _i(jc, {
                  key: "map",
                  chapters: Ae(pt),
                  visited: i,
                  onSelect: K
                }, null, 8, ["chapters", "visited"])) : t.value === "chapter" && l.value ? (I(), H("section", ta, [
                  ne(Ec, {
                    chapter: l.value,
                    index: n.value,
                    total: Ae(pt).length,
                    onLetter: S[3] || (S[3] = (z) => r.value = !0)
                  }, null, 8, ["chapter", "index", "total"]),
                  g("nav", na, [
                    g("button", {
                      type: "button",
                      disabled: n.value === 0,
                      onClick: B
                    }, [...S[18] || (S[18] = [
                      g("span", { "aria-hidden": "true" }, "←", -1),
                      $e(" 上一段 ", -1)
                    ])], 8, sa),
                    g("button", {
                      type: "button",
                      onClick: O
                    }, "返回地图"),
                    g("button", {
                      type: "button",
                      onClick: F
                    }, [
                      $e(J(n.value === Ae(pt).length - 1 ? "完成探索" : "下一段") + " ", 1),
                      S[19] || (S[19] = g("span", { "aria-hidden": "true" }, "→", -1))
                    ])
                  ])
                ])) : (I(), H("section", ra, [
                  g("div", ia, [
                    ne(Es, { scene: "house" })
                  ]),
                  S[21] || (S[21] = g("p", null, "家庭存档 / 已完成", -1)),
                  S[22] || (S[22] = g("h2", { id: "ending-title" }, "谢谢你", -1)),
                  S[23] || (S[23] = g("p", { class: "ending-copy" }, "谢谢你一直和我一起生活，也一起照顾这个越来越热闹的小世界。", -1)),
                  S[24] || (S[24] = g("strong", null, "七夕快乐", -1)),
                  g("div", { class: "ending-actions" }, [
                    g("button", {
                      class: "pixel-button",
                      type: "button",
                      onClick: O
                    }, "再次查看地图"),
                    S[20] || (S[20] = g("a", { href: "/works/" }, "返回作品列表", -1))
                  ])
                ]))
              ]),
              _: 1
            })
          ]))
        ]),
        _: 1
      }),
      ne(hn, { name: "panel-slide" }, {
        default: Nt(() => [
          s.value ? (I(), H("div", la, [
            g("button", {
              class: "overlay-backdrop",
              type: "button",
              "aria-label": "关闭角色卡",
              onClick: S[4] || (S[4] = (z) => s.value = !1)
            }),
            ne(Fc, {
              characters: Ae(Vc),
              onClose: S[5] || (S[5] = (z) => s.value = !1)
            }, null, 8, ["characters"])
          ])) : vt("", !0)
        ]),
        _: 1
      }),
      ne(hn, { name: "panel-slide" }, {
        default: Nt(() => [
          r.value ? (I(), H("div", oa, [
            g("button", {
              class: "overlay-backdrop",
              type: "button",
              "aria-label": "关闭未来留言",
              onClick: S[6] || (S[6] = (z) => r.value = !1)
            }),
            g("article", ca, [
              g("header", null, [
                g("span", null, J(Ae(Qn).year), 1),
                g("button", {
                  type: "button",
                  "aria-label": "关闭未来留言",
                  onClick: S[7] || (S[7] = (z) => r.value = !1)
                }, "×")
              ]),
              S[25] || (S[25] = g("p", null, "私人留言", -1)),
              g("h2", aa, J(Ae(Qn).title), 1),
              g("div", null, [
                (I(!0), H(re, null, it(Ae(Qn).paragraphs, (z) => (I(), H("p", { key: z }, J(z), 1))), 128))
              ]),
              S[26] || (S[26] = g("small", null, "这封信先保存在未来，到时候再回来看看。", -1))
            ])
          ])) : vt("", !0)
        ]),
        _: 1
      })
    ], 34));
  }
}), mr = document.querySelector("#our-little-world-app");
mr && ic(ua).mount(mr);
