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
const Y = {}, yt = [], Be = () => {
}, hi = () => !1, _n = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), xn = (e) => e.startsWith("onUpdate:"), re = Object.assign, us = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Er = Object.prototype.hasOwnProperty, k = (e, t) => Er.call(e, t), R = Array.isArray, _t = (e) => Jt(e) === "[object Map]", pi = (e) => Jt(e) === "[object Set]", Os = (e) => Jt(e) === "[object Date]", H = (e) => typeof e == "function", ee = (e) => typeof e == "string", ke = (e) => typeof e == "symbol", K = (e) => e !== null && typeof e == "object", gi = (e) => (K(e) || H(e)) && H(e.then) && H(e.catch), mi = Object.prototype.toString, Jt = (e) => mi.call(e), Mr = (e) => Jt(e).slice(8, -1), bi = (e) => Jt(e) === "[object Object]", as = (e) => ee(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ft = /* @__PURE__ */ fs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), wn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Or = /-\w/g, Me = wn(
  (e) => e.replace(Or, (t) => t.slice(1).toUpperCase())
), Pr = /\B([A-Z])/g, mt = wn(
  (e) => e.replace(Pr, "-$1").toLowerCase()
), vi = wn((e) => e.charAt(0).toUpperCase() + e.slice(1)), $n = wn(
  (e) => e ? `on${vi(e)}` : ""
), je = (e, t) => !Object.is(e, t), Dn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, yi = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Ir = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Rr = (e) => {
  const t = ee(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Ps;
const Sn = () => Ps || (Ps = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function jt(e) {
  if (R(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = ee(s) ? Dr(s) : jt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (ee(e) || K(e))
    return e;
}
const Fr = /;(?![^(]*\))/g, Lr = /:([^]+)/, $r = /\/\*[^]*?\*\//g;
function Dr(e) {
  const t = {};
  return e.replace($r, "").split(Fr).forEach((n) => {
    if (n) {
      const s = n.split(Lr);
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
  else if (K(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Hr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Nr = /* @__PURE__ */ fs(Hr);
function _i(e) {
  return !!e || e === "";
}
function jr(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = ds(e[s], t[s]);
  return n;
}
function ds(e, t) {
  if (e === t) return !0;
  let n = Os(e), s = Os(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = ke(e), s = ke(t), n || s)
    return e === t;
  if (n = R(e), s = R(t), n || s)
    return n && s ? jr(e, t) : !1;
  if (n = K(e), s = K(t), n || s) {
    if (!n || !s)
      return !1;
    const i = Object.keys(e).length, r = Object.keys(t).length;
    if (i !== r)
      return !1;
    for (const l in e) {
      const o = e.hasOwnProperty(l), c = t.hasOwnProperty(l);
      if (o && !c || !o && c || !ds(e[l], t[l]))
        return !1;
    }
  }
  return String(e) === String(t);
}
const xi = (e) => !!(e && e.__v_isRef === !0), ye = (e) => ee(e) ? e : e == null ? "" : R(e) || K(e) && (e.toString === mi || !H(e.toString)) ? xi(e) ? ye(e.value) : JSON.stringify(e, wi, 2) : String(e), wi = (e, t) => xi(t) ? wi(e, t.value) : _t(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[Hn(s, r) + " =>"] = i, n),
    {}
  )
} : pi(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Hn(n))
} : ke(t) ? Hn(t) : K(t) && !R(t) && !bi(t) ? String(t) : t, Hn = (e, t = "") => {
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
class Vr {
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
function Br() {
  return ce;
}
let J;
const Nn = /* @__PURE__ */ new WeakSet();
class Si {
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ti(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Is(this), Ai(this);
    const t = J, n = Oe;
    J = this, Oe = !0;
    try {
      return this.fn();
    } finally {
      Ei(this), J = t, Oe = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        gs(t);
      this.deps = this.depsTail = void 0, Is(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Nn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Yn(this) && this.run();
  }
  get dirty() {
    return Yn(this);
  }
}
let Ci = 0, Lt, $t;
function Ti(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = $t, $t = e;
    return;
  }
  e.next = Lt, Lt = e;
}
function hs() {
  Ci++;
}
function ps() {
  if (--Ci > 0)
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
function Ai(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ei(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), gs(s), kr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Yn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Mi(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Mi(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Bt) || (e.globalVersion = Bt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Yn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = J, s = Oe;
  J = e, Oe = !0;
  try {
    Ai(e);
    const i = e.fn(e._value);
    (t.version === 0 || je(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    J = n, Oe = s, Ei(e), e.flags &= -3;
  }
}
function gs(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      gs(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function kr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Oe = !0;
const Oi = [];
function Ye() {
  Oi.push(Oe), Oe = !1;
}
function Xe() {
  const e = Oi.pop();
  Oe = e === void 0 ? !0 : e;
}
function Is(e) {
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
class Kr {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ms {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!J || !Oe || J === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== J)
      n = this.activeLink = new Kr(J, this), J.deps ? (n.prevDep = J.depsTail, J.depsTail.nextDep = n, J.depsTail = n) : J.deps = J.depsTail = n, Pi(n);
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
    hs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ps();
    }
  }
}
function Pi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Pi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Xn = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ Symbol(
  ""
), Zn = /* @__PURE__ */ Symbol(
  ""
), kt = /* @__PURE__ */ Symbol(
  ""
);
function ae(e, t, n) {
  if (Oe && J) {
    let s = Xn.get(e);
    s || Xn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new ms()), i.map = s, i.key = n), i.track();
  }
}
function Je(e, t, n, s, i, r) {
  const l = Xn.get(e);
  if (!l) {
    Bt++;
    return;
  }
  const o = (c) => {
    c && c.trigger();
  };
  if (hs(), t === "clear")
    l.forEach(o);
  else {
    const c = R(e), d = c && as(n);
    if (c && n === "length") {
      const u = Number(s);
      l.forEach((h, _) => {
        (_ === "length" || _ === kt || !ke(_) && _ >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(kt)), t) {
        case "add":
          c ? d && o(l.get("length")) : (o(l.get(ht)), _t(e) && o(l.get(Zn)));
          break;
        case "delete":
          c || (o(l.get(ht)), _t(e) && o(l.get(Zn)));
          break;
        case "set":
          _t(e) && o(l.get(ht));
          break;
      }
  }
  ps();
}
function bt(e) {
  const t = /* @__PURE__ */ B(e);
  return t === e ? t : (ae(t, "iterate", kt), /* @__PURE__ */ Ae(e) ? t : t.map(Pe));
}
function Cn(e) {
  return ae(e = /* @__PURE__ */ B(e), "iterate", kt), e;
}
function He(e, t) {
  return /* @__PURE__ */ Ze(e) ? St(/* @__PURE__ */ pt(e) ? Pe(t) : t) : Pe(t);
}
const Ur = {
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
    return Et(this, "pop");
  },
  push(...e) {
    return Et(this, "push", e);
  },
  reduce(e, ...t) {
    return Rs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Rs(this, "reduceRight", e, t);
  },
  shift() {
    return Et(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ue(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Et(this, "splice", e);
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
    return Et(this, "unshift", e);
  },
  values() {
    return jn(this, "values", (e) => He(this, e));
  }
};
function jn(e, t, n) {
  const s = Cn(e), i = s[t]();
  return s !== e && !/* @__PURE__ */ Ae(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.done || (r.value = n(r.value)), r;
  }), i;
}
const Wr = Array.prototype;
function Ue(e, t, n, s, i, r) {
  const l = Cn(e), o = l !== e && !/* @__PURE__ */ Ae(e), c = l[t];
  if (c !== Wr[t]) {
    const h = c.apply(e, r);
    return o ? Pe(h) : h;
  }
  let d = n;
  l !== e && (o ? d = function(h, _) {
    return n.call(this, He(e, h), _, e);
  } : n.length > 2 && (d = function(h, _) {
    return n.call(this, h, _, e);
  }));
  const u = c.call(l, d, s);
  return o && i ? i(u) : u;
}
function Rs(e, t, n, s) {
  const i = Cn(e), r = i !== e && !/* @__PURE__ */ Ae(e);
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
  const s = /* @__PURE__ */ B(e);
  ae(s, "iterate", kt);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ ys(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), s[t](...n)) : i;
}
function Et(e, t, n = []) {
  Ye(), hs();
  const s = (/* @__PURE__ */ B(e))[t].apply(e, n);
  return ps(), Xe(), s;
}
const zr = /* @__PURE__ */ fs("__proto__,__v_isRef,__isVue"), Ii = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ke)
);
function qr(e) {
  ke(e) || (e = String(e));
  const t = /* @__PURE__ */ B(this);
  return ae(t, "has", e), t.hasOwnProperty(e);
}
class Ri {
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
      return s === (i ? r ? sl : Di : r ? $i : Li).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = R(t);
    if (!i) {
      let c;
      if (l && (c = Ur[n]))
        return c;
      if (n === "hasOwnProperty")
        return qr;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ de(t) ? t : s
    );
    if ((ke(n) ? Ii.has(n) : zr(n)) || (i || ae(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ de(o)) {
      const c = l && as(n) ? o : o.value;
      return i && K(c) ? /* @__PURE__ */ es(c) : c;
    }
    return K(o) ? i ? /* @__PURE__ */ es(o) : /* @__PURE__ */ Tn(o) : o;
  }
}
class Fi extends Ri {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = R(t) && as(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ Ze(r);
      if (!/* @__PURE__ */ Ae(s) && !/* @__PURE__ */ Ze(s) && (r = /* @__PURE__ */ B(r), s = /* @__PURE__ */ B(s)), !l && /* @__PURE__ */ de(r) && !/* @__PURE__ */ de(s))
        return d || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : k(t, n), c = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ de(t) ? t : i
    );
    return t === /* @__PURE__ */ B(i) && c && (o ? je(s, r) && Je(t, "set", n, s) : Je(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = k(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && Je(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!ke(n) || !Ii.has(n)) && ae(t, "has", n), s;
  }
  ownKeys(t) {
    return ae(
      t,
      "iterate",
      R(t) ? "length" : ht
    ), Reflect.ownKeys(t);
  }
}
class Gr extends Ri {
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
const Jr = /* @__PURE__ */ new Fi(), Yr = /* @__PURE__ */ new Gr(), Xr = /* @__PURE__ */ new Fi(!0);
const Qn = (e) => e, en = (e) => Reflect.getPrototypeOf(e);
function Zr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ B(i), l = _t(r), o = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, d = i[e](...s), u = n ? Qn : t ? St : Pe;
    return !t && ae(
      r,
      "iterate",
      c ? Zn : ht
    ), re(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: _ } = d.next();
          return _ ? { value: h, done: _ } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: _
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
function Qr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ B(r), o = /* @__PURE__ */ B(i);
      e || (je(i, o) && ae(l, "get", i), ae(l, "get", o));
      const { has: c } = en(l), d = t ? Qn : e ? St : Pe;
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
      return e || (je(i, o) && ae(l, "has", i), ae(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, c = /* @__PURE__ */ B(o), d = t ? Qn : e ? St : Pe;
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
        const r = /* @__PURE__ */ B(this), l = en(r), o = /* @__PURE__ */ B(i), c = !t && !/* @__PURE__ */ Ae(i) && !/* @__PURE__ */ Ze(i) ? o : i;
        return l.has.call(r, c) || je(i, c) && l.has.call(r, i) || je(o, c) && l.has.call(r, o) || (r.add(c), Je(r, "add", c, c)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ Ae(r) && !/* @__PURE__ */ Ze(r) && (r = /* @__PURE__ */ B(r));
        const l = /* @__PURE__ */ B(this), { has: o, get: c } = en(l);
        let d = o.call(l, i);
        d || (i = /* @__PURE__ */ B(i), d = o.call(l, i));
        const u = c.call(l, i);
        return l.set(i, r), d ? je(r, u) && Je(l, "set", i, r) : Je(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ B(this), { has: l, get: o } = en(r);
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
    n[i] = Zr(i, e, t);
  }), n;
}
function bs(e, t) {
  const n = Qr(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? s : Reflect.get(
    k(n, i) && i in s ? n : s,
    i,
    r
  );
}
const el = {
  get: /* @__PURE__ */ bs(!1, !1)
}, tl = {
  get: /* @__PURE__ */ bs(!1, !0)
}, nl = {
  get: /* @__PURE__ */ bs(!0, !1)
};
const Li = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), Di = /* @__PURE__ */ new WeakMap(), sl = /* @__PURE__ */ new WeakMap();
function il(e) {
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
  return /* @__PURE__ */ Ze(e) ? e : vs(
    e,
    !1,
    Jr,
    el,
    Li
  );
}
// @__NO_SIDE_EFFECTS__
function rl(e) {
  return vs(
    e,
    !1,
    Xr,
    tl,
    $i
  );
}
// @__NO_SIDE_EFFECTS__
function es(e) {
  return vs(
    e,
    !0,
    Yr,
    nl,
    Di
  );
}
function vs(e, t, n, s, i) {
  if (!K(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = il(Mr(e));
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
function Ae(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function ys(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ B(t) : e;
}
function ll(e) {
  return !k(e, "__v_skip") && Object.isExtensible(e) && yi(e, "__v_skip", !0), e;
}
const Pe = (e) => K(e) ? /* @__PURE__ */ Tn(e) : e, St = (e) => K(e) ? /* @__PURE__ */ es(e) : e;
// @__NO_SIDE_EFFECTS__
function de(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
  return ol(e, !1);
}
function ol(e, t) {
  return /* @__PURE__ */ de(e) ? e : new cl(e, t);
}
class cl {
  constructor(t, n) {
    this.dep = new ms(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ B(t), this._value = n ? t : Pe(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Ae(t) || /* @__PURE__ */ Ze(t);
    t = s ? t : /* @__PURE__ */ B(t), je(t, n) && (this._rawValue = t, this._value = s ? t : Pe(t), this.dep.trigger());
  }
}
function ze(e) {
  return /* @__PURE__ */ de(e) ? e.value : e;
}
const fl = {
  get: (e, t, n) => t === "__v_raw" ? e : ze(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ de(i) && !/* @__PURE__ */ de(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Hi(e) {
  return /* @__PURE__ */ pt(e) ? e : new Proxy(e, fl);
}
class ul {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ms(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Bt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    J !== this)
      return Ti(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Mi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function al(e, t, n = !1) {
  let s, i;
  return H(e) ? s = e : (s = e.get, i = e.set), new ul(s, i, n);
}
const nn = {}, fn = /* @__PURE__ */ new WeakMap();
let at;
function dl(e, t = !1, n = at) {
  if (n) {
    let s = fn.get(n);
    s || fn.set(n, s = []), s.push(e);
  }
}
function hl(e, t, n = Y) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: c } = n, d = (M) => i ? M : /* @__PURE__ */ Ae(M) || i === !1 || i === 0 ? nt(M, 1) : nt(M);
  let u, h, _, C, L = !1, O = !1;
  if (/* @__PURE__ */ de(e) ? (h = () => e.value, L = /* @__PURE__ */ Ae(e)) : /* @__PURE__ */ pt(e) ? (h = () => d(e), L = !0) : R(e) ? (O = !0, L = e.some((M) => /* @__PURE__ */ pt(M) || /* @__PURE__ */ Ae(M)), h = () => e.map((M) => {
    if (/* @__PURE__ */ de(M))
      return M.value;
    if (/* @__PURE__ */ pt(M))
      return d(M);
    if (H(M))
      return c ? c(M, 2) : M();
  })) : H(e) ? t ? h = c ? () => c(e, 2) : e : h = () => {
    if (_) {
      Ye();
      try {
        _();
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
    const M = h, U = i === !0 ? 1 / 0 : i;
    h = () => nt(M(), U);
  }
  const j = Br(), D = () => {
    u.stop(), j && j.active && us(j.effects, u);
  };
  if (r && t) {
    const M = t;
    t = (...U) => {
      const se = M(...U);
      return D(), se;
    };
  }
  let y = O ? new Array(e.length).fill(nn) : nn;
  const F = (M) => {
    if (!(!(u.flags & 1) || !u.dirty && !M))
      if (t) {
        const U = u.run();
        if (M || i || L || (O ? U.some((se, he) => je(se, y[he])) : je(U, y))) {
          _ && _();
          const se = at;
          at = u;
          try {
            const he = [
              U,
              // pass undefined as the old value when it's changed for the first time
              y === nn ? void 0 : O && y[0] === nn ? [] : y,
              C
            ];
            y = U, c ? c(t, 3, he) : (
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
  return o && o(F), u = new Si(h), u.scheduler = l ? () => l(F, !1) : F, C = (M) => dl(M, !1, u), _ = u.onStop = () => {
    const M = fn.get(u);
    if (M) {
      if (c)
        c(M, 4);
      else
        for (const U of M) U();
      fn.delete(u);
    }
  }, t ? s ? F(!0) : y = u.run() : l ? l(F.bind(null, !0), !0) : u.run(), D.pause = u.pause.bind(u), D.resume = u.resume.bind(u), D.stop = D, D;
}
function nt(e, t = 1 / 0, n) {
  if (t <= 0 || !K(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ de(e))
    nt(e.value, t, n);
  else if (R(e))
    for (let s = 0; s < e.length; s++)
      nt(e[s], t, n);
  else if (pi(e) || _t(e))
    e.forEach((s) => {
      nt(s, t, n);
    });
  else if (bi(e)) {
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
    An(i, t, n);
  }
}
function Ee(e, t, n, s) {
  if (H(e)) {
    const i = Yt(e, t, n, s);
    return i && gi(i) && i.catch((r) => {
      An(r, t, n);
    }), i;
  }
  if (R(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(Ee(e[r], t, n, s));
    return i;
  }
}
function An(e, t, n, s = !0) {
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
  pl(e, n, i, s, l);
}
function pl(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const ge = [];
let De = -1;
const xt = [];
let tt = null, vt = 0;
const Ni = /* @__PURE__ */ Promise.resolve();
let un = null;
function gl(e) {
  const t = un || Ni;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function ml(e) {
  let t = De + 1, n = ge.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = ge[s], r = Kt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function _s(e) {
  if (!(e.flags & 1)) {
    const t = Kt(e), n = ge[ge.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Kt(n) ? ge.push(e) : ge.splice(ml(t), 0, e), e.flags |= 1, ji();
  }
}
function ji() {
  un || (un = Ni.then(Bi));
}
function bl(e) {
  if (!R(e))
    tt && e.id === -1 ? tt.splice(vt + 1, 0, e) : e.flags & 1 || (xt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      xt.push(e[t]);
  ji();
}
function Fs(e, t, n = De + 1) {
  for (; n < ge.length; n++) {
    const s = ge[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      ge.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Vi(e) {
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
function Bi(e) {
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
    De = -1, ge.length = 0, Vi(), un = null, (ge.length || xt.length) && Bi();
  }
}
let Ve = null, ki = null;
function an(e) {
  const t = Ve;
  return Ve = e, ki = e && e.type.__scopeId || null, t;
}
function ts(e, t = Ve, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && mn(-1);
    const r = an(t), l = gt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let c = gt.length; c > l; c--) br();
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
    c && (Ye(), Ee(c, n, 8, [
      e.el,
      o,
      e,
      t
    ]), Xe());
  }
}
function vl(e, t) {
  if (be) {
    let n = be.provides;
    const s = be.parent && be.parent.provides;
    s === n && (n = be.provides = Object.create(s)), n[e] = t;
  }
}
function rn(e, t, n = !1) {
  const s = _r();
  if (s || wt) {
    let i = wt ? wt._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && H(t) ? t.call(s && s.proxy) : t;
  }
}
const yl = /* @__PURE__ */ Symbol.for("v-scx"), _l = () => rn(yl);
function Bn(e, t, n) {
  return Ki(e, t, n);
}
function Ki(e, t, n = Y) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = re({}, n), c = t && s || !t && r !== "post";
  let d;
  if (qt) {
    if (r === "sync") {
      const C = _l();
      d = C.__watcherHandles || (C.__watcherHandles = []);
    } else if (!c) {
      const C = () => {
      };
      return C.stop = Be, C.resume = Be, C.pause = Be, C;
    }
  }
  const u = be;
  o.call = (C, L, O) => Ee(C, u, L, O);
  let h = !1;
  r === "post" ? o.scheduler = (C) => {
    _e(C, u && u.suspense);
  } : r !== "sync" && (h = !0, o.scheduler = (C, L) => {
    L ? C() : _s(C);
  }), o.augmentJob = (C) => {
    t && (C.flags |= 4), h && (C.flags |= 2, u && (C.id = u.uid, C.i = u));
  };
  const _ = hl(e, t, o);
  return qt && (d ? d.push(_) : c && _()), _;
}
function xl(e, t, n) {
  const s = this.proxy, i = ee(e) ? e.includes(".") ? Ui(s, e) : () => s[e] : e.bind(s, s);
  let r;
  H(t) ? r = t : (r = t.handler, n = t);
  const l = Xt(this), o = Ki(i, r.bind(s), n);
  return l(), o;
}
function Ui(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++)
      s = s[n[i]];
    return s;
  };
}
const wl = /* @__PURE__ */ Symbol("_vte"), En = (e) => e.__isTeleport, Te = /* @__PURE__ */ Symbol("_leaveCb"), Mt = /* @__PURE__ */ Symbol("_enterCb");
function Sl() {
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
const Ce = [Function, Array], Wi = {
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
}, zi = (e) => {
  const t = e.subTree;
  return t.component ? zi(t.component) : t;
}, Cl = {
  name: "BaseTransition",
  props: Wi,
  setup(e, { slots: t }) {
    const n = _r(), s = Sl();
    return () => {
      const i = t.default && Ji(t.default(), !0), r = i && i.length ? qi(i) : (
        // Keep explicit default-slot conditionals on the same transition path
        // as regular v-if branches, which render a comment placeholder.
        n.subTree ? ho() : void 0
      );
      if (!r)
        return;
      const l = /* @__PURE__ */ B(e), { mode: o } = l;
      if (s.isLeaving)
        return kn(r);
      const c = dn(r);
      if (!c)
        return kn(r);
      let d = ns(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (h) => d = h
      );
      c.type !== me && Ut(c, d);
      let u = n.subTree && dn(n.subTree);
      if (u && u.type !== me && !dt(u, c) && zi(n).type !== me) {
        let h = ns(
          u,
          l,
          s,
          n
        );
        if (Ut(u, h), o === "out-in" && c.type !== me)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave, u = void 0;
          }, kn(r);
        o === "in-out" && c.type !== me ? h.delayLeave = (_, C, L) => {
          const O = Gi(
            s,
            u
          );
          O[String(u.key)] = u, _[Te] = () => {
            C(), _[Te] = void 0, delete d.delayedLeave, u = void 0;
          }, d.delayedLeave = () => {
            L(), delete d.delayedLeave, u = void 0;
          };
        } : u = void 0;
      } else u && (u = void 0);
      return r;
    };
  }
};
function qi(e) {
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
const Tl = Cl;
function Gi(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function ns(e, t, n, s, i) {
  const {
    appear: r,
    mode: l,
    persisted: o = !1,
    onBeforeEnter: c,
    onEnter: d,
    onAfterEnter: u,
    onEnterCancelled: h,
    onBeforeLeave: _,
    onLeave: C,
    onAfterLeave: L,
    onLeaveCancelled: O,
    onBeforeAppear: j,
    onAppear: D,
    onAfterAppear: y,
    onAppearCancelled: F
  } = t, M = String(e.key), U = Gi(n, e), se = (N, W) => {
    N && Ee(
      N,
      s,
      9,
      W
    );
  }, he = (N, W) => {
    const Z = W[1];
    se(N, W), R(N) ? N.every((E) => E.length <= 1) && Z() : N.length <= 1 && Z();
  }, ve = {
    mode: l,
    persisted: o,
    beforeEnter(N) {
      let W = c;
      if (!n.isMounted)
        if (r)
          W = j || c;
        else
          return;
      N[Te] && N[Te](
        !0
        /* cancelled */
      );
      const Z = U[M];
      Z && dt(e, Z) && Z.el[Te] && Z.el[Te](), se(W, [N]);
    },
    enter(N) {
      if (U[M] === e) return;
      let W = d, Z = u, E = h;
      if (!n.isMounted)
        if (r)
          W = D || d, Z = y || u, E = F || h;
        else
          return;
      let X = !1;
      N[Mt] = (Ke) => {
        X || (X = !0, Ke ? se(E, [N]) : se(Z, [N]), ve.delayedLeave && ve.delayedLeave(), N[Mt] = void 0);
      };
      const ue = N[Mt].bind(null, !1);
      W ? he(W, [N, ue]) : ue();
    },
    leave(N, W) {
      const Z = String(e.key);
      if (N[Mt] && N[Mt](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return W();
      se(_, [N]);
      let E = !1;
      N[Te] = (ue) => {
        E || (E = !0, W(), ue ? se(O, [N]) : se(L, [N]), N[Te] = void 0, U[Z] === e && delete U[Z]);
      };
      const X = N[Te].bind(null, !1);
      U[Z] = e, C ? he(C, [N, X]) : X();
    },
    clone(N) {
      const W = ns(
        N,
        t,
        n,
        s,
        i
      );
      return i && i(W), W;
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
    return En(e.type) && e.children ? qi(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && H(n.default))
      return n.default();
  }
}
function Ut(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Ut(
      En(n.type) && dn(n) || n,
      t
    );
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Ji(e, t = !1, n) {
  let s = [], i = 0;
  for (let r = 0; r < e.length; r++) {
    let l = e[r];
    const o = n == null ? l.key : String(n) + String(l.key != null ? l.key : r);
    l.type === xe ? (l.patchFlag & 128 && i++, s = s.concat(
      Ji(l.children, t, o)
    )) : (t || l.type !== me) && s.push(o != null ? st(l, { key: o }) : l);
  }
  if (i > 1)
    for (let r = 0; r < s.length; r++)
      s[r].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function Yi(e, t) {
  return H(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    re({ name: e.name }, t, { setup: e })
  ) : e;
}
function Xi(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ls(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const hn = /* @__PURE__ */ new WeakMap();
function Dt(e, t, n, s, i = !1) {
  if (R(e)) {
    e.forEach(
      (O, j) => Dt(
        O,
        t && (R(t) ? t[j] : t),
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
  const r = s.shapeFlag & 4 ? Ss(s.component) : s.el, l = i ? null : r, { i: o, r: c } = e, d = t && t.r, u = o.refs === Y ? o.refs = {} : o.refs, h = o.setupState, _ = /* @__PURE__ */ B(h), C = h === Y ? hi : (O) => Ls(u, O) ? !1 : k(_, O), L = (O, j) => !(j && Ls(u, j));
  if (d != null && d !== c) {
    if ($s(t), ee(d))
      u[d] = null, C(d) && (h[d] = null);
    else if (/* @__PURE__ */ de(d)) {
      const O = t;
      L(d, O.k) && (d.value = null), O.k && (u[O.k] = null);
    }
  }
  if (H(c))
    Yt(c, o, 12, [l, u]);
  else {
    const O = ee(c), j = /* @__PURE__ */ de(c);
    if (O || j) {
      const D = () => {
        if (e.f) {
          const y = O ? C(c) ? h[c] : u[c] : L() || !e.k ? c.value : u[e.k];
          if (i)
            R(y) && us(y, r);
          else if (R(y))
            y.includes(r) || y.push(r);
          else if (O)
            u[c] = [r], C(c) && (h[c] = u[c]);
          else {
            const F = [r];
            L(c, e.k) && (c.value = F), e.k && (u[e.k] = F);
          }
        } else O ? (u[c] = l, C(c) && (h[c] = l)) : j && (L(c, e.k) && (c.value = l), e.k && (u[e.k] = l));
      };
      if (l) {
        const y = () => {
          D(), hn.delete(e);
        };
        y.id = -1, hn.set(e, y), _e(y, n);
      } else
        $s(e), D();
    }
  }
}
function $s(e) {
  const t = hn.get(e);
  t && (t.flags |= 8, hn.delete(e));
}
Sn().requestIdleCallback;
Sn().cancelIdleCallback;
const Ht = (e) => !!e.type.__asyncLoader, Mn = (e) => e.type.__isKeepAlive;
function Al(e, t) {
  Zi(e, "a", t);
}
function El(e, t) {
  Zi(e, "da", t);
}
function Zi(e, t, n = be) {
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
      Mn(i.parent.vnode) && Ml(s, t, n, i), i = i.parent;
  }
}
function Ml(e, t, n, s) {
  const i = On(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Qi(() => {
    us(s[t], i);
  }, n);
}
function On(e, t, n = be, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...l) => {
      Ye();
      const o = Xt(n), c = Ee(t, n, e, l);
      return o(), Xe(), c;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const Qe = (e) => (t, n = be) => {
  (!qt || e === "sp") && On(e, (...s) => t(...s), n);
}, Ol = Qe("bm"), Pn = Qe("m"), Pl = Qe(
  "bu"
), Il = Qe("u"), In = Qe(
  "bum"
), Qi = Qe("um"), Rl = Qe(
  "sp"
), Fl = Qe("rtg"), Ll = Qe("rtc");
function $l(e, t = be) {
  On("ec", e, t);
}
const Dl = /* @__PURE__ */ Symbol.for("v-ndc");
function pn(e, t, n, s) {
  let i;
  const r = n, l = R(e);
  if (l || ee(e)) {
    const o = l && /* @__PURE__ */ pt(e);
    let c = !1, d = !1;
    o && (c = !/* @__PURE__ */ Ae(e), d = /* @__PURE__ */ Ze(e), e = Cn(e)), i = new Array(e.length);
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
const ss = (e) => e ? xr(e) ? Ss(e) : ss(e.parent) : null, Nt = (
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
    $parent: (e) => ss(e.parent),
    $root: (e) => ss(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => tr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      _s(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = gl.bind(e.proxy)),
    $watch: (e) => xl.bind(e)
  })
), Kn = (e, t) => e !== Y && !e.__isScriptSetup && k(e, t), Hl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: l, type: o, appContext: c } = e;
    if (t[0] !== "$") {
      const _ = l[t];
      if (_ !== void 0)
        switch (_) {
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
        if (i !== Y && k(i, t))
          return l[t] = 2, i[t];
        if (k(r, t))
          return l[t] = 3, r[t];
        if (n !== Y && k(n, t))
          return l[t] = 4, n[t];
        is && (l[t] = 0);
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
    return Kn(i, t) ? (i[t] = n, !0) : s !== Y && k(s, t) ? (s[t] = n, !0) : k(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let c;
    return !!(n[o] || e !== Y && o[0] !== "$" && k(e, o) || Kn(t, o) || k(r, o) || k(s, o) || k(Nt, o) || k(i.config.globalProperties, o) || (c = l.__cssModules) && c[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : k(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Ds(e) {
  return R(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let is = !0;
function Nl(e) {
  const t = tr(e), n = e.proxy, s = e.ctx;
  is = !1, t.beforeCreate && Hs(t.beforeCreate, e, "bc");
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
    mounted: _,
    beforeUpdate: C,
    updated: L,
    activated: O,
    deactivated: j,
    beforeDestroy: D,
    beforeUnmount: y,
    destroyed: F,
    unmounted: M,
    render: U,
    renderTracked: se,
    renderTriggered: he,
    errorCaptured: ve,
    serverPrefetch: N,
    // public API
    expose: W,
    inheritAttrs: Z,
    // assets
    components: E,
    directives: X,
    filters: ue
  } = t;
  if (d && jl(d, s, null), l)
    for (const Q in l) {
      const G = l[Q];
      H(G) && (s[Q] = G.bind(n));
    }
  if (i) {
    const Q = i.call(n, n);
    K(Q) && (e.data = /* @__PURE__ */ Tn(Q));
  }
  if (is = !0, r)
    for (const Q in r) {
      const G = r[Q], it = H(G) ? G.bind(n, n) : H(G.get) ? G.get.bind(n, n) : Be, Zt = !H(G) && H(G.set) ? G.set.bind(n) : Be, rt = It({
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
      er(o[Q], s, n, Q);
  if (c) {
    const Q = H(c) ? c.call(n) : c;
    Reflect.ownKeys(Q).forEach((G) => {
      vl(G, Q[G]);
    });
  }
  u && Hs(u, e, "c");
  function le(Q, G) {
    R(G) ? G.forEach((it) => Q(it.bind(n))) : G && Q(G.bind(n));
  }
  if (le(Ol, h), le(Pn, _), le(Pl, C), le(Il, L), le(Al, O), le(El, j), le($l, ve), le(Ll, se), le(Fl, he), le(In, y), le(Qi, M), le(Rl, N), R(W))
    if (W.length) {
      const Q = e.exposed || (e.exposed = {});
      W.forEach((G) => {
        Object.defineProperty(Q, G, {
          get: () => n[G],
          set: (it) => n[G] = it,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  U && e.render === Be && (e.render = U), Z != null && (e.inheritAttrs = Z), E && (e.components = E), X && (e.directives = X), N && Xi(e);
}
function jl(e, t, n = Be) {
  R(e) && (e = rs(e));
  for (const s in e) {
    const i = e[s];
    let r;
    K(i) ? "default" in i ? r = rn(
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
function Hs(e, t, n) {
  Ee(
    R(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function er(e, t, n, s) {
  let i = s.includes(".") ? Ui(n, s) : () => n[s];
  if (ee(e)) {
    const r = t[e];
    H(r) && Bn(i, r);
  } else if (H(e))
    Bn(i, e.bind(n));
  else if (K(e))
    if (R(e))
      e.forEach((r) => er(r, t, n, s));
    else {
      const r = H(e.handler) ? e.handler.bind(n) : t[e.handler];
      H(r) && Bn(i, r, e);
    }
}
function tr(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: i,
    optionsCache: r,
    config: { optionMergeStrategies: l }
  } = e.appContext, o = r.get(t);
  let c;
  return o ? c = o : !i.length && !n && !s ? c = t : (c = {}, i.length && i.forEach(
    (d) => gn(c, d, l, !0)
  ), gn(c, t, l)), K(t) && r.set(t, c), c;
}
function gn(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && gn(e, r, n, !0), i && i.forEach(
    (l) => gn(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const o = Vl[l] || n && n[l];
      e[l] = o ? o(e[l], t[l]) : t[l];
    }
  return e;
}
const Vl = {
  data: Ns,
  props: js,
  emits: js,
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
  watch: kl,
  // provide / inject
  provide: Ns,
  inject: Bl
};
function Ns(e, t) {
  return t ? e ? function() {
    return re(
      H(e) ? e.call(this, this) : e,
      H(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Bl(e, t) {
  return Pt(rs(e), rs(t));
}
function rs(e) {
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
function js(e, t) {
  return e ? R(e) && R(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : re(
    /* @__PURE__ */ Object.create(null),
    Ds(e),
    Ds(t ?? {})
  ) : t;
}
function kl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = re(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = pe(e[s], t[s]);
  return n;
}
function nr() {
  return {
    app: null,
    config: {
      isNativeTag: hi,
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
  return function(s, i = null) {
    H(s) || (s = re({}, s)), i != null && !K(i) && (i = null);
    const r = nr(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let c = !1;
    const d = r.app = {
      _uid: Kl++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: Co,
      get config() {
        return r.config;
      },
      set config(u) {
      },
      use(u, ...h) {
        return l.has(u) || (u && H(u.install) ? (l.add(u), u.install(d, ...h)) : H(u) && (l.add(u), u(d, ...h))), d;
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
      mount(u, h, _) {
        if (!c) {
          const C = d._ceVNode || fe(s, i);
          return C.appContext = r, _ === !0 ? _ = "svg" : _ === !1 && (_ = void 0), e(C, u, _), c = !0, d._container = u, u.__vue_app__ = d, Ss(C.component);
        }
      },
      onUnmount(u) {
        o.push(u);
      },
      unmount() {
        c && (Ee(
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
const Wl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Me(t)}Modifiers`] || e[`${mt(t)}Modifiers`];
function zl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Y;
  let i = n;
  const r = t.startsWith("update:"), l = r && Wl(s, t.slice(7));
  l && (l.trim && (i = n.map((u) => ee(u) ? u.trim() : u)), l.number && (i = n.map(Ir)));
  let o, c = s[o = $n(t)] || // also try camelCase event handler (#2249)
  s[o = $n(Me(t))];
  !c && r && (c = s[o = $n(mt(t))]), c && Ee(
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
    e.emitted[o] = !0, Ee(
      d,
      e,
      6,
      i
    );
  }
}
const ql = /* @__PURE__ */ new WeakMap();
function sr(e, t, n = !1) {
  const s = n ? ql : t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let l = {}, o = !1;
  if (!H(e)) {
    const c = (d) => {
      const u = sr(d, t, !0);
      u && (o = !0, re(l, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !r && !o ? (K(e) && s.set(e, null), null) : (R(r) ? r.forEach((c) => l[c] = null) : re(l, r), K(e) && s.set(e, l), l);
}
function Rn(e, t) {
  return !e || !_n(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), k(e, t[0].toLowerCase() + t.slice(1)) || k(e, mt(t)) || k(e, t));
}
function Vs(e) {
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
    data: _,
    setupState: C,
    ctx: L,
    inheritAttrs: O
  } = e, j = an(e);
  let D, y;
  try {
    if (n.shapeFlag & 4) {
      const M = i || s, U = M;
      D = Ne(
        d.call(
          U,
          M,
          u,
          h,
          C,
          _,
          L
        )
      ), y = o;
    } else {
      const M = t;
      D = Ne(
        M.length > 1 ? M(
          h,
          { attrs: o, slots: l, emit: c }
        ) : M(
          h,
          null
        )
      ), y = t.props ? o : Gl(o);
    }
  } catch (M) {
    gt.length = 0, An(M, e, 1), D = fe(me);
  }
  let F = D;
  if (y && O !== !1) {
    const M = Object.keys(y), { shapeFlag: U } = F;
    M.length && U & 7 && (r && M.some(xn) && (y = Jl(
      y,
      r
    )), F = st(F, y, !1, !0));
  }
  if (n.dirs && (F = st(F, null, !1, !0), F.dirs = F.dirs ? F.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const M = En(F.type) && dn(F) || F;
    Ut(M, n.transition);
  }
  return D = F, an(j), D;
}
const Gl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || _n(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Jl = (e, t) => {
  const n = {};
  for (const s in e)
    (!xn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Yl(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: l, children: o, patchFlag: c } = t, d = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Bs(s, l, d) : !!l;
    if (c & 8) {
      const u = t.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        const _ = u[h];
        if (ir(l, s, _) && !Rn(d, _))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Bs(s, l, d) : !0 : !!l;
  return !1;
}
function Bs(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (ir(t, e, r) && !Rn(n, r))
      return !0;
  }
  return !1;
}
function ir(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && K(s) && K(i) ? !ds(s, i) : s !== i;
}
function Xl({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const rr = {}, lr = () => Object.create(rr), or = (e) => Object.getPrototypeOf(e) === rr;
function Zl(e, t, n, s = !1) {
  const i = {}, r = lr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), cr(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ rl(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Ql(e, t, n, s) {
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
        let _ = u[h];
        if (Rn(e.emitsOptions, _))
          continue;
        const C = t[_];
        if (c)
          if (k(r, _))
            C !== r[_] && (r[_] = C, d = !0);
          else {
            const L = Me(_);
            i[L] = ls(
              c,
              o,
              L,
              C,
              e,
              !1
            );
          }
        else
          C !== r[_] && (r[_] = C, d = !0);
      }
    }
  } else {
    cr(e, t, i, r) && (d = !0);
    let u;
    for (const h in o)
      (!t || // for camelCase
      !k(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = mt(h)) === h || !k(t, u))) && (c ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[u] !== void 0) && (i[h] = ls(
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
function cr(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let c in t) {
      if (Ft(c))
        continue;
      const d = t[c];
      let u;
      i && k(i, u = Me(c)) ? !r || !r.includes(u) ? n[u] = d : (o || (o = {}))[u] = d : Rn(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, l = !0);
    }
  if (r) {
    const c = /* @__PURE__ */ B(n), d = o || Y;
    for (let u = 0; u < r.length; u++) {
      const h = r[u];
      n[h] = ls(
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
function ls(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = k(l, "default");
    if (o && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && H(c)) {
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
const eo = /* @__PURE__ */ new WeakMap();
function fr(e, t, n = !1) {
  const s = n ? eo : t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, l = {}, o = [];
  let c = !1;
  if (!H(e)) {
    const u = (h) => {
      c = !0;
      const [_, C] = fr(h, t, !0);
      re(l, _), C && o.push(...C);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!r && !c)
    return K(e) && s.set(e, yt), yt;
  if (R(r))
    for (let u = 0; u < r.length; u++) {
      const h = Me(r[u]);
      ks(h) && (l[h] = Y);
    }
  else if (r)
    for (const u in r) {
      const h = Me(u);
      if (ks(h)) {
        const _ = r[u], C = l[h] = R(_) || H(_) ? { type: _ } : re({}, _), L = C.type;
        let O = !1, j = !0;
        if (R(L))
          for (let D = 0; D < L.length; ++D) {
            const y = L[D], F = H(y) && y.name;
            if (F === "Boolean") {
              O = !0;
              break;
            } else F === "String" && (j = !1);
          }
        else
          O = H(L) && L.name === "Boolean";
        C[
          0
          /* shouldCast */
        ] = O, C[
          1
          /* shouldCastTrue */
        ] = j, (O || k(C, "default")) && o.push(h);
      }
    }
  const d = [l, o];
  return K(e) && s.set(e, d), d;
}
function ks(e) {
  return e[0] !== "$" && !Ft(e);
}
const xs = (e) => e === "_" || e === "_ctx" || e === "$stable", ws = (e) => R(e) ? e.map(Ne) : [Ne(e)], to = (e, t, n) => {
  if (t._n)
    return t;
  const s = ts((...i) => ws(t(...i)), n);
  return s._c = !1, s;
}, ur = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (xs(i)) continue;
    const r = e[i];
    if (H(r))
      t[i] = to(i, r, s);
    else if (r != null) {
      const l = ws(r);
      t[i] = () => l;
    }
  }
}, ar = (e, t) => {
  const n = ws(t);
  e.slots.default = () => n;
}, dr = (e, t, n) => {
  for (const s in t)
    (n || !xs(s)) && (e[s] = t[s]);
}, no = (e, t, n) => {
  const s = e.slots = lr();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (dr(s, t, n), n && yi(s, "_", i, !0)) : ur(t, s);
  } else t && ar(e, t);
}, so = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = Y;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : dr(i, t, n) : (r = !t.$stable, ur(t, i)), l = t;
  } else t && (ar(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !xs(o) && l[o] == null && delete i[o];
}, _e = co;
function io(e) {
  return ro(e);
}
function ro(e, t) {
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
    nextSibling: _,
    setScopeId: C = Be,
    insertStaticContent: L
  } = e, O = (f, a, p, v = null, b = null, g = null, T = void 0, S = null, w = !!a.dynamicChildren) => {
    if (f === a)
      return;
    f && !dt(f, a) && (v = Qt(f), Ie(f, b, g, !0), f = null), a.patchFlag === -2 && (w = !1, a.dynamicChildren = null);
    const { type: m, ref: I, shapeFlag: A } = a;
    switch (m) {
      case Fn:
        j(f, a, p, v);
        break;
      case me:
        D(f, a, p, v);
        break;
      case ln:
        f == null && y(a, p, v, T);
        break;
      case xe:
        E(
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
        A & 1 ? U(
          f,
          a,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        ) : A & 6 ? X(
          f,
          a,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        ) : (A & 64 || A & 128) && m.process(
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
  }, j = (f, a, p, v) => {
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
  }, D = (f, a, p, v) => {
    f == null ? s(
      a.el = c(a.children || ""),
      p,
      v
    ) : a.el = f.el;
  }, y = (f, a, p, v) => {
    [f.el, f.anchor] = L(
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
      b = _(f), s(f, p, v), f = b;
    s(a, p, v);
  }, M = ({ el: f, anchor: a }) => {
    let p;
    for (; f && f !== a; )
      p = _(f), i(f), f = p;
    i(a);
  }, U = (f, a, p, v, b, g, T, S, w) => {
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
        m && m._beginPatch(), N(
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
    const { props: I, shapeFlag: A, transition: P, dirs: $ } = f;
    if (w = f.el = l(
      f.type,
      g,
      I && I.is,
      I
    ), A & 8 ? u(w, f.children) : A & 16 && ve(
      f.children,
      w,
      null,
      v,
      b,
      Un(f, g),
      T,
      S
    ), $ && lt(f, null, v, "created"), he(w, f, f.scopeId, T, v), I) {
      for (const q in I)
        q !== "value" && !Ft(q) && r(w, q, null, I[q], g, v);
      "value" in I && r(w, "value", null, I.value, g), (m = I.onVnodeBeforeMount) && $e(m, v, f);
    }
    $ && lt(f, null, v, "beforeMount");
    const V = lo(b, P);
    V && P.beforeEnter(w), s(w, a, p), ((m = I && I.onVnodeMounted) || V || $) && _e(() => {
      try {
        m && $e(m, v, f), V && P.enter(w), $ && lt(f, null, v, "mounted");
      } finally {
      }
    }, b);
  }, he = (f, a, p, v, b) => {
    if (p && C(f, p), v)
      for (let g = 0; g < v.length; g++)
        C(f, v[g]);
    if (b) {
      let g = b.subTree;
      if (a === g || mr(g.type) && (g.ssContent === a || g.ssFallback === a)) {
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
      O(
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
  }, N = (f, a, p, v, b, g, T) => {
    const S = a.el = f.el;
    let { patchFlag: w, dynamicChildren: m, dirs: I } = a;
    w |= f.patchFlag & 16;
    const A = f.props || Y, P = a.props || Y;
    let $;
    if (p && ot(p, !1), ($ = P.onVnodeBeforeUpdate) && $e($, p, a, f), I && lt(a, f, p, "beforeUpdate"), p && ot(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    m && (!f.dynamicChildren || f.dynamicChildren.length !== m.length) && (w = 0, T = !1, m = null), (A.innerHTML && P.innerHTML == null || A.textContent && P.textContent == null) && u(S, ""), m ? W(
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
        Z(S, A, P, p, b);
      else if (w & 2 && A.class !== P.class && r(S, "class", null, P.class, b), w & 4 && r(S, "style", A.style, P.style, b), w & 8) {
        const V = a.dynamicProps;
        for (let q = 0; q < V.length; q++) {
          const z = V[q], ie = A[z], oe = P[z];
          (oe !== ie || z === "value") && r(S, z, ie, oe, b, p);
        }
      }
      w & 1 && f.children !== a.children && u(S, a.children);
    } else !T && m == null && Z(S, A, P, p, b);
    (($ = P.onVnodeUpdated) || I) && _e(() => {
      $ && $e($, p, a, f), I && lt(a, f, p, "updated");
    }, v);
  }, W = (f, a, p, v, b, g, T) => {
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
      O(
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
  }, E = (f, a, p, v, b, g, T, S, w) => {
    const m = a.el = f ? f.el : o(""), I = a.anchor = f ? f.anchor : o("");
    let { patchFlag: A, dynamicChildren: P, slotScopeIds: $ } = a;
    $ && (S = S ? S.concat($) : $), f == null ? (s(m, p, v), s(I, p, v), ve(
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
    )) : A > 0 && A & 64 && P && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren && f.dynamicChildren.length === P.length ? (W(
      f.dynamicChildren,
      P,
      p,
      b,
      g,
      T,
      S
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (a.key != null || b && a === b.subTree) && hr(
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
    const S = f.component = bo(
      f,
      v,
      b
    );
    if (Mn(f) && (S.ctx.renderer = Tt), vo(S, !1, T), S.asyncDep) {
      if (b && b.registerDep(S, le, T), !f.el) {
        const w = S.subTree = fe(me);
        D(null, w, a, p), f.placeholder = w.el;
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
    if (Yl(f, a, p))
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
        let { next: A, bu: P, u: $, parent: V, vnode: q } = f;
        {
          const Fe = pr(f);
          if (Fe) {
            A && (A.el = q.el, Q(f, A, T)), Fe.asyncDep.then(() => {
              _e(() => {
                f.isUnmounted || m();
              }, b);
            });
            return;
          }
        }
        let z = A, ie;
        ot(f, !1), A ? (A.el = q.el, Q(f, A, T)) : A = q, P && Dn(P), (ie = A.props && A.props.onVnodeBeforeUpdate) && $e(ie, V, A, q), ot(f, !0);
        const oe = Vs(f), Re = f.subTree;
        f.subTree = oe, O(
          Re,
          oe,
          // parent may have changed if it's in a teleport
          h(Re.el),
          // anchor may have changed if it's in a fragment
          Qt(Re),
          f,
          b,
          g
        ), A.el = oe.el, z === null && Xl(f, oe.el), $ && _e($, b), (ie = A.props && A.props.onVnodeUpdated) && _e(
          () => $e(ie, V, A, q),
          b
        );
      } else {
        let A;
        const { el: P, props: $ } = a, { bm: V, m: q, parent: z, root: ie, type: oe } = f, Re = Ht(a);
        ot(f, !1), V && Dn(V), !Re && (A = $ && $.onVnodeBeforeMount) && $e(A, z, a), ot(f, !0);
        {
          ie.ce && ie.ce._hasShadowRoot() && ie.ce._injectChildStyle(
            oe,
            f.parent ? f.parent.type : void 0
          );
          const Fe = f.subTree = Vs(f);
          O(
            null,
            Fe,
            p,
            v,
            f,
            b,
            g
          ), a.el = Fe.el;
        }
        if (q && _e(q, b), !Re && (A = $ && $.onVnodeMounted)) {
          const Fe = a;
          _e(
            () => $e(A, z, Fe),
            b
          );
        }
        (a.shapeFlag & 256 || z && Ht(z.vnode) && z.vnode.shapeFlag & 256) && f.a && _e(f.a, b), f.isMounted = !0, a = p = v = null;
      }
    };
    f.scope.on();
    const w = f.effect = new Si(S);
    f.scope.off();
    const m = f.update = w.run.bind(w), I = f.job = w.runIfDirty.bind(w);
    I.i = f, I.id = f.uid, w.scheduler = () => _s(I), ot(f, !0), m();
  }, Q = (f, a, p) => {
    a.component = f;
    const v = f.vnode.props;
    f.vnode = a, f.next = null, Ql(f, a.props, v, p), so(f, a.children, p), Ye(), Fs(f), Xe();
  }, G = (f, a, p, v, b, g, T, S, w = !1) => {
    const m = f && f.children, I = f ? f.shapeFlag : 0, A = a.children, { patchFlag: P, shapeFlag: $ } = a;
    if (P > 0) {
      if (P & 128) {
        Zt(
          m,
          A,
          p,
          v,
          b,
          g,
          T,
          S,
          w
        );
        return;
      } else if (P & 256) {
        it(
          m,
          A,
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
    $ & 8 ? (I & 16 && Ct(m, b, g), A !== m && u(p, A)) : I & 16 ? $ & 16 ? Zt(
      m,
      A,
      p,
      v,
      b,
      g,
      T,
      S,
      w
    ) : Ct(m, b, g, !0) : (I & 8 && u(p, ""), $ & 16 && ve(
      A,
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
    const m = f.length, I = a.length, A = Math.min(m, I);
    let P;
    for (P = 0; P < A; P++) {
      const $ = a[P] = w ? Ge(a[P]) : Ne(a[P]);
      O(
        f[P],
        $,
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
      A
    ) : ve(
      a,
      p,
      v,
      b,
      g,
      T,
      S,
      w,
      A
    );
  }, Zt = (f, a, p, v, b, g, T, S, w) => {
    let m = 0;
    const I = a.length;
    let A = f.length - 1, P = I - 1;
    for (; m <= A && m <= P; ) {
      const $ = f[m], V = a[m] = w ? Ge(a[m]) : Ne(a[m]);
      if (dt($, V))
        O(
          $,
          V,
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
    for (; m <= A && m <= P; ) {
      const $ = f[A], V = a[P] = w ? Ge(a[P]) : Ne(a[P]);
      if (dt($, V))
        O(
          $,
          V,
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
      A--, P--;
    }
    if (m > A) {
      if (m <= P) {
        const $ = P + 1, V = $ < I ? a[$].el : v;
        for (; m <= P; )
          O(
            null,
            a[m] = w ? Ge(a[m]) : Ne(a[m]),
            p,
            V,
            b,
            g,
            T,
            S,
            w
          ), m++;
      }
    } else if (m > P)
      for (; m <= A; )
        Ie(f[m], b, g, !0), m++;
    else {
      const $ = m, V = m, q = /* @__PURE__ */ new Map();
      for (m = V; m <= P; m++) {
        const we = a[m] = w ? Ge(a[m]) : Ne(a[m]);
        we.key != null && q.set(we.key, m);
      }
      let z, ie = 0;
      const oe = P - V + 1;
      let Re = !1, Fe = 0;
      const At = new Array(oe);
      for (m = 0; m < oe; m++) At[m] = 0;
      for (m = $; m <= A; m++) {
        const we = f[m];
        if (ie >= oe) {
          Ie(we, b, g, !0);
          continue;
        }
        let Le;
        if (we.key != null)
          Le = q.get(we.key);
        else
          for (z = V; z <= P; z++)
            if (At[z - V] === 0 && dt(we, a[z])) {
              Le = z;
              break;
            }
        Le === void 0 ? Ie(we, b, g, !0) : (At[Le - V] = m + 1, Le >= Fe ? Fe = Le : Re = !0, O(
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
      const As = Re ? oo(At) : yt;
      for (z = As.length - 1, m = oe - 1; m >= 0; m--) {
        const we = V + m, Le = a[we], Es = a[we + 1], Ms = we + 1 < I ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          Es.el || gr(Es)
        ) : v;
        At[m] === 0 ? O(
          null,
          Le,
          p,
          Ms,
          b,
          g,
          T,
          S,
          w
        ) : Re && (z < 0 || m !== As[z] ? rt(Le, p, Ms, 2) : z--);
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
      for (let A = 0; A < w.length; A++)
        rt(w[A], a, p, v);
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
        const { leave: A, delayLeave: P, afterLeave: $ } = S, V = () => {
          f.ctx.isUnmounted ? i(g) : s(g, a, p);
        }, q = () => {
          const z = g._isLeaving || !!g[Te];
          g._isLeaving && g[Te](
            !0
            /* cancelled */
          ), S.persisted && !z ? V() : A(g, () => {
            V(), $ && $();
          });
        };
        P ? P(g, V, q) : q();
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
      patchFlag: A,
      dirs: P,
      cacheIndex: $,
      memo: V
    } = f;
    if (A === -2 && (b = !1), S != null && (Ye(), Dt(S, null, p, f, !0), Xe()), $ != null && (a.renderCache[$] = void 0), I & 256) {
      a.ctx.deactivate(f);
      return;
    }
    const q = I & 1 && P, z = !Ht(f);
    let ie;
    if (z && (ie = T && T.onVnodeBeforeUnmount) && $e(ie, a, f), I & 6)
      Ar(f.component, p, v);
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
      (g !== xe || A > 0 && A & 64) ? Ct(
        m,
        a,
        p,
        !1,
        !0
      ) : (g === xe && A & 384 || !b && I & 16) && Ct(w, a, p), v && Cs(f);
    }
    const oe = V != null && $ == null;
    (z && (ie = T && T.onVnodeUnmounted) || q || oe) && _e(() => {
      ie && $e(ie, a, f), q && lt(f, null, a, "unmounted"), oe && (f.el = null);
    }, p);
  }, Cs = (f) => {
    const { type: a, el: p, anchor: v, transition: b } = f;
    if (a === xe) {
      Tr(p, v);
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
  }, Tr = (f, a) => {
    let p;
    for (; f !== a; )
      p = _(f), i(f), f = p;
    i(a);
  }, Ar = (f, a, p) => {
    const { bum: v, scope: b, job: g, subTree: T, um: S, m: w, a: m } = f;
    Ks(w), Ks(m), v && Dn(v), b.stop(), g && (g.flags |= 8, Ie(T, f, a, p)), S && _e(S, a), _e(() => {
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
    const a = _(f.anchor || f.el), p = a && a[wl];
    return p ? _(p) : a;
  };
  let Ln = !1;
  const Ts = (f, a, p) => {
    let v;
    f == null ? a._vnode && (Ie(a._vnode, null, null, !0), v = a._vnode.component) : O(
      a._vnode || null,
      f,
      a,
      null,
      null,
      null,
      p
    ), a._vnode = f, Ln || (Ln = !0, Fs(v), Vi(), Ln = !1);
  }, Tt = {
    p: O,
    um: Ie,
    m: rt,
    r: Cs,
    mt: ue,
    mc: ve,
    pc: G,
    pbc: W,
    n: Qt,
    o: e
  };
  return {
    render: Ts,
    hydrate: void 0,
    createApp: Ul(Ts)
  };
}
function Un({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ot({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function lo(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function hr(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (R(s) && R(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = Ge(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && hr(l, o)), o.type === Fn && (o.patchFlag === -1 && (o = i[r] = Ge(o)), o.el = l.el), o.type === me && !o.el && (o.el = l.el);
    }
}
function oo(e) {
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
function pr(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : pr(t);
}
function Ks(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function gr(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? gr(t.subTree) : null;
}
const mr = (e) => e.__isSuspense;
function co(e, t) {
  t && t.pendingBranch ? R(e) ? t.effects.push(...e) : t.effects.push(e) : bl(e);
}
const xe = /* @__PURE__ */ Symbol.for("v-fgt"), Fn = /* @__PURE__ */ Symbol.for("v-txt"), me = /* @__PURE__ */ Symbol.for("v-cmt"), ln = /* @__PURE__ */ Symbol.for("v-stc"), gt = [];
let Se = null;
function te(e = !1) {
  gt.push(Se = e ? null : []);
}
function br() {
  gt.pop(), Se = gt[gt.length - 1] || null;
}
let Wt = 1;
function mn(e, t = !1) {
  Wt += e, e < 0 && Se && t && (Se.hasOnce = !0);
}
function vr(e) {
  return e.dynamicChildren = Wt > 0 ? Se || yt : null, br(), Wt > 0 && Se && Se.push(e), e;
}
function ne(e, t, n, s, i, r) {
  return vr(
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
function fo(e, t, n, s, i) {
  return vr(
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
const yr = ({ key: e }) => e ?? null, on = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ee(e) || /* @__PURE__ */ de(e) || H(e) ? { i: Ve, r: e, k: t, f: !!n } : e : null);
function x(e, t = null, n = null, s = 0, i = null, r = e === xe ? 0 : 1, l = !1, o = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && yr(t),
    ref: t && on(t),
    scopeId: ki,
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
const fe = uo;
function uo(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Dl) && (e = me), bn(e)) {
    const o = st(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && vn(o, n), Wt > 0 && !r && Se && (o.shapeFlag & 6 ? Se[Se.indexOf(e)] = o : Se.push(o)), o.patchFlag = -2, o;
  }
  if (wo(e) && (e = e.__vccOpts), t) {
    t = ao(t);
    let { class: o, style: c } = t;
    o && !ee(o) && (t.class = Vt(o)), K(c) && (/* @__PURE__ */ ys(c) && !R(c) && (c = re({}, c)), t.style = jt(c));
  }
  const l = ee(e) ? 1 : mr(e) ? 128 : En(e) ? 64 : K(e) ? 4 : H(e) ? 2 : 0;
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
function ao(e) {
  return e ? /* @__PURE__ */ ys(e) || or(e) ? re({}, e) : e : null;
}
function st(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: l, children: o, transition: c } = e, d = t ? po(i || {}, t) : i, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && yr(d),
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
function os(e = " ", t = 0) {
  return fe(Fn, null, e, t);
}
function sn(e, t) {
  const n = fe(ln, null, e);
  return n.staticCount = t, n;
}
function ho(e = "", t = !1) {
  return t ? (te(), fo(me, null, e)) : fe(me, null, e);
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
      !i && !or(t) ? t._ctx = Ve : i === 3 && Ve && (Ve.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (H(t)) {
    if (s & 65) {
      vn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ve }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [os(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function po(...e) {
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
  Ee(e, t, 7, [
    n,
    s
  ]);
}
const go = nr();
let mo = 0;
function bo(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || go, r = {
    uid: mo++,
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
    scope: new Vr(
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
    propsOptions: fr(s, i),
    emitsOptions: sr(s, i),
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
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = zl.bind(null, r), e.ce && e.ce(r), r;
}
let be = null;
const _r = () => be || Ve;
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
}, Us = () => {
  be && be.scope.off(), yn(null);
};
function xr(e) {
  return e.vnode.shapeFlag & 4;
}
let qt = !1;
function vo(e, t = !1, n = !1) {
  t && zt(t);
  const { props: s, children: i } = e.vnode, r = xr(e);
  Zl(e, s, r, t), no(e, i, n || t);
  const l = r ? yo(e, t) : void 0;
  return t && zt(!1), l;
}
function yo(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Hl);
  const { setup: s } = n;
  if (s) {
    Ye();
    const i = e.setupContext = s.length > 1 ? xo(e) : null, r = Xt(e), l = Yt(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = gi(l);
    if (Xe(), r(), (o || e.sp) && !Ht(e) && Xi(e), o) {
      if (l.then(Us, Us), t)
        return l.then((c) => {
          zt(!0);
          try {
            Ws(e, c, t);
          } finally {
            zt(!1);
          }
        }).catch((c) => {
          An(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Ws(e, l);
  } else
    wr(e);
}
function Ws(e, t, n) {
  H(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : K(t) && (e.setupState = Hi(t)), wr(e);
}
function wr(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Be);
  {
    const i = Xt(e);
    Ye();
    try {
      Nl(e);
    } finally {
      Xe(), i();
    }
  }
}
const _o = {
  get(e, t) {
    return ae(e, "get", ""), e[t];
  }
};
function xo(e) {
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
function Ss(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Hi(ll(e.exposed)), {
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
function wo(e) {
  return H(e) && "__vccOpts" in e;
}
const It = (e, t) => /* @__PURE__ */ al(e, t, qt);
function So(e, t, n) {
  try {
    mn(-1);
    const s = arguments.length;
    return s === 2 ? K(t) && !R(t) ? bn(t) ? fe(e, null, [t]) : fe(e, t) : fe(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && bn(n) && (n = [n]), fe(e, t, n));
  } finally {
    mn(1);
  }
}
const Co = "3.5.41";
/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let cs;
const zs = typeof window < "u" && window.trustedTypes;
if (zs)
  try {
    cs = /* @__PURE__ */ zs.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Sr = cs ? (e) => cs.createHTML(e) : (e) => e, To = "http://www.w3.org/2000/svg", Ao = "http://www.w3.org/1998/Math/MathML", qe = typeof document < "u" ? document : null, qs = qe && /* @__PURE__ */ qe.createElement("template"), Eo = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? qe.createElementNS(To, e) : t === "mathml" ? qe.createElementNS(Ao, e) : n ? qe.createElement(e, { is: n }) : qe.createElement(e);
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
      qs.innerHTML = Sr(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = qs.content;
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
}, et = "transition", Ot = "animation", Gt = /* @__PURE__ */ Symbol("_vtc"), Cr = {
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
}, Mo = /* @__PURE__ */ re(
  {},
  Wi,
  Cr
), Oo = (e) => (e.displayName = "Transition", e.props = Mo, e), Gs = /* @__PURE__ */ Oo(
  (e, { slots: t }) => So(Tl, Po(e), t)
), ct = (e, t = []) => {
  R(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Js = (e) => e ? R(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Po(e) {
  const t = {};
  for (const E in e)
    E in Cr || (t[E] = e[E]);
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
    leaveActiveClass: _ = `${n}-leave-active`,
    leaveToClass: C = `${n}-leave-to`
  } = e, L = Io(i), O = L && L[0], j = L && L[1], {
    onBeforeEnter: D,
    onEnter: y,
    onEnterCancelled: F,
    onLeave: M,
    onLeaveCancelled: U,
    onBeforeAppear: se = D,
    onAppear: he = y,
    onAppearCancelled: ve = F
  } = t, N = (E, X, ue, Ke) => {
    E._enterCancelled = Ke, ft(E, X ? u : o), ft(E, X ? d : l), ue && ue();
  }, W = (E, X) => {
    E._isLeaving = !1, ft(E, h), ft(E, C), ft(E, _), X && X();
  }, Z = (E) => (X, ue) => {
    const Ke = E ? he : y, le = () => N(X, E, ue);
    ct(Ke, [X, le]), Ys(() => {
      ft(X, E ? c : r), We(X, E ? u : o), Js(Ke) || Xs(X, s, O, le);
    });
  };
  return re(t, {
    onBeforeEnter(E) {
      ct(D, [E]), We(E, r), We(E, l);
    },
    onBeforeAppear(E) {
      ct(se, [E]), We(E, c), We(E, d);
    },
    onEnter: Z(!1),
    onAppear: Z(!0),
    onLeave(E, X) {
      E._isLeaving = !0;
      const ue = () => W(E, X);
      We(E, h), E._enterCancelled ? (We(E, _), ei(E)) : (ei(E), We(E, _)), Ys(() => {
        E._isLeaving && (ft(E, h), We(E, C), Js(M) || Xs(E, s, j, ue));
      }), ct(M, [E, ue]);
    },
    onEnterCancelled(E) {
      N(E, !1, void 0, !0), ct(F, [E]);
    },
    onAppearCancelled(E) {
      N(E, !0, void 0, !0), ct(ve, [E]);
    },
    onLeaveCancelled(E) {
      W(E), ct(U, [E]);
    }
  });
}
function Io(e) {
  if (e == null)
    return null;
  if (K(e))
    return [Wn(e.enter), Wn(e.leave)];
  {
    const t = Wn(e);
    return [t, t];
  }
}
function Wn(e) {
  return Rr(e);
}
function We(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Gt] || (e[Gt] = /* @__PURE__ */ new Set())).add(t);
}
function ft(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Gt];
  n && (n.delete(t), n.size || (e[Gt] = void 0));
}
function Ys(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Ro = 0;
function Xs(e, t, n, s) {
  const i = e._endId = ++Ro, r = () => {
    i === e._endId && s();
  };
  if (n != null)
    return setTimeout(r, n);
  const { type: l, timeout: o, propCount: c } = Fo(e, t);
  if (!l)
    return s();
  const d = l + "end";
  let u = 0;
  const h = () => {
    e.removeEventListener(d, _), r();
  }, _ = (C) => {
    C.target === e && ++u >= c && h();
  };
  setTimeout(() => {
    u < c && h();
  }, o + 1), e.addEventListener(d, _);
}
function Fo(e, t) {
  const n = window.getComputedStyle(e), s = (L) => (n[L] || "").split(", "), i = s(`${et}Delay`), r = s(`${et}Duration`), l = Zs(i, r), o = s(`${Ot}Delay`), c = s(`${Ot}Duration`), d = Zs(o, c);
  let u = null, h = 0, _ = 0;
  t === et ? l > 0 && (u = et, h = l, _ = r.length) : t === Ot ? d > 0 && (u = Ot, h = d, _ = c.length) : (h = Math.max(l, d), u = h > 0 ? l > d ? et : Ot : null, _ = u ? u === et ? r.length : c.length : 0);
  const C = u === et && /\b(?:transform|all)(?:,|$)/.test(
    s(`${et}Property`).toString()
  );
  return {
    type: u,
    timeout: h,
    propCount: _,
    hasTransform: C
  };
}
function Zs(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => Qs(n) + Qs(e[s])));
}
function Qs(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function ei(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Lo(e, t, n) {
  const s = e[Gt];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ti = /* @__PURE__ */ Symbol("_vod"), $o = /* @__PURE__ */ Symbol("_vsh"), Do = /* @__PURE__ */ Symbol(""), Ho = /(?:^|;)\s*display\s*:/;
function No(e, t, n) {
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
      o != null ? Vo(
        e,
        l,
        !ee(t) && t ? t[l] : void 0,
        o
      ) || Rt(s, l, o) : Rt(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[Do];
      l && (n += ";" + l), s.cssText = n, r = Ho.test(n);
    }
  } else t && e.removeAttribute("style");
  ti in e && (e[ti] = r ? s.display : "", e[$o] && (s.display = "none"));
}
const ni = /\s*!important$/;
function Rt(e, t, n) {
  if (R(n))
    n.forEach((s) => Rt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = jo(e, t);
    ni.test(n) ? e.setProperty(
      mt(s),
      n.replace(ni, ""),
      "important"
    ) : e[s] = n;
  }
}
const si = ["Webkit", "Moz", "ms"], zn = {};
function jo(e, t) {
  const n = zn[t];
  if (n)
    return n;
  let s = Me(t);
  if (s !== "filter" && s in e)
    return zn[t] = s;
  s = vi(s);
  for (let i = 0; i < si.length; i++) {
    const r = si[i] + s;
    if (r in e)
      return zn[t] = r;
  }
  return t;
}
function Vo(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ee(s) && n === s;
}
const ii = "http://www.w3.org/1999/xlink";
function ri(e, t, n, s, i, r = Nr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ii, t.slice(6, t.length)) : e.setAttributeNS(ii, t, n) : n == null || r && !_i(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : ke(n) ? String(n) : n
  );
}
function li(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Sr(n) : n);
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
    o === "boolean" ? n = _i(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function Bo(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function ko(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const oi = /* @__PURE__ */ Symbol("_vei");
function Ko(e, t, n, s, i = null) {
  const r = e[oi] || (e[oi] = {}), l = r[t];
  if (s && l)
    l.value = s;
  else {
    const [o, c] = zo(t);
    if (s) {
      const d = r[t] = Jo(
        s,
        i
      );
      Bo(e, o, d, c);
    } else l && (ko(e, o, l, c), r[t] = void 0);
  }
}
const Uo = /(Once|Passive|Capture)$/, Wo = /^on:?(?:Once|Passive|Capture)$/;
function zo(e) {
  let t, n;
  for (; (n = e.match(Uo)) && !Wo.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : mt(e.slice(2)), t];
}
let qn = 0;
const qo = /* @__PURE__ */ Promise.resolve(), Go = () => qn || (qo.then(() => qn = 0), qn = Date.now());
function Jo(e, t) {
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
        d && Ee(
          d,
          t,
          5,
          o
        );
      }
    } else
      Ee(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Go(), n;
}
const ci = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Yo = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? Lo(e, s, l) : t === "style" ? No(e, n, s) : _n(t) ? xn(t) || Ko(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Xo(e, t, s, l)) ? (li(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ri(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Zo(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ee(s))) ? li(e, Me(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), ri(e, t, s, l));
};
function Xo(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ci(t) && H(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return ci(t) && ee(n) ? !1 : t in e;
}
function Zo(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Me(t);
  return Array.isArray(n) ? n.some((i) => Me(i) === s) : Object.keys(n).some((i) => Me(i) === s);
}
const Qo = /* @__PURE__ */ re({ patchProp: Yo }, Eo);
let fi;
function ec() {
  return fi || (fi = io(Qo));
}
const tc = ((...e) => {
  const t = ec().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = sc(s);
    if (!i) return;
    const r = t._component;
    !H(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, nc(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function nc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function sc(e) {
  return ee(e) ? document.querySelector(e) : e;
}
const ic = ["aria-label"], rc = { key: 0 }, lc = { class: "muted-people" }, oc = ["x"], cc = ["x"], fc = { key: 1 }, uc = { key: 2 }, ac = { key: 3 }, dc = { key: 4 }, hc = { key: 5 }, pc = { key: 6 }, gc = { key: 7 }, mc = /* @__PURE__ */ Yi({
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
      e.scene === "crowd" ? (te(), ne("g", rc, [
        x("g", lc, [
          (te(), ne(xe, null, pn([16, 42, 68, 94, 120, 140], (s) => x("rect", {
            key: s,
            x: s,
            y: "42",
            width: "8",
            height: "8"
          }, null, 8, oc)), 64)),
          (te(), ne(xe, null, pn([13, 39, 65, 91, 117, 137], (s) => x("rect", {
            key: `b${s}`,
            x: s,
            y: "52",
            width: "14",
            height: "25"
          }, null, 8, cc)), 64))
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
      ])) : e.scene === "dog" ? (te(), ne("g", fc, [...n[3] || (n[3] = [
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
      ])])) : e.scene === "cactus" ? (te(), ne("g", uc, [...n[4] || (n[4] = [
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
      ])])) : e.scene === "park" ? (te(), ne("g", ac, [...n[5] || (n[5] = [
        sn('<path class="tree" d="M24 28h26v24H24zM17 39h40v19H17z"></path><rect class="trunk" x="33" y="58" width="8" height="24"></rect><path class="bench" d="M73 59h54v6H73zM78 49h44v8H78zM80 65h6v14h-6zM115 65h6v14h-6z"></path><rect class="point-a" x="84" y="41" width="7" height="7"></rect><rect class="point-b" x="106" y="41" width="7" height="7"></rect><rect class="ground" x="12" y="82" width="136" height="3"></rect>', 6)
      ])])) : e.scene === "track" ? (te(), ne("g", dc, [...n[6] || (n[6] = [
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
      ])])) : e.scene === "mountain" ? (te(), ne("g", hc, [...n[7] || (n[7] = [
        sn('<path class="mountain-back" d="M7 89L48 34l23 30 19-25 63 50z"></path><path class="mountain-front" d="M13 91l45-39 22 23 17-13 50 29z"></path><path class="path" d="M42 88l28-18 18 5 22-21"></path><rect class="point-a" x="68" y="66" width="7" height="7"></rect><rect class="point-b" x="106" y="49" width="7" height="7"></rect>', 5)
      ])])) : e.scene === "hotel" ? (te(), ne("g", pc, [...n[8] || (n[8] = [
        sn('<rect class="wall" x="27" y="14" width="106" height="83"></rect><rect class="door" x="57" y="28" width="46" height="69"></rect><rect class="door-line" x="62" y="34" width="36" height="58"></rect><rect class="point-a" x="49" y="57" width="7" height="7"></rect><rect class="point-b" x="108" y="57" width="7" height="7"></rect><rect class="handle" x="88" y="61" width="5" height="5"></rect>', 6)
      ])])) : (te(), ne("g", gc, [...n[9] || (n[9] = [
        sn('<rect class="balance-line" x="25" y="58" width="110" height="3"></rect><rect class="balance-mark" x="78" y="49" width="4" height="21"></rect><rect class="point-a" x="62" y="47" width="9" height="9"></rect><rect class="point-b" x="89" y="47" width="9" height="9"></rect><rect class="shadow-a" x="60" y="71" width="13" height="3"></rect><rect class="shadow-b" x="87" y="71" width="13" height="3"></rect>', 6)
      ])]))
    ], 8, ic));
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
function bc() {
  const e = window.AudioContext || window.webkitAudioContext;
  if (!e) return null;
  try {
    return new e();
  } catch {
    return null;
  }
}
function vc(e) {
  const t = e.createBuffer(1, 1, e.sampleRate), n = e.createBufferSource();
  n.buffer = t, n.connect(e.destination), n.start(0);
}
async function ui(e) {
  if (e.state === "closed") return !1;
  try {
    return vc(e), e.state !== "running" && await e.resume(), e.state === "running";
  } catch {
    return !1;
  }
}
function ai(e, t) {
  try {
    localStorage.setItem(e, String(t));
  } catch {
  }
}
const Gn = "our-secret-world:muted", Jn = 14.4, yc = [
  [0, 329.63, 1.8],
  [1.8, 392, 1.2],
  [3.6, 440, 2.1],
  [6.2, 392, 1.4],
  [8.2, 293.66, 1.8],
  [10.3, 329.63, 1.2],
  [12, 261.63, 2.1]
];
function _c() {
  const e = /* @__PURE__ */ cn(!1), t = /* @__PURE__ */ cn("idle");
  let n = null, s = null, i = null;
  try {
    e.value = localStorage.getItem(Gn) === "true", e.value && (t.value = "muted");
  } catch {
  }
  function r(h, _, C, L, O) {
    if (!n || !s) return;
    const j = n.createOscillator(), D = n.createGain(), y = n.createStereoPanner();
    j.type = "sine", j.frequency.value = _, y.pan.value = O, D.gain.setValueAtTime(1e-4, h), D.gain.exponentialRampToValueAtTime(L, h + 0.18), D.gain.exponentialRampToValueAtTime(1e-4, h + C), j.connect(D).connect(y).connect(s), j.start(h), j.stop(h + C + 0.05);
  }
  function l(h) {
    yc.forEach(([_, C, L], O) => {
      r(h + _, C, L, 0.15, O % 2 === 0 ? -0.32 : 0.32);
    }), r(h, 130.81, Jn - 0.5, 0.028, -0.18), r(h + 0.06, 196, Jn - 0.5, 0.022, 0.18);
  }
  async function o() {
    if (e.value)
      return t.value = "muted", !1;
    if (t.value = "starting", !n) {
      if (n = bc(), !n)
        return t.value = "blocked", !1;
      s = n.createGain(), s.gain.value = 0.34, s.connect(n.destination);
    }
    return await ui(n) ? i !== null ? (t.value = "playing", !0) : (l(n.currentTime + 0.1), i = window.setInterval(() => {
      (n == null ? void 0 : n.state) === "running" && l(n.currentTime + 0.1);
    }, Jn * 1e3), t.value = "playing", !0) : (t.value = "blocked", !1);
  }
  function c(h = "idle") {
    i !== null && window.clearInterval(i), i = null, n == null || n.close(), n = null, s = null, t.value = h;
  }
  async function d() {
    if (t.value === "playing" || t.value === "starting") {
      e.value = !0, ai(Gn, !0), c("muted");
      return;
    }
    e.value = !1, ai(Gn, !1), await o();
  }
  async function u() {
    if (document.visibilityState !== "visible" || e.value || !n || i === null) return;
    const h = await ui(n);
    t.value = h ? "playing" : "blocked";
  }
  return Pn(() => document.addEventListener("visibilitychange", u)), In(() => {
    c(), document.removeEventListener("visibilitychange", u);
  }), { muted: e, status: t, start: o, toggle: d };
}
const xc = {
  key: "entrance",
  class: "secret-entrance",
  "aria-labelledby": "secret-title"
}, wc = ["aria-label"], Sc = {
  key: "world",
  class: "secret-interface"
}, Cc = { class: "secret-toolbar" }, Tc = ["aria-label"], Ac = {
  key: "map",
  class: "secret-map",
  "aria-labelledby": "map-title"
}, Ec = { class: "map-heading" }, Mc = { class: "distance-chart" }, Oc = ["aria-label", "onClick"], Pc = { class: "chapter-visual" }, Ic = { class: "distance-meter" }, Rc = { "aria-label": "记录切换" }, Fc = ["disabled"], Lc = {
  key: "ending",
  class: "secret-ending",
  "aria-labelledby": "ending-title"
}, $c = /* @__PURE__ */ Yi({
  __name: "App",
  setup(e) {
    const t = /* @__PURE__ */ cn("entrance"), n = /* @__PURE__ */ cn(0), s = /* @__PURE__ */ Tn(/* @__PURE__ */ new Set()), i = It(() => ut[n.value]), { status: r, start: l, toggle: o } = _c(), c = It(
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
    function _() {
      t.value = "map";
    }
    function C(D) {
      n.value = D, s.add(ut[D].id), t.value = "chapter";
    }
    function L() {
      n.value > 0 && C(n.value - 1);
    }
    function O() {
      n.value < ut.length - 1 ? C(n.value + 1) : t.value = "ending";
    }
    function j(D) {
      D.key === "Escape" && t.value !== "entrance" && _(), t.value === "chapter" && (D.key === "ArrowLeft" && L(), D.key === "ArrowRight" && O());
    }
    return Pn(() => window.addEventListener("keydown", j)), In(() => window.removeEventListener("keydown", j)), (D, y) => (te(), ne("div", {
      class: Vt(["secret-world", `state-${t.value}`])
    }, [
      y[23] || (y[23] = x("div", {
        class: "secret-grain",
        "aria-hidden": "true"
      }, null, -1)),
      fe(Gs, {
        name: "secret-fade",
        mode: "out-in"
      }, {
        default: ts(() => [
          t.value === "entrance" ? (te(), ne("section", xc, [
            y[3] || (y[3] = x("header", null, [
              x("span", null, "未公开记录"),
              x("span", null, "仅凭链接进入")
            ], -1)),
            y[4] || (y[4] = x("div", {
              class: "entrance-signal",
              "aria-hidden": "true"
            }, [
              x("i"),
              x("span"),
              x("i")
            ], -1)),
            y[5] || (y[5] = x("p", null, "两个信号已建立连接", -1)),
            y[6] || (y[6] = x("h1", { id: "secret-title" }, "我们的秘密世界", -1)),
            y[7] || (y[7] = x("p", { class: "entrance-copy" }, "靠近，停下，再找到合适的距离。", -1)),
            x("button", {
              type: "button",
              class: "secret-button",
              onClick: h
            }, [...y[2] || (y[2] = [
              x("span", { "aria-hidden": "true" }, "●", -1),
              os(" 读取记录 ", -1)
            ])]),
            x("button", {
              type: "button",
              class: "entrance-sound",
              "aria-label": c.value,
              onClick: y[0] || (y[0] = //@ts-ignore
              (...F) => ze(o) && ze(o)(...F))
            }, ye(u.value), 9, wc)
          ])) : (te(), ne("main", Sc, [
            x("header", Cc, [
              x("button", {
                type: "button",
                onClick: _
              }, "返回轨迹"),
              y[8] || (y[8] = x("p", null, [
                x("i"),
                os(" 两个信号保持连接")
              ], -1)),
              x("button", {
                type: "button",
                "aria-label": c.value,
                onClick: y[1] || (y[1] = //@ts-ignore
                (...F) => ze(o) && ze(o)(...F))
              }, ye(d.value), 9, Tc)
            ]),
            fe(Gs, {
              name: "secret-shift",
              mode: "out-in"
            }, {
              default: ts(() => [
                t.value === "map" ? (te(), ne("section", Ac, [
                  x("div", Ec, [
                    y[9] || (y[9] = x("div", null, [
                      x("span", null, "八段未公开记录"),
                      x("h2", { id: "map-title" }, "距离的变化")
                    ], -1)),
                    x("p", null, ye(s.size) + " / " + ye(ze(ut).length) + " 已读取", 1)
                  ]),
                  x("div", Mc, [
                    y[11] || (y[11] = x("svg", {
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
                      onClick: (U) => C(M)
                    }, [
                      y[10] || (y[10] = x("span", null, [
                        x("i"),
                        x("i")
                      ], -1)),
                      x("strong", null, ye(F.label), 1),
                      x("small", null, ye(F.index), 1)
                    ], 14, Oc))), 128)),
                    y[12] || (y[12] = x("div", { class: "chart-note" }, [
                      x("span", null, "远"),
                      x("i"),
                      x("span", null, "近")
                    ], -1))
                  ]),
                  y[13] || (y[13] = x("p", { class: "map-instruction" }, "选择一个节点，读取当时留下的距离", -1))
                ])) : t.value === "chapter" ? (te(), ne("section", {
                  key: i.value.id,
                  class: "secret-chapter"
                }, [
                  x("div", Pc, [
                    x("header", null, [
                      x("span", null, ye(i.value.index), 1),
                      x("span", null, ye(i.value.label), 1)
                    ]),
                    fe(mc, {
                      scene: i.value.scene,
                      title: i.value.title
                    }, null, 8, ["scene", "title"]),
                    x("div", Ic, [
                      y[14] || (y[14] = x("span", null, "远", -1)),
                      x("div", null, [
                        x("i", {
                          style: jt({ width: `${100 - i.value.distance}%` })
                        }, null, 4)
                      ]),
                      y[15] || (y[15] = x("span", null, "近", -1))
                    ]),
                    y[16] || (y[16] = x("small", null, "仍然保留一格距离", -1))
                  ]),
                  x("article", null, [
                    x("span", null, "记录 " + ye(i.value.index) + " / " + ye(ze(ut).length.toString().padStart(2, "0")), 1),
                    x("h2", null, ye(i.value.title), 1),
                    x("div", null, [
                      (te(!0), ne(xe, null, pn(i.value.paragraphs, (F) => (te(), ne("p", { key: F }, ye(F), 1))), 128))
                    ]),
                    x("nav", Rc, [
                      x("button", {
                        type: "button",
                        disabled: n.value === 0,
                        onClick: L
                      }, "上一段", 8, Fc),
                      x("button", {
                        type: "button",
                        onClick: _
                      }, "查看轨迹"),
                      x("button", {
                        type: "button",
                        onClick: O
                      }, ye(n.value === ze(ut).length - 1 ? "读完" : "下一段"), 1)
                    ])
                  ])
                ])) : (te(), ne("section", Lc, [
                  y[18] || (y[18] = x("div", {
                    class: "ending-points",
                    "aria-hidden": "true"
                  }, [
                    x("i"),
                    x("span"),
                    x("i")
                  ], -1)),
                  y[19] || (y[19] = x("p", null, "距离记录 / 已保存", -1)),
                  y[20] || (y[20] = x("h2", { id: "ending-title" }, "有些关系不需要答案", -1)),
                  y[21] || (y[21] = x("p", null, "谢谢你曾经在人海里看见我，也谢谢我们都没有让这份理解失去边界。", -1)),
                  y[22] || (y[22] = x("strong", null, "七夕快乐", -1)),
                  x("div", null, [
                    x("button", {
                      type: "button",
                      class: "secret-button",
                      onClick: _
                    }, "再次查看"),
                    y[17] || (y[17] = x("a", { href: "/" }, "离开这里", -1))
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
}), di = document.querySelector("#our-secret-world-app");
di && tc($c).mount(di);
