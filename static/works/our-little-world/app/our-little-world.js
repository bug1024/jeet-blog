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
const te = {}, Et = [], Ue = () => {
}, hr = () => !1, An = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Mn = (e) => e.startsWith("onUpdate:"), ae = Object.assign, ds = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ai = Object.prototype.hasOwnProperty, z = (e, t) => Ai.call(e, t), R = Array.isArray, At = (e) => en(e) === "[object Map]", pr = (e) => en(e) === "[object Set]", Ls = (e) => en(e) === "[object Date]", N = (e) => typeof e == "function", oe = (e) => typeof e == "string", We = (e) => typeof e == "symbol", q = (e) => e !== null && typeof e == "object", gr = (e) => (q(e) || N(e)) && N(e.then) && N(e.catch), mr = Object.prototype.toString, en = (e) => mr.call(e), Mi = (e) => en(e).slice(8, -1), yr = (e) => en(e) === "[object Object]", hs = (e) => oe(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, jt = /* @__PURE__ */ fs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), $n = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, $i = /-\w/g, Pe = $n(
  (e) => e.replace($i, (t) => t.slice(1).toUpperCase())
), Oi = /\B([A-Z])/g, ot = $n(
  (e) => e.replace(Oi, "-$1").toLowerCase()
), vr = $n((e) => e.charAt(0).toUpperCase() + e.slice(1)), jn = $n(
  (e) => e ? `on${vr(e)}` : ""
), Ve = (e, t) => !Object.is(e, t), Bn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, br = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Pi = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Li = (e) => {
  const t = oe(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Is;
const On = () => Is || (Is = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function tn(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = oe(s) ? Hi(s) : tn(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (oe(e) || q(e))
    return e;
}
const Ii = /;(?![^(]*\))/g, Ri = /:([^]+)/, Fi = /\/\*[^]*?\*\//g;
function Hi(e) {
  const t = {};
  return e.replace(Fi, "").split(Ii).forEach((n) => {
    if (n) {
      const s = n.split(Ri);
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
  else if (q(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Ni = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Di = /* @__PURE__ */ fs(Ni);
function xr(e) {
  return !!e || e === "";
}
function ki(e, t) {
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
  if (n = R(e), s = R(t), n || s)
    return n && s ? ki(e, t) : !1;
  if (n = q(e), s = q(t), n || s) {
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
const wr = (e) => !!(e && e.__v_isRef === !0), J = (e) => oe(e) ? e : e == null ? "" : R(e) || q(e) && (e.toString === mr || !N(e.toString)) ? wr(e) ? J(e.value) : JSON.stringify(e, _r, 2) : String(e), _r = (e, t) => wr(t) ? _r(e, t.value) : At(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[Vn(s, i) + " =>"] = r, n),
    {}
  )
} : pr(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Vn(n))
} : We(t) ? Vn(t) : q(t) && !R(t) && !yr(t) ? String(t) : t, Vn = (e, t = "") => {
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
class ji {
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
function Bi() {
  return de;
}
let ee;
const Kn = /* @__PURE__ */ new WeakSet();
class Sr {
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Tr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Rs(this), Er(this);
    const t = ee, n = Le;
    ee = this, Le = !0;
    try {
      return this.fn();
    } finally {
      Ar(this), ee = t, Le = n, this.flags &= -3;
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
let Cr = 0, Bt, Vt;
function Tr(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Vt, Vt = e;
    return;
  }
  e.next = Bt, Bt = e;
}
function gs() {
  Cr++;
}
function ms() {
  if (--Cr > 0)
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
function Er(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ar(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), ys(s), Vi(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function es(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Mr(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Mr(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === zt) || (e.globalVersion = zt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !es(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ee, s = Le;
  ee = e, Le = !0;
  try {
    Er(e);
    const r = e.fn(e._value);
    (t.version === 0 || Ve(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    ee = n, Le = s, Ar(e), e.flags &= -3;
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
function Vi(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Le = !0;
const $r = [];
function Ze() {
  $r.push(Le), Le = !1;
}
function Qe() {
  const e = $r.pop();
  Le = e === void 0 ? !0 : e;
}
function Rs(e) {
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
class Ki {
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
    if (!ee || !Le || ee === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ee)
      n = this.activeLink = new Ki(ee, this), ee.deps ? (n.prevDep = ee.depsTail, ee.depsTail.nextDep = n, ee.depsTail = n) : ee.deps = ee.depsTail = n, Or(n);
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
    gs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ms();
    }
  }
}
function Or(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Or(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const ts = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ Symbol(
  ""
), ns = /* @__PURE__ */ Symbol(
  ""
), qt = /* @__PURE__ */ Symbol(
  ""
);
function pe(e, t, n) {
  if (Le && ee) {
    let s = ts.get(e);
    s || ts.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new vs()), r.map = s, r.key = n), r.track();
  }
}
function Xe(e, t, n, s, r, i) {
  const l = ts.get(e);
  if (!l) {
    zt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (gs(), t === "clear")
    l.forEach(o);
  else {
    const c = R(e), d = c && hs(n);
    if (c && n === "length") {
      const u = Number(s);
      l.forEach((h, x) => {
        (x === "length" || x === qt || !We(x) && x >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(qt)), t) {
        case "add":
          c ? d && o(l.get("length")) : (o(l.get(bt)), At(e) && o(l.get(ns)));
          break;
        case "delete":
          c || (o(l.get(bt)), At(e) && o(l.get(ns)));
          break;
        case "set":
          At(e) && o(l.get(bt));
          break;
      }
  }
  ms();
}
function St(e) {
  const t = /* @__PURE__ */ U(e);
  return t === e ? t : (pe(t, "iterate", qt), /* @__PURE__ */ Me(e) ? t : t.map(Ie));
}
function Pn(e) {
  return pe(e = /* @__PURE__ */ U(e), "iterate", qt), e;
}
function je(e, t) {
  return /* @__PURE__ */ et(e) ? Ot(/* @__PURE__ */ xt(e) ? Ie(t) : t) : Ie(t);
}
const Ui = {
  __proto__: null,
  [Symbol.iterator]() {
    return Un(this, Symbol.iterator, (e) => je(this, e));
  },
  concat(...e) {
    return St(this).concat(
      ...e.map((t) => R(t) ? St(t) : t)
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
    return Rt(this, "pop");
  },
  push(...e) {
    return Rt(this, "push", e);
  },
  reduce(e, ...t) {
    return Fs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Fs(this, "reduceRight", e, t);
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
    return St(this).toReversed();
  },
  toSorted(e) {
    return St(this).toSorted(e);
  },
  toSpliced(...e) {
    return St(this).toSpliced(...e);
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
const Wi = Array.prototype;
function qe(e, t, n, s, r, i) {
  const l = Pn(e), o = l !== e && !/* @__PURE__ */ Me(e), c = l[t];
  if (c !== Wi[t]) {
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
  const s = /* @__PURE__ */ U(e);
  pe(s, "iterate", qt);
  const r = s[t](...n);
  return (r === -1 || r === !1) && /* @__PURE__ */ ws(n[0]) ? (n[0] = /* @__PURE__ */ U(n[0]), s[t](...n)) : r;
}
function Rt(e, t, n = []) {
  Ze(), gs();
  const s = (/* @__PURE__ */ U(e))[t].apply(e, n);
  return ms(), Qe(), s;
}
const zi = /* @__PURE__ */ fs("__proto__,__v_isRef,__isVue"), Pr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(We)
);
function qi(e) {
  We(e) || (e = String(e));
  const t = /* @__PURE__ */ U(this);
  return pe(t, "has", e), t.hasOwnProperty(e);
}
class Lr {
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
      return s === (r ? i ? sl : Hr : i ? Fr : Rr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = R(t);
    if (!r) {
      let c;
      if (l && (c = Ui[n]))
        return c;
      if (n === "hasOwnProperty")
        return qi;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ ge(t) ? t : s
    );
    if ((We(n) ? Pr.has(n) : zi(n)) || (r || pe(t, "get", n), i))
      return o;
    if (/* @__PURE__ */ ge(o)) {
      const c = l && hs(n) ? o : o.value;
      return r && q(c) ? /* @__PURE__ */ rs(c) : c;
    }
    return q(o) ? r ? /* @__PURE__ */ rs(o) : /* @__PURE__ */ Ln(o) : o;
  }
}
class Ir extends Lr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    const l = R(t) && hs(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ et(i);
      if (!/* @__PURE__ */ Me(s) && !/* @__PURE__ */ et(s) && (i = /* @__PURE__ */ U(i), s = /* @__PURE__ */ U(s)), !l && /* @__PURE__ */ ge(i) && !/* @__PURE__ */ ge(s))
        return d || (i.value = s), !0;
    }
    const o = l ? Number(n) < t.length : z(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ ge(t) ? t : r
    );
    return t === /* @__PURE__ */ U(r) && c && (o ? Ve(s, i) && Xe(t, "set", n, s) : Xe(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = z(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Xe(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!We(n) || !Pr.has(n)) && pe(t, "has", n), s;
  }
  ownKeys(t) {
    return pe(
      t,
      "iterate",
      R(t) ? "length" : bt
    ), Reflect.ownKeys(t);
  }
}
class Ji extends Lr {
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
const Gi = /* @__PURE__ */ new Ir(), Yi = /* @__PURE__ */ new Ji(), Xi = /* @__PURE__ */ new Ir(!0);
const ss = (e) => e, un = (e) => Reflect.getPrototypeOf(e);
function Zi(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = /* @__PURE__ */ U(r), l = At(i), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, d = r[e](...s), u = n ? ss : t ? Ot : Ie;
    return !t && pe(
      i,
      "iterate",
      c ? ns : bt
    ), ae(
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
function fn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Qi(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ U(i), o = /* @__PURE__ */ U(r);
      e || (Ve(r, o) && pe(l, "get", r), pe(l, "get", o));
      const { has: c } = un(l), d = t ? ss : e ? Ot : Ie;
      if (c.call(l, r))
        return d(i.get(r));
      if (c.call(l, o))
        return d(i.get(o));
      i !== l && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && pe(/* @__PURE__ */ U(r), "iterate", bt), r.size;
    },
    has(r) {
      const i = this.__v_raw, l = /* @__PURE__ */ U(i), o = /* @__PURE__ */ U(r);
      return e || (Ve(r, o) && pe(l, "has", r), pe(l, "has", o)), r === o ? i.has(r) : i.has(r) || i.has(o);
    },
    forEach(r, i) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ U(o), d = t ? ss : e ? Ot : Ie;
      return !e && pe(c, "iterate", bt), o.forEach((u, h) => r.call(i, d(u), d(h), l));
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
        const i = /* @__PURE__ */ U(this), l = un(i), o = /* @__PURE__ */ U(r), c = !t && !/* @__PURE__ */ Me(r) && !/* @__PURE__ */ et(r) ? o : r;
        return l.has.call(i, c) || Ve(r, c) && l.has.call(i, r) || Ve(o, c) && l.has.call(i, o) || (i.add(c), Xe(i, "add", c, c)), this;
      },
      set(r, i) {
        !t && !/* @__PURE__ */ Me(i) && !/* @__PURE__ */ et(i) && (i = /* @__PURE__ */ U(i));
        const l = /* @__PURE__ */ U(this), { has: o, get: c } = un(l);
        let d = o.call(l, r);
        d || (r = /* @__PURE__ */ U(r), d = o.call(l, r));
        const u = c.call(l, r);
        return l.set(r, i), d ? Ve(i, u) && Xe(l, "set", r, i) : Xe(l, "add", r, i), this;
      },
      delete(r) {
        const i = /* @__PURE__ */ U(this), { has: l, get: o } = un(i);
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
    n[r] = Zi(r, e, t);
  }), n;
}
function bs(e, t) {
  const n = Qi(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    z(n, r) && r in s ? n : s,
    r,
    i
  );
}
const el = {
  get: /* @__PURE__ */ bs(!1, !1)
}, tl = {
  get: /* @__PURE__ */ bs(!1, !0)
}, nl = {
  get: /* @__PURE__ */ bs(!0, !1)
};
const Rr = /* @__PURE__ */ new WeakMap(), Fr = /* @__PURE__ */ new WeakMap(), Hr = /* @__PURE__ */ new WeakMap(), sl = /* @__PURE__ */ new WeakMap();
function rl(e) {
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
  return /* @__PURE__ */ et(e) ? e : xs(
    e,
    !1,
    Gi,
    el,
    Rr
  );
}
// @__NO_SIDE_EFFECTS__
function il(e) {
  return xs(
    e,
    !1,
    Xi,
    tl,
    Fr
  );
}
// @__NO_SIDE_EFFECTS__
function rs(e) {
  return xs(
    e,
    !0,
    Yi,
    nl,
    Hr
  );
}
function xs(e, t, n, s, r) {
  if (!q(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const l = rl(Mi(e));
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
function ll(e) {
  return !z(e, "__v_skip") && Object.isExtensible(e) && br(e, "__v_skip", !0), e;
}
const Ie = (e) => q(e) ? /* @__PURE__ */ Ln(e) : e, Ot = (e) => q(e) ? /* @__PURE__ */ rs(e) : e;
// @__NO_SIDE_EFFECTS__
function ge(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function yt(e) {
  return ol(e, !1);
}
function ol(e, t) {
  return /* @__PURE__ */ ge(e) ? e : new cl(e, t);
}
class cl {
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
function Ee(e) {
  return /* @__PURE__ */ ge(e) ? e.value : e;
}
const al = {
  get: (e, t, n) => t === "__v_raw" ? e : Ee(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return /* @__PURE__ */ ge(r) && !/* @__PURE__ */ ge(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Nr(e) {
  return /* @__PURE__ */ xt(e) ? e : new Proxy(e, al);
}
class ul {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new vs(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = zt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ee !== this)
      return Tr(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Mr(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function fl(e, t, n = !1) {
  let s, r;
  return N(e) ? s = e : (s = e.get, r = e.set), new ul(s, r, n);
}
const dn = {}, yn = /* @__PURE__ */ new WeakMap();
let gt;
function dl(e, t = !1, n = gt) {
  if (n) {
    let s = yn.get(n);
    s || yn.set(n, s = []), s.push(e);
  }
}
function hl(e, t, n = te) {
  const { immediate: s, deep: r, once: i, scheduler: l, augmentJob: o, call: c } = n, d = (M) => r ? M : /* @__PURE__ */ Me(M) || r === !1 || r === 0 ? rt(M, 1) : rt(M);
  let u, h, x, w, $ = !1, O = !1;
  if (/* @__PURE__ */ ge(e) ? (h = () => e.value, $ = /* @__PURE__ */ Me(e)) : /* @__PURE__ */ xt(e) ? (h = () => d(e), $ = !0) : R(e) ? (O = !0, $ = e.some((M) => /* @__PURE__ */ xt(M) || /* @__PURE__ */ Me(M)), h = () => e.map((M) => {
    if (/* @__PURE__ */ ge(M))
      return M.value;
    if (/* @__PURE__ */ xt(M))
      return d(M);
    if (N(M))
      return c ? c(M, 2) : M();
  })) : N(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (x) {
      Ze();
      try {
        x();
      } finally {
        Qe();
      }
    }
    const M = gt;
    gt = u;
    try {
      return c ? c(e, 3, [w]) : e(w);
    } finally {
      gt = M;
    }
  } : h = Ue, t && r) {
    const M = h, B = r === !0 ? 1 / 0 : r;
    h = () => rt(M(), B);
  }
  const G = Bi(), K = () => {
    u.stop(), G && G.active && ds(G.effects, u);
  };
  if (i && t) {
    const M = t;
    t = (...B) => {
      const S = M(...B);
      return K(), S;
    };
  }
  let D = O ? new Array(e.length).fill(dn) : dn;
  const j = (M) => {
    if (!(!(u.flags & 1) || !u.dirty && !M))
      if (t) {
        const B = u.run();
        if (M || r || $ || (O ? B.some((S, W) => Ve(S, D[W])) : Ve(B, D))) {
          x && x();
          const S = gt;
          gt = u;
          try {
            const W = [
              B,
              // pass undefined as the old value when it's changed for the first time
              D === dn ? void 0 : O && D[0] === dn ? [] : D,
              w
            ];
            D = B, c ? c(t, 3, W) : (
              // @ts-expect-error
              t(...W)
            );
          } finally {
            gt = S;
          }
        }
      } else
        u.run();
  };
  return o && o(j), u = new Sr(h), u.scheduler = l ? () => l(j, !1) : j, w = (M) => dl(M, !1, u), x = u.onStop = () => {
    const M = yn.get(u);
    if (M) {
      if (c)
        c(M, 4);
      else
        for (const B of M) B();
      yn.delete(u);
    }
  }, t ? s ? j(!0) : D = u.run() : l ? l(j.bind(null, !0), !0) : u.run(), K.pause = u.pause.bind(u), K.resume = u.resume.bind(u), K.stop = K, K;
}
function rt(e, t = 1 / 0, n) {
  if (t <= 0 || !q(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ ge(e))
    rt(e.value, t, n);
  else if (R(e))
    for (let s = 0; s < e.length; s++)
      rt(e[s], t, n);
  else if (pr(e) || At(e))
    e.forEach((s) => {
      rt(s, t, n);
    });
  else if (yr(e)) {
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
function $e(e, t, n, s) {
  if (N(e)) {
    const r = sn(e, t, n, s);
    return r && gr(r) && r.catch((i) => {
      In(i, t, n);
    }), r;
  }
  if (R(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push($e(e[i], t, n, s));
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
  pl(e, n, r, s, l);
}
function pl(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const ye = [];
let ke = -1;
const Mt = [];
let st = null, Ct = 0;
const Dr = /* @__PURE__ */ Promise.resolve();
let vn = null;
function gl(e) {
  const t = vn || Dr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function ml(e) {
  let t = ke + 1, n = ye.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = ye[s], i = Jt(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function _s(e) {
  if (!(e.flags & 1)) {
    const t = Jt(e), n = ye[ye.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Jt(n) ? ye.push(e) : ye.splice(ml(t), 0, e), e.flags |= 1, kr();
  }
}
function kr() {
  vn || (vn = Dr.then(Br));
}
function yl(e) {
  if (!R(e))
    st && e.id === -1 ? st.splice(Ct + 1, 0, e) : e.flags & 1 || (Mt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Mt.push(e[t]);
  kr();
}
function Hs(e, t, n = ke + 1) {
  for (; n < ye.length; n++) {
    const s = ye[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ye.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function jr(e) {
  if (Mt.length) {
    const t = [...new Set(Mt)].sort(
      (n, s) => Jt(n) - Jt(s)
    );
    if (Mt.length = 0, st) {
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
const Jt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Br(e) {
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
    ke = -1, ye.length = 0, jr(), vn = null, (ye.length || Mt.length) && Br();
  }
}
let Ke = null, Vr = null;
function bn(e) {
  const t = Ke;
  return Ke = e, Vr = e && e.type.__scopeId || null, t;
}
function Nt(e, t = Ke, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Sn(-1);
    const i = bn(t), l = wt.length;
    let o;
    try {
      o = e(...r);
    } finally {
      for (let c = wt.length; c > l; c--) mi();
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
    c && (Ze(), $e(c, n, 8, [
      e.el,
      o,
      e,
      t
    ]), Qe());
  }
}
function vl(e, t) {
  if (be) {
    let n = be.provides;
    const s = be.parent && be.parent.provides;
    s === n && (n = be.provides = Object.create(s)), n[e] = t;
  }
}
function pn(e, t, n = !1) {
  const s = xi();
  if (s || $t) {
    let r = $t ? $t._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && N(t) ? t.call(s && s.proxy) : t;
  }
}
const bl = /* @__PURE__ */ Symbol.for("v-scx"), xl = () => pn(bl);
function zn(e, t, n) {
  return Kr(e, t, n);
}
function Kr(e, t, n = te) {
  const { immediate: s, deep: r, flush: i, once: l } = n, o = ae({}, n), c = t && s || !t && i !== "post";
  let d;
  if (Zt) {
    if (i === "sync") {
      const w = xl();
      d = w.__watcherHandles || (w.__watcherHandles = []);
    } else if (!c) {
      const w = () => {
      };
      return w.stop = Ue, w.resume = Ue, w.pause = Ue, w;
    }
  }
  const u = be;
  o.call = (w, $, O) => $e(w, u, $, O);
  let h = !1;
  i === "post" ? o.scheduler = (w) => {
    we(w, u && u.suspense);
  } : i !== "sync" && (h = !0, o.scheduler = (w, $) => {
    $ ? w() : _s(w);
  }), o.augmentJob = (w) => {
    t && (w.flags |= 4), h && (w.flags |= 2, u && (w.id = u.uid, w.i = u));
  };
  const x = hl(e, t, o);
  return Zt && (d ? d.push(x) : c && x()), x;
}
function wl(e, t, n) {
  const s = this.proxy, r = oe(e) ? e.includes(".") ? Ur(s, e) : () => s[e] : e.bind(s, s);
  let i;
  N(t) ? i = t : (i = t.handler, n = t);
  const l = on(this), o = Kr(r, i.bind(s), n);
  return l(), o;
}
function Ur(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const _l = /* @__PURE__ */ Symbol("_vte"), Rn = (e) => e.__isTeleport, Ae = /* @__PURE__ */ Symbol("_leaveCb"), Ft = /* @__PURE__ */ Symbol("_enterCb");
function Sl() {
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
const Te = [Function, Array], Wr = {
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
}, zr = (e) => {
  const t = e.subTree;
  return t.component ? zr(t.component) : t;
}, Cl = {
  name: "BaseTransition",
  props: Wr,
  setup(e, { slots: t }) {
    const n = xi(), s = Sl();
    return () => {
      const r = t.default && Gr(t.default(), !0), i = r && r.length ? qr(r) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? vt() : void 0
      );
      if (!i)
        return;
      const l = /* @__PURE__ */ U(e), { mode: o } = l;
      if (s.isLeaving)
        return qn(i);
      const c = xn(i);
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
      c.type !== ve && Gt(c, d);
      let u = n.subTree && xn(n.subTree);
      if (u && u.type !== ve && !mt(u, c) && zr(n).type !== ve) {
        let h = is(
          u,
          l,
          s,
          n
        );
        if (Gt(u, h), o === "out-in" && c.type !== ve)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave, u = void 0;
          }, qn(i);
        o === "in-out" && c.type !== ve ? h.delayLeave = (x, w, $) => {
          const O = Jr(
            s,
            u
          );
          O[String(u.key)] = u, x[Ae] = () => {
            w(), x[Ae] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            $(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return i;
    };
  }
};
function qr(e) {
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
const Tl = Cl;
function Jr(e, t) {
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
    onLeave: w,
    onAfterLeave: $,
    onLeaveCancelled: O,
    onBeforeAppear: G,
    onAppear: K,
    onAfterAppear: D,
    onAppearCancelled: j
  } = t, M = String(e.key), B = Jr(n, e), S = (k, Y) => {
    k && $e(
      k,
      s,
      9,
      Y
    );
  }, W = (k, Y) => {
    const ie = Y[1];
    S(k, Y), R(k) ? k.every((A) => A.length <= 1) && ie() : k.length <= 1 && ie();
  }, xe = {
    mode: l,
    persisted: o,
    beforeEnter(k) {
      let Y = c;
      if (!n.isMounted)
        if (i)
          Y = G || c;
        else
          return;
      k[Ae] && k[Ae](
        !0
        /* cancelled */
      );
      const ie = B[M];
      ie && mt(e, ie) && ie.el[Ae] && ie.el[Ae](), S(Y, [k]);
    },
    enter(k) {
      if (B[M] === e) return;
      let Y = d, ie = u, A = h;
      if (!n.isMounted)
        if (i)
          Y = K || d, ie = D || u, A = j || h;
        else
          return;
      let se = !1;
      k[Ft] = (ze) => {
        se || (se = !0, ze ? S(A, [k]) : S(ie, [k]), xe.delayedLeave && xe.delayedLeave(), k[Ft] = void 0);
      };
      const he = k[Ft].bind(null, !1);
      Y ? W(Y, [k, he]) : he();
    },
    leave(k, Y) {
      const ie = String(e.key);
      if (k[Ft] && k[Ft](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return Y();
      S(x, [k]);
      let A = !1;
      k[Ae] = (he) => {
        A || (A = !0, Y(), he ? S(O, [k]) : S($, [k]), k[Ae] = void 0, B[ie] === e && delete B[ie]);
      };
      const se = k[Ae].bind(null, !1);
      B[ie] = e, w ? W(w, [k, se]) : se();
    },
    clone(k) {
      const Y = is(
        k,
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
    return Rn(e.type) && e.children ? qr(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && N(n.default))
      return n.default();
  }
}
function Gt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Gt(
      Rn(n.type) && xn(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Gr(e, t = !1, n) {
  let s = [], r = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : i);
    l.type === re ? (l.patchFlag & 128 && r++, s = s.concat(
      Gr(l.children, t, o)
    )) : (t || l.type !== ve) && s.push(o != null ? lt(l, { key: o }) : l);
  }
  if (r > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function _t(e, t) {
  return N(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ae({ name: e.name }, t, { setup: e })
  ) : e;
}
function Yr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ns(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const wn = /* @__PURE__ */ new WeakMap();
function Kt(e, t, n, s, r = !1) {
  if (R(e)) {
    e.forEach(
      (O, G) => Kt(
        O,
        t && (R(t) ? t[G] : t),
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
  const i = s.shapeFlag & 4 ? Ts(s.component) : s.el, l = r ? null : i, { i: o, r: c } = e, d = t && t.r, u = o.refs === te ? o.refs = {} : o.refs, h = o.setupState, x = /* @__PURE__ */ U(h), w = h === te ? hr : (O) => Ns(u, O) ? !1 : z(x, O), $ = (O, G) => !(G && Ns(u, G));
  if (d != null && d !== c) {
    if (Ds(t), oe(d))
      u[d] = null, w(d) && (h[d] = null);
    else if (/* @__PURE__ */ ge(d)) {
      const O = t;
      $(d, O.k) && (d.value = null), O.k && (u[O.k] = null);
    }
  }
  if (N(c))
    sn(c, o, 12, [l, u]);
  else {
    const O = oe(c), G = /* @__PURE__ */ ge(c);
    if (O || G) {
      const K = () => {
        if (e.f) {
          const D = O ? w(c) ? h[c] : u[c] : $() || !e.k ? c.value : u[e.k];
          if (r)
            R(D) && ds(D, i);
          else if (R(D))
            D.includes(i) || D.push(i);
          else if (O)
            u[c] = [i], w(c) && (h[c] = u[c]);
          else {
            const j = [i];
            $(c, e.k) && (c.value = j), e.k && (u[e.k] = j);
          }
        } else O ? (u[c] = l, w(c) && (h[c] = l)) : G && ($(c, e.k) && (c.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const D = () => {
          K(), wn.delete(e);
        };
        D.id = -1, wn.set(e, D), we(D, n);
      } else
        Ds(e), K();
    }
  }
}
function Ds(e) {
  const t = wn.get(e);
  t && (t.flags |= 8, wn.delete(e));
}
On().requestIdleCallback;
On().cancelIdleCallback;
const Ut = (e) => !!e.type.__asyncLoader, Fn = (e) => e.type.__isKeepAlive;
function El(e, t) {
  Xr(e, "a", t);
}
function Al(e, t) {
  Xr(e, "da", t);
}
function Xr(e, t, n = be) {
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
      Fn(r.parent.vnode) && Ml(s, t, n, r), r = r.parent;
  }
}
function Ml(e, t, n, s) {
  const r = Hn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Zr(() => {
    ds(s[t], r);
  }, n);
}
function Hn(e, t, n = be, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      Ze();
      const o = on(n), c = $e(t, n, e, l);
      return o(), Qe(), c;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const tt = (e) => (t, n = be) => {
  (!Zt || e === "sp") && Hn(e, (...s) => t(...s), n);
}, $l = tt("bm"), rn = tt("m"), Ol = tt(
  "bu"
), Pl = tt("u"), ln = tt(
  "bum"
), Zr = tt("um"), Ll = tt(
  "sp"
), Il = tt("rtg"), Rl = tt("rtc");
function Fl(e, t = be) {
  Hn("ec", e, t);
}
const Hl = /* @__PURE__ */ Symbol.for("v-ndc");
function it(e, t, n, s) {
  let r;
  const i = n, l = R(e);
  if (l || oe(e)) {
    const o = l && /* @__PURE__ */ xt(e);
    let c = !1, d = !1;
    o && (c = !/* @__PURE__ */ Me(e), d = /* @__PURE__ */ et(e), e = Pn(e)), r = new Array(e.length);
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
  } else if (q(e))
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
const ls = (e) => e ? wi(e) ? Ts(e) : ls(e.parent) : null, Wt = (
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
    $parent: (e) => ls(e.parent),
    $root: (e) => ls(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ei(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      _s(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = gl.bind(e.proxy)),
    $watch: (e) => wl.bind(e)
  })
), Jn = (e, t) => e !== te && !e.__isScriptSetup && z(e, t), Nl = {
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
        if (Jn(s, t))
          return l[t] = 1, s[t];
        if (r !== te && z(r, t))
          return l[t] = 2, r[t];
        if (z(i, t))
          return l[t] = 3, i[t];
        if (n !== te && z(n, t))
          return l[t] = 4, n[t];
        os && (l[t] = 0);
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
    if (n !== te && z(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      h = c.config.globalProperties, z(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return Jn(r, t) ? (r[t] = n, !0) : s !== te && z(s, t) ? (s[t] = n, !0) : z(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, props: i, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== te && o[0] !== "$" && z(e, o) || Jn(t, o) || z(i, o) || z(s, o) || z(Wt, o) || z(r.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : z(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function ks(e) {
  return R(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let os = !0;
function Dl(e) {
  const t = ei(e), n = e.proxy, s = e.ctx;
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
    beforeUpdate: w,
    updated: $,
    activated: O,
    deactivated: G,
    beforeDestroy: K,
    beforeUnmount: D,
    destroyed: j,
    unmounted: M,
    render: B,
    renderTracked: S,
    renderTriggered: W,
    errorCaptured: xe,
    serverPrefetch: k,
    // public API
    expose: Y,
    inheritAttrs: ie,
    // assets
    components: A,
    directives: se,
    filters: he
  } = t;
  if (d && kl(d, s, null), l)
    for (const le in l) {
      const Q = l[le];
      N(Q) && (s[le] = Q.bind(n));
    }
  if (r) {
    const le = r.call(n, n);
    q(le) && (e.data = /* @__PURE__ */ Ln(le));
  }
  if (os = !0, i)
    for (const le in i) {
      const Q = i[le], ct = N(Q) ? Q.bind(n, n) : N(Q.get) ? Q.get.bind(n, n) : Ue, cn = !N(Q) && N(Q.set) ? Q.set.bind(n) : Ue, at = Tt({
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
      Qr(o[le], s, n, le);
  if (c) {
    const le = N(c) ? c.call(n) : c;
    Reflect.ownKeys(le).forEach((Q) => {
      vl(Q, le[Q]);
    });
  }
  u && js(u, e, "c");
  function ue(le, Q) {
    R(Q) ? Q.forEach((ct) => le(ct.bind(n))) : Q && le(Q.bind(n));
  }
  if (ue($l, h), ue(rn, x), ue(Ol, w), ue(Pl, $), ue(El, O), ue(Al, G), ue(Fl, xe), ue(Rl, S), ue(Il, W), ue(ln, D), ue(Zr, M), ue(Ll, k), R(Y))
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
  B && e.render === Ue && (e.render = B), ie != null && (e.inheritAttrs = ie), A && (e.components = A), se && (e.directives = se), k && Yr(e);
}
function kl(e, t, n = Ue) {
  R(e) && (e = cs(e));
  for (const s in e) {
    const r = e[s];
    let i;
    q(r) ? "default" in r ? i = pn(
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
function js(e, t, n) {
  $e(
    R(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Qr(e, t, n, s) {
  let r = s.includes(".") ? Ur(n, s) : () => n[s];
  if (oe(e)) {
    const i = t[e];
    N(i) && zn(r, i);
  } else if (N(e))
    zn(r, e.bind(n));
  else if (q(e))
    if (R(e))
      e.forEach((i) => Qr(i, t, n, s));
    else {
      const i = N(e.handler) ? e.handler.bind(n) : t[e.handler];
      N(i) && zn(r, i, e);
    }
}
function ei(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = i.get(t);
  let c;
  return o ? c = o : !r.length && !n && !s ? c = t : (c = {}, r.length && r.forEach(
    (d) => _n(c, d, l, !0)
  ), _n(c, t, l)), q(t) && i.set(t, c), c;
}
function _n(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && _n(e, i, n, !0), r && r.forEach(
    (l) => _n(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = jl[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const jl = {
  data: Bs,
  props: Vs,
  emits: Vs,
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
  watch: Vl,
  // provide / inject
  provide: Bs,
  inject: Bl
};
function Bs(e, t) {
  return t ? e ? function() {
    return ae(
      N(e) ? e.call(this, this) : e,
      N(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Bl(e, t) {
  return Dt(cs(e), cs(t));
}
function cs(e) {
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
function Vs(e, t) {
  return e ? R(e) && R(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ae(
    /* @__PURE__ */ Object.create(null),
    ks(e),
    ks(t ?? {})
  ) : t;
}
function Vl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ae(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = me(e[s], t[s]);
  return n;
}
function ti() {
  return {
    app: null,
    config: {
      isNativeTag: hr,
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
let Kl = 0;
function Ul(e, t) {
  return function(s, r = null) {
    N(s) || (s = ae({}, s)), r != null && !q(r) && (r = null);
    const i = ti(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const d = i.app = {
      _uid: Kl++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: _o,
      get config() {
        return i.config;
      },
      set config(u) {
      },
      use(u, ...h) {
        return l.has(u) || (u && N(u.install) ? (l.add(u), u.install(d, ...h)) : N(u) && (l.add(u), u(d, ...h))), d;
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
          const w = d._ceVNode || ne(s, r);
          return w.appContext = i, x === !0 ? x = "svg" : x === !1 && (x = void 0), e(w, u, x), c = !0, d._container = u, u.__vue_app__ = d, Ts(w.component);
        }
      },
      onUnmount(u) {
        o.push(u);
      },
      unmount() {
        c && ($e(
          o,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(u, h) {
        return i.provides[u] = h, d;
      },
      runWithContext(u) {
        const h = $t;
        $t = d;
        try {
          return u();
        } finally {
          $t = h;
        }
      }
    };
    return d;
  };
}
let $t = null;
const Wl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Pe(t)}Modifiers`] || e[`${ot(t)}Modifiers`];
function zl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || te;
  let r = n;
  const i = t.startsWith("update:"), l = i && Wl(s, t.slice(7));
  l && (l.trim && (r = n.map((u) => oe(u) ? u.trim() : u)), l.number && (r = n.map(Pi)));
  let o, c = s[o = jn(t)] || // also try camelCase event handler (#2249)
  s[o = jn(Pe(t))];
  !c && i && (c = s[o = jn(ot(t))]), c && $e(
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
    e.emitted[o] = !0, $e(
      d,
      e,
      6,
      r
    );
  }
}
const ql = /* @__PURE__ */ new WeakMap();
function ni(e, t, n = !1) {
  const s = n ? ql : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let l = {}, o = !1;
  if (!N(e)) {
    const c = (d) => {
      const u = ni(d, t, !0);
      u && (o = !0, ae(l, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !o ? (q(e) && s.set(e, null), null) : (R(i) ? i.forEach((c) => l[c] = null) : ae(l, i), q(e) && s.set(e, l), l);
}
function Nn(e, t) {
  return !e || !An(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), z(e, t[0].toLowerCase() + t.slice(1)) || z(e, ot(t)) || z(e, t));
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
    setupState: w,
    ctx: $,
    inheritAttrs: O
  } = e, G = bn(e);
  let K, D;
  try {
    if (n.shapeFlag & 4) {
      const M = r || s, B = M;
      K = Be(
        d.call(
          B,
          M,
          u,
          h,
          w,
          x,
          $
        )
      ), D = o;
    } else {
      const M = t;
      K = Be(
        M.length > 1 ? M(
          h,
          { attrs: o, slots: l, emit: c }
        ) : M(
          h,
          null
        )
      ), D = t.props ? o : Jl(o);
    }
  } catch (M) {
    wt.length = 0, In(M, e, 1), K = ne(ve);
  }
  let j = K;
  if (D && O !== !1) {
    const M = Object.keys(D), { shapeFlag: B } = j;
    M.length && B & 7 && (i && M.some(Mn) && (D = Gl(
      D,
      i
    )), j = lt(j, D, !1, !0));
  }
  if (n.dirs && (j = lt(j, null, !1, !0), j.dirs = j.dirs ? j.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const M = Rn(j.type) && xn(j) || j;
    Gt(M, n.transition);
  }
  return K = j, bn(G), K;
}
const Jl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || An(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Gl = (e, t) => {
  const n = {};
  for (const s in e)
    (!Mn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Yl(e, t, n) {
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
        if (si(l, s, x) && !Nn(d, x))
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
    if (si(t, e, i) && !Nn(n, i))
      return !0;
  }
  return !1;
}
function si(e, t, n) {
  const s = e[n], r = t[n];
  return n === "style" && q(s) && q(r) ? !ps(s, r) : s !== r;
}
function Xl({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = s, e = r), r === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const ri = {}, ii = () => Object.create(ri), li = (e) => Object.getPrototypeOf(e) === ri;
function Zl(e, t, n, s = !1) {
  const r = {}, i = ii();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), oi(e, t, r, i);
  for (const l in e.propsOptions[0])
    l in r || (r[l] = void 0);
  n ? e.props = s ? r : /* @__PURE__ */ il(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function Ql(e, t, n, s) {
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
        const w = t[x];
        if (c)
          if (z(i, x))
            w !== i[x] && (i[x] = w, d = !0);
          else {
            const $ = Pe(x);
            r[$] = as(
              c,
              o,
              $,
              w,
              e,
              !1
            );
          }
        else
          w !== i[x] && (i[x] = w, d = !0);
      }
    }
  } else {
    oi(e, t, r, i) && (d = !0);
    let u;
    for (const h in o)
      (!t || // for camelCase
      !z(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = ot(h)) === h || !z(t, u))) && (c ? n && // for camelCase
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
        (!t || !z(t, h)) && (delete i[h], d = !0);
  }
  d && Xe(e.attrs, "set", "");
}
function oi(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (jt(c))
        continue;
      const d = t[c];
      let u;
      r && z(r, u = Pe(c)) ? !i || !i.includes(u) ? n[u] = d : (o || (o = {}))[u] = d : Nn(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, l = !0);
    }
  if (i) {
    const c = /* @__PURE__ */ U(n), d = o || te;
    for (let u = 0; u < i.length; u++) {
      const h = i[u];
      n[h] = as(
        r,
        c,
        h,
        d[h],
        e,
        !z(d, h)
      );
    }
  }
  return l;
}
function as(e, t, n, s, r, i) {
  const l = e[n];
  if (l != null) {
    const o = z(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && N(c)) {
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
const eo = /* @__PURE__ */ new WeakMap();
function ci(e, t, n = !1) {
  const s = n ? eo : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, l = {}, o = [];
  let c = !1;
  if (!N(e)) {
    const u = (h) => {
      c = !0;
      const [x, w] = ci(h, t, !0);
      ae(l, x), w && o.push(...w);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!i && !c)
    return q(e) && s.set(e, Et), Et;
  if (R(i))
    for (let u = 0; u < i.length; u++) {
      const h = Pe(i[u]);
      Ws(h) && (l[h] = te);
    }
  else if (i)
    for (const u in i) {
      const h = Pe(u);
      if (Ws(h)) {
        const x = i[u], w = l[h] = R(x) || N(x) ? { type: x } : ae({}, x), $ = w.type;
        let O = !1, G = !0;
        if (R($))
          for (let K = 0; K < $.length; ++K) {
            const D = $[K], j = N(D) && D.name;
            if (j === "Boolean") {
              O = !0;
              break;
            } else j === "String" && (G = !1);
          }
        else
          O = N($) && $.name === "Boolean";
        w[
          0
          /* shouldCast */
        ] = O, w[
          1
          /* shouldCastTrue */
        ] = G, (O || z(w, "default")) && o.push(h);
      }
    }
  const d = [l, o];
  return q(e) && s.set(e, d), d;
}
function Ws(e) {
  return e[0] !== "$" && !jt(e);
}
const Ss = (e) => e === "_" || e === "_ctx" || e === "$stable", Cs = (e) => R(e) ? e.map(Be) : [Be(e)], to = (e, t, n) => {
  if (t._n)
    return t;
  const s = Nt((...r) => Cs(t(...r)), n);
  return s._c = !1, s;
}, ai = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (Ss(r)) continue;
    const i = e[r];
    if (N(i))
      t[r] = to(r, i, s);
    else if (i != null) {
      const l = Cs(i);
      t[r] = () => l;
    }
  }
}, ui = (e, t) => {
  const n = Cs(t);
  e.slots.default = () => n;
}, fi = (e, t, n) => {
  for (const s in t)
    (n || !Ss(s)) && (e[s] = t[s]);
}, no = (e, t, n) => {
  const s = e.slots = ii();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (fi(s, t, n), n && br(s, "_", r, !0)) : ai(t, s);
  } else t && ui(e, t);
}, so = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, l = te;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? i = !1 : fi(r, t, n) : (i = !t.$stable, ai(t, r)), l = t;
  } else t && (ui(e, t), l = { default: 1 });
  if (i)
    for (const o in r)
      !Ss(o) && l[o] == null && delete r[o];
}, we = co;
function ro(e) {
  return io(e);
}
function io(e, t) {
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
    setScopeId: w = Ue,
    insertStaticContent: $
  } = e, O = (a, f, p, b = null, v = null, m = null, T = void 0, C = null, _ = !!f.dynamicChildren) => {
    if (a === f)
      return;
    a && !mt(a, f) && (b = an(a), Re(a, v, m, !0), a = null), f.patchFlag === -2 && (_ = !1, f.dynamicChildren = null);
    const { type: y, ref: L, shapeFlag: E } = f;
    switch (y) {
      case Dn:
        G(a, f, p, b);
        break;
      case ve:
        K(a, f, p, b);
        break;
      case gn:
        a == null && D(f, p, b, T);
        break;
      case re:
        A(
          a,
          f,
          p,
          b,
          v,
          m,
          T,
          C,
          _
        );
        break;
      default:
        E & 1 ? B(
          a,
          f,
          p,
          b,
          v,
          m,
          T,
          C,
          _
        ) : E & 6 ? se(
          a,
          f,
          p,
          b,
          v,
          m,
          T,
          C,
          _
        ) : (E & 64 || E & 128) && y.process(
          a,
          f,
          p,
          b,
          v,
          m,
          T,
          C,
          _,
          Lt
        );
    }
    L != null && v ? Kt(L, a && a.ref, m, f || a, !f) : L == null && a && a.ref != null && Kt(a.ref, null, m, a, !0);
  }, G = (a, f, p, b) => {
    if (a == null)
      s(
        f.el = o(f.children),
        p,
        b
      );
    else {
      const v = f.el = a.el;
      f.children !== a.children && d(v, f.children);
    }
  }, K = (a, f, p, b) => {
    a == null ? s(
      f.el = c(f.children || ""),
      p,
      b
    ) : f.el = a.el;
  }, D = (a, f, p, b) => {
    [a.el, a.anchor] = $(
      a.children,
      f,
      p,
      b,
      a.el,
      a.anchor
    );
  }, j = ({ el: a, anchor: f }, p, b) => {
    let v;
    for (; a && a !== f; )
      v = x(a), s(a, p, b), a = v;
    s(f, p, b);
  }, M = ({ el: a, anchor: f }) => {
    let p;
    for (; a && a !== f; )
      p = x(a), r(a), a = p;
    r(f);
  }, B = (a, f, p, b, v, m, T, C, _) => {
    if (f.type === "svg" ? T = "svg" : f.type === "math" && (T = "mathml"), a == null)
      S(
        f,
        p,
        b,
        v,
        m,
        T,
        C,
        _
      );
    else {
      const y = a.el && a.el._isVueCE ? a.el : null;
      try {
        y && y._beginPatch(), k(
          a,
          f,
          v,
          m,
          T,
          C,
          _
        );
      } finally {
        y && y._endPatch();
      }
    }
  }, S = (a, f, p, b, v, m, T, C) => {
    let _, y;
    const { props: L, shapeFlag: E, transition: P, dirs: H } = a;
    if (_ = a.el = l(
      a.type,
      m,
      L && L.is,
      L
    ), E & 8 ? u(_, a.children) : E & 16 && xe(
      a.children,
      _,
      null,
      b,
      v,
      Gn(a, m),
      T,
      C
    ), H && ut(a, null, b, "created"), W(_, a, a.scopeId, T, b), L) {
      for (const Z in L)
        Z !== "value" && !jt(Z) && i(_, Z, null, L[Z], m, b);
      "value" in L && i(_, "value", null, L.value, m), (y = L.onVnodeBeforeMount) && De(y, b, a);
    }
    H && ut(a, null, b, "beforeMount");
    const V = lo(v, P);
    V && P.beforeEnter(_), s(_, f, p), ((y = L && L.onVnodeMounted) || V || H) && we(() => {
      try {
        y && De(y, b, a), V && P.enter(_), H && ut(a, null, b, "mounted");
      } finally {
      }
    }, v);
  }, W = (a, f, p, b, v) => {
    if (p && w(a, p), b)
      for (let m = 0; m < b.length; m++)
        w(a, b[m]);
    if (v) {
      let m = v.subTree;
      if (f === m || gi(m.type) && (m.ssContent === f || m.ssFallback === f)) {
        const T = v.vnode;
        W(
          a,
          T,
          T.scopeId,
          T.slotScopeIds,
          v.parent
        );
      }
    }
  }, xe = (a, f, p, b, v, m, T, C, _ = 0) => {
    for (let y = _; y < a.length; y++) {
      const L = a[y] = C ? Ye(a[y]) : Be(a[y]);
      O(
        null,
        L,
        f,
        p,
        b,
        v,
        m,
        T,
        C
      );
    }
  }, k = (a, f, p, b, v, m, T) => {
    const C = f.el = a.el;
    let { patchFlag: _, dynamicChildren: y, dirs: L } = f;
    _ |= a.patchFlag & 16;
    const E = a.props || te, P = f.props || te;
    let H;
    if (p && ft(p, !1), (H = P.onVnodeBeforeUpdate) && De(H, p, f, a), L && ut(f, a, p, "beforeUpdate"), p && ft(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    y && (!a.dynamicChildren || a.dynamicChildren.length !== y.length) && (_ = 0, T = !1, y = null), (E.innerHTML && P.innerHTML == null || E.textContent && P.textContent == null) && u(C, ""), y ? Y(
      a.dynamicChildren,
      y,
      C,
      p,
      b,
      Gn(f, v),
      m
    ) : T || Q(
      a,
      f,
      C,
      null,
      p,
      b,
      Gn(f, v),
      m,
      !1
    ), _ > 0) {
      if (_ & 16)
        ie(C, E, P, p, v);
      else if (_ & 2 && E.class !== P.class && i(C, "class", null, P.class, v), _ & 4 && i(C, "style", E.style, P.style, v), _ & 8) {
        const V = f.dynamicProps;
        for (let Z = 0; Z < V.length; Z++) {
          const X = V[Z], ce = E[X], fe = P[X];
          (fe !== ce || X === "value") && i(C, X, ce, fe, v, p);
        }
      }
      _ & 1 && a.children !== f.children && u(C, f.children);
    } else !T && y == null && ie(C, E, P, p, v);
    ((H = P.onVnodeUpdated) || L) && we(() => {
      H && De(H, p, f, a), L && ut(f, a, p, "updated");
    }, b);
  }, Y = (a, f, p, b, v, m, T) => {
    for (let C = 0; C < f.length; C++) {
      const _ = a[C], y = f[C], L = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        _.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (_.type === re || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !mt(_, y) || // - In the case of a component, it could contain anything.
        _.shapeFlag & 198) ? h(_.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      O(
        _,
        y,
        L,
        null,
        b,
        v,
        m,
        T,
        !0
      );
    }
  }, ie = (a, f, p, b, v) => {
    if (f !== p) {
      if (f !== te)
        for (const m in f)
          !jt(m) && !(m in p) && i(
            a,
            m,
            f[m],
            null,
            v,
            b
          );
      for (const m in p) {
        if (jt(m)) continue;
        const T = p[m], C = f[m];
        T !== C && m !== "value" && i(a, m, C, T, v, b);
      }
      "value" in p && i(a, "value", f.value, p.value, v);
    }
  }, A = (a, f, p, b, v, m, T, C, _) => {
    const y = f.el = a ? a.el : o(""), L = f.anchor = a ? a.anchor : o("");
    let { patchFlag: E, dynamicChildren: P, slotScopeIds: H } = f;
    H && (C = C ? C.concat(H) : H), a == null ? (s(y, p, b), s(L, p, b), xe(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      p,
      L,
      v,
      m,
      T,
      C,
      _
    )) : E > 0 && E & 64 && P && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    a.dynamicChildren && a.dynamicChildren.length === P.length ? (Y(
      a.dynamicChildren,
      P,
      p,
      v,
      m,
      T,
      C
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (f.key != null || v && f === v.subTree) && di(
      a,
      f,
      !0
      /* shallow */
    )) : Q(
      a,
      f,
      p,
      L,
      v,
      m,
      T,
      C,
      _
    );
  }, se = (a, f, p, b, v, m, T, C, _) => {
    f.slotScopeIds = C, a == null ? f.shapeFlag & 512 ? v.ctx.activate(
      f,
      p,
      b,
      T,
      _
    ) : he(
      f,
      p,
      b,
      v,
      m,
      T,
      _
    ) : ze(a, f, _);
  }, he = (a, f, p, b, v, m, T) => {
    const C = a.component = go(
      a,
      b,
      v
    );
    if (Fn(a) && (C.ctx.renderer = Lt), mo(C, !1, T), C.asyncDep) {
      if (v && v.registerDep(C, ue, T), !a.el) {
        const _ = C.subTree = ne(ve);
        K(null, _, f, p), a.placeholder = _.el;
      }
    } else
      ue(
        C,
        a,
        f,
        p,
        v,
        m,
        T
      );
  }, ze = (a, f, p) => {
    const b = f.component = a.component;
    if (Yl(a, f, p))
      if (b.asyncDep && !b.asyncResolved) {
        le(b, f, p);
        return;
      } else
        b.next = f, b.update();
    else
      f.el = a.el, b.vnode = f;
  }, ue = (a, f, p, b, v, m, T) => {
    const C = () => {
      if (a.isMounted) {
        let { next: E, bu: P, u: H, parent: V, vnode: Z } = a;
        {
          const He = hi(a);
          if (He) {
            E && (E.el = Z.el, le(a, E, T)), He.asyncDep.then(() => {
              we(() => {
                a.isUnmounted || y();
              }, v);
            });
            return;
          }
        }
        let X = E, ce;
        ft(a, !1), E ? (E.el = Z.el, le(a, E, T)) : E = Z, P && Bn(P), (ce = E.props && E.props.onVnodeBeforeUpdate) && De(ce, V, E, Z), ft(a, !0);
        const fe = Ks(a), Fe = a.subTree;
        a.subTree = fe, O(
          Fe,
          fe,
          // parent may have changed if it's in a teleport
          h(Fe.el),
          // anchor may have changed if it's in a fragment
          an(Fe),
          a,
          v,
          m
        ), E.el = fe.el, X === null && Xl(a, fe.el), H && we(H, v), (ce = E.props && E.props.onVnodeUpdated) && we(
          () => De(ce, V, E, Z),
          v
        );
      } else {
        let E;
        const { el: P, props: H } = f, { bm: V, m: Z, parent: X, root: ce, type: fe } = a, Fe = Ut(f);
        ft(a, !1), V && Bn(V), !Fe && (E = H && H.onVnodeBeforeMount) && De(E, X, f), ft(a, !0);
        {
          ce.ce && ce.ce._hasShadowRoot() && ce.ce._injectChildStyle(
            fe,
            a.parent ? a.parent.type : void 0
          );
          const He = a.subTree = Ks(a);
          O(
            null,
            He,
            p,
            b,
            a,
            v,
            m
          ), f.el = He.el;
        }
        if (Z && we(Z, v), !Fe && (E = H && H.onVnodeMounted)) {
          const He = f;
          we(
            () => De(E, X, He),
            v
          );
        }
        (f.shapeFlag & 256 || X && Ut(X.vnode) && X.vnode.shapeFlag & 256) && a.a && we(a.a, v), a.isMounted = !0, f = p = b = null;
      }
    };
    a.scope.on();
    const _ = a.effect = new Sr(C);
    a.scope.off();
    const y = a.update = _.run.bind(_), L = a.job = _.runIfDirty.bind(_);
    L.i = a, L.id = a.uid, _.scheduler = () => _s(L), ft(a, !0), y();
  }, le = (a, f, p) => {
    f.component = a;
    const b = a.vnode.props;
    a.vnode = f, a.next = null, Ql(a, f.props, b, p), so(a, f.children, p), Ze(), Hs(a), Qe();
  }, Q = (a, f, p, b, v, m, T, C, _ = !1) => {
    const y = a && a.children, L = a ? a.shapeFlag : 0, E = f.children, { patchFlag: P, shapeFlag: H } = f;
    if (P > 0) {
      if (P & 128) {
        cn(
          y,
          E,
          p,
          b,
          v,
          m,
          T,
          C,
          _
        );
        return;
      } else if (P & 256) {
        ct(
          y,
          E,
          p,
          b,
          v,
          m,
          T,
          C,
          _
        );
        return;
      }
    }
    H & 8 ? (L & 16 && Pt(y, v, m), E !== y && u(p, E)) : L & 16 ? H & 16 ? cn(
      y,
      E,
      p,
      b,
      v,
      m,
      T,
      C,
      _
    ) : Pt(y, v, m, !0) : (L & 8 && u(p, ""), H & 16 && xe(
      E,
      p,
      b,
      v,
      m,
      T,
      C,
      _
    ));
  }, ct = (a, f, p, b, v, m, T, C, _) => {
    a = a || Et, f = f || Et;
    const y = a.length, L = f.length, E = Math.min(y, L);
    let P;
    for (P = 0; P < E; P++) {
      const H = f[P] = _ ? Ye(f[P]) : Be(f[P]);
      O(
        a[P],
        H,
        p,
        null,
        v,
        m,
        T,
        C,
        _
      );
    }
    y > L ? Pt(
      a,
      v,
      m,
      !0,
      !1,
      E
    ) : xe(
      f,
      p,
      b,
      v,
      m,
      T,
      C,
      _,
      E
    );
  }, cn = (a, f, p, b, v, m, T, C, _) => {
    let y = 0;
    const L = f.length;
    let E = a.length - 1, P = L - 1;
    for (; y <= E && y <= P; ) {
      const H = a[y], V = f[y] = _ ? Ye(f[y]) : Be(f[y]);
      if (mt(H, V))
        O(
          H,
          V,
          p,
          null,
          v,
          m,
          T,
          C,
          _
        );
      else
        break;
      y++;
    }
    for (; y <= E && y <= P; ) {
      const H = a[E], V = f[P] = _ ? Ye(f[P]) : Be(f[P]);
      if (mt(H, V))
        O(
          H,
          V,
          p,
          null,
          v,
          m,
          T,
          C,
          _
        );
      else
        break;
      E--, P--;
    }
    if (y > E) {
      if (y <= P) {
        const H = P + 1, V = H < L ? f[H].el : b;
        for (; y <= P; )
          O(
            null,
            f[y] = _ ? Ye(f[y]) : Be(f[y]),
            p,
            V,
            v,
            m,
            T,
            C,
            _
          ), y++;
      }
    } else if (y > P)
      for (; y <= E; )
        Re(a[y], v, m, !0), y++;
    else {
      const H = y, V = y, Z = /* @__PURE__ */ new Map();
      for (y = V; y <= P; y++) {
        const _e = f[y] = _ ? Ye(f[y]) : Be(f[y]);
        _e.key != null && Z.set(_e.key, y);
      }
      let X, ce = 0;
      const fe = P - V + 1;
      let Fe = !1, He = 0;
      const It = new Array(fe);
      for (y = 0; y < fe; y++) It[y] = 0;
      for (y = H; y <= E; y++) {
        const _e = a[y];
        if (ce >= fe) {
          Re(_e, v, m, !0);
          continue;
        }
        let Ne;
        if (_e.key != null)
          Ne = Z.get(_e.key);
        else
          for (X = V; X <= P; X++)
            if (It[X - V] === 0 && mt(_e, f[X])) {
              Ne = X;
              break;
            }
        Ne === void 0 ? Re(_e, v, m, !0) : (It[Ne - V] = y + 1, Ne >= He ? He = Ne : Fe = !0, O(
          _e,
          f[Ne],
          p,
          null,
          v,
          m,
          T,
          C,
          _
        ), ce++);
      }
      const $s = Fe ? oo(It) : Et;
      for (X = $s.length - 1, y = fe - 1; y >= 0; y--) {
        const _e = V + y, Ne = f[_e], Os = f[_e + 1], Ps = _e + 1 < L ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Os.el || pi(Os)
        ) : b;
        It[y] === 0 ? O(
          null,
          Ne,
          p,
          Ps,
          v,
          m,
          T,
          C,
          _
        ) : Fe && (X < 0 || y !== $s[X] ? at(Ne, p, Ps, 2) : X--);
      }
    }
  }, at = (a, f, p, b, v = null) => {
    const { el: m, type: T, transition: C, children: _, shapeFlag: y } = a;
    if (y & 6) {
      at(a.component.subTree, f, p, b);
      return;
    }
    if (y & 128) {
      a.suspense.move(f, p, b);
      return;
    }
    if (y & 64) {
      T.move(a, f, p, Lt);
      return;
    }
    if (T === re) {
      s(m, f, p);
      for (let E = 0; E < _.length; E++)
        at(_[E], f, p, b);
      s(a.anchor, f, p);
      return;
    }
    if (T === gn) {
      j(a, f, p);
      return;
    }
    if (b !== 2 && y & 1 && C)
      if (b === 0)
        C.persisted && !m[Ae] ? s(m, f, p) : (C.beforeEnter(m), s(m, f, p), we(() => C.enter(m), v));
      else {
        const { leave: E, delayLeave: P, afterLeave: H } = C, V = () => {
          a.ctx.isUnmounted ? r(m) : s(m, f, p);
        }, Z = () => {
          const X = m._isLeaving || !!m[Ae];
          m._isLeaving && m[Ae](
            !0
            /* cancelled */
          ), C.persisted && !X ? V() : E(m, () => {
            V(), H && H();
          });
        };
        P ? P(m, V, Z) : Z();
      }
    else
      s(m, f, p);
  }, Re = (a, f, p, b = !1, v = !1) => {
    const {
      type: m,
      props: T,
      ref: C,
      children: _,
      dynamicChildren: y,
      shapeFlag: L,
      patchFlag: E,
      dirs: P,
      cacheIndex: H,
      memo: V
    } = a;
    if (E === -2 && (v = !1), C != null && (Ze(), Kt(C, null, p, a, !0), Qe()), H != null && (f.renderCache[H] = void 0), L & 256) {
      f.ctx.deactivate(a);
      return;
    }
    const Z = L & 1 && P, X = !Ut(a);
    let ce;
    if (X && (ce = T && T.onVnodeBeforeUnmount) && De(ce, f, a), L & 6)
      Ei(a.component, p, b);
    else {
      if (L & 128) {
        a.suspense.unmount(p, b);
        return;
      }
      Z && ut(a, null, f, "beforeUnmount"), L & 64 ? a.type.remove(
        a,
        f,
        p,
        Lt,
        b
      ) : y && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !y.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (m !== re || E > 0 && E & 64) ? Pt(
        y,
        f,
        p,
        !1,
        !0
      ) : (m === re && E & 384 || !v && L & 16) && Pt(_, f, p), b && As(a);
    }
    const fe = V != null && H == null;
    (X && (ce = T && T.onVnodeUnmounted) || Z || fe) && we(() => {
      ce && De(ce, f, a), Z && ut(a, null, f, "unmounted"), fe && (a.el = null);
    }, p);
  }, As = (a) => {
    const { type: f, el: p, anchor: b, transition: v } = a;
    if (f === re) {
      Ti(p, b);
      return;
    }
    if (f === gn) {
      M(a);
      return;
    }
    const m = () => {
      r(p), v && !v.persisted && v.afterLeave && v.afterLeave();
    };
    if (a.shapeFlag & 1 && v && !v.persisted) {
      const { leave: T, delayLeave: C } = v, _ = () => T(p, m);
      C ? C(a.el, m, _) : _();
    } else
      m();
  }, Ti = (a, f) => {
    let p;
    for (; a !== f; )
      p = x(a), r(a), a = p;
    r(f);
  }, Ei = (a, f, p) => {
    const { bum: b, scope: v, job: m, subTree: T, um: C, m: _, a: y } = a;
    zs(_), zs(y), b && Bn(b), v.stop(), m && (m.flags |= 8, Re(T, a, f, p)), C && we(C, f), we(() => {
      a.isUnmounted = !0;
    }, f);
  }, Pt = (a, f, p, b = !1, v = !1, m = 0) => {
    for (let T = m; T < a.length; T++)
      Re(a[T], f, p, b, v);
  }, an = (a) => {
    if (a.shapeFlag & 6)
      return an(a.component.subTree);
    if (a.shapeFlag & 128)
      return a.suspense.next();
    const f = x(a.anchor || a.el), p = f && f[_l];
    return p ? x(p) : f;
  };
  let kn = !1;
  const Ms = (a, f, p) => {
    let b;
    a == null ? f._vnode && (Re(f._vnode, null, null, !0), b = f._vnode.component) : O(
      f._vnode || null,
      a,
      f,
      null,
      null,
      null,
      p
    ), f._vnode = a, kn || (kn = !0, Hs(b), jr(), kn = !1);
  }, Lt = {
    p: O,
    um: Re,
    m: at,
    r: As,
    mt: he,
    mc: xe,
    pc: Q,
    pbc: Y,
    n: an,
    o: e
  };
  return {
    render: Ms,
    hydrate: void 0,
    createApp: Ul(Ms)
  };
}
function Gn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ft({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function lo(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function di(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (R(s) && R(r))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let o = r[i];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = r[i] = Ye(r[i]), o.el = l.el), !n && o.patchFlag !== -2 && di(l, o)), o.type === Dn && (o.patchFlag === -1 && (o = r[i] = Ye(o)), o.el = l.el), o.type === ve && !o.el && (o.el = l.el);
    }
}
function oo(e) {
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
function hi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : hi(t);
}
function zs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function pi(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? pi(t.subTree) : null;
}
const gi = (e) => e.__isSuspense;
function co(e, t) {
  t && t.pendingBranch ? R(e) ? t.effects.push(...e) : t.effects.push(e) : yl(e);
}
const re = /* @__PURE__ */ Symbol.for("v-fgt"), Dn = /* @__PURE__ */ Symbol.for("v-txt"), ve = /* @__PURE__ */ Symbol.for("v-cmt"), gn = /* @__PURE__ */ Symbol.for("v-stc"), wt = [];
let Ce = null;
function I(e = !1) {
  wt.push(Ce = e ? null : []);
}
function mi() {
  wt.pop(), Ce = wt[wt.length - 1] || null;
}
let Yt = 1;
function Sn(e, t = !1) {
  Yt += e, e < 0 && Ce && t && (Ce.hasOnce = !0);
}
function yi(e) {
  return e.dynamicChildren = Yt > 0 ? Ce || Et : null, mi(), Yt > 0 && Ce && Ce.push(e), e;
}
function F(e, t, n, s, r, i) {
  return yi(
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
function vi(e, t, n, s, r) {
  return yi(
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
const bi = ({ key: e }) => e ?? null, mn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? oe(e) || /* @__PURE__ */ ge(e) || N(e) ? { i: Ke, r: e, k: t, f: !!n } : e : null);
function g(e, t = null, n = null, s = 0, r = null, i = e === re ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && bi(t),
    ref: t && mn(t),
    scopeId: Vr,
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
const ne = ao;
function ao(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === Hl) && (e = ve), Cn(e)) {
    const o = lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Tn(o, n), Yt > 0 && !i && Ce && (o.shapeFlag & 6 ? Ce[Ce.indexOf(e)] = o : Ce.push(o)), o.patchFlag = -2, o;
  }
  if (xo(e) && (e = e.__vccOpts), t) {
    t = uo(t);
    let { class: o, style: c } = t;
    o && !oe(o) && (t.class = nn(o)), q(c) && (/* @__PURE__ */ ws(c) && !R(c) && (c = ae({}, c)), t.style = tn(c));
  }
  const l = oe(e) ? 1 : gi(e) ? 128 : Rn(e) ? 64 : q(e) ? 4 : N(e) ? 2 : 0;
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
function uo(e) {
  return e ? /* @__PURE__ */ ws(e) || li(e) ? ae({}, e) : e : null;
}
function lt(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: l, children: o, transition: c } = e, d = t ? fo(r || {}, t) : r, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && bi(d),
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
  return c && s && Gt(
    u,
    c.clone(u)
  ), u;
}
function Oe(e = " ", t = 0) {
  return ne(Dn, null, e, t);
}
function Se(e, t) {
  const n = ne(gn, null, e);
  return n.staticCount = t, n;
}
function vt(e = "", t = !1) {
  return t ? (I(), vi(ve, null, e)) : ne(ve, null, e);
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
      !r && !li(t) ? t._ctx = Ke : r === 3 && Ke && (Ke.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (N(t)) {
    if (s & 65) {
      Tn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ke }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [Oe(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function fo(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = nn([t.class, s.class]));
      else if (r === "style")
        t.style = tn([t.style, s.style]);
      else if (An(r)) {
        const i = t[r], l = s[r];
        l && i !== l && !(R(i) && i.includes(l)) ? t[r] = i ? [].concat(i, l) : l : l == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Mn(r) && (t[r] = l);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function De(e, t, n, s = null) {
  $e(e, t, 7, [
    n,
    s
  ]);
}
const ho = ti();
let po = 0;
function go(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || ho, i = {
    uid: po++,
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
    scope: new ji(
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
    propsOptions: ci(s, r),
    emitsOptions: ni(s, r),
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = zl.bind(null, i), e.ce && e.ce(i), i;
}
let be = null;
const xi = () => be || Ke;
let En, Xt;
{
  const e = On(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((l) => l(i)) : r[0](i);
    };
  };
  En = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => be = n
  ), Xt = t(
    "__VUE_SSR_SETTERS__",
    (n) => Zt = n
  );
}
const on = (e) => {
  const t = be;
  return En(e), e.scope.on(), () => {
    e.scope.off(), En(t);
  };
}, qs = () => {
  be && be.scope.off(), En(null);
};
function wi(e) {
  return e.vnode.shapeFlag & 4;
}
let Zt = !1;
function mo(e, t = !1, n = !1) {
  t && Xt(t);
  const { props: s, children: r } = e.vnode, i = wi(e);
  Zl(e, s, i, t), no(e, r, n || t);
  const l = i ? yo(e, t) : void 0;
  return t && Xt(!1), l;
}
function yo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Nl);
  const { setup: s } = n;
  if (s) {
    Ze();
    const r = e.setupContext = s.length > 1 ? bo(e) : null, i = on(e), l = sn(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), o = gr(l);
    if (Qe(), i(), (o || e.sp) && !Ut(e) && Yr(e), o) {
      if (l.then(qs, qs), t)
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
    _i(e);
}
function Js(e, t, n) {
  N(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : q(t) && (e.setupState = Nr(t)), _i(e);
}
function _i(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Ue);
  {
    const r = on(e);
    Ze();
    try {
      Dl(e);
    } finally {
      Qe(), r();
    }
  }
}
const vo = {
  get(e, t) {
    return pe(e, "get", ""), e[t];
  }
};
function bo(e) {
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
function Ts(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Nr(ll(e.exposed)), {
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
function xo(e) {
  return N(e) && "__vccOpts" in e;
}
const Tt = (e, t) => /* @__PURE__ */ fl(e, t, Zt);
function wo(e, t, n) {
  try {
    Sn(-1);
    const s = arguments.length;
    return s === 2 ? q(t) && !R(t) ? Cn(t) ? ne(e, null, [t]) : ne(e, t) : ne(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && Cn(n) && (n = [n]), ne(e, t, n));
  } finally {
    Sn(1);
  }
}
const _o = "3.5.41";
/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let us;
const Gs = typeof window < "u" && window.trustedTypes;
if (Gs)
  try {
    us = /* @__PURE__ */ Gs.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Si = us ? (e) => us.createHTML(e) : (e) => e, So = "http://www.w3.org/2000/svg", Co = "http://www.w3.org/1998/Math/MathML", Ge = typeof document < "u" ? document : null, Ys = Ge && /* @__PURE__ */ Ge.createElement("template"), To = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? Ge.createElementNS(So, e) : t === "mathml" ? Ge.createElementNS(Co, e) : n ? Ge.createElement(e, { is: n }) : Ge.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => Ge.createTextNode(e),
  createComment: (e) => Ge.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Ge.querySelector(e),
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
      Ys.innerHTML = Si(
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
}, nt = "transition", Ht = "animation", Qt = /* @__PURE__ */ Symbol("_vtc"), Ci = {
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
}, Eo = /* @__PURE__ */ ae(
  {},
  Wr,
  Ci
), Ao = (e) => (e.displayName = "Transition", e.props = Eo, e), hn = /* @__PURE__ */ Ao(
  (e, { slots: t }) => wo(Tl, Mo(e), t)
), dt = (e, t = []) => {
  R(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Xs = (e) => e ? R(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Mo(e) {
  const t = {};
  for (const A in e)
    A in Ci || (t[A] = e[A]);
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
    leaveToClass: w = `${n}-leave-to`
  } = e, $ = $o(r), O = $ && $[0], G = $ && $[1], {
    onBeforeEnter: K,
    onEnter: D,
    onEnterCancelled: j,
    onLeave: M,
    onLeaveCancelled: B,
    onBeforeAppear: S = K,
    onAppear: W = D,
    onAppearCancelled: xe = j
  } = t, k = (A, se, he, ze) => {
    A._enterCancelled = ze, ht(A, se ? u : o), ht(A, se ? d : l), he && he();
  }, Y = (A, se) => {
    A._isLeaving = !1, ht(A, h), ht(A, w), ht(A, x), se && se();
  }, ie = (A) => (se, he) => {
    const ze = A ? W : D, ue = () => k(se, A, he);
    dt(ze, [se, ue]), Zs(() => {
      ht(se, A ? c : i), Je(se, A ? u : o), Xs(ze) || Qs(se, s, O, ue);
    });
  };
  return ae(t, {
    onBeforeEnter(A) {
      dt(K, [A]), Je(A, i), Je(A, l);
    },
    onBeforeAppear(A) {
      dt(S, [A]), Je(A, c), Je(A, d);
    },
    onEnter: ie(!1),
    onAppear: ie(!0),
    onLeave(A, se) {
      A._isLeaving = !0;
      const he = () => Y(A, se);
      Je(A, h), A._enterCancelled ? (Je(A, x), nr(A)) : (nr(A), Je(A, x)), Zs(() => {
        A._isLeaving && (ht(A, h), Je(A, w), Xs(M) || Qs(A, s, G, he));
      }), dt(M, [A, he]);
    },
    onEnterCancelled(A) {
      k(A, !1, void 0, !0), dt(j, [A]);
    },
    onAppearCancelled(A) {
      k(A, !0, void 0, !0), dt(xe, [A]);
    },
    onLeaveCancelled(A) {
      Y(A), dt(B, [A]);
    }
  });
}
function $o(e) {
  if (e == null)
    return null;
  if (q(e))
    return [Yn(e.enter), Yn(e.leave)];
  {
    const t = Yn(e);
    return [t, t];
  }
}
function Yn(e) {
  return Li(e);
}
function Je(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Qt] || (e[Qt] = /* @__PURE__ */ new Set())).add(t);
}
function ht(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Qt];
  n && (n.delete(t), n.size || (e[Qt] = void 0));
}
function Zs(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Oo = 0;
function Qs(e, t, n, s) {
  const r = e._endId = ++Oo, i = () => {
    r === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: l, timeout: o, propCount: c } = Po(e, t);
  if (!l)
    return s();
  const d = l + "end";
  let u = 0;
  const h = () => {
    e.removeEventListener(d, x), i();
  }, x = (w) => {
    w.target === e && ++u >= c && h();
  };
  setTimeout(() => {
    u < c && h();
  }, o + 1), e.addEventListener(d, x);
}
function Po(e, t) {
  const n = window.getComputedStyle(e), s = ($) => (n[$] || "").split(", "), r = s(`${nt}Delay`), i = s(`${nt}Duration`), l = er(r, i), o = s(`${Ht}Delay`), c = s(`${Ht}Duration`), d = er(o, c);
  let u = null, h = 0, x = 0;
  t === nt ? l > 0 && (u = nt, h = l, x = i.length) : t === Ht ? d > 0 && (u = Ht, h = d, x = c.length) : (h = Math.max(l, d), u = h > 0 ? l > d ? nt : Ht : null, x = u ? u === nt ? i.length : c.length : 0);
  const w = u === nt && /\b(?:transform|all)(?:,|$)/.test(
    s(`${nt}Property`).toString()
  );
  return {
    type: u,
    timeout: h,
    propCount: x,
    hasTransform: w
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
function Lo(e, t, n) {
  const s = e[Qt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const sr = /* @__PURE__ */ Symbol("_vod"), Io = /* @__PURE__ */ Symbol("_vsh"), Ro = /* @__PURE__ */ Symbol(""), Fo = /(?:^|;)\s*display\s*:/;
function Ho(e, t, n) {
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
      o != null ? Do(
        e,
        l,
        !oe(t) && t ? t[l] : void 0,
        o
      ) || kt(s, l, o) : kt(s, l, "");
    }
  } else if (r) {
    if (t !== n) {
      const l = s[Ro];
      l && (n += ";" + l), s.cssText = n, i = Fo.test(n);
    }
  } else t && e.removeAttribute("style");
  sr in e && (e[sr] = i ? s.display : "", e[Io] && (s.display = "none"));
}
const rr = /\s*!important$/;
function kt(e, t, n) {
  if (R(n))
    n.forEach((s) => kt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = No(e, t);
    rr.test(n) ? e.setProperty(
      ot(s),
      n.replace(rr, ""),
      "important"
    ) : e[s] = n;
  }
}
const ir = ["Webkit", "Moz", "ms"], Xn = {};
function No(e, t) {
  const n = Xn[t];
  if (n)
    return n;
  let s = Pe(t);
  if (s !== "filter" && s in e)
    return Xn[t] = s;
  s = vr(s);
  for (let r = 0; r < ir.length; r++) {
    const i = ir[r] + s;
    if (i in e)
      return Xn[t] = i;
  }
  return t;
}
function Do(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && oe(s) && n === s;
}
const lr = "http://www.w3.org/1999/xlink";
function or(e, t, n, s, r, i = Di(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(lr, t.slice(6, t.length)) : e.setAttributeNS(lr, t, n) : n == null || i && !xr(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : We(n) ? String(n) : n
  );
}
function cr(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Si(n) : n);
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
    o === "boolean" ? n = xr(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(r || t);
}
function ko(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function jo(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const ar = /* @__PURE__ */ Symbol("_vei");
function Bo(e, t, n, s, r = null) {
  const i = e[ar] || (e[ar] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = Uo(t);
    if (s) {
      const d = i[t] = qo(
        s,
        r
      );
      ko(e, o, d, c);
    } else l && (jo(e, o, l, c), i[t] = void 0);
  }
}
const Vo = /(Once|Passive|Capture)$/, Ko = /^on:?(?:Once|Passive|Capture)$/;
function Uo(e) {
  let t, n;
  for (; (n = e.match(Vo)) && !Ko.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : ot(e.slice(2)), t];
}
let Zn = 0;
const Wo = /* @__PURE__ */ Promise.resolve(), zo = () => Zn || (Wo.then(() => Zn = 0), Zn = Date.now());
function qo(e, t) {
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
        d && $e(
          d,
          t,
          5,
          o
        );
      }
    } else
      $e(
        r,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = zo(), n;
}
const ur = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Jo = (e, t, n, s, r, i) => {
  const l = r === "svg";
  t === "class" ? Lo(e, s, l) : t === "style" ? Ho(e, n, s) : An(t) ? Mn(t) || Bo(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Go(e, t, s, l)) ? (cr(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && or(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Yo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !oe(s))) ? cr(e, Pe(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), or(e, t, s, l));
};
function Go(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ur(t) && N(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ur(t) && oe(n) ? !1 : t in e;
}
function Yo(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Pe(t);
  return Array.isArray(n) ? n.some((r) => Pe(r) === s) : Object.keys(n).some((r) => Pe(r) === s);
}
const Xo = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Zo = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = ((r) => {
    if (!("key" in r))
      return;
    const i = ot(r.key);
    if (t.some(
      (l) => l === i || Xo[l] === i
    ))
      return e(r);
  }));
}, Qo = /* @__PURE__ */ ae({ patchProp: Jo }, To);
let fr;
function ec() {
  return fr || (fr = ro(Qo));
}
const tc = ((...e) => {
  const t = ec().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = sc(s);
    if (!r) return;
    const i = t._component;
    !N(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const l = n(r, !1, nc(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), l;
  }, t;
});
function nc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function sc(e) {
  return oe(e) ? document.querySelector(e) : e;
}
const rc = ["aria-label"], Es = /* @__PURE__ */ _t({
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
    }, s = Tt(() => t.name ? `${t.name}的像素画面` : `${n[t.scene]}的像素画面`);
    return (r, i) => (I(), F("svg", {
      class: "pixel-scene",
      viewBox: "0 0 96 72",
      role: "img",
      "aria-label": s.value,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "couple" ? (I(), F(re, { key: 0 }, [
        i[0] || (i[0] = Se('<rect class="ground" x="13" y="59" width="70" height="3"></rect><g class="person-one"><rect x="25" y="26" width="12" height="12"></rect><rect x="22" y="39" width="18" height="15"></rect><rect x="22" y="54" width="6" height="8"></rect><rect x="34" y="54" width="6" height="8"></rect></g><g class="person-two"><rect x="59" y="25" width="12" height="13"></rect><rect x="56" y="39" width="18" height="15"></rect><rect x="56" y="54" width="6" height="8"></rect><rect x="68" y="54" width="6" height="8"></rect></g><rect class="pixel-star" x="45" y="16" width="5" height="5"></rect>', 4))
      ], 64)) : e.scene === "cat" ? (I(), F(re, { key: 1 }, [
        i[1] || (i[1] = Se('<g class="cat-body"><rect x="31" y="28" width="34" height="26"></rect><rect x="34" y="21" width="9" height="11"></rect><rect x="54" y="21" width="9" height="11"></rect><rect x="25" y="47" width="10" height="6"></rect><rect x="22" y="42" width="6" height="8"></rect></g><rect class="pixel-warm" x="39" y="36" width="5" height="5"></rect><rect class="pixel-warm" x="53" y="36" width="5" height="5"></rect><rect class="pixel-ink" x="46" y="43" width="5" height="4"></rect><rect class="ground" x="18" y="57" width="62" height="3"></rect>', 5))
      ], 64)) : e.scene === "house" ? (I(), F(re, { key: 2 }, [
        i[2] || (i[2] = Se('<path class="house-roof" d="M18 34h8v-7h8v-7h28v7h8v7h8v6H18z"></path><rect class="house-wall" x="25" y="40" width="46" height="24"></rect><rect class="pixel-warm window-glow" x="34" y="47" width="10" height="9"></rect><rect class="pixel-warm window-glow" x="52" y="47" width="10" height="9"></rect><rect class="pixel-door" x="44" y="51" width="9" height="13"></rect><rect class="ground" x="13" y="64" width="70" height="3"></rect>', 6))
      ], 64)) : e.scene === "girl" ? (I(), F(re, { key: 3 }, [
        i[3] || (i[3] = Se('<rect class="pixel-star" x="19" y="18" width="4" height="4"></rect><rect class="pixel-star" x="73" y="24" width="3" height="3"></rect><g class="person-two"><rect x="42" y="20" width="13" height="13"></rect><rect x="39" y="34" width="19" height="18"></rect><rect x="41" y="52" width="6" height="10"></rect><rect x="51" y="52" width="6" height="10"></rect></g><rect class="pixel-warm" x="45" y="24" width="3" height="3"></rect><rect class="pixel-warm" x="51" y="24" width="3" height="3"></rect><rect class="ground" x="25" y="62" width="48" height="3"></rect>', 6))
      ], 64)) : e.scene === "travel" ? (I(), F(re, { key: 4 }, [
        i[4] || (i[4] = Se('<path class="map-land" d="M16 22h24v7h17v-5h23v35H57v-6H40v6H16z"></path><path class="map-route" d="M25 49L40 37L53 46L70 31"></path><rect class="pixel-warm" x="22" y="46" width="6" height="6"></rect><rect class="pixel-warm" x="37" y="34" width="6" height="6"></rect><rect class="pixel-warm" x="50" y="43" width="6" height="6"></rect><rect class="pixel-warm" x="67" y="28" width="6" height="6"></rect>', 6))
      ], 64)) : (I(), F(re, { key: 5 }, [
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
    ], 8, rc));
  }
}), ic = ["aria-label"], lc = { key: 0 }, oc = { key: 1 }, cc = { key: 2 }, ac = { key: 3 }, uc = { key: 4 }, fc = { key: 5 }, dc = { key: 6 }, hc = { key: 7 }, pc = /* @__PURE__ */ _t({
  __name: "PixelMemory",
  props: {
    scene: {},
    label: {}
  },
  setup(e) {
    return (t, n) => (I(), F("svg", {
      class: "pixel-memory",
      viewBox: "0 0 160 70",
      role: "img",
      "aria-label": e.label,
      "shape-rendering": "crispEdges"
    }, [
      e.scene === "meeting" ? (I(), F("g", lc, [...n[0] || (n[0] = [
        Se('<rect class="pm-ground" x="15" y="57" width="130" height="3"></rect><path class="pm-blue" d="M28 31h10v-6h28v6h10v4H28z"></path><rect class="pm-one" x="43" y="35" width="12" height="18"></rect><path class="pm-rose" d="M84 29h10v-6h28v6h10v4H84z"></path><rect class="pm-two" x="99" y="33" width="12" height="20"></rect><rect class="pm-warm" x="76" y="17" width="5" height="5"></rect>', 6)
      ])])) : e.scene === "cat-arrival" ? (I(), F("g", oc, [...n[1] || (n[1] = [
        Se('<path class="pm-box" d="M47 34h66v25H47zM40 28h33l7 6H47zM120 28H87l-7 6h33z"></path><path class="pm-cat" d="M64 21h8v7h16v-7h8v25H64z"></path><rect class="pm-warm" x="70" y="32" width="4" height="4"></rect><rect class="pm-warm" x="87" y="32" width="4" height="4"></rect><rect class="pm-ink" x="78" y="39" width="5" height="3"></rect>', 5)
      ])])) : e.scene === "cat-life" ? (I(), F("g", cc, [...n[2] || (n[2] = [
        Se('<rect class="pm-ground" x="18" y="56" width="124" height="3"></rect><path class="pm-cat" d="M26 35h29v18H26zM29 28h8v8h11v-8h7v8"></path><path class="pm-blue" d="M77 45h28l-5 11H82z"></path><rect class="pm-warm" x="112" y="31" width="8" height="8"></rect><rect class="pm-line" x="119" y="36" width="18" height="3"></rect>', 5)
      ])])) : e.scene === "marriage" ? (I(), F("g", ac, [...n[3] || (n[3] = [
        Se('<rect class="pm-paper" x="43" y="13" width="74" height="47"></rect><rect class="pm-blue" x="43" y="13" width="74" height="9"></rect><rect class="pm-line" x="53" y="29" width="18" height="3"></rect><rect class="pm-line" x="89" y="29" width="18" height="3"></rect><rect class="pm-rose" x="73" y="36" width="7" height="7"></rect><rect class="pm-rose" x="80" y="43" width="7" height="7"></rect><rect class="pm-rose" x="87" y="36" width="7" height="7"></rect>', 7)
      ])])) : e.scene === "wedding" ? (I(), F("g", uc, [...n[4] || (n[4] = [
        Se('<path class="pm-house" d="M33 34h10v-8h10v-7h54v7h10v8h10v5H33z"></path><rect class="pm-wall" x="43" y="39" width="74" height="21"></rect><rect class="pm-warm" x="56" y="46" width="12" height="9"></rect><rect class="pm-warm" x="92" y="46" width="12" height="9"></rect><rect class="pm-door" x="75" y="46" width="11" height="14"></rect>', 5)
      ])])) : e.scene === "birth" ? (I(), F("g", fc, [...n[5] || (n[5] = [
        Se('<rect class="pm-ground" x="29" y="57" width="102" height="3"></rect><path class="pm-blue" d="M50 38h62v17H50zM54 32h8v8h42v-8h8v8"></path><rect class="pm-rose" x="71" y="39" width="20" height="12"></rect><rect class="pm-warm" x="76" y="19" width="8" height="8"></rect><rect class="pm-warm" x="78" y="16" width="4" height="14"></rect><rect class="pm-warm" x="73" y="21" width="14" height="4"></rect>', 6)
      ])])) : e.scene === "growing" ? (I(), F("g", dc, [...n[6] || (n[6] = [
        Se('<rect class="pm-line" x="35" y="14" width="3" height="45"></rect><rect class="pm-line" x="38" y="20" width="10" height="2"></rect><rect class="pm-line" x="38" y="30" width="7" height="2"></rect><rect class="pm-line" x="38" y="40" width="10" height="2"></rect><g class="pm-two"><rect x="68" y="25" width="14" height="14"></rect><rect x="64" y="40" width="22" height="18"></rect></g><rect class="pm-warm" x="104" y="43" width="14" height="14"></rect><rect class="pm-blue" x="118" y="49" width="10" height="8"></rect>', 7)
      ])])) : (I(), F("g", hc, [...n[7] || (n[7] = [
        Se('<path class="pm-route" d="M24 51L55 28L83 44L131 19"></path><rect class="pm-warm" x="20" y="47" width="8" height="8"></rect><rect class="pm-blue" x="51" y="24" width="8" height="8"></rect><rect class="pm-rose" x="79" y="40" width="8" height="8"></rect><rect class="pm-warm" x="127" y="15" width="8" height="8"></rect><path class="pm-case" d="M66 49h28v14H66zM72 44h16v5H72z"></path>', 6)
      ])]))
    ], 8, ic));
  }
}), gc = ["aria-labelledby"], mc = { class: "chapter-scene" }, yc = { class: "chapter-copy" }, vc = ["id"], bc = { class: "chapter-paragraphs" }, xc = {
  key: 0,
  class: "destination-list",
  "aria-label": "去过的地方"
}, wc = {
  key: 1,
  class: "future-list",
  "aria-label": "未来清单"
}, _c = {
  key: 2,
  class: "memory-slots"
}, Sc = /* @__PURE__ */ _t({
  __name: "ChapterCard",
  props: {
    chapter: {},
    index: {},
    total: {}
  },
  emits: ["letter"],
  setup(e) {
    return (t, n) => (I(), F("article", {
      class: "chapter-card",
      "aria-labelledby": `chapter-${e.chapter.id}`
    }, [
      g("div", mc, [
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
      g("div", yc, [
        g("header", null, [
          g("span", null, J(String(e.index + 1).padStart(2, "0")) + " / " + J(String(e.total).padStart(2, "0")), 1),
          g("p", null, J(e.chapter.year), 1)
        ]),
        g("h2", {
          id: `chapter-${e.chapter.id}`
        }, J(e.chapter.title), 9, vc),
        g("div", bc, [
          (I(!0), F(re, null, it(e.chapter.paragraphs, (s) => (I(), F("p", { key: s }, J(s), 1))), 128))
        ]),
        e.chapter.destinations ? (I(), F("ul", xc, [
          (I(!0), F(re, null, it(e.chapter.destinations, (s) => (I(), F("li", { key: s }, J(s), 1))), 128))
        ])) : vt("", !0),
        e.chapter.futureList ? (I(), F("ul", wc, [
          (I(!0), F(re, null, it(e.chapter.futureList, (s) => (I(), F("li", { key: s }, [
            n[2] || (n[2] = g("i", { "aria-hidden": "true" }, null, -1)),
            Oe(J(s), 1)
          ]))), 128))
        ])) : vt("", !0),
        e.chapter.memorySlots ? (I(), F("div", _c, [
          (I(!0), F(re, null, it(e.chapter.memorySlots, (s) => (I(), F("figure", {
            key: s.label
          }, [
            ne(pc, {
              scene: s.scene,
              label: s.label
            }, null, 8, ["scene", "label"]),
            g("figcaption", null, J(s.label), 1)
          ]))), 128))
        ])) : vt("", !0),
        e.chapter.id === "future" ? (I(), F("button", {
          key: 3,
          class: "text-command",
          type: "button",
          onClick: n[0] || (n[0] = (s) => t.$emit("letter"))
        }, [...n[3] || (n[3] = [
          Oe(" 读取 2040 留言 ", -1),
          g("span", { "aria-hidden": "true" }, "→", -1)
        ])])) : vt("", !0)
      ])
    ], 8, gc));
  }
}), Cc = {
  class: "character-panel",
  "aria-labelledby": "character-title"
}, Tc = { class: "character-grid" }, Ec = { class: "character-avatar" }, Ac = { class: "character-level" }, Mc = { class: "character-class" }, $c = { class: "character-skill" }, Oc = { class: "character-description" }, Pc = /* @__PURE__ */ _t({
  __name: "CharacterPanel",
  props: {
    characters: {}
  },
  emits: ["close"],
  setup(e) {
    return (t, n) => (I(), F("aside", Cc, [
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
      g("div", Tc, [
        (I(!0), F(re, null, it(e.characters, (s) => (I(), F("article", {
          key: s.id
        }, [
          g("div", Ec, [
            ne(Es, {
              scene: s.scene,
              name: s.name
            }, null, 8, ["scene", "name"])
          ]),
          g("p", Ac, "等级 " + J(s.level), 1),
          g("h3", null, J(s.name), 1),
          g("p", Mc, J(s.className), 1),
          g("dl", null, [
            (I(!0), F(re, null, it(s.attributes, (r) => (I(), F("div", {
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
          g("p", $c, [
            n[2] || (n[2] = g("span", null, "特别能力", -1)),
            Oe(J(s.skill), 1)
          ]),
          g("p", Oc, J(s.description), 1)
        ]))), 128))
      ])
    ]));
  }
}), Lc = {
  class: "world-map",
  "aria-labelledby": "world-map-title"
}, Ic = { class: "world-map-head" }, Rc = { class: "map-board" }, Fc = ["aria-label", "onClick"], Hc = /* @__PURE__ */ _t({
  __name: "PixelWorld",
  props: {
    chapters: {},
    visited: {}
  },
  emits: ["select"],
  setup(e) {
    return (t, n) => (I(), F("section", Lc, [
      g("header", Ic, [
        n[0] || (n[0] = g("div", null, [
          g("span", null, "家庭存档 / 01"),
          g("h1", { id: "world-map-title" }, "我们的小世界")
        ], -1)),
        g("p", null, J(e.visited.size) + " / " + J(e.chapters.length) + " 已读取", 1)
      ]),
      g("div", Rc, [
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
        (I(!0), F(re, null, it(e.chapters, (s, r) => (I(), F("button", {
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
        ], 14, Fc))), 128)),
        n[4] || (n[4] = g("p", { class: "map-hint" }, "选择一个地点，读取这一段存档", -1))
      ])
    ]));
  }
}), Nc = /* @__PURE__ */ _t({
  __name: "StarBackground",
  setup(e) {
    const t = /* @__PURE__ */ yt(null);
    let n = null, s = [], r = 0, i, l = 0, o = 0, c = !1;
    function d() {
      const x = Math.min(150, Math.max(55, Math.round(l * o / 10500)));
      s = Array.from({ length: x }, (w, $) => ({
        x: $ * 83.17 % 100 / 100 * l,
        y: ($ * 47.63 + 13) % 100 / 100 * o,
        size: $ % 19 === 0 ? 2 : $ % 5 === 0 ? 1.5 : 1,
        alpha: 0.25 + $ * 17 % 60 / 100,
        speed: 0.5 + $ % 7 * 0.12,
        phase: $ * 0.63
      }));
    }
    function u() {
      if (!t.value) return;
      const x = t.value.getBoundingClientRect(), w = Math.min(window.devicePixelRatio || 1, 2);
      l = x.width, o = x.height, t.value.width = Math.round(l * w), t.value.height = Math.round(o * w), n = t.value.getContext("2d"), n == null || n.setTransform(w, 0, 0, w, 0, 0), d(), h(0);
    }
    function h(x) {
      if (n) {
        n.clearRect(0, 0, l, o);
        for (const w of s) {
          const $ = c ? 1 : 0.72 + Math.sin(x * 1e-3 * w.speed + w.phase) * 0.28;
          n.fillStyle = `rgba(237, 229, 203, ${w.alpha * $})`, n.fillRect(Math.round(w.x), Math.round(w.y), w.size, w.size);
        }
        c || (r = requestAnimationFrame(h));
      }
    }
    return rn(() => {
      c = window.matchMedia("(prefers-reduced-motion: reduce)").matches, i = new ResizeObserver(u), t.value && i.observe(t.value), c || (r = requestAnimationFrame(h));
    }), ln(() => {
      i == null || i.disconnect(), cancelAnimationFrame(r);
    }), (x, w) => (I(), F("canvas", {
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
], Dc = [
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
function kc({ src: e, storageKey: t, volume: n }) {
  const s = /* @__PURE__ */ yt(!1), r = /* @__PURE__ */ yt("idle");
  let i = null, l = !1;
  try {
    s.value = localStorage.getItem(t) === "true", s.value && (r.value = "muted");
  } catch {
  }
  function o() {
    try {
      localStorage.setItem(t, String(s.value));
    } catch {
    }
  }
  function c() {
    return i || (i = document.createElement("audio"), i.src = e, i.loop = !0, i.preload = "auto", i.volume = n, i.setAttribute("playsinline", ""), i.setAttribute("webkit-playsinline", ""), i.hidden = !0, document.body.append(i), i);
  }
  async function d() {
    if (s.value)
      return r.value = "muted", !1;
    l = !0, r.value = "starting";
    const w = c();
    try {
      const $ = w.play();
      return $ && await $, r.value = "playing", !0;
    } catch {
      return r.value = "blocked", !1;
    }
  }
  function u(w = "idle") {
    l = !1, i == null || i.pause(), r.value = w;
  }
  async function h() {
    if (r.value === "playing" || r.value === "starting") {
      s.value = !0, o(), u("muted");
      return;
    }
    s.value = !1, o(), await d();
  }
  async function x() {
    if (!(document.visibilityState !== "visible" || s.value || !l || !i))
      try {
        const w = i.play();
        w && await w, r.value = "playing";
      } catch {
        r.value = "blocked";
      }
  }
  return rn(() => document.addEventListener("visibilitychange", x)), ln(() => {
    u(), document.removeEventListener("visibilitychange", x), i == null || i.remove(), i = null;
  }), { muted: s, status: r, start: d, toggle: h };
}
function jc() {
  return kc({
    src: "/works/our-little-world/music.wav?v=2",
    storageKey: "our-little-world:muted",
    volume: 0.72
  });
}
const Bc = {
  key: "boot",
  class: "boot-screen",
  "aria-labelledby": "world-title"
}, Vc = ["aria-label"], Kc = { "aria-hidden": "true" }, Uc = {
  key: "world",
  class: "world-interface"
}, Wc = { class: "world-toolbar" }, zc = { class: "toolbar-actions" }, qc = ["aria-label"], Jc = { "aria-hidden": "true" }, Gc = {
  key: "chapter",
  class: "chapter-screen"
}, Yc = {
  class: "chapter-nav",
  "aria-label": "章节切换"
}, Xc = ["disabled"], Zc = {
  key: "ending",
  class: "ending-screen",
  "aria-labelledby": "ending-title"
}, Qc = {
  class: "ending-house",
  "aria-hidden": "true"
}, ea = {
  key: 0,
  class: "world-overlay",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "同行角色"
}, ta = {
  key: 0,
  class: "world-overlay letter-overlay",
  role: "dialog",
  "aria-modal": "true",
  "aria-labelledby": "letter-title"
}, na = { class: "future-letter" }, sa = { id: "letter-title" }, ra = /* @__PURE__ */ _t({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ yt("boot"), n = /* @__PURE__ */ yt(0), s = /* @__PURE__ */ yt(!1), r = /* @__PURE__ */ yt(!1), i = /* @__PURE__ */ Ln(/* @__PURE__ */ new Set()), l = Tt(() => pt[n.value]), { status: o, start: c, toggle: d } = jc(), u = Tt(
      () => o.value === "playing" || o.value === "starting" ? "关闭背景音乐" : "开启背景音乐"
    ), h = Tt(() => o.value === "playing" ? "♪" : o.value === "starting" ? "…" : "×"), x = Tt(() => ({
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
    function $() {
      c(), t.value = "map";
    }
    function O() {
      t.value = "map", r.value = !1;
    }
    function G(B) {
      n.value = B, i.add(pt[B].id), w(), t.value = "chapter";
    }
    function K() {
      n.value > 0 && G(n.value - 1);
    }
    function D() {
      if (n.value < pt.length - 1) {
        G(n.value + 1);
        return;
      }
      t.value = "ending";
    }
    function j() {
      r.value ? r.value = !1 : s.value ? s.value = !1 : (t.value === "chapter" || t.value === "ending") && O();
    }
    function M(B) {
      B.key === "Escape" && j(), !(t.value !== "chapter" || s.value || r.value) && (B.key === "ArrowLeft" && K(), B.key === "ArrowRight" && D());
    }
    return rn(() => {
      try {
        JSON.parse(localStorage.getItem("our-little-world:visited") || "[]").filter((S) => pt.some((W) => W.id === S)).forEach((S) => i.add(S));
      } catch {
      }
      window.addEventListener("keydown", M);
    }), ln(() => window.removeEventListener("keydown", M)), (B, S) => (I(), F("div", {
      class: nn(["little-world", `screen-${t.value}`]),
      onKeydown: Zo(j, ["esc"])
    }, [
      ne(Nc),
      S[27] || (S[27] = g("div", {
        class: "world-vignette",
        "aria-hidden": "true"
      }, null, -1)),
      ne(hn, {
        name: "world-fade",
        mode: "out-in"
      }, {
        default: Nt(() => [
          t.value === "boot" ? (I(), F("section", Bc, [
            S[9] || (S[9] = g("div", { class: "boot-save" }, [
              g("span", null, "家庭存档 01"),
              g("span", null, "2018—2026")
            ], -1)),
            g("button", {
              class: "sound-toggle boot-sound",
              type: "button",
              "aria-label": u.value,
              onClick: S[0] || (S[0] = //@ts-ignore
              (...W) => Ee(d) && Ee(d)(...W))
            }, [
              g("span", Kc, J(h.value), 1),
              Oe(J(x.value), 1)
            ], 8, Vc),
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
              Oe(" 世界已载入")
            ], -1)),
            S[12] || (S[12] = g("h1", { id: "world-title" }, "我们的小世界", -1)),
            S[13] || (S[13] = g("p", { class: "boot-names" }, "W × W", -1)),
            g("button", {
              class: "pixel-button boot-enter",
              type: "button",
              onClick: $
            }, [...S[8] || (S[8] = [
              g("span", { "aria-hidden": "true" }, "▶", -1),
              Oe(" 进入 ", -1)
            ])]),
            S[14] || (S[14] = g("p", { class: "boot-note" }, "一份用代码完成的家庭礼物", -1))
          ])) : (I(), F("div", Uc, [
            g("header", Wc, [
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
                Oe(" 我们的小世界 "),
                g("small", null, "/ 运行中")
              ], -1)),
              g("div", zc, [
                g("button", {
                  class: "sound-toggle",
                  type: "button",
                  "aria-label": u.value,
                  onClick: S[1] || (S[1] = //@ts-ignore
                  (...W) => Ee(d) && Ee(d)(...W))
                }, [
                  g("span", Jc, J(h.value), 1)
                ], 8, qc),
                g("button", {
                  type: "button",
                  class: "toolbar-party",
                  onClick: S[2] || (S[2] = (W) => s.value = !0)
                }, [...S[16] || (S[16] = [
                  Oe(" 同行角色 ", -1),
                  g("span", null, "02", -1)
                ])])
              ])
            ]),
            ne(hn, {
              name: "scene-shift",
              mode: "out-in"
            }, {
              default: Nt(() => [
                t.value === "map" ? (I(), vi(Hc, {
                  key: "map",
                  chapters: Ee(pt),
                  visited: i,
                  onSelect: G
                }, null, 8, ["chapters", "visited"])) : t.value === "chapter" && l.value ? (I(), F("section", Gc, [
                  ne(Sc, {
                    chapter: l.value,
                    index: n.value,
                    total: Ee(pt).length,
                    onLetter: S[3] || (S[3] = (W) => r.value = !0)
                  }, null, 8, ["chapter", "index", "total"]),
                  g("nav", Yc, [
                    g("button", {
                      type: "button",
                      disabled: n.value === 0,
                      onClick: K
                    }, [...S[18] || (S[18] = [
                      g("span", { "aria-hidden": "true" }, "←", -1),
                      Oe(" 上一段 ", -1)
                    ])], 8, Xc),
                    g("button", {
                      type: "button",
                      onClick: O
                    }, "返回地图"),
                    g("button", {
                      type: "button",
                      onClick: D
                    }, [
                      Oe(J(n.value === Ee(pt).length - 1 ? "完成探索" : "下一段") + " ", 1),
                      S[19] || (S[19] = g("span", { "aria-hidden": "true" }, "→", -1))
                    ])
                  ])
                ])) : (I(), F("section", Zc, [
                  g("div", Qc, [
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
          s.value ? (I(), F("div", ea, [
            g("button", {
              class: "overlay-backdrop",
              type: "button",
              "aria-label": "关闭角色卡",
              onClick: S[4] || (S[4] = (W) => s.value = !1)
            }),
            ne(Pc, {
              characters: Ee(Dc),
              onClose: S[5] || (S[5] = (W) => s.value = !1)
            }, null, 8, ["characters"])
          ])) : vt("", !0)
        ]),
        _: 1
      }),
      ne(hn, { name: "panel-slide" }, {
        default: Nt(() => [
          r.value ? (I(), F("div", ta, [
            g("button", {
              class: "overlay-backdrop",
              type: "button",
              "aria-label": "关闭未来留言",
              onClick: S[6] || (S[6] = (W) => r.value = !1)
            }),
            g("article", na, [
              g("header", null, [
                g("span", null, J(Ee(Qn).year), 1),
                g("button", {
                  type: "button",
                  "aria-label": "关闭未来留言",
                  onClick: S[7] || (S[7] = (W) => r.value = !1)
                }, "×")
              ]),
              S[25] || (S[25] = g("p", null, "私人留言", -1)),
              g("h2", sa, J(Ee(Qn).title), 1),
              g("div", null, [
                (I(!0), F(re, null, it(Ee(Qn).paragraphs, (W) => (I(), F("p", { key: W }, J(W), 1))), 128))
              ]),
              S[26] || (S[26] = g("small", null, "这封信先保存在未来，到时候再回来看看。", -1))
            ])
          ])) : vt("", !0)
        ]),
        _: 1
      })
    ], 34));
  }
}), dr = document.querySelector("#our-little-world-app");
dr && tc(ra).mount(dr);
