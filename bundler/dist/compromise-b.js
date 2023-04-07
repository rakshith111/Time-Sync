(() => {
  "use strict";
  const e = {
      methods: { one: {}, two: {}, three: {}, four: {} },
      model: { one: {}, two: {}, three: {} },
      compute: {},
      hooks: [],
    },
    t = {
      compute: function (e) {
        const { world: t } = this,
          n = t.compute;
        return (
          "string" == typeof e && n.hasOwnProperty(e)
            ? n[e](this)
            : ((e) => "[object Array]" === Object.prototype.toString.call(e))(e)
            ? e.forEach((a) => {
                t.compute.hasOwnProperty(a)
                  ? n[a](this)
                  : console.warn("no compute:", e);
              })
            : "function" == typeof e
            ? e(this)
            : console.warn("no compute:", e),
          this
        );
      },
    },
    n = t,
    a = {
      forEach: function (e) {
        return (
          this.fullPointer.forEach((t, n) => {
            let a = this.update([t]);
            e(a, n);
          }),
          this
        );
      },
      map: function (e, t) {
        let n = this.fullPointer.map((t, n) => {
          let a = this.update([t]),
            r = e(a, n);
          return void 0 === r ? this.none() : r;
        });
        if (0 === n.length) return t || this.update([]);
        if (void 0 !== n[0]) {
          if ("string" == typeof n[0]) return n;
          if ("object" == typeof n[0] && (null === n[0] || !n[0].isView))
            return n;
        }
        let a = [];
        return (
          n.forEach((e) => {
            a = a.concat(e.fullPointer);
          }),
          this.toView(a)
        );
      },
      filter: function (e) {
        let t = this.fullPointer;
        return (
          (t = t.filter((t, n) => {
            let a = this.update([t]);
            return e(a, n);
          })),
          this.update(t)
        );
      },
      find: function (e) {
        let t = this.fullPointer.find((t, n) => {
          let a = this.update([t]);
          return e(a, n);
        });
        return this.update([t]);
      },
      some: function (e) {
        return this.fullPointer.some((t, n) => {
          let a = this.update([t]);
          return e(a, n);
        });
      },
      random: function (e = 1) {
        let t = this.fullPointer,
          n = Math.floor(Math.random() * t.length);
        return (
          n + e > this.length && ((n = this.length - e), (n = n < 0 ? 0 : n)),
          (t = t.slice(n, n + e)),
          this.update(t)
        );
      },
    },
    r = {
      termList: function () {
        return this.methods.one.termList(this.docs);
      },
      terms: function (e) {
        let t = this.match(".");
        return "number" == typeof e ? t.eq(e) : t;
      },
      groups: function (e) {
        if (e || 0 === e) return this.update(this._groups[e] || []);
        let t = {};
        return (
          Object.keys(this._groups).forEach((e) => {
            t[e] = this.update(this._groups[e]);
          }),
          t
        );
      },
      eq: function (e) {
        let t = this.pointer;
        return (
          t || (t = this.docs.map((e, t) => [t])),
          t[e] ? this.update([t[e]]) : this.none()
        );
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        let e = this.fullPointer.length - 1;
        return this.eq(e);
      },
      firstTerms: function () {
        return this.match("^.");
      },
      lastTerms: function () {
        return this.match(".$");
      },
      slice: function (e, t) {
        let n = this.pointer || this.docs.map((e, t) => [t]);
        return (n = n.slice(e, t)), this.update(n);
      },
      all: function () {
        return this.update().toView();
      },
      fullSentences: function () {
        let e = this.fullPointer.map((e) => [e[0]]);
        return this.update(e).toView();
      },
      none: function () {
        return this.update([]);
      },
      isDoc: function (e) {
        if (!e || !e.isView) return !1;
        let t = this.fullPointer,
          n = e.fullPointer;
        return (
          !t.length !== n.length &&
          t.every(
            (e, t) =>
              !!n[t] && e[0] === n[t][0] && e[1] === n[t][1] && e[2] === n[t][2]
          )
        );
      },
      wordCount: function () {
        return this.docs.reduce(
          (e, t) => ((e += t.filter((e) => "" !== e.text).length), e),
          0
        );
      },
      isFull: function () {
        let e = this.pointer;
        if (!e) return !0;
        let t = this.document;
        for (let n = 0; n < e.length; n += 1) {
          let [a, r, o] = e[n];
          if (a !== n || 0 !== r) return !1;
          if (t[a].length > o) return !1;
        }
        return !0;
      },
      getNth: function (e) {
        return "number" == typeof e
          ? this.eq(e)
          : "string" == typeof e
          ? this.if(e)
          : this;
      },
    };
  (r.group = r.groups),
    (r.fullSentence = r.fullSentences),
    (r.sentence = r.fullSentences),
    (r.lastTerm = r.lastTerms),
    (r.firstTerm = r.firstTerms);
  const o = r,
    i = Object.assign({}, o, n, a);
  i.get = i.eq;
  const s = i;
  class l {
    constructor(t, n, a = {}) {
      [
        ["document", t],
        ["world", e],
        ["_groups", a],
        ["_cache", null],
        ["viewType", "View"],
      ].forEach((e) => {
        Object.defineProperty(this, e[0], { value: e[1], writable: !0 });
      }),
        (this.ptrs = n);
    }
    get docs() {
      let t = this.document;
      return (
        this.ptrs && (t = e.methods.one.getDoc(this.ptrs, this.document)), t
      );
    }
    get pointer() {
      return this.ptrs;
    }
    get methods() {
      return this.world.methods;
    }
    get model() {
      return this.world.model;
    }
    get hooks() {
      return this.world.hooks;
    }
    get isView() {
      return !0;
    }
    get found() {
      return this.docs.length > 0;
    }
    get length() {
      return this.docs.length;
    }
    get fullPointer() {
      let { docs: e, ptrs: t, document: n } = this,
        a = t || e.map((e, t) => [t]);
      return a.map((e) => {
        let [t, a, r, o, i] = e;
        return (
          (a = a || 0),
          (r = r || (n[t] || []).length),
          n[t] &&
            n[t][a] &&
            ((o = o || n[t][a].id), n[t][r - 1] && (i = i || n[t][r - 1].id)),
          [t, a, r, o, i]
        );
      });
    }
    update(e) {
      let t = new l(this.document, e);
      if (this._cache && e && e.length > 0) {
        let n = [];
        e.forEach((e, t) => {
          let [a, r, o] = e;
          (1 === e.length || (0 === r && this.document[a].length === o)) &&
            (n[t] = this._cache[a]);
        }),
          n.length > 0 && (t._cache = n);
      }
      return (t.world = this.world), t;
    }
    toView(e) {
      return new l(this.document, e || this.pointer);
    }
    fromText(e) {
      const { methods: t } = this;
      let n = t.one.tokenize.fromString(e, this.world),
        a = new l(n);
      return (
        (a.world = this.world),
        a.compute(["normal", "lexicon"]),
        this.world.compute.preTagger && a.compute("preTagger"),
        a
      );
    }
    clone() {
      let e = this.document.slice(0);
      e = e.map((e) =>
        e.map((e) => (((e = Object.assign({}, e)).tags = new Set(e.tags)), e))
      );
      let t = this.update(this.pointer);
      return (t.document = e), (t._cache = this._cache), t;
    }
  }
  Object.assign(l.prototype, s);
  const u = l,
    c = function (e) {
      return e && "object" == typeof e && !Array.isArray(e);
    };
  function h(e, t) {
    if (c(t))
      for (const n in t)
        c(t[n])
          ? (e[n] || Object.assign(e, { [n]: {} }), h(e[n], t[n]))
          : Object.assign(e, { [n]: t[n] });
    return e;
  }
  const d = function (e, t, n, a) {
      const { methods: r, model: o, compute: i, hooks: s } = t;
      e.methods &&
        (function (e, t) {
          for (const n in t) (e[n] = e[n] || {}), Object.assign(e[n], t[n]);
        })(r, e.methods),
        e.model && h(o, e.model),
        e.irregulars &&
          (function (e, t) {
            let n = e.two.models || {};
            Object.keys(t).forEach((e) => {
              t[e].pastTense &&
                (n.toPast && (n.toPast.exceptions[e] = t[e].pastTense),
                n.fromPast && (n.fromPast.exceptions[t[e].pastTense] = e)),
                t[e].presentTense &&
                  (n.toPresent &&
                    (n.toPresent.exceptions[e] = t[e].presentTense),
                  n.fromPresent &&
                    (n.fromPresent.exceptions[t[e].presentTense] = e)),
                t[e].gerund &&
                  (n.toGerund && (n.toGerund.exceptions[e] = t[e].gerund),
                  n.fromGerund && (n.fromGerund.exceptions[t[e].gerund] = e)),
                t[e].comparative &&
                  (n.toComparative &&
                    (n.toComparative.exceptions[e] = t[e].comparative),
                  n.fromComparative &&
                    (n.fromComparative.exceptions[t[e].comparative] = e)),
                t[e].superlative &&
                  (n.toSuperlative &&
                    (n.toSuperlative.exceptions[e] = t[e].superlative),
                  n.fromSuperlative &&
                    (n.fromSuperlative.exceptions[t[e].superlative] = e));
            });
          })(o, e.irregulars),
        e.compute && Object.assign(i, e.compute),
        s && (t.hooks = s.concat(e.hooks || [])),
        e.api && e.api(n),
        e.lib && Object.keys(e.lib).forEach((t) => (a[t] = e.lib[t])),
        e.tags && a.addTags(e.tags),
        e.words && a.addWords(e.words),
        e.mutate && e.mutate(t);
    },
    m = function (e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    },
    p = function (e, t, n) {
      const { methods: a } = n;
      let r = new t([]);
      if (((r.world = n), "number" == typeof e && (e = String(e)), !e))
        return r;
      if ("string" == typeof e) return new t(a.one.tokenize.fromString(e, n));
      if (
        ((o = e),
        "[object Object]" === Object.prototype.toString.call(o) && e.isView)
      )
        return new t(e.document, e.ptrs);
      var o;
      if (m(e)) {
        if (m(e[0])) {
          let n = e.map((e) =>
            e.map((e) => ({
              text: e,
              normal: e,
              pre: "",
              post: " ",
              tags: new Set(),
            }))
          );
          return new t(n);
        }
        let n = (function (e) {
          return e.map((e) =>
            e.terms.map((e) => (m(e.tags) && (e.tags = new Set(e.tags)), e))
          );
        })(e);
        return new t(n);
      }
      return r;
    };
  let g = Object.assign({}, e);
  const f = function (e, t) {
    t && f.addWords(t);
    let n = p(e, u, g);
    return e && n.compute(g.hooks), n;
  };
  Object.defineProperty(f, "_world", { value: g, writable: !0 }),
    (f.tokenize = function (e, t) {
      const { compute: n } = this._world;
      t && f.addWords(t);
      let a = p(e, u, g);
      return (
        n.contractions &&
          a.compute(["alias", "normal", "machine", "contractions"]),
        a
      );
    }),
    (f.plugin = function (e) {
      return d(e, this._world, u, this), this;
    }),
    (f.extend = f.plugin),
    (f.world = function () {
      return this._world;
    }),
    (f.model = function () {
      return this._world.model;
    }),
    (f.methods = function () {
      return this._world.methods;
    }),
    (f.hooks = function () {
      return this._world.hooks;
    }),
    (f.verbose = function (e) {
      const t =
        "undefined" != typeof process && process.env
          ? process.env
          : self.env || {};
      return (
        (t.DEBUG_TAGS = "tagger" === e || !0 === e || ""),
        (t.DEBUG_MATCH = "match" === e || !0 === e || ""),
        (t.DEBUG_CHUNKS = "chunker" === e || !0 === e || ""),
        this
      );
    }),
    (f.version = "14.8.2");
  const y = f,
    b = {
      cache: function () {
        return (this._cache = this.methods.one.cacheDoc(this.document)), this;
      },
      uncache: function () {
        return (this._cache = null), this;
      },
    },
    v = {
      api: function (e) {
        Object.assign(e.prototype, b);
      },
      compute: {
        cache: function (e) {
          e._cache = e.methods.one.cacheDoc(e.document);
        },
      },
      methods: {
        one: {
          cacheDoc: function (e) {
            let t = e.map((e) => {
              let t = new Set();
              return (
                e.forEach((e) => {
                  "" !== e.normal && t.add(e.normal),
                    e.switch && t.add(`%${e.switch}%`),
                    e.implicit && t.add(e.implicit),
                    e.machine && t.add(e.machine),
                    e.root && t.add(e.root),
                    e.alias && e.alias.forEach((e) => t.add(e));
                  let n = Array.from(e.tags);
                  for (let e = 0; e < n.length; e += 1) t.add("#" + n[e]);
                }),
                t
              );
            });
            return t;
          },
        },
      },
    },
    w = (e) => /^\p{Lu}[\p{Ll}'’]/u.test(e) || /^\p{Lu}$/u.test(e),
    k = (e, t, n) => {
      if ((n.forEach((e) => (e.dirty = !0)), e)) {
        let a = [t, 0].concat(n);
        Array.prototype.splice.apply(e, a);
      }
      return e;
    },
    P = function (e) {
      let t = e[e.length - 1];
      !t || / $/.test(t.post) || /[-–—]/.test(t.post) || (t.post += " ");
    },
    j = (e, t, n) => {
      const a = /[-.?!,;:)–—'"]/g;
      let r = e[t - 1];
      if (!r) return;
      let o = r.post;
      if (a.test(o)) {
        let e = o.match(a).join(""),
          t = n[n.length - 1];
        (t.post = e + t.post), (r.post = r.post.replace(a, ""));
      }
    };
  let A = 0;
  const x = (e) => ((e = e.length < 3 ? "0" + e : e).length < 3 ? "0" + e : e),
    D = function (e) {
      let [t, n] = e.index || [0, 0];
      (A += 1),
        (A = A > 46655 ? 0 : A),
        (t = t > 46655 ? 0 : t),
        (n = n > 1294 ? 0 : n);
      let a = x(A.toString(36));
      a += x(t.toString(36));
      let r = n.toString(36);
      return (
        (r = r.length < 2 ? "0" + r : r),
        (a += r),
        (a += parseInt(36 * Math.random(), 10).toString(36)),
        e.normal + "|" + a.toUpperCase()
      );
    },
    I = function (e) {
      e.has("@hasContraction") &&
        "function" == typeof e.contractions &&
        e.grow("@hasContraction").contractions().expand();
    },
    N = (e) => "[object Array]" === Object.prototype.toString.call(e),
    E = function (e, t, n) {
      const { document: a, world: r } = t;
      t.uncache();
      let o = t.fullPointer,
        i = t.fullPointer;
      t.forEach((s, l) => {
        let u = s.fullPointer[0],
          [c] = u,
          h = a[c],
          d = (function (e, t) {
            const { methods: n } = t;
            return "string" == typeof e
              ? n.one.tokenize.fromString(e, t)[0]
              : "object" == typeof e && e.isView
              ? e.clone().docs[0] || []
              : N(e)
              ? N(e[0])
                ? e[0]
                : e
              : [];
          })(e, r);
        0 !== d.length &&
          ((d = (function (e) {
            return e.map((e) => ((e.id = D(e)), e));
          })(d)),
          n
            ? (I(t.update([u]).firstTerm()),
              (function (e, t, n, a) {
                let [r, o, i] = t;
                0 === o || i === a[r].length ? P(n) : (P(n), P([e[t[1]]])),
                  (function (e, t, n) {
                    let a = e[t];
                    if (0 !== t || !w(a.text)) return;
                    n[0].text = n[0].text.replace(/^\p{Ll}/u, (e) =>
                      e.toUpperCase()
                    );
                    let r = e[t];
                    r.tags.has("ProperNoun") ||
                      r.tags.has("Acronym") ||
                      (w(r.text) &&
                        r.text.length > 1 &&
                        (r.text = r.text.replace(/^\p{Lu}/u, (e) =>
                          e.toLowerCase()
                        )));
                  })(e, o, n),
                  k(e, o, n);
              })(h, u, d, a))
            : (I(t.update([u]).lastTerm()),
              (function (e, t, n, a) {
                let [r, , o] = t,
                  i = (a[r] || []).length;
                o < i
                  ? (j(e, o, n), P(n))
                  : i === o &&
                    (P(e),
                    j(e, o, n),
                    a[r + 1] && (n[n.length - 1].post += " ")),
                  k(e, t[2], n),
                  (t[4] = n[n.length - 1].id);
              })(h, u, d, a)),
          a[c] && a[c][u[1]] && (u[3] = a[c][u[1]].id),
          (i[l] = u),
          (u[2] += d.length),
          (o[l] = u));
      });
      let s = t.toView(o);
      return (
        (t.ptrs = i),
        s.compute(["id", "index", "lexicon"]),
        s.world.compute.preTagger && s.compute("preTagger"),
        s
      );
    },
    T = {
      insertAfter: function (e) {
        return E(e, this, !1);
      },
      insertBefore: function (e) {
        return E(e, this, !0);
      },
    };
  (T.append = T.insertAfter),
    (T.prepend = T.insertBefore),
    (T.insert = T.insertAfter);
  const O = T,
    C = /\$[0-9a-z]+/g,
    V = {
      replaceWith: function (e, t = {}) {
        let n = this.fullPointer,
          a = this;
        if ((this.uncache(), "function" == typeof e))
          return (function (e, t) {
            return (
              e.forEach((e) => {
                let n = t(e);
                e.replaceWith(n);
              }),
              e
            );
          })(a, e);
        e = (function (e, t) {
          if ("string" != typeof e) return e;
          let n = t.groups();
          return (
            (e = e.replace(C, (e) => {
              let t = e.replace(/\$/, "");
              return n.hasOwnProperty(t) ? n[t].text() : e;
            })),
            e
          );
        })(e, a);
        let r = this.update(n);
        n = n.map((e) => e.slice(0, 3));
        let o = (r.docs[0] || []).map((e) => Array.from(e.tags));
        "string" == typeof e && (e = this.fromText(e).compute("id")),
          a.insertAfter(e),
          r.has("@hasContraction") &&
            a.contractions &&
            a.grow("@hasContraction+").contractions().expand(),
          a.delete(r);
        let i = a.toView(n).compute(["index", "lexicon"]);
        return (
          i.world.compute.preTagger && i.compute("preTagger"),
          t.tags &&
            i.terms().forEach((e, t) => {
              e.tagSafe(o[t]);
            }),
          t.case &&
            i.docs[0] &&
            i.docs[0][0] &&
            0 === i.docs[0][0].index[1] &&
            (i.docs[0][0].text = i.docs[0][0].text.replace(
              /\w\S*/g,
              (e) => e.charAt(0).toUpperCase() + e.substring(1).toLowerCase()
            )),
          i
        );
      },
      replace: function (e, t, n) {
        if (e && !t) return this.replaceWith(e, n);
        let a = this.match(e);
        return a.found ? (this.soften(), a.replaceWith(t, n)) : this;
      },
    },
    z = V,
    $ = {
      remove: function (e) {
        const { indexN: t } = this.methods.one.pointer;
        this.uncache();
        let n = this.all(),
          a = this;
        e && ((n = this), (a = this.match(e)));
        let r = !n.ptrs;
        a.has("@hasContraction") &&
          a.contractions &&
          a.grow("@hasContraction").contractions().expand();
        let o = n.fullPointer,
          i = a.fullPointer.reverse(),
          s = (function (e, t) {
            t.forEach((t) => {
              let [n, a, r] = t,
                o = r - a;
              e[n] &&
                (r === e[n].length &&
                  r > 1 &&
                  (function (e, t) {
                    let n = e.length - 1,
                      a = e[n],
                      r = e[n - t];
                    r &&
                      a &&
                      ((r.post += a.post),
                      (r.post = r.post.replace(/ +([.?!,;:])/, "$1")),
                      (r.post = r.post.replace(/[,;:]+([.?!])/, "$1")));
                  })(e[n], o),
                e[n].splice(a, o));
            });
            for (let t = e.length - 1; t >= 0; t -= 1)
              if (
                0 === e[t].length &&
                (e.splice(t, 1), t === e.length && e[t - 1])
              ) {
                let n = e[t - 1],
                  a = n[n.length - 1];
                a && (a.post = a.post.trimEnd());
              }
            return e;
          })(this.document, i);
        return (
          (o = (function (e, t) {
            return (
              (e = e.map((e) => {
                let [n] = e;
                return t[n]
                  ? (t[n].forEach((t) => {
                      let n = t[2] - t[1];
                      e[1] <= t[1] && e[2] >= t[2] && (e[2] -= n);
                    }),
                    e)
                  : e;
              })),
              e.forEach((t, n) => {
                if (0 === t[1] && 0 == t[2])
                  for (let t = n + 1; t < e.length; t += 1)
                    (e[t][0] -= 1), e[t][0] < 0 && (e[t][0] = 0);
              }),
              (e = (e = e.filter((e) => e[2] - e[1] > 0)).map(
                (e) => ((e[3] = null), (e[4] = null), e)
              ))
            );
          })(o, t(i))),
          (n.ptrs = o),
          (n.document = s),
          n.compute("index"),
          r && (n.ptrs = void 0),
          e ? n.toView(o) : ((this.ptrs = []), n.none())
        );
      },
    };
  $.delete = $.remove;
  const F = $,
    B = {
      pre: function (e, t) {
        return void 0 === e && this.found
          ? this.docs[0][0].pre
          : (this.docs.forEach((n) => {
              let a = n[0];
              !0 === t ? (a.pre += e) : (a.pre = e);
            }),
            this);
      },
      post: function (e, t) {
        if (void 0 === e) {
          let e = this.docs[this.docs.length - 1];
          return e[e.length - 1].post;
        }
        return (
          this.docs.forEach((n) => {
            let a = n[n.length - 1];
            !0 === t ? (a.post += e) : (a.post = e);
          }),
          this
        );
      },
      trim: function () {
        if (!this.found) return this;
        let e = this.docs,
          t = e[0][0];
        t.pre = t.pre.trimStart();
        let n = e[e.length - 1],
          a = n[n.length - 1];
        return (a.post = a.post.trimEnd()), this;
      },
      hyphenate: function () {
        return (
          this.docs.forEach((e) => {
            e.forEach((t, n) => {
              0 !== n && (t.pre = ""), e[n + 1] && (t.post = "-");
            });
          }),
          this
        );
      },
      dehyphenate: function () {
        const e = /[-–—]/;
        return (
          this.docs.forEach((t) => {
            t.forEach((t) => {
              e.test(t.post) && (t.post = " ");
            });
          }),
          this
        );
      },
      toQuotations: function (e, t) {
        return (
          (e = e || '"'),
          (t = t || '"'),
          this.docs.forEach((n) => {
            n[0].pre = e + n[0].pre;
            let a = n[n.length - 1];
            a.post = t + a.post;
          }),
          this
        );
      },
      toParentheses: function (e, t) {
        return (
          (e = e || "("),
          (t = t || ")"),
          this.docs.forEach((n) => {
            n[0].pre = e + n[0].pre;
            let a = n[n.length - 1];
            a.post = t + a.post;
          }),
          this
        );
      },
    };
  (B.deHyphenate = B.dehyphenate), (B.toQuotation = B.toQuotations);
  const M = B,
    S = {
      alpha: (e, t) => (e.normal < t.normal ? -1 : e.normal > t.normal ? 1 : 0),
      length: (e, t) => {
        let n = e.normal.trim().length,
          a = t.normal.trim().length;
        return n < a ? 1 : n > a ? -1 : 0;
      },
      wordCount: (e, t) => (e.words < t.words ? 1 : e.words > t.words ? -1 : 0),
      sequential: (e, t) =>
        e[0] < t[0] ? 1 : e[0] > t[0] ? -1 : e[1] > t[1] ? 1 : -1,
      byFreq: function (e) {
        let t = {};
        return (
          e.forEach((e) => {
            (t[e.normal] = t[e.normal] || 0), (t[e.normal] += 1);
          }),
          e.sort((e, n) => {
            let a = t[e.normal],
              r = t[n.normal];
            return a < r ? 1 : a > r ? -1 : 0;
          }),
          e
        );
      },
    },
    G = new Set([
      "index",
      "sequence",
      "seq",
      "sequential",
      "chron",
      "chronological",
    ]),
    L = new Set(["freq", "frequency", "topk", "repeats"]),
    H = new Set(["alpha", "alphabetical"]),
    q = {
      unique: function () {
        let e = new Set(),
          t = this.filter((t) => {
            let n = t.text("machine");
            return !e.has(n) && (e.add(n), !0);
          });
        return t;
      },
      reverse: function () {
        let e = this.pointer || this.docs.map((e, t) => [t]);
        return (
          (e = [].concat(e)),
          (e = e.reverse()),
          this._cache && (this._cache = this._cache.reverse()),
          this.update(e)
        );
      },
      sort: function (e) {
        let { docs: t, pointer: n } = this;
        if ((this.uncache(), "function" == typeof e))
          return (function (e, t) {
            let n = e.fullPointer;
            return (
              (n = n.sort(
                (n, a) => ((n = e.update([n])), (a = e.update([a])), t(n, a))
              )),
              (e.ptrs = n),
              e
            );
          })(this, e);
        e = e || "alpha";
        let a = n || t.map((e, t) => [t]),
          r = t.map((e, t) => ({
            index: t,
            words: e.length,
            normal: e.map((e) => e.machine || e.normal || "").join(" "),
            pointer: a[t],
          }));
        return (
          G.has(e) && (e = "sequential"),
          H.has(e) && (e = "alpha"),
          L.has(e)
            ? ((r = S.byFreq(r)), this.update(r.map((e) => e.pointer)))
            : "function" == typeof S[e]
            ? ((r = r.sort(S[e])), this.update(r.map((e) => e.pointer)))
            : this
        );
      },
    },
    W = function (e, t) {
      if (e.length > 0) {
        let t = e[e.length - 1],
          n = t[t.length - 1];
        !1 === / /.test(n.post) && (n.post += " ");
      }
      return e.concat(t);
    },
    J = {
      concat: function (e) {
        if ("string" == typeof e) {
          let t = this.fromText(e);
          if (this.found && this.ptrs) {
            let e = this.fullPointer,
              n = e[e.length - 1][0];
            this.document.splice(n, 0, ...t.document);
          } else this.document = this.document.concat(t.document);
          return this.all().compute("index");
        }
        if ("object" == typeof e && e.isView)
          return (function (e, t) {
            if (e.document === t.document) {
              let n = e.fullPointer.concat(t.fullPointer);
              return e.toView(n).compute("index");
            }
            return (
              t.fullPointer.forEach((t) => {
                t[0] += e.document.length;
              }),
              (e.document = W(e.document, t.docs)),
              e.all()
            );
          })(this, e);
        if (((t = e), "[object Array]" === Object.prototype.toString.call(t))) {
          let t = W(this.document, e);
          return (this.document = t), this.all();
        }
        var t;
        return this;
      },
    },
    _ = Object.assign(
      {},
      {
        toLowerCase: function () {
          return (
            this.termList().forEach((e) => {
              e.text = e.text.toLowerCase();
            }),
            this
          );
        },
        toUpperCase: function () {
          return (
            this.termList().forEach((e) => {
              e.text = e.text.toUpperCase();
            }),
            this
          );
        },
        toTitleCase: function () {
          return (
            this.termList().forEach((e) => {
              e.text = e.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e) =>
                e.toUpperCase()
              );
            }),
            this
          );
        },
        toCamelCase: function () {
          return (
            this.docs.forEach((e) => {
              e.forEach((t, n) => {
                0 !== n &&
                  (t.text = t.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e) =>
                    e.toUpperCase()
                  )),
                  n !== e.length - 1 && (t.post = "");
              });
            }),
            this
          );
        },
      },
      O,
      z,
      F,
      M,
      q,
      J,
      {
        harden: function () {
          return (this.ptrs = this.fullPointer), this;
        },
        soften: function () {
          let e = this.ptrs;
          return (
            !e ||
              e.length < 1 ||
              ((e = e.map((e) => e.slice(0, 3))), (this.ptrs = e)),
            this
          );
        },
      }
    ),
    K = {
      id: function (e) {
        let t = e.docs;
        for (let e = 0; e < t.length; e += 1)
          for (let n = 0; n < t[e].length; n += 1) {
            let a = t[e][n];
            a.id = a.id || D(a);
          }
      },
    },
    U = {
      api: function (e) {
        Object.assign(e.prototype, _);
      },
      compute: K,
    },
    R = function (e, t, n) {
      let [a, r] = t;
      n &&
        0 !== n.length &&
        ((n = n.map(
          (e, t) => (
            (e.implicit = e.text),
            (e.machine = e.text),
            (e.pre = ""),
            (e.post = ""),
            (e.text = ""),
            (e.normal = ""),
            (e.index = [a, r + t]),
            e
          )
        )),
        n[0] &&
          ((n[0].pre = e[a][r].pre),
          (n[n.length - 1].post = e[a][r].post),
          (n[0].text = e[a][r].text),
          (n[0].normal = e[a][r].normal)),
        e[a].splice(r, 1, ...n));
    },
    Y = /'/,
    Q = new Set(["what", "how", "when", "where", "why"]),
    Z = new Set(["be", "go", "start", "think", "need"]),
    X = new Set(["been", "gone"]),
    ee = /'/,
    te = /^([0-9.]{1,4}[a-z]{0,2}) ?[-–—] ?([0-9]{1,4}[a-z]{0,2})$/i,
    ne =
      /^([0-9]{1,2}(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9]{1,2}(:[0-9][0-9])?(am|pm)?)$/i,
    ae = /^[0-9]{3}-[0-9]{4}$/,
    re = function (e, t) {
      let n = e[t],
        a = n.text.match(te);
      return null !== a
        ? !0 === n.tags.has("PhoneNumber") || ae.test(n.text)
          ? null
          : [a[1], "to", a[2]]
        : ((a = n.text.match(ne)), null !== a ? [a[1], "to", a[4]] : null);
    },
    oe = /^([+-]?[0-9][.,0-9]*)([a-z°²³µ/]+)$/,
    ie = new Set(["st", "nd", "rd", "th", "am", "pm", "max", "°", "s", "e"]),
    se = function (e, t) {
      let n = e[t].text.match(oe);
      if (null !== n) {
        let e = n[2].toLowerCase().trim();
        return ie.has(e) ? null : [n[1], e];
      }
      return null;
    },
    le = /'/,
    ue = /^[0-9][^-–—]*[-–—].*?[0-9]/,
    ce = function (e, t, n, a) {
      let r = t.update();
      r.document = [e];
      let o = n + a;
      n > 0 && (n -= 1), e[o] && (o += 1), (r.ptrs = [[0, n, o]]);
    },
    he = {
      t: (e, t) =>
        (function (e, t) {
          return "ain't" === e[t].normal || "aint" === e[t].normal
            ? null
            : [e[t].normal.replace(/n't/, ""), "not"];
        })(e, t),
      d: (e, t) =>
        (function (e, t) {
          let n = e[t].normal.split(Y)[0];
          if (Q.has(n)) return [n, "did"];
          if (e[t + 1]) {
            if (X.has(e[t + 1].normal)) return [n, "had"];
            if (Z.has(e[t + 1].normal)) return [n, "would"];
          }
          return null;
        })(e, t),
    },
    de = {
      j: (e, t) => ((e, t) => ["je", e[t].normal.split(ee)[1]])(e, t),
      l: (e, t) =>
        ((e, t) => {
          let n = e[t].normal.split(ee)[1];
          return n && n.endsWith("e") ? ["la", n] : ["le", n];
        })(e, t),
      d: (e, t) =>
        ((e, t) => {
          let n = e[t].normal.split(ee)[1];
          return n && n.endsWith("e")
            ? ["du", n]
            : n && n.endsWith("s")
            ? ["des", n]
            : ["de", n];
        })(e, t),
    },
    me = function (e, t, n, a) {
      for (let r = 0; r < e.length; r += 1) {
        let o = e[r];
        if (o.word === t.normal) return o.out;
        if (null !== a && a === o.after) return [n].concat(o.out);
        if (null !== n && n === o.before) return o.out.concat(a);
      }
      return null;
    },
    pe = function (e, t) {
      let n = t.fromText(e.join(" "));
      return n.compute(["id", "alias"]), n.docs[0];
    },
    ge = {
      model: {
        one: {
          contractions: [
            { word: "@", out: ["at"] },
            { word: "alot", out: ["a", "lot"] },
            { word: "brb", out: ["be", "right", "back"] },
            { word: "cannot", out: ["can", "not"] },
            { word: "cant", out: ["can", "not"] },
            { word: "dont", out: ["do", "not"] },
            { word: "dun", out: ["do", "not"] },
            { word: "wont", out: ["will", "not"] },
            { word: "can't", out: ["can", "not"] },
            { word: "shan't", out: ["should", "not"] },
            { word: "won't", out: ["will", "not"] },
            { word: "that's", out: ["that", "is"] },
            { word: "what's", out: ["what", "is"] },
            { word: "let's", out: ["let", "us"] },
            { word: "there's", out: ["there", "is"] },
            { word: "dunno", out: ["do", "not", "know"] },
            { word: "gonna", out: ["going", "to"] },
            { word: "gotta", out: ["have", "got", "to"] },
            { word: "gimme", out: ["give", "me"] },
            { word: "tryna", out: ["trying", "to"] },
            { word: "gtg", out: ["got", "to", "go"] },
            { word: "im", out: ["i", "am"] },
            { word: "imma", out: ["I", "will"] },
            { word: "imo", out: ["in", "my", "opinion"] },
            { word: "irl", out: ["in", "real", "life"] },
            { word: "ive", out: ["i", "have"] },
            { word: "rn", out: ["right", "now"] },
            { word: "tbh", out: ["to", "be", "honest"] },
            { word: "wanna", out: ["want", "to"] },
            { word: "c'mere", out: ["come", "here"] },
            { word: "c'mon", out: ["come", "on"] },
            { word: "howd", out: ["how", "did"] },
            { word: "whatd", out: ["what", "did"] },
            { word: "whend", out: ["when", "did"] },
            { word: "whered", out: ["where", "did"] },
            { word: "shoulda", out: ["should", "have"] },
            { word: "coulda", out: ["coulda", "have"] },
            { word: "woulda", out: ["woulda", "have"] },
            { word: "musta", out: ["must", "have"] },
            { word: "tis", out: ["it", "is"] },
            { word: "twas", out: ["it", "was"] },
            { word: "y'know", out: ["you", "know"] },
            { word: "ne'er", out: ["never"] },
            { word: "o'er", out: ["over"] },
            { after: "ll", out: ["will"] },
            { after: "ve", out: ["have"] },
            { after: "re", out: ["are"] },
            { after: "m", out: ["am"] },
            { before: "c", out: ["ce"] },
            { before: "m", out: ["me"] },
            { before: "n", out: ["ne"] },
            { before: "qu", out: ["que"] },
            { before: "s", out: ["se"] },
            { before: "t", out: ["tu"] },
          ],
        },
      },
      compute: {
        contractions: (e) => {
          let { world: t, document: n } = e;
          const { model: a, methods: r } = t;
          let o = a.one.contractions || [];
          new Set(a.one.units || []);
          n.forEach((a, i) => {
            for (let s = a.length - 1; s >= 0; s -= 1) {
              let l = null,
                u = null;
              !0 === le.test(a[s].normal) && ([l, u] = a[s].normal.split(le));
              let c = me(o, a[s], l, u);
              !c && he.hasOwnProperty(u) && (c = he[u](a, s, t)),
                !c && de.hasOwnProperty(l) && (c = de[l](a, s)),
                c
                  ? ((c = pe(c, e)), R(n, [i, s], c), ce(n[i], e, s, c.length))
                  : ue.test(a[s].normal)
                  ? ((c = re(a, s)),
                    c &&
                      ((c = pe(c, e)),
                      R(n, [i, s], c),
                      r.one.setTag(c, "NumberRange", t),
                      c[2] &&
                        c[2].tags.has("Time") &&
                        r.one.setTag([c[0]], "Time", t, null, "time-range"),
                      ce(n[i], e, s, c.length)))
                  : ((c = se(a, s)),
                    c &&
                      ((c = pe(c, e)),
                      R(n, [i, s], c),
                      r.one.setTag(
                        [c[1]],
                        "Unit",
                        t,
                        null,
                        "contraction-unit"
                      )));
            }
          });
        },
      },
      hooks: ["contractions"],
    },
    fe = function (e, t, n) {
      const { model: a, methods: r } = n,
        o = r.one.setTag,
        i = a.one._multiCache || {},
        s = a.one.lexicon || {};
      let l = e[t],
        u = l.machine || l.normal;
      return void 0 !== e[t + 1] && !0 === i[u]
        ? (function (e, t, n, a, r) {
            let o = t + 4 > e.length ? e.length - t : 4,
              i = e[t].machine || e[t].normal;
            for (let s = 1; s < o; s += 1) {
              let o = e[t + s];
              if (
                ((i += " " + (o.machine || o.normal)),
                !0 === n.hasOwnProperty(i))
              ) {
                let o = n[i],
                  l = e.slice(t, t + s + 1);
                return (
                  a(l, o, r, !1, "1-multi-lexicon"),
                  !o ||
                    2 !== o.length ||
                    ("PhrasalVerb" !== o[0] && "PhrasalVerb" !== o[1]) ||
                    a([l[1]], "Particle", r, !1, "1-phrasal-particle"),
                  !0
                );
              }
            }
            return !1;
          })(e, t, s, o, n)
        : null;
    },
    ye = /^(under|over|mis|re|un|dis|semi|pre|post)-?/,
    be = new Set([
      "Verb",
      "Infinitive",
      "PastTense",
      "Gerund",
      "PresentTense",
      "Adjective",
      "Participle",
    ]),
    ve = function (e, t, n) {
      const { model: a, methods: r } = n,
        o = r.one.setTag,
        i = a.one.lexicon;
      let s = e[t],
        l = s.machine || s.normal;
      if (void 0 !== i[l] && i.hasOwnProperty(l))
        return o([s], i[l], n, !1, "1-lexicon"), !0;
      if (s.alias) {
        let e = s.alias.find((e) => i.hasOwnProperty(e));
        if (e) return o([s], i[e], n, !1, "1-lexicon-alias"), !0;
      }
      if (!0 === ye.test(l)) {
        let e = l.replace(ye, "");
        if (i.hasOwnProperty(e) && e.length > 3 && be.has(i[e]))
          return o([s], i[e], n, !1, "1-lexicon-prefix"), !0;
      }
      return null;
    },
    we = {
      lexicon: function (e) {
        const t = e.world;
        e.docs.forEach((e) => {
          for (let n = 0; n < e.length; n += 1)
            if (0 === e[n].tags.size) {
              let a = null;
              (a = a || fe(e, n, t)), (a = a || ve(e, n, t));
            }
        });
      },
    },
    ke = {
      addWords: function (e) {
        const t = this.world(),
          { methods: n, model: a } = t;
        if (e)
          if (
            (Object.keys(e).forEach((t) => {
              "string" == typeof e[t] &&
                e[t].startsWith("#") &&
                (e[t] = e[t].replace(/^#/, ""));
            }),
            n.two.expandLexicon)
          ) {
            let { lex: r, _multi: o } = n.two.expandLexicon(e, t);
            Object.assign(a.one.lexicon, r),
              Object.assign(a.one._multiCache, o);
          } else if (n.one.expandLexicon) {
            let { lex: r, _multi: o } = n.one.expandLexicon(e, t);
            Object.assign(a.one.lexicon, r),
              Object.assign(a.one._multiCache, o);
          } else Object.assign(a.one.lexicon, e);
      },
    },
    Pe = {
      model: { one: { lexicon: {}, _multiCache: {} } },
      methods: {
        one: {
          expandLexicon: function (e) {
            let t = {},
              n = {};
            return (
              Object.keys(e).forEach((a) => {
                let r = e[a],
                  o = (a = (a = a.toLowerCase().trim()).replace(
                    /'s\b/,
                    ""
                  )).split(/ /);
                o.length > 1 && (n[o[0]] = !0), (t[a] = t[a] || r);
              }),
              delete t[""],
              delete t.null,
              delete t[" "],
              { lex: t, _multi: n }
            );
          },
        },
      },
      compute: we,
      lib: ke,
      hooks: ["lexicon"],
    },
    je = function (e, t) {
      let n = [{}],
        a = [null],
        r = [0],
        o = [],
        i = 0;
      e.forEach(function (e) {
        let r = 0,
          o = (function (e, t) {
            const { methods: n, model: a } = t;
            let r = n.one.tokenize
              .splitTerms(e, a)
              .map((e) => n.one.tokenize.splitWhitespace(e, a));
            return r.map((e) => e.text.toLowerCase());
          })(e, t);
        for (let e = 0; e < o.length; e++) {
          let t = o[e];
          n[r] && n[r].hasOwnProperty(t)
            ? (r = n[r][t])
            : (i++, (n[r][t] = i), (n[i] = {}), (r = i), (a[i] = null));
        }
        a[r] = [o.length];
      });
      for (let e in n[0]) (i = n[0][e]), (r[i] = 0), o.push(i);
      for (; o.length; ) {
        let e = o.shift(),
          t = Object.keys(n[e]);
        for (let s = 0; s < t.length; s += 1) {
          let l = t[s],
            u = n[e][l];
          for (o.push(u), i = r[e]; i > 0 && !n[i].hasOwnProperty(l); )
            i = r[i];
          if (n.hasOwnProperty(i)) {
            let e = n[i][l];
            (r[u] = e),
              a[e] && ((a[u] = a[u] || []), (a[u] = a[u].concat(a[e])));
          } else r[u] = 0;
        }
      }
      return { goNext: n, endAs: a, failTo: r };
    },
    Ae = function (e, t, n) {
      let a = 0,
        r = [];
      for (let o = 0; o < e.length; o++) {
        let i = e[o][n.form] || e[o].normal;
        for (
          ;
          a > 0 && (void 0 === t.goNext[a] || !t.goNext[a].hasOwnProperty(i));

        )
          a = t.failTo[a] || 0;
        if (
          t.goNext[a].hasOwnProperty(i) &&
          ((a = t.goNext[a][i]), t.endAs[a])
        ) {
          let n = t.endAs[a];
          for (let t = 0; t < n.length; t++) {
            let a = n[t],
              i = e[o - a + 1],
              [s, l] = i.index;
            r.push([s, l, l + a, i.id]);
          }
        }
      }
      return r;
    },
    xe = function (e, t) {
      for (let n = 0; n < e.length; n += 1) if (!0 === t.has(e[n])) return !1;
      return !0;
    },
    De = (e, t) => {
      for (let n = e.length - 1; n >= 0; n -= 1)
        if (e[n] !== t) return e.slice(0, n + 1);
      return e;
    },
    Ie = {
      buildTrie: function (e) {
        return (function (e) {
          return (
            (e.goNext = e.goNext.map((e) => {
              if (0 !== Object.keys(e).length) return e;
            })),
            (e.goNext = De(e.goNext, void 0)),
            (e.failTo = De(e.failTo, 0)),
            (e.endAs = De(e.endAs, null)),
            e
          );
        })(je(e, this.world()));
      },
    };
  Ie.compile = Ie.buildTrie;
  const Ne = {
      api: function (e) {
        e.prototype.lookup = function (e, t = {}) {
          if (!e) return this.none();
          var n;
          "string" == typeof e && (e = [e]);
          let a = (function (e, t, n) {
            let a = [];
            n.form = n.form || "normal";
            let r = e.docs;
            if (!t.goNext || !t.goNext[0])
              return console.error("Compromise invalid lookup trie"), e.none();
            let o = Object.keys(t.goNext[0]);
            for (let i = 0; i < r.length; i++) {
              if (e._cache && e._cache[i] && !0 === xe(o, e._cache[i]))
                continue;
              let s = r[i],
                l = Ae(s, t, n);
              l.length > 0 && (a = a.concat(l));
            }
            return e.update(a);
          })(
            this,
            ((n = e),
            "[object Object]" === Object.prototype.toString.call(n)
              ? e
              : je(e, this.world)),
            t
          );
          return (a = a.settle()), a;
        };
      },
      lib: Ie,
    },
    Ee = function (e, t) {
      return t
        ? (e.forEach((e) => {
            let n = e[0];
            t[n] && ((e[0] = t[n][0]), (e[1] += t[n][1]), (e[2] += t[n][1]));
          }),
          e)
        : e;
    },
    Te = function (e, t) {
      let { ptrs: n, byGroup: a } = e;
      return (
        (n = Ee(n, t)),
        Object.keys(a).forEach((e) => {
          a[e] = Ee(a[e], t);
        }),
        { ptrs: n, byGroup: a }
      );
    },
    Oe = (e) => "[object Object]" === Object.prototype.toString.call(e),
    Ce = (e) => e && Oe(e) && !0 === e.isView,
    Ve = (e) => e && Oe(e) && !0 === e.isNet,
    ze = function (e, t, n) {
      const a = n.methods.one;
      return (
        "number" == typeof e && (e = String(e)),
        "string" == typeof e &&
          ((e = a.killUnicode(e, n)), (e = a.parseMatch(e, t, n))),
        e
      );
    },
    $e = {
      matchOne: function (e, t, n) {
        const a = this.methods.one;
        if (Ce(e)) return this.intersection(e).eq(0);
        if (Ve(e)) return this.sweep(e, { tagger: !1, matchOne: !0 }).view;
        let r = { regs: (e = ze(e, n, this.world)), group: t, justOne: !0 },
          o = a.match(this.docs, r, this._cache),
          { ptrs: i, byGroup: s } = Te(o, this.fullPointer),
          l = this.toView(i);
        return (l._groups = s), l;
      },
      match: function (e, t, n) {
        const a = this.methods.one;
        if (Ce(e)) return this.intersection(e);
        if (Ve(e)) return this.sweep(e, { tagger: !1 }).view.settle();
        let r = { regs: (e = ze(e, n, this.world)), group: t },
          o = a.match(this.docs, r, this._cache),
          { ptrs: i, byGroup: s } = Te(o, this.fullPointer),
          l = this.toView(i);
        return (l._groups = s), l;
      },
      has: function (e, t, n) {
        const a = this.methods.one;
        if (Ce(e)) return e.fullPointer.length > 0;
        if (Ve(e)) return this.sweep(e, { tagger: !1 }).view.found;
        let r = { regs: (e = ze(e, n, this.world)), group: t, justOne: !0 };
        return a.match(this.docs, r, this._cache).ptrs.length > 0;
      },
      if: function (e, t, n) {
        const a = this.methods.one;
        if (Ce(e)) return this.filter((t) => t.intersection(e).found);
        if (Ve(e)) {
          let t = this.sweep(e, { tagger: !1 }).view.settle();
          return this.if(t);
        }
        let r = { regs: (e = ze(e, n, this.world)), group: t, justOne: !0 },
          o = this.fullPointer,
          i = this._cache || [];
        o = o.filter((e, t) => {
          let n = this.update([e]);
          return a.match(n.docs, r, i[t]).ptrs.length > 0;
        });
        let s = this.update(o);
        return this._cache && (s._cache = o.map((e) => i[e[0]])), s;
      },
      ifNo: function (e, t, n) {
        const { methods: a } = this,
          r = a.one;
        if (Ce(e)) return this.filter((t) => !t.intersection(e).found);
        if (Ve(e)) {
          let t = this.sweep(e, { tagger: !1 }).view.settle();
          return this.ifNo(t);
        }
        e = ze(e, n, this.world);
        let o = this._cache || [],
          i = this.filter((n, a) => {
            let i = { regs: e, group: t, justOne: !0 };
            return 0 === r.match(n.docs, i, o[a]).ptrs.length;
          });
        return this._cache && (i._cache = i.ptrs.map((e) => o[e[0]])), i;
      },
    },
    Fe = {
      before: function (e, t, n) {
        const { indexN: a } = this.methods.one.pointer;
        let r = [],
          o = a(this.fullPointer);
        Object.keys(o).forEach((e) => {
          let t = o[e].sort((e, t) => (e[1] > t[1] ? 1 : -1))[0];
          t[1] > 0 && r.push([t[0], 0, t[1]]);
        });
        let i = this.toView(r);
        return e ? i.match(e, t, n) : i;
      },
      after: function (e, t, n) {
        const { indexN: a } = this.methods.one.pointer;
        let r = [],
          o = a(this.fullPointer),
          i = this.document;
        Object.keys(o).forEach((e) => {
          let t = o[e].sort((e, t) => (e[1] > t[1] ? -1 : 1))[0],
            [n, , a] = t;
          a < i[n].length && r.push([n, a, i[n].length]);
        });
        let s = this.toView(r);
        return e ? s.match(e, t, n) : s;
      },
      growLeft: function (e, t, n) {
        "string" == typeof e &&
          (e = this.world.methods.one.parseMatch(e, n, this.world)),
          (e[e.length - 1].end = !0);
        let a = this.fullPointer;
        return (
          this.forEach((n, r) => {
            let o = n.before(e, t);
            if (o.found) {
              let e = o.terms();
              (a[r][1] -= e.length), (a[r][3] = e.docs[0][0].id);
            }
          }),
          this.update(a)
        );
      },
      growRight: function (e, t, n) {
        "string" == typeof e &&
          (e = this.world.methods.one.parseMatch(e, n, this.world)),
          (e[0].start = !0);
        let a = this.fullPointer;
        return (
          this.forEach((n, r) => {
            let o = n.after(e, t);
            if (o.found) {
              let e = o.terms();
              (a[r][2] += e.length), (a[r][4] = null);
            }
          }),
          this.update(a)
        );
      },
      grow: function (e, t, n) {
        return this.growRight(e, t, n).growLeft(e, t, n);
      },
    },
    Be = function (e, t) {
      return [e[0], e[1], t[2]];
    },
    Me = (e, t, n) => {
      return "string" == typeof e ||
        ((a = e), "[object Array]" === Object.prototype.toString.call(a))
        ? t.match(e, n)
        : e || t.none();
      var a;
    },
    Se = function (e, t) {
      let [n, a, r] = e;
      return (
        t.document[n] &&
          t.document[n][a] &&
          ((e[3] = e[3] || t.document[n][a].id),
          t.document[n][r - 1] && (e[4] = e[4] || t.document[n][r - 1].id)),
        e
      );
    },
    Ge = {
      splitOn: function (e, t) {
        const { splitAll: n } = this.methods.one.pointer;
        let a = Me(e, this, t).fullPointer,
          r = n(this.fullPointer, a),
          o = [];
        return (
          r.forEach((e) => {
            o.push(e.passthrough),
              o.push(e.before),
              o.push(e.match),
              o.push(e.after);
          }),
          (o = o.filter((e) => e)),
          (o = o.map((e) => Se(e, this))),
          this.update(o)
        );
      },
      splitBefore: function (e, t) {
        const { splitAll: n } = this.methods.one.pointer;
        let a = Me(e, this, t).fullPointer,
          r = n(this.fullPointer, a),
          o = [];
        return (
          r.forEach((e) => {
            o.push(e.passthrough),
              o.push(e.before),
              e.match && e.after
                ? o.push(Be(e.match, e.after))
                : (o.push(e.match), o.push(e.after));
          }),
          (o = o.filter((e) => e)),
          (o = o.map((e) => Se(e, this))),
          this.update(o)
        );
      },
      splitAfter: function (e, t) {
        const { splitAll: n } = this.methods.one.pointer;
        let a = Me(e, this, t).fullPointer,
          r = n(this.fullPointer, a),
          o = [];
        return (
          r.forEach((e) => {
            o.push(e.passthrough),
              e.before && e.match
                ? o.push(Be(e.before, e.match))
                : (o.push(e.before), o.push(e.match)),
              o.push(e.after);
          }),
          (o = o.filter((e) => e)),
          (o = o.map((e) => Se(e, this))),
          this.update(o)
        );
      },
    };
  Ge.split = Ge.splitAfter;
  const Le = Ge,
    He = Object.assign({}, $e, Fe, Le);
  (He.lookBehind = He.before),
    (He.lookBefore = He.before),
    (He.lookAhead = He.after),
    (He.lookAfter = He.after),
    (He.notIf = He.ifNo);
  const qe = /(?:^|\s)([![^]*(?:<[^<]*>)?\/.*?[^\\/]\/[?\]+*$~]*)(?:\s|$)/,
    We = /([!~[^]*(?:<[^<]*>)?\([^)]+[^\\)]\)[?\]+*$~]*)(?:\s|$)/,
    Je = / /g,
    _e = (e) => /^[![^]*(<[^<]*>)?\//.test(e) && /\/[?\]+*$~]*$/.test(e),
    Ke = function (e) {
      return (e = e.map((e) => e.trim())).filter((e) => e);
    },
    Ue = /\{([0-9]+)?(, *[0-9]*)?\}/,
    Re = /&&/,
    Ye = new RegExp(/^<\s*(\S+)\s*>/),
    Qe = (e) => e.charAt(0).toUpperCase() + e.substring(1),
    Ze = (e) => e.charAt(e.length - 1),
    Xe = (e) => e.charAt(0),
    et = (e) => e.substring(1),
    tt = (e) => e.substring(0, e.length - 1),
    nt = function (e) {
      return (e = et(e)), tt(e);
    },
    at = function (e, t) {
      let n = {};
      for (let a = 0; a < 2; a += 1) {
        if (
          ("$" === Ze(e) && ((n.end = !0), (e = tt(e))),
          "^" === Xe(e) && ((n.start = !0), (e = et(e))),
          ("[" === Xe(e) || "]" === Ze(e)) &&
            ((n.group = null),
            "[" === Xe(e) && (n.groupStart = !0),
            "]" === Ze(e) && (n.groupEnd = !0),
            (e = (e = e.replace(/^\[/, "")).replace(/\]$/, "")),
            "<" === Xe(e)))
        ) {
          const t = Ye.exec(e);
          t.length >= 2 && ((n.group = t[1]), (e = e.replace(t[0], "")));
        }
        if (
          ("+" === Ze(e) && ((n.greedy = !0), (e = tt(e))),
          "*" !== e &&
            "*" === Ze(e) &&
            "\\*" !== e &&
            ((n.greedy = !0), (e = tt(e))),
          "?" === Ze(e) && ((n.optional = !0), (e = tt(e))),
          "!" === Xe(e) && ((n.negative = !0), (e = et(e))),
          "~" === Xe(e) &&
            "~" === Ze(e) &&
            e.length > 2 &&
            ((e = nt(e)),
            (n.fuzzy = !0),
            (n.min = t.fuzzy || 0.85),
            !1 === /\(/.test(e)))
        )
          return (n.word = e), n;
        if ("(" === Xe(e) && ")" === Ze(e)) {
          Re.test(e)
            ? ((n.choices = e.split(Re)), (n.operator = "and"))
            : ((n.choices = e.split("|")), (n.operator = "or")),
            (n.choices[0] = et(n.choices[0]));
          let a = n.choices.length - 1;
          (n.choices[a] = tt(n.choices[a])),
            (n.choices = n.choices.map((e) => e.trim())),
            (n.choices = n.choices.filter((e) => e)),
            (n.choices = n.choices.map((e) =>
              e.split(/ /g).map((e) => at(e, t))
            )),
            (e = "");
        }
        if ("/" === Xe(e) && "/" === Ze(e))
          return (
            (e = nt(e)),
            t.caseSensitive && (n.use = "text"),
            (n.regex = new RegExp(e)),
            n
          );
        if ("{" === Xe(e) && "}" === Ze(e)) {
          if (((e = nt(e)), (n.root = e), /\//.test(e))) {
            let e = n.root.split(/\//);
            (n.root = e[0]),
              (n.pos = e[1]),
              "adj" === n.pos && (n.pos = "Adjective"),
              (n.pos =
                n.pos.charAt(0).toUpperCase() + n.pos.substr(1).toLowerCase()),
              void 0 !== e[2] && (n.sense = e[2]);
          }
          return n;
        }
        if ("<" === Xe(e) && ">" === Ze(e))
          return (e = nt(e)), (n.chunk = Qe(e)), (n.greedy = !0), n;
        if ("%" === Xe(e) && "%" === Ze(e))
          return (e = nt(e)), (n.switch = e), n;
      }
      return (
        !0 === Ue.test(e) &&
          (e = e.replace(
            Ue,
            (e, t, a) => (
              void 0 === a
                ? ((n.min = Number(t)), (n.max = Number(t)))
                : ((a = a.replace(/, */, "")),
                  void 0 === t
                    ? ((n.min = 0), (n.max = Number(a)))
                    : ((n.min = Number(t)), (n.max = Number(a || 999)))),
              (n.greedy = !0),
              n.min || (n.optional = !0),
              ""
            )
          )),
        "#" === Xe(e)
          ? ((n.tag = et(e)), (n.tag = Qe(n.tag)), n)
          : "@" === Xe(e)
          ? ((n.method = et(e)), n)
          : "." === e
          ? ((n.anything = !0), n)
          : "*" === e
          ? ((n.anything = !0), (n.greedy = !0), (n.optional = !0), n)
          : (e &&
              ((e = (e = e.replace("\\*", "*")).replace("\\.", ".")),
              t.caseSensitive ? (n.use = "text") : (e = e.toLowerCase()),
              (n.word = e)),
            n)
      );
    },
    rt = at,
    ot = /[a-z0-9][-–—][a-z]/i,
    it = function (e, t) {
      let { all: n } = t.methods.two.transform.verb || {},
        a = e.root;
      return n ? n(a, t.model) : [];
    },
    st = function (e, t) {
      let { all: n } = t.methods.two.transform.noun || {};
      return n ? n(e.root, t.model) : [e.root];
    },
    lt = function (e, t) {
      let { all: n } = t.methods.two.transform.adjective || {};
      return n ? n(e.root, t.model) : [e.root];
    },
    ut = function (e, t) {
      for (let n of t) if (e.has(n)) return !0;
      return !1;
    },
    ct = function (e, t) {
      for (let n = 0; n < e.length; n += 1) {
        let a = e[n];
        if (!0 !== a.optional && !0 !== a.negative && !0 !== a.fuzzy) {
          if (void 0 !== a.word && !1 === t.has(a.word)) return !0;
          if (void 0 !== a.tag && !1 === t.has("#" + a.tag)) return !0;
          if (a.fastOr && !1 === ut(a.fastOr, t)) return !1;
        }
      }
      return !1;
    },
    ht =
      /([\u0022\uFF02\u0027\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F])/,
    dt =
      /([\u0022\uFF02\u0027\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4])/,
    mt = /^[-–—]$/,
    pt = / [-–—]{1,3} /,
    gt = (e, t) => -1 !== e.post.indexOf(t),
    ft = (e, t) => -1 !== e.pre.indexOf(t),
    yt = {
      hasQuote: (e) => ht.test(e.pre) || dt.test(e.post),
      hasComma: (e) => gt(e, ","),
      hasPeriod: (e) => !0 === gt(e, ".") && !1 === gt(e, "..."),
      hasExclamation: (e) => gt(e, "!"),
      hasQuestionMark: (e) => gt(e, "?") || gt(e, "¿"),
      hasEllipses: (e) =>
        gt(e, "..") || gt(e, "…") || ft(e, "..") || ft(e, "…"),
      hasSemicolon: (e) => gt(e, ";"),
      hasColon: (e) => gt(e, ":"),
      hasSlash: (e) => /\//.test(e.text),
      hasHyphen: (e) => mt.test(e.post) || mt.test(e.pre),
      hasDash: (e) => pt.test(e.post) || pt.test(e.pre),
      hasContraction: (e) => Boolean(e.implicit),
      isAcronym: (e) => e.tags.has("Acronym"),
      isKnown: (e) => e.tags.size > 0,
      isTitleCase: (e) => /^\p{Lu}[a-z'\u00C0-\u00FF]/u.test(e.text),
      isUpperCase: (e) => /^\p{Lu}+$/u.test(e.text),
    };
  yt.hasQuotation = yt.hasQuote;
  const bt = yt;
  let vt = function () {};
  vt = function (e, t, n, a) {
    let r = (function (e, t, n, a) {
      if (!0 === t.anything) return !0;
      if (!0 === t.start && 0 !== n) return !1;
      if (!0 === t.end && n !== a - 1) return !1;
      if (void 0 !== t.id && t.id === e.id) return !0;
      if (void 0 !== t.word) {
        if (t.use) return t.word === e[t.use];
        if (null !== e.machine && e.machine === t.word) return !0;
        if (void 0 !== e.alias && e.alias.hasOwnProperty(t.word)) return !0;
        if (!0 === t.fuzzy) {
          if (t.word === e.root) return !0;
          if (
            (function (e, t, n = 3) {
              if (e === t) return 1;
              if (e.length < n || t.length < n) return 0;
              const a = (function (e, t) {
                let n = e.length,
                  a = t.length;
                if (0 === n) return a;
                if (0 === a) return n;
                let r = (a > n ? a : n) + 1;
                if (Math.abs(n - a) > (r || 100)) return r || 100;
                let o,
                  i,
                  s,
                  l,
                  u,
                  c,
                  h = [];
                for (let e = 0; e < r; e++) (h[e] = [e]), (h[e].length = r);
                for (let e = 0; e < r; e++) h[0][e] = e;
                for (let r = 1; r <= n; ++r)
                  for (i = e[r - 1], o = 1; o <= a; ++o) {
                    if (r === o && h[r][o] > 4) return n;
                    (s = t[o - 1]),
                      (l = i === s ? 0 : 1),
                      (u = h[r - 1][o] + 1),
                      (c = h[r][o - 1] + 1) < u && (u = c),
                      (c = h[r - 1][o - 1] + l) < u && (u = c);
                    let a =
                      r > 1 &&
                      o > 1 &&
                      i === t[o - 2] &&
                      e[r - 2] === s &&
                      (c = h[r - 2][o - 2] + l) < u;
                    h[r][o] = a ? c : u;
                  }
                return h[n][a];
              })(e, t);
              let r = Math.max(e.length, t.length);
              return 1 - (0 === r ? 0 : a / r);
            })(t.word, e.normal) >= t.min
          )
            return !0;
        }
        return (
          !(!e.alias || !e.alias.some((e) => e === t.word)) ||
          t.word === e.text ||
          t.word === e.normal
        );
      }
      if (void 0 !== t.tag) return !0 === e.tags.has(t.tag);
      if (void 0 !== t.method)
        return "function" == typeof bt[t.method] && !0 === bt[t.method](e);
      if (void 0 !== t.pre) return e.pre && e.pre.includes(t.pre);
      if (void 0 !== t.post) return e.post && e.post.includes(t.post);
      if (void 0 !== t.regex) {
        let n = e.normal;
        return t.use && (n = e[t.use]), t.regex.test(n);
      }
      if (void 0 !== t.chunk) return e.chunk === t.chunk;
      if (void 0 !== t.switch) return e.switch === t.switch;
      if (void 0 !== t.machine)
        return (
          e.normal === t.machine ||
          e.machine === t.machine ||
          e.root === t.machine
        );
      if (void 0 !== t.sense) return e.sense === t.sense;
      if (void 0 !== t.fastOr) {
        if (t.pos && !e.tags.has(t.pos)) return null;
        let n = e.root || e.implicit || e.machine || e.normal;
        return t.fastOr.has(n) || t.fastOr.has(e.text);
      }
      return (
        void 0 !== t.choices &&
        ("and" === t.operator
          ? t.choices.every((t) => vt(e, t, n, a))
          : t.choices.some((t) => vt(e, t, n, a)))
      );
    })(e, t, n, a);
    return !0 === t.negative ? !r : r;
  };
  const wt = vt,
    kt = function (e, t) {
      if (
        !0 === e.end &&
        !0 === e.greedy &&
        t.start_i + t.t < t.phrase_length - 1
      ) {
        let n = Object.assign({}, e, { end: !1 });
        if (!0 === wt(t.terms[t.t], n, t.start_i + t.t, t.phrase_length))
          return !0;
      }
      return !1;
    },
    Pt = function (e, t) {
      return (
        e.groups[e.inGroup] || (e.groups[e.inGroup] = { start: t, length: 0 }),
        e.groups[e.inGroup]
      );
    },
    jt = function (e) {
      let { regs: t } = e,
        n = t[e.r],
        a = (function (e, t) {
          let n = e.t;
          if (!t) return e.terms.length;
          for (; n < e.terms.length; n += 1)
            if (!0 === wt(e.terms[n], t, e.start_i + n, e.phrase_length))
              return n;
          return null;
        })(e, t[e.r + 1]);
      return null === a || 0 === a || (void 0 !== n.min && a - e.t < n.min)
        ? null
        : void 0 !== n.max && a - e.t > n.max
        ? ((e.t = e.t + n.max), !0)
        : (!0 === e.hasGroup && (Pt(e, e.t).length = a - e.t), (e.t = a), !0);
    },
    At = function (e, t = 0) {
      let n = e.regs[e.r],
        a = !1;
      for (let o = 0; o < n.choices.length; o += 1) {
        let i = n.choices[o];
        if (((r = i), "[object Array]" !== Object.prototype.toString.call(r)))
          return !1;
        if (
          ((a = i.every((n, a) => {
            let r = 0,
              o = e.t + a + t + r;
            if (void 0 === e.terms[o]) return !1;
            let i = wt(e.terms[o], n, o + e.start_i, e.phrase_length);
            if (!0 === i && !0 === n.greedy)
              for (let t = 1; t < e.terms.length; t += 1) {
                let a = e.terms[o + t];
                if (a) {
                  if (!0 !== wt(a, n, e.start_i + t, e.phrase_length)) break;
                  r += 1;
                }
              }
            return (t += r), i;
          })),
          a)
        ) {
          t += i.length;
          break;
        }
      }
      var r;
      return a && !0 === n.greedy ? At(e, t) : t;
    },
    xt = function (e) {
      const { regs: t } = e;
      let n = t[e.r],
        a = At(e);
      if (a) {
        if (!0 === n.negative) return null;
        if ((!0 === e.hasGroup && (Pt(e, e.t).length += a), !0 === n.end)) {
          let t = e.phrase_length;
          if (e.t + e.start_i + a !== t) return null;
        }
        return (e.t += a), !0;
      }
      return !!n.optional || null;
    },
    Dt = function (e) {
      const { regs: t } = e;
      let n = t[e.r],
        a = (function (e) {
          let t = 0;
          return (
            !0 ===
              e.regs[e.r].choices.every((n) => {
                let a = n.every((t, n) => {
                  let a = e.t + n;
                  return (
                    void 0 !== e.terms[a] &&
                    wt(e.terms[a], t, a, e.phrase_length)
                  );
                });
                return !0 === a && n.length > t && (t = n.length), a;
              }) && t
          );
        })(e);
      if (a) {
        if (!0 === n.negative) return null;
        if ((!0 === e.hasGroup && (Pt(e, e.t).length += a), !0 === n.end)) {
          let t = e.phrase_length - 1;
          if (e.t + e.start_i !== t) return null;
        }
        return (e.t += a), !0;
      }
      return !!n.optional || null;
    },
    It = function (e) {
      const { regs: t } = e;
      let n = t[e.r],
        a = Object.assign({}, n);
      if (
        ((a.negative = !1),
        wt(e.terms[e.t], a, e.start_i + e.t, e.phrase_length))
      )
        return !1;
      if (n.optional) {
        let n = t[e.r + 1];
        n &&
          (wt(e.terms[e.t], n, e.start_i + e.t, e.phrase_length)
            ? (e.r += 1)
            : n.optional &&
              t[e.r + 2] &&
              wt(e.terms[e.t], t[e.r + 2], e.start_i + e.t, e.phrase_length) &&
              (e.r += 2));
      }
      return n.greedy
        ? (function (e, t, n) {
            let a = 0;
            for (let r = e.t; r < e.terms.length; r += 1) {
              let o = wt(e.terms[r], t, e.start_i + e.t, e.phrase_length);
              if (o) break;
              if (
                n &&
                ((o = wt(e.terms[r], n, e.start_i + e.t, e.phrase_length)), o)
              )
                break;
              if (((a += 1), void 0 !== t.max && a === t.max)) break;
            }
            return !(0 === a || (t.min && t.min > a) || ((e.t += a), 0));
          })(e, a, t[e.r + 1])
        : ((e.t += 1), !0);
    },
    Nt = function (e) {
      const { regs: t } = e;
      let n = t[e.r],
        a = e.terms[e.t],
        r = e.t;
      return (
        !!(n.optional && t[e.r + 1] && n.negative) ||
        (n.optional &&
          t[e.r + 1] &&
          (function (e) {
            const { regs: t } = e;
            let n = t[e.r],
              a = e.terms[e.t],
              r = wt(a, t[e.r + 1], e.start_i + e.t, e.phrase_length);
            if (n.negative || r) {
              let n = e.terms[e.t + 1];
              (n && wt(n, t[e.r + 1], e.start_i + e.t, e.phrase_length)) ||
                (e.r += 1);
            }
          })(e),
        a.implicit &&
          e.terms[e.t + 1] &&
          (function (e) {
            let t = e.terms[e.t],
              n = e.regs[e.r];
            if (t.implicit && e.terms[e.t + 1]) {
              if (!e.terms[e.t + 1].implicit) return;
              n.word === t.normal && (e.t += 1),
                "hasContraction" === n.method && (e.t += 1);
            }
          })(e),
        (e.t += 1),
        !0 === n.end && e.t !== e.terms.length && !0 !== n.greedy
          ? null
          : !0 !== n.greedy ||
            (function (e) {
              const { regs: t, phrase_length: n } = e;
              let a = t[e.r];
              return (
                (e.t = (function (e, t) {
                  let n = Object.assign({}, e.regs[e.r], {
                      start: !1,
                      end: !1,
                    }),
                    a = e.t;
                  for (; e.t < e.terms.length; e.t += 1) {
                    if (
                      t &&
                      wt(e.terms[e.t], t, e.start_i + e.t, e.phrase_length)
                    )
                      return e.t;
                    let r = e.t - a + 1;
                    if (void 0 !== n.max && r === n.max) return e.t;
                    if (
                      !1 ===
                      wt(e.terms[e.t], n, e.start_i + e.t, e.phrase_length)
                    )
                      return void 0 !== n.min && r < n.min ? null : e.t;
                  }
                  return e.t;
                })(e, t[e.r + 1])),
                null === e.t || (a.min && a.min > e.t)
                  ? null
                  : !0 !== a.end || e.start_i + e.t === n || null
              );
            })(e)
          ? (!0 === e.hasGroup &&
              (function (e, t) {
                let n = e.regs[e.r];
                const a = Pt(e, t);
                e.t > 1 && n.greedy ? (a.length += e.t - t) : a.length++;
              })(e, r),
            !0)
          : null)
      );
    },
    Et = function (e, t, n, a) {
      if (0 === e.length || 0 === t.length) return null;
      let r = {
        t: 0,
        terms: e,
        r: 0,
        regs: t,
        groups: {},
        start_i: n,
        phrase_length: a,
        inGroup: null,
      };
      for (; r.r < t.length; r.r += 1) {
        let e = t[r.r];
        if (
          ((r.hasGroup = Boolean(e.group)),
          !0 === r.hasGroup ? (r.inGroup = e.group) : (r.inGroup = null),
          !r.terms[r.t])
        ) {
          if (!1 === t.slice(r.r).some((e) => !e.optional)) break;
          return null;
        }
        if (!0 !== e.anything || !0 !== e.greedy) {
          if (void 0 === e.choices || "or" !== e.operator) {
            if (void 0 === e.choices || "and" !== e.operator)
              if (!0 !== e.anything) {
                if (!0 !== kt(e, r)) {
                  if (e.negative) {
                    if (!It(r)) return null;
                  } else if (
                    !0 !== wt(r.terms[r.t], e, r.start_i + r.t, r.phrase_length)
                  ) {
                    if (!0 !== e.optional) return null;
                  } else if (!Nt(r)) return null;
                } else if (!Nt(r)) return null;
              } else {
                if (e.negative && e.anything) return null;
                if (!Nt(r)) return null;
              }
            else if (!Dt(r)) return null;
          } else if (!xt(r)) return null;
        } else if (!jt(r)) return null;
      }
      let o = [null, n, r.t + n];
      if (o[1] === o[2]) return null;
      let i = {};
      return (
        Object.keys(r.groups).forEach((e) => {
          let t = r.groups[e],
            a = n + t.start;
          i[e] = [null, a, a + t.length];
        }),
        { pointer: o, groups: i }
      );
    },
    Tt = function (e, t) {
      return (
        (e.pointer[0] = t),
        Object.keys(e.groups).forEach((n) => {
          e.groups[n][0] = t;
        }),
        e
      );
    },
    Ot = function (e, t, n) {
      let a = Et(e, t, 0, e.length);
      return a ? ((a = Tt(a, n)), a) : null;
    },
    Ct = {
      api: function (e) {
        Object.assign(e.prototype, He);
      },
      methods: {
        one: {
          termMethods: bt,
          parseMatch: function (e, t, n) {
            if (null == e || "" === e) return [];
            (t = t || {}), "number" == typeof e && (e = String(e));
            let a = (function (e) {
              let t = e.split(qe),
                n = [];
              t.forEach((e) => {
                _e(e) ? n.push(e) : (n = n.concat(e.split(We)));
              }),
                (n = Ke(n));
              let a = [];
              return (
                n.forEach((e) => {
                  ((e) =>
                    /^[![^]*(<[^<]*>)?\(/.test(e) && /\)[?\]+*$~]*$/.test(e))(
                    e
                  ) || _e(e)
                    ? a.push(e)
                    : (a = a.concat(e.split(Je)));
                }),
                (a = Ke(a)),
                a
              );
            })(e);
            return (
              (a = a.map((e) => rt(e, t))),
              (a = (function (e, t) {
                let n = t.model.one.prefixes;
                for (let t = e.length - 1; t >= 0; t -= 1) {
                  let a = e[t];
                  if (a.word && ot.test(a.word)) {
                    let r = a.word.split(/[-–—]/g);
                    if (n.hasOwnProperty(r[0])) continue;
                    (r = r.filter((e) => e).reverse()),
                      e.splice(t, 1),
                      r.forEach((n) => {
                        let r = Object.assign({}, a);
                        (r.word = n), e.splice(t, 0, r);
                      });
                  }
                }
                return e;
              })(a, n)),
              (a = (function (e, t) {
                return e.map((e) => {
                  if (e.root)
                    if (t.methods.two && t.methods.two.transform) {
                      let n = [];
                      e.pos
                        ? "Verb" === e.pos
                          ? (n = n.concat(it(e, t)))
                          : "Noun" === e.pos
                          ? (n = n.concat(st(e, t)))
                          : "Adjective" === e.pos && (n = n.concat(lt(e, t)))
                        : ((n = n.concat(it(e, t))),
                          (n = n.concat(st(e, t))),
                          (n = n.concat(lt(e, t)))),
                        (n = n.filter((e) => e)),
                        n.length > 0 &&
                          ((e.operator = "or"), (e.fastOr = new Set(n)));
                    } else (e.machine = e.root), delete e.id, delete e.root;
                  return e;
                });
              })(a, n)),
              (r = (function (e) {
                let t = 0,
                  n = null;
                for (let a = 0; a < e.length; a++) {
                  const r = e[a];
                  !0 === r.groupStart &&
                    ((n = r.group), null === n && ((n = String(t)), (t += 1))),
                    null !== n && (r.group = n),
                    !0 === r.groupEnd && (n = null);
                }
                return e;
              })((r = a))),
              (r = (function (e) {
                return e.map(
                  (e) => (
                    e.fuzzy &&
                      e.choices &&
                      e.choices.forEach((t) => {
                        1 === t.length &&
                          t[0].word &&
                          ((t[0].fuzzy = !0), (t[0].min = e.min));
                      }),
                    e
                  )
                );
              })(
                (r = r.map((e) => {
                  if (void 0 !== e.choices) {
                    if ("or" !== e.operator) return e;
                    if (!0 === e.fuzzy) return e;
                    !0 ===
                      e.choices.every((e) => {
                        if (1 !== e.length) return !1;
                        let t = e[0];
                        return (
                          !0 !== t.fuzzy &&
                          !t.start &&
                          !t.end &&
                          void 0 !== t.word &&
                          !0 !== t.negative &&
                          !0 !== t.optional &&
                          !0 !== t.method
                        );
                      }) &&
                      ((e.fastOr = new Set()),
                      e.choices.forEach((t) => {
                        e.fastOr.add(t[0].word);
                      }),
                      delete e.choices);
                  }
                  return e;
                }))
              )),
              (a = r),
              a
            );
            var r;
          },
          match: function (e, t, n) {
            n = n || [];
            let { regs: a, group: r, justOne: o } = t,
              i = [];
            if (!a || 0 === a.length) return { ptrs: [], byGroup: {} };
            const s = a.filter(
              (e) => !0 !== e.optional && !0 !== e.negative
            ).length;
            e: for (let t = 0; t < e.length; t += 1) {
              let r = e[t];
              if (!n[t] || !ct(a, n[t]))
                if (!0 !== a[0].start)
                  for (let e = 0; e < r.length; e += 1) {
                    let n = r.slice(e);
                    if (n.length < s) break;
                    let l = Et(n, a, e, r.length);
                    if (l) {
                      if (((l = Tt(l, t)), i.push(l), !0 === o)) break e;
                      let n = l.pointer[2];
                      Math.abs(n - 1) > e && (e = Math.abs(n - 1));
                    }
                  }
                else {
                  let e = Ot(r, a, t);
                  e && i.push(e);
                }
            }
            return (
              !0 === a[a.length - 1].end &&
                (i = i.filter((t) => {
                  let n = t.pointer[0];
                  return e[n].length === t.pointer[2];
                })),
              t.notIf &&
                (i = (function (e, t, n) {
                  return (
                    (e = e.filter((e) => {
                      let [a, r, o] = e.pointer,
                        i = n[a].slice(r, o);
                      for (let e = 0; e < i.length; e += 1) {
                        let n = i.slice(e);
                        if (null !== Et(n, t, e, i.length)) return !1;
                      }
                      return !0;
                    })),
                    e
                  );
                })(i, t.notIf, e)),
              (i = (function (e, t) {
                let n = [],
                  a = {};
                return (
                  0 === e.length ||
                    ("number" == typeof t && (t = String(t)),
                    t
                      ? e.forEach((e) => {
                          e.groups[t] && n.push(e.groups[t]);
                        })
                      : e.forEach((e) => {
                          n.push(e.pointer),
                            Object.keys(e.groups).forEach((t) => {
                              (a[t] = a[t] || []), a[t].push(e.groups[t]);
                            });
                        })),
                  { ptrs: n, byGroup: a }
                );
              })(i, r)),
              i.ptrs.forEach((t) => {
                let [n, a, r] = t;
                (t[3] = e[n][a].id), (t[4] = e[n][r - 1].id);
              }),
              i
            );
          },
        },
      },
      lib: {
        parseMatch: function (e, t) {
          const n = this.world();
          let a = n.methods.one.killUnicode;
          return a && (e = a(e, n)), n.methods.one.parseMatch(e, t, n);
        },
      },
    },
    Vt = /^\../,
    zt = /^#./,
    $t = {
      html: function (e) {
        let { starts: t, ends: n } = (function (e, t) {
            let n = {},
              a = {};
            return (
              Object.keys(t).forEach((r) => {
                let o = t[r],
                  i = (function (e) {
                    let t = "",
                      n = "</span>";
                    return (
                      (e = e
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&apos;")),
                      Vt.test(e)
                        ? (t = `<span class="${e.replace(/^\./, "")}"`)
                        : zt.test(e)
                        ? (t = `<span id="${e.replace(/^#/, "")}"`)
                        : ((t = `<${e}`), (n = `</${e}>`)),
                      (t += ">"),
                      { start: t, end: n }
                    );
                  })(r);
                "string" == typeof o && (o = e.match(o)),
                  o.docs.forEach((e) => {
                    if (e.every((e) => e.implicit)) return;
                    let t = e[0].id;
                    (n[t] = n[t] || []), n[t].push(i.start);
                    let r = e[e.length - 1].id;
                    (a[r] = a[r] || []), a[r].push(i.end);
                  });
              }),
              { starts: n, ends: a }
            );
          })(this, e),
          a = "";
        return (
          this.docs.forEach((e) => {
            for (let r = 0; r < e.length; r += 1) {
              let o = e[r];
              t.hasOwnProperty(o.id) && (a += t[o.id].join("")),
                (a += o.pre || "" + o.text || ""),
                n.hasOwnProperty(o.id) && (a += n[o.id].join("")),
                (a += o.post || "");
            }
          }),
          a
        );
      },
    },
    Ft =
      /[,:;)\]*.?~!\u0022\uFF02\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4—-]+$/,
    Bt =
      /^[(['"*~\uFF02\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F]+/,
    Mt = /[,:;)('"\u201D\]]/,
    St = /^[-–—]$/,
    Gt = / /,
    Lt = function (e, t, n = !0) {
      let a = "";
      return (
        e.forEach((e) => {
          let n = e.pre || "",
            r = e.post || "";
          "some" === t.punctuation &&
            ((n = n.replace(Bt, "")),
            St.test(r) && (r = " "),
            (r = r.replace(Mt, "")),
            (r = r.replace(/\?!+/, "?")),
            (r = r.replace(/!+/, "!")),
            (r = r.replace(/\?+/, "?")),
            (r = r.replace(/\.{2,}/, "")),
            e.tags.has("Abbreviation") && (r = r.replace(/\./, ""))),
            "some" === t.whitespace &&
              ((n = n.replace(/\s/, "")), (r = r.replace(/\s+/, " "))),
            t.keepPunct ||
              ((n = n.replace(Bt, "")),
              (r = "-" === r ? " " : r.replace(Ft, "")));
          let o = e[t.form || "text"] || e.normal || "";
          "implicit" === t.form && (o = e.implicit || e.text),
            "root" === t.form &&
              e.implicit &&
              (o = e.root || e.implicit || e.normal),
            ("machine" !== t.form &&
              "implicit" !== t.form &&
              "root" !== t.form) ||
              !e.implicit ||
              (r && Gt.test(r)) ||
              (r += " "),
            (a += n + o + r);
        }),
        !1 === n && (a = a.trim()),
        !0 === t.lowerCase && (a = a.toLowerCase()),
        a
      );
    },
    Ht = {
      text: { form: "text" },
      normal: {
        whitespace: "some",
        punctuation: "some",
        case: "some",
        unicode: "some",
        form: "normal",
      },
      machine: {
        keepSpace: !1,
        whitespace: "some",
        punctuation: "some",
        case: "none",
        unicode: "some",
        form: "machine",
      },
      root: {
        keepSpace: !1,
        whitespace: "some",
        punctuation: "some",
        case: "some",
        unicode: "some",
        form: "root",
      },
      implicit: { form: "implicit" },
    };
  (Ht.clean = Ht.normal), (Ht.reduced = Ht.root);
  const qt = Ht;
  let Wt = [],
    Jt = 0;
  for (; Jt < 64; ) Wt[Jt] = 0 | (4294967296 * Math.sin(++Jt % Math.PI));
  function _t(e) {
    let t,
      n,
      a,
      r = [(t = 1732584193), (n = 4023233417), ~t, ~n],
      o = [],
      i = decodeURI(encodeURI(e)) + "",
      s = i.length;
    for (e = (--s / 4 + 2) | 15, o[--e] = 8 * s; ~s; )
      o[s >> 2] |= i.charCodeAt(s) << (8 * s--);
    for (Jt = i = 0; Jt < e; Jt += 16) {
      for (
        s = r;
        i < 64;
        s = [
          (a = s[3]),
          t +
            (((a =
              s[0] +
              [(t & n) | (~t & a), (a & t) | (~a & n), t ^ n ^ a, n ^ (t | ~a)][
                (s = i >> 4)
              ] +
              Wt[i] +
              ~~o[Jt | (15 & [i, 5 * i + 1, 3 * i + 5, 7 * i][s])]) <<
              (s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][
                4 * s + (i++ % 4)
              ])) |
              (a >>> -s)),
          t,
          n,
        ]
      )
        (t = 0 | s[1]), (n = s[2]);
      for (i = 4; i; ) r[--i] += s[i];
    }
    for (e = ""; i < 32; )
      e += ((r[i >> 3] >> (4 * (1 ^ i++))) & 15).toString(16);
    return e;
  }
  const Kt = { text: !0, terms: !0 };
  let Ut = {
    case: "none",
    unicode: "some",
    form: "machine",
    punctuation: "some",
  };
  const Rt = function (e, t) {
      return Object.assign({}, e, t);
    },
    Yt = {
      text: (e) => Lt(e, { keepPunct: !0 }, !1),
      normal: (e) => Lt(e, Rt(qt.normal, { keepPunct: !0 }), !1),
      implicit: (e) => Lt(e, Rt(qt.implicit, { keepPunct: !0 }), !1),
      machine: (e) => Lt(e, Ut, !1),
      root: (e) => Lt(e, Rt(Ut, { form: "root" }), !1),
      hash: (e) => _t(Lt(e, { keepPunct: !0 }, !1)),
      offset: (e) => {
        let t = Yt.text(e).length;
        return {
          index: e[0].offset.index,
          start: e[0].offset.start,
          length: t,
        };
      },
      terms: (e) =>
        e.map((e) => {
          let t = Object.assign({}, e);
          return (t.tags = Array.from(e.tags)), t;
        }),
      confidence: (e, t, n) => t.eq(n).confidence(),
      syllables: (e, t, n) => t.eq(n).syllables(),
      sentence: (e, t, n) => t.eq(n).fullSentence().text(),
      dirty: (e) => e.some((e) => !0 === e.dirty),
    };
  (Yt.sentences = Yt.sentence), (Yt.clean = Yt.normal), (Yt.reduced = Yt.root);
  const Qt = {
    json: function (e) {
      let t =
        ((n = this),
        "string" == typeof (a = (a = e) || {}) && (a = {}),
        (a = Object.assign({}, Kt, a)).offset && n.compute("offset"),
        n.docs.map((e, t) => {
          let r = {};
          return (
            Object.keys(a).forEach((o) => {
              a[o] && Yt[o] && (r[o] = Yt[o](e, n, t));
            }),
            r
          );
        }));
      var n, a;
      return "number" == typeof e ? t[e] : t;
    },
  };
  Qt.data = Qt.json;
  const Zt = Qt,
    Xt = "[0m",
    en = {
      green: (e) => "[32m" + e + Xt,
      red: (e) => "[31m" + e + Xt,
      blue: (e) => "[34m" + e + Xt,
      magenta: (e) => "[35m" + e + Xt,
      cyan: (e) => "[36m" + e + Xt,
      yellow: (e) => "[33m" + e + Xt,
      black: (e) => "[30m" + e + Xt,
      dim: (e) => "[2m" + e + Xt,
      i: (e) => "[3m" + e + Xt,
    },
    tn = function (e) {
      let t = e.pre || "",
        n = e.post || "";
      return t + e.text + n;
    },
    nn = function (e, t) {
      let n = (function (e, t) {
          let n = {};
          return (
            Object.keys(t).forEach((a) => {
              e.match(a).fullPointer.forEach((e) => {
                n[e[3]] = { fn: t[a], end: e[2] };
              });
            }),
            n
          );
        })(e, t),
        a = "";
      return (
        e.docs.forEach((t, r) => {
          for (let o = 0; o < t.length; o += 1) {
            let i = t[o];
            if (n.hasOwnProperty(i.id)) {
              let { fn: s, end: l } = n[i.id],
                u = e.update([[r, o, l]]);
              (a += t[o].pre || ""),
                (a += s(u)),
                (o = l - 1),
                (a += t[o].post || "");
            } else a += tn(i);
          }
        }),
        a
      );
    },
    an = {
      debug: function (e = {}) {
        let t = this;
        if ("string" == typeof e) {
          let t = {};
          (t[e] = !0), (e = t);
        }
        return "undefined" != typeof window && window.document
          ? ((function (e) {
              console.log("%c -=-=- ", "background-color:#6699cc;"),
                e.forEach((e) => {
                  console.groupCollapsed(e.text());
                  let t = e.docs[0].map((e) => {
                    let t = e.text || "-";
                    return (
                      e.implicit && (t = "[" + e.implicit + "]"),
                      {
                        text: t,
                        tags: "[" + Array.from(e.tags).join(", ") + "]",
                      }
                    );
                  });
                  console.table(t, ["text", "tags"]), console.groupEnd();
                });
            })(t),
            t)
          : (!1 !== e.tags &&
              ((function (e) {
                let { docs: t, model: n } = e;
                0 === t.length && console.log(en.blue("\n     ──────")),
                  t.forEach((t) => {
                    console.log(en.blue("\n  ┌─────────")),
                      t.forEach((t) => {
                        let a = [...(t.tags || [])],
                          r = t.text || "-";
                        t.sense && (r = `{${t.normal}/${t.sense}}`),
                          t.implicit && (r = "[" + t.implicit + "]"),
                          (r = en.yellow(r));
                        let o = "'" + r + "'";
                        if (t.reference) {
                          let n = e.update([t.reference]).text("normal");
                          o += ` - ${en.dim(en.i("[" + n + "]"))}`;
                        }
                        o = o.padEnd(18);
                        let i =
                          en.blue("  │ ") +
                          en.i(o) +
                          "  - " +
                          (function (e, t) {
                            return (
                              t.one.tagSet &&
                                (e = e.map((e) => {
                                  if (!t.one.tagSet.hasOwnProperty(e)) return e;
                                  const n = t.one.tagSet[e].color || "blue";
                                  return en[n](e);
                                })),
                              e.join(", ")
                            );
                          })(a, n);
                        console.log(i);
                      });
                  });
              })(t),
              console.log("\n")),
            !0 === e.chunks &&
              ((function (e) {
                let { docs: t } = e;
                console.log(""),
                  t.forEach((e) => {
                    let t = [];
                    e.forEach((e) => {
                      "Noun" === e.chunk
                        ? t.push(en.blue(e.implicit || e.normal))
                        : "Verb" === e.chunk
                        ? t.push(en.green(e.implicit || e.normal))
                        : "Adjective" === e.chunk
                        ? t.push(en.yellow(e.implicit || e.normal))
                        : "Pivot" === e.chunk
                        ? t.push(en.red(e.implicit || e.normal))
                        : t.push(e.implicit || e.normal);
                    }),
                      console.log(t.join(" "), "\n");
                  });
              })(t),
              console.log("\n")),
            !0 === e.highlight &&
              ((function (e) {
                if (!e.found) return;
                let t = {};
                e.fullPointer.forEach((e) => {
                  (t[e[0]] = t[e[0]] || []), t[e[0]].push(e);
                }),
                  Object.keys(t).forEach((n) => {
                    let a = e.update([[Number(n)]]).text();
                    e
                      .update(t[n])
                      .json({ offset: !0 })
                      .forEach((e, t) => {
                        a = (function (e, t, n) {
                          let a = ((e, t, n) => {
                            let a = 9 * n,
                              r = t.start + a,
                              o = r + t.length;
                            return [
                              e.substring(0, r),
                              e.substring(r, o),
                              e.substring(o, e.length),
                            ];
                          })(e, t, n);
                          return `${a[0]}${en.blue(a[1])}${a[2]}`;
                        })(a, e.offset, t);
                      }),
                      console.log(a);
                  });
              })(t),
              console.log("\n")),
            t);
      },
      out: function (e) {
        if (((t = e), "[object Object]" === Object.prototype.toString.call(t)))
          return nn(this, e);
        var t;
        if ("text" === e) return this.text();
        if ("normal" === e) return this.text("normal");
        if ("root" === e) return this.text("root");
        if ("machine" === e || "reduced" === e) return this.text("machine");
        if ("hash" === e || "md5" === e) return _t(this.text());
        if ("json" === e) return this.json();
        if ("offset" === e || "offsets" === e)
          return this.compute("offset"), this.json({ offset: !0 });
        if ("array" === e) {
          let e = this.docs.map((e) =>
            e.reduce((e, t) => e + t.pre + t.text + t.post, "").trim()
          );
          return e.filter((e) => e);
        }
        if ("freq" === e || "frequency" === e || "topk" === e)
          return (function (e) {
            let t = {};
            e.forEach((e) => {
              (t[e] = t[e] || 0), (t[e] += 1);
            });
            let n = Object.keys(t).map((e) => ({ normal: e, count: t[e] }));
            return n.sort((e, t) => (e.count > t.count ? -1 : 0));
          })(this.json({ normal: !0 }).map((e) => e.normal));
        if ("terms" === e) {
          let e = [];
          return (
            this.docs.forEach((t) => {
              let n = t.terms.map((e) => e.text);
              (n = n.filter((e) => e)), (e = e.concat(n));
            }),
            e
          );
        }
        return "tags" === e
          ? this.docs.map((e) =>
              e.reduce(
                (e, t) => ((e[t.implicit || t.normal] = Array.from(t.tags)), e),
                {}
              )
            )
          : "debug" === e
          ? this.debug()
          : this.text();
      },
      wrap: function (e) {
        return nn(this, e);
      },
    },
    rn = an,
    on = {
      text: function (e) {
        let t = {};
        var n;
        if (
          (e && "string" == typeof e && qt.hasOwnProperty(e)
            ? (t = Object.assign({}, qt[e]))
            : e &&
              ((n = e),
              "[object Object]" === Object.prototype.toString.call(n)) &&
              (t = Object.assign({}, e)),
          void 0 === t.keepSpace && this.pointer && (t.keepSpace = !1),
          void 0 === t.keepPunct && this.pointer)
        ) {
          let e = this.pointer[0];
          e && e[1] ? (t.keepPunct = !1) : (t.keepPunct = !0);
        }
        return (
          void 0 === t.keepPunct && (t.keepPunct = !0),
          void 0 === t.keepSpace && (t.keepSpace = !0),
          (function (e, t) {
            let n = "";
            if (!e || !e[0] || !e[0][0]) return n;
            for (let a = 0; a < e.length; a += 1) n += Lt(e[a], t, !0);
            if ((t.keepSpace || (n = n.trim()), !1 === t.keepPunct)) {
              e[0][0].tags.has("Emoticon") || (n = n.replace(Bt, ""));
              let t = e[e.length - 1];
              t[t.length - 1].tags.has("Emoticon") || (n = n.replace(Ft, ""));
            }
            return !0 === t.cleanWhitespace && (n = n.trim()), n;
          })(this.docs, t)
        );
      },
    },
    sn = Object.assign({}, rn, on, Zt, $t),
    ln = {
      api: function (e) {
        Object.assign(e.prototype, sn);
      },
      methods: { one: { hash: _t } },
    },
    un = function (e, t) {
      if (e[0] !== t[0]) return !1;
      let [, n, a] = e,
        [, r, o] = t;
      return (n <= r && a > r) || (r <= n && o > n);
    },
    cn = function (e) {
      let t = {};
      return (
        e.forEach((e) => {
          (t[e[0]] = t[e[0]] || []), t[e[0]].push(e);
        }),
        t
      );
    },
    hn = function (e, t) {
      let n = cn(t),
        a = [];
      return (
        e.forEach((e) => {
          let [t] = e,
            r = n[t] || [];
          if (
            ((r = r.filter((t) =>
              (function (e, t) {
                return e[1] <= t[1] && t[2] <= e[2];
              })(e, t)
            )),
            0 === r.length)
          )
            return void a.push({ passthrough: e });
          r = r.sort((e, t) => e[1] - t[1]);
          let o = e;
          r.forEach((e, t) => {
            let n = (function (e, t) {
              let [n, a] = e,
                r = t[1],
                o = t[2],
                i = {};
              if (a < r) {
                let t = r < e[2] ? r : e[2];
                i.before = [n, a, t];
              }
              return (i.match = t), e[2] > o && (i.after = [n, o, e[2]]), i;
            })(o, e);
            r[t + 1]
              ? (a.push({ before: n.before, match: n.match }),
                n.after && (o = n.after))
              : a.push(n);
          });
        }),
        a
      );
    },
    dn = {
      one: {
        termList: function (e) {
          let t = [];
          for (let n = 0; n < e.length; n += 1)
            for (let a = 0; a < e[n].length; a += 1) t.push(e[n][a]);
          return t;
        },
        getDoc: function (e, t) {
          let n = [];
          return (
            e.forEach((a, r) => {
              if (!a) return;
              let [o, i, s, l, u] = a,
                c = t[o] || [];
              if (
                (void 0 === i && (i = 0),
                void 0 === s && (s = c.length),
                !l || (c[i] && c[i].id === l))
              )
                c = c.slice(i, s);
              else {
                let n = (function (e, t, n) {
                  for (let a = 0; a < 20; a += 1) {
                    if (t[n - a]) {
                      let r = t[n - a].findIndex((t) => t.id === e);
                      if (-1 !== r) return [n - a, r];
                    }
                    if (t[n + a]) {
                      let r = t[n + a].findIndex((t) => t.id === e);
                      if (-1 !== r) return [n + a, r];
                    }
                  }
                  return null;
                })(l, t, o);
                if (null !== n) {
                  let a = s - i;
                  c = t[n[0]].slice(n[1], n[1] + a);
                  let o = c[0] ? c[0].id : null;
                  e[r] = [n[0], n[1], n[1] + a, o];
                }
              }
              0 !== c.length &&
                i !== s &&
                (u &&
                  c[c.length - 1].id !== u &&
                  (c = (function (e, t) {
                    let [n, a, , , r] = e,
                      o = t[n],
                      i = o.findIndex((e) => e.id === r);
                    return (
                      -1 === i
                        ? ((e[2] = t[n].length),
                          (e[4] = o.length ? o[o.length - 1].id : null))
                        : (e[2] = i),
                      t[n].slice(a, e[2] + 1)
                    );
                  })(a, t)),
                n.push(c));
            }),
            (n = n.filter((e) => e.length > 0)),
            n
          );
        },
        pointer: { indexN: cn, splitAll: hn },
      },
    },
    mn = function (e, t) {
      let n = e.concat(t),
        a = cn(n),
        r = [];
      return (
        n.forEach((e) => {
          let [t] = e;
          if (1 === a[t].length) return void r.push(e);
          let n = a[t].filter((t) => un(e, t));
          n.push(e);
          let o = (function (e) {
            let t = e[0][1],
              n = e[0][2];
            return (
              e.forEach((e) => {
                e[1] < t && (t = e[1]), e[2] > n && (n = e[2]);
              }),
              [e[0][0], t, n]
            );
          })(n);
          r.push(o);
        }),
        (r = (function (e) {
          let t = {};
          for (let n = 0; n < e.length; n += 1) t[e[n].join(",")] = e[n];
          return Object.values(t);
        })(r)),
        r
      );
    },
    pn = function (e, t) {
      let n = [];
      return (
        hn(e, t).forEach((e) => {
          e.passthrough && n.push(e.passthrough),
            e.before && n.push(e.before),
            e.after && n.push(e.after);
        }),
        n
      );
    },
    gn = (e, t) => {
      return "string" == typeof e ||
        ((n = e), "[object Array]" === Object.prototype.toString.call(n))
        ? t.match(e)
        : e || t.none();
      var n;
    },
    fn = function (e, t) {
      return e.map((e) => {
        let [n, a] = e;
        return t[n] && t[n][a] && (e[3] = t[n][a].id), e;
      });
    },
    yn = {
      union: function (e) {
        e = gn(e, this);
        let t = mn(this.fullPointer, e.fullPointer);
        return (t = fn(t, this.document)), this.toView(t);
      },
    };
  (yn.and = yn.union),
    (yn.intersection = function (e) {
      e = gn(e, this);
      let t = (function (e, t) {
        let n = cn(t),
          a = [];
        return (
          e.forEach((e) => {
            let t = n[e[0]] || [];
            (t = t.filter((t) => un(e, t))),
              0 !== t.length &&
                t.forEach((t) => {
                  let n = (function (e, t) {
                    let n = e[1] < t[1] ? t[1] : e[1],
                      a = e[2] > t[2] ? t[2] : e[2];
                    return n < a ? [e[0], n, a] : null;
                  })(e, t);
                  n && a.push(n);
                });
          }),
          a
        );
      })(this.fullPointer, e.fullPointer);
      return (t = fn(t, this.document)), this.toView(t);
    }),
    (yn.not = function (e) {
      e = gn(e, this);
      let t = pn(this.fullPointer, e.fullPointer);
      return (t = fn(t, this.document)), this.toView(t);
    }),
    (yn.difference = yn.not),
    (yn.complement = function () {
      let e = this.all(),
        t = pn(e.fullPointer, this.fullPointer);
      return (t = fn(t, this.document)), this.toView(t);
    }),
    (yn.settle = function () {
      let e = this.fullPointer;
      return (
        e.forEach((t) => {
          e = mn(e, [t]);
        }),
        (e = fn(e, this.document)),
        this.update(e)
      );
    });
  const bn = {
      methods: dn,
      api: function (e) {
        Object.assign(e.prototype, yn);
      },
    },
    vn = function (e) {
      return !0 === e.optional || !0 === e.negative
        ? null
        : e.tag
        ? "#" + e.tag
        : e.word
        ? e.word
        : e.switch
        ? `%${e.switch}%`
        : null;
    },
    wn = {
      lib: {
        buildNet: function (e) {
          let t = this.methods().one.buildNet(e, this.world());
          return (t.isNet = !0), t;
        },
      },
      api: function (e) {
        e.prototype.sweep = function (e, t = {}) {
          const { world: n, docs: a } = this,
            { methods: r } = n;
          let o = r.one.bulkMatch(a, e, this.methods, t);
          !1 !== t.tagger && r.one.bulkTagger(o, a, this.world),
            (o = o.map((e) => {
              let t = e.pointer,
                n = a[t[0]][t[1]],
                r = t[2] - t[1];
              return (
                n.index && (e.pointer = [n.index[0], n.index[1], t[1] + r]), e
              );
            }));
          let i = o.map((e) => e.pointer);
          return (
            (o = o.map(
              (e) => (
                (e.view = this.update([e.pointer])),
                delete e.regs,
                delete e.needs,
                delete e.pointer,
                delete e._expanded,
                e
              )
            )),
            { view: this.update(i), found: o }
          );
        };
      },
      methods: {
        one: {
          buildNet: function (e, t) {
            e = (function (e, t) {
              const n = t.methods.one.parseMatch;
              return (
                e.forEach((e) => {
                  (e.regs = n(e.match, {}, t)),
                    "string" == typeof e.ifNo && (e.ifNo = [e.ifNo]),
                    e.notIf && (e.notIf = n(e.notIf, {}, t)),
                    (e.needs = (function (e) {
                      let t = [];
                      return (
                        e.forEach((e) => {
                          t.push(vn(e)),
                            "and" === e.operator &&
                              e.choices &&
                              e.choices.forEach((e) => {
                                e.forEach((e) => {
                                  t.push(vn(e));
                                });
                              });
                        }),
                        t.filter((e) => e)
                      );
                    })(e.regs));
                  let { wants: a, count: r } = (function (e) {
                    let t = [],
                      n = 0;
                    return (
                      e.forEach((e) => {
                        "or" !== e.operator ||
                          e.optional ||
                          e.negative ||
                          (e.fastOr &&
                            Array.from(e.fastOr).forEach((e) => {
                              t.push(e);
                            }),
                          e.choices &&
                            e.choices.forEach((e) => {
                              e.forEach((e) => {
                                let n = vn(e);
                                n && t.push(n);
                              });
                            }),
                          (n += 1));
                      }),
                      { wants: t, count: n }
                    );
                  })(e.regs);
                  (e.wants = a),
                    (e.minWant = r),
                    (e.minWords = e.regs.filter((e) => !e.optional).length);
                }),
                e
              );
            })(e, t);
            let n = {};
            e.forEach((e) => {
              e.needs.forEach((t) => {
                (n[t] = n[t] || []), n[t].push(e);
              }),
                e.wants.forEach((t) => {
                  (n[t] = n[t] || []), n[t].push(e);
                });
            }),
              Object.keys(n).forEach((e) => {
                let t = {};
                n[e] = n[e].filter(
                  (e) => !t[e.match] && ((t[e.match] = !0), !0)
                );
              });
            let a = e.filter(
              (e) => 0 === e.needs.length && 0 === e.wants.length
            );
            return { hooks: n, always: a };
          },
          bulkMatch: function (e, t, n, a = {}) {
            let r = n.one.cacheDoc(e),
              o =
                ((i = r),
                (s = t.hooks),
                i.map((e, t) => {
                  let n = [];
                  Object.keys(s).forEach((e) => {
                    i[t].has(e) && (n = n.concat(s[e]));
                  });
                  let a = {};
                  return (
                    (n = n.filter(
                      (e) => !a[e.match] && ((a[e.match] = !0), !0)
                    )),
                    n
                  );
                }));
            var i, s;
            return (
              (o = (function (e, t) {
                return e.map((e, n) => {
                  let a = t[n];
                  return (e = (e = e.filter((e) =>
                    e.needs.every((e) => a.has(e))
                  )).filter(
                    (e) =>
                      void 0 === e.ifNo || !0 !== e.ifNo.some((e) => a.has(e))
                  )).filter(
                    (e) =>
                      0 === e.wants.length ||
                      e.wants.filter((e) => a.has(e)).length >= e.minWant
                  );
                });
              })(o, r)),
              t.always.length > 0 && (o = o.map((e) => e.concat(t.always))),
              (o = (function (e, t) {
                return e.map((e, n) => {
                  let a = t[n].length;
                  return (e = e.filter((e) => a >= e.minWords));
                });
              })(o, e)),
              (function (e, t, n, a, r) {
                let o = [];
                for (let n = 0; n < e.length; n += 1)
                  for (let i = 0; i < e[n].length; i += 1) {
                    let s = e[n][i],
                      l = a.one.match([t[n]], s);
                    if (
                      l.ptrs.length > 0 &&
                      (l.ptrs.forEach((e) => {
                        e[0] = n;
                        let t = Object.assign({}, s, { pointer: e });
                        void 0 !== s.unTag && (t.unTag = s.unTag), o.push(t);
                      }),
                      !0 === r.matchOne)
                    )
                      return [o[0]];
                  }
                return o;
              })(o, e, 0, n, a)
            );
          },
          bulkTagger: function (e, t, n) {
            const { model: a, methods: r } = n,
              { getDoc: o, setTag: i, unTag: s } = r.one,
              l = r.two.looksPlural;
            return 0 === e.length
              ? e
              : (("undefined" != typeof process && process.env
                  ? process.env
                  : self.env || {}
                ).DEBUG_TAGS && console.log(`\n\n  [32m→ ${e.length} post-tagger:[0m`),
                e.map((e) => {
                  if (!e.tag && !e.chunk && !e.unTag) return;
                  let r = e.reason || e.match,
                    u = o([e.pointer], t)[0];
                  if (!0 === e.safe) {
                    if (
                      !1 ===
                      (function (e, t, n) {
                        let a = n.one.tagSet;
                        if (!a.hasOwnProperty(t)) return !0;
                        let r = a[t].not || [];
                        for (let t = 0; t < e.length; t += 1) {
                          let n = e[t];
                          for (let e = 0; e < r.length; e += 1)
                            if (!0 === n.tags.has(r[e])) return !1;
                        }
                        return !0;
                      })(u, e.tag, a)
                    )
                      return;
                    if ("-" === u[u.length - 1].post) return;
                  }
                  if (
                    void 0 !== e.tag &&
                    (i(u, e.tag, n, e.safe, `[post] '${r}'`),
                    "Noun" === e.tag && l)
                  ) {
                    let t = u[u.length - 1];
                    l(t.text)
                      ? i([t], "Plural", n, e.safe, "quick-plural")
                      : i([t], "Singular", n, e.safe, "quick-singular");
                  }
                  void 0 !== e.unTag && s(u, e.unTag, n, e.safe, r),
                    e.chunk && u.forEach((t) => (t.chunk = e.chunk));
                }));
          },
        },
      },
    },
    kn = / /,
    Pn = function (e, t) {
      "Noun" === t && (e.chunk = t), "Verb" === t && (e.chunk = t);
    },
    jn = function (e, t, n, a) {
      if (!0 === e.tags.has(t)) return null;
      if ("." === t) return null;
      let r = n[t];
      if (r) {
        if (r.not && r.not.length > 0)
          for (let t = 0; t < r.not.length; t += 1) {
            if (!0 === a && e.tags.has(r.not[t])) return null;
            e.tags.delete(r.not[t]);
          }
        if (r.parents && r.parents.length > 0)
          for (let t = 0; t < r.parents.length; t += 1)
            e.tags.add(r.parents[t]), Pn(e, r.parents[t]);
      }
      return e.tags.add(t), (e.dirty = !0), Pn(e, t), !0;
    },
    An = function (e, t, n = {}, a, r) {
      const o = n.model.one.tagSet || {};
      if (!t) return;
      const i =
        "undefined" != typeof process && process.env
          ? process.env
          : self.env || {};
      var s;
      if (
        (i &&
          i.DEBUG_TAGS &&
          ((e, t, n = "") => {
            let a = e.map((e) => e.text || "[" + e.implicit + "]").join(" ");
            var r;
            "string" != typeof t &&
              t.length > 2 &&
              (t = t.slice(0, 2).join(", #") + " +"),
              (t = "string" != typeof t ? t.join(", #") : t),
              console.log(
                ` ${((r = a), "[33m[3m" + r + "[0m").padEnd(24)} [32m→[0m #${t.padEnd(22)}  ${((
                  e
                ) => "[3m" + e + "[0m")(n)}`
              );
          })(e, t, r),
        1 != ((s = t), "[object Array]" === Object.prototype.toString.call(s)))
      )
        if ("string" == typeof t)
          if (((t = t.trim()), kn.test(t)))
            !(function (e, t, n, a) {
              let r = t.split(kn);
              e.forEach((e, t) => {
                let o = r[t];
                o && ((o = o.replace(/^#/, "")), jn(e, o, n, a));
              });
            })(e, t, o, a);
          else {
            t = t.replace(/^#/, "");
            for (let n = 0; n < e.length; n += 1) jn(e[n], t, o, a);
          }
        else console.warn(`compromise: Invalid tag '${t}'`);
      else t.forEach((t) => An(e, t, n, a));
    },
    xn = An,
    Dn = function (e) {
      return (
        (e.children = e.children || []),
        (e._cache = e._cache || {}),
        (e.props = e.props || {}),
        (e._cache.parents = e._cache.parents || []),
        (e._cache.children = e._cache.children || []),
        e
      );
    },
    In = /^ *(#|\/\/)/,
    Nn = function (e) {
      let t = e.trim().split(/->/),
        n = [];
      t.forEach((e) => {
        n = n.concat(
          (function (e) {
            if (!(e = e.trim())) return null;
            if (/^\[/.test(e) && /\]$/.test(e)) {
              let t = (e = (e = e.replace(/^\[/, "")).replace(/\]$/, "")).split(
                /,/
              );
              return (
                (t = t.map((e) => e.trim()).filter((e) => e)),
                (t = t.map((e) => Dn({ id: e }))),
                t
              );
            }
            return [Dn({ id: e })];
          })(e)
        );
      }),
        (n = n.filter((e) => e));
      let a = n[0];
      for (let e = 1; e < n.length; e += 1) a.children.push(n[e]), (a = n[e]);
      return n[0];
    },
    En = (e, t) => {
      let n = [],
        a = [e];
      for (; a.length > 0; ) {
        let e = a.pop();
        n.push(e),
          e.children &&
            e.children.forEach((n) => {
              t && t(e, n), a.push(n);
            });
      }
      return n;
    },
    Tn = (e) => "[object Array]" === Object.prototype.toString.call(e),
    On = (e) => (e = e || "").trim(),
    Cn = function (e = []) {
      return "string" == typeof e
        ? (function (e) {
            let t = e.split(/\r?\n/),
              n = [];
            t.forEach((e) => {
              if (!e.trim() || In.test(e)) return;
              let t = ((e) => {
                const t = /^( {2}|\t)/;
                let n = 0;
                for (; t.test(e); ) (e = e.replace(t, "")), (n += 1);
                return n;
              })(e);
              n.push({ indent: t, node: Nn(e) });
            });
            let a = (function (e) {
              let t = { children: [] };
              return (
                e.forEach((n, a) => {
                  0 === n.indent
                    ? (t.children = t.children.concat(n.node))
                    : e[a - 1] &&
                      (function (e, t) {
                        let n = e[t].indent;
                        for (; t >= 0; t -= 1) if (e[t].indent < n) return e[t];
                        return e[0];
                      })(e, a).node.children.push(n.node);
                }),
                t
              );
            })(n);
            return (a = Dn(a)), a;
          })(e)
        : Tn(e)
        ? (function (e) {
            let t = {};
            e.forEach((e) => {
              t[e.id] = e;
            });
            let n = Dn({});
            return (
              e.forEach((e) => {
                if ((e = Dn(e)).parent)
                  if (t.hasOwnProperty(e.parent)) {
                    let n = t[e.parent];
                    delete e.parent, n.children.push(e);
                  } else console.warn(`[Grad] - missing node '${e.parent}'`);
                else n.children.push(e);
              }),
              n
            );
          })(e)
        : (En((t = e)).forEach(Dn), t);
      var t;
    },
    Vn = function (e, t) {
      let n = "-> ";
      t && (n = "[2m→ [0m");
      let a = "";
      return (
        En(e).forEach((e, r) => {
          let o = e.id || "";
          if ((t && (o = ((e) => "[31m" + e + "[0m")(o)), 0 === r && !e.id)) return;
          let i = e._cache.parents.length;
          a += "    ".repeat(i) + n + o + "\n";
        }),
        a
      );
    },
    zn = function (e) {
      let t = En(e);
      t.forEach((e) => {
        delete (e = Object.assign({}, e)).children;
      });
      let n = t[0];
      return n && !n.id && 0 === Object.keys(n.props).length && t.shift(), t;
    },
    $n = { text: Vn, txt: Vn, array: zn, flat: zn },
    Fn = function (e, t) {
      return "nested" === t || "json" === t
        ? e
        : "debug" === t
        ? (console.log(Vn(e, !0)), null)
        : $n.hasOwnProperty(t)
        ? $n[t](e)
        : e;
    },
    Bn = (e) => {
      En(e, (e, t) => {
        e.id &&
          ((e._cache.parents = e._cache.parents || []),
          (t._cache.parents = e._cache.parents.concat([e.id])));
      });
    },
    Mn = /\//;
  class Sn {
    constructor(e = {}) {
      Object.defineProperty(this, "json", {
        enumerable: !1,
        value: e,
        writable: !0,
      });
    }
    get children() {
      return this.json.children;
    }
    get id() {
      return this.json.id;
    }
    get found() {
      return this.json.id || this.json.children.length > 0;
    }
    props(e = {}) {
      let t = this.json.props || {};
      return (
        "string" == typeof e && (t[e] = !0),
        (this.json.props = Object.assign(t, e)),
        this
      );
    }
    get(e) {
      if (((e = On(e)), !Mn.test(e))) {
        let t = this.json.children.find((t) => t.id === e);
        return new Sn(t);
      }
      let t =
        ((e, t) => {
          let n = ((e) =>
            "string" != typeof e ? e : (e = e.replace(/^\//, "")).split(/\//))(
            (t = t || "")
          );
          for (let t = 0; t < n.length; t += 1) {
            let a = e.children.find((e) => e.id === n[t]);
            if (!a) return null;
            e = a;
          }
          return e;
        })(this.json, e) || Dn({});
      return new Sn(t);
    }
    add(e, t = {}) {
      if (Tn(e)) return e.forEach((e) => this.add(On(e), t)), this;
      e = On(e);
      let n = Dn({ id: e, props: t });
      return this.json.children.push(n), new Sn(n);
    }
    remove(e) {
      return (
        (e = On(e)),
        (this.json.children = this.json.children.filter((t) => t.id !== e)),
        this
      );
    }
    nodes() {
      return En(this.json).map(
        (e) => (delete (e = Object.assign({}, e)).children, e)
      );
    }
    cache() {
      return (
        ((e) => {
          let t = En(e, (e, t) => {
              e.id &&
                ((e._cache.parents = e._cache.parents || []),
                (e._cache.children = e._cache.children || []),
                (t._cache.parents = e._cache.parents.concat([e.id])));
            }),
            n = {};
          t.forEach((e) => {
            e.id && (n[e.id] = e);
          }),
            t.forEach((e) => {
              e._cache.parents.forEach((t) => {
                n.hasOwnProperty(t) && n[t]._cache.children.push(e.id);
              });
            }),
            (e._cache.children = Object.keys(n));
        })(this.json),
        this
      );
    }
    list() {
      return En(this.json);
    }
    fillDown() {
      var e;
      return (
        (e = this.json),
        En(e, (e, t) => {
          t.props = ((e, t) => (
            Object.keys(t).forEach((n) => {
              if (t[n] instanceof Set) {
                let a = e[n] || new Set();
                e[n] = new Set([...a, ...t[n]]);
              } else if (
                ((e) => e && "object" == typeof e && !Array.isArray(e))(t[n])
              ) {
                let a = e[n] || {};
                e[n] = Object.assign({}, t[n], a);
              } else
                Tn(t[n])
                  ? (e[n] = t[n].concat(e[n] || []))
                  : void 0 === e[n] && (e[n] = t[n]);
            }),
            e
          ))(t.props, e.props);
        }),
        this
      );
    }
    depth() {
      Bn(this.json);
      let e = En(this.json),
        t = e.length > 1 ? 1 : 0;
      return (
        e.forEach((e) => {
          if (0 === e._cache.parents.length) return;
          let n = e._cache.parents.length + 1;
          n > t && (t = n);
        }),
        t
      );
    }
    out(e) {
      return Bn(this.json), Fn(this.json, e);
    }
    debug() {
      return Bn(this.json), Fn(this.json, "debug"), this;
    }
  }
  const Gn = function (e) {
    let t = Cn(e);
    return new Sn(t);
  };
  Gn.prototype.plugin = function (e) {
    e(this);
  };
  const Ln = {
      Noun: "blue",
      Verb: "green",
      Negative: "green",
      Date: "red",
      Value: "red",
      Adjective: "magenta",
      Preposition: "cyan",
      Conjunction: "cyan",
      Determiner: "cyan",
      Hyphenated: "cyan",
      Adverb: "cyan",
    },
    Hn = function (e) {
      if (Ln.hasOwnProperty(e.id)) return Ln[e.id];
      if (Ln.hasOwnProperty(e.is)) return Ln[e.is];
      let t = e._cache.parents.find((e) => Ln[e]);
      return Ln[t];
    },
    qn = function (e) {
      return e ? ("string" == typeof e ? [e] : e) : [];
    },
    Wn = {
      one: {
        setTag: xn,
        unTag: function (e, t, n) {
          t = t.trim().replace(/^#/, "");
          for (let a = 0; a < e.length; a += 1) {
            let r = e[a];
            if ("*" === t) {
              r.tags.clear();
              continue;
            }
            let o = n[t];
            if (o && o.children.length > 0)
              for (let e = 0; e < o.children.length; e += 1)
                r.tags.delete(o.children[e]);
            r.tags.delete(t);
          }
        },
        addTags: function (e, t) {
          Object.keys(t).length > 0 &&
            (e = (function (e) {
              return (
                Object.keys(e).forEach((t) => {
                  (e[t] = Object.assign({}, e[t])), (e[t].novel = !0);
                }),
                e
              );
            })(e)),
            (e = (function (e, t) {
              return (
                (e = (function (e, t) {
                  return (
                    Object.keys(e).forEach((n) => {
                      e[n].isA && (e[n].is = e[n].isA),
                        e[n].notA && (e[n].not = e[n].notA),
                        e[n].is &&
                          "string" == typeof e[n].is &&
                          (t.hasOwnProperty(e[n].is) ||
                            e.hasOwnProperty(e[n].is) ||
                            (e[e[n].is] = {})),
                        e[n].not &&
                          "string" == typeof e[n].not &&
                          !e.hasOwnProperty(e[n].not) &&
                          (t.hasOwnProperty(e[n].not) ||
                            e.hasOwnProperty(e[n].not) ||
                            (e[e[n].not] = {}));
                    }),
                    e
                  );
                })(e, t)),
                Object.keys(e).forEach((t) => {
                  (e[t].children = qn(e[t].children)),
                    (e[t].not = qn(e[t].not));
                }),
                Object.keys(e).forEach((t) => {
                  (e[t].not || []).forEach((n) => {
                    e[n] && e[n].not && e[n].not.push(t);
                  });
                }),
                e
              );
            })(e, t));
          const n = (function (e) {
            const t = Object.keys(e).map((t) => {
              let n = e[t];
              const a = {
                not: new Set(n.not),
                also: n.also,
                is: n.is,
                novel: n.novel,
              };
              return { id: t, parent: n.is, props: a, children: [] };
            });
            return Gn(t).cache().fillDown().out("array");
          })(Object.assign({}, t, e));
          return (function (e) {
            const t = {};
            return (
              e.forEach((e) => {
                let { not: n, also: a, is: r, novel: o } = e.props,
                  i = e._cache.parents;
                a && (i = i.concat(a)),
                  (t[e.id] = {
                    is: r,
                    not: n,
                    novel: o,
                    also: a,
                    parents: i,
                    children: e._cache.children,
                    color: Hn(e),
                  });
              }),
              Object.keys(t).forEach((e) => {
                let n = new Set(t[e].not);
                t[e].not.forEach((e) => {
                  t[e] && t[e].children.forEach((e) => n.add(e));
                }),
                  (t[e].not = Array.from(n));
              }),
              t
            );
          })(n);
        },
      },
    },
    Jn = function (e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    },
    _n = {
      tag: function (e, t = "", n) {
        if (!this.found || !e) return this;
        let a = this.termList();
        if (0 === a.length) return this;
        const { methods: r, verbose: o, world: i } = this;
        return (
          !0 === o && console.log(" +  ", e, t || ""),
          Jn(e)
            ? e.forEach((e) => r.one.setTag(a, e, i, n, t))
            : r.one.setTag(a, e, i, n, t),
          this.uncache(),
          this
        );
      },
      tagSafe: function (e, t = "") {
        return this.tag(e, t, !0);
      },
      unTag: function (e, t) {
        if (!this.found || !e) return this;
        let n = this.termList();
        if (0 === n.length) return this;
        const { methods: a, verbose: r, model: o } = this;
        !0 === r && console.log(" -  ", e, t || "");
        let i = o.one.tagSet;
        return (
          Jn(e) ? e.forEach((e) => a.one.unTag(n, e, i)) : a.one.unTag(n, e, i),
          this.uncache(),
          this
        );
      },
      canBe: function (e) {
        e = e.replace(/^#/, "");
        let t = this.model.one.tagSet;
        if (!t.hasOwnProperty(e)) return this;
        let n = t[e].not || [],
          a = [];
        this.document.forEach((e, t) => {
          e.forEach((e, r) => {
            n.find((t) => e.tags.has(t)) && a.push([t, r, r + 1]);
          });
        });
        let r = this.update(a);
        return this.difference(r);
      },
    },
    Kn = _n,
    Un = new Set(["Auxiliary", "Possessive"]),
    Rn = {
      model: { one: { tagSet: {} } },
      compute: {
        tagRank: function (e) {
          const { document: t, world: n } = e,
            a = n.model.one.tagSet;
          t.forEach((e) => {
            e.forEach((e) => {
              let t = Array.from(e.tags);
              e.tagRank = (function (e, t) {
                return (
                  (e = e.sort((e, n) => {
                    if (Un.has(e) || !t.hasOwnProperty(n)) return 1;
                    if (Un.has(n) || !t.hasOwnProperty(e)) return -1;
                    let a = t[e].children || [],
                      r = a.length;
                    return (a = t[n].children || []), r - a.length;
                  })),
                  e
                );
              })(t, a);
            });
          });
        },
      },
      methods: Wn,
      api: function (e) {
        Object.assign(e.prototype, Kn);
      },
      lib: {
        addTags: function (e) {
          const { model: t, methods: n } = this.world(),
            a = t.one.tagSet;
          let r = (0, n.one.addTags)(e, a);
          return (t.one.tagSet = r), this;
        },
      },
    },
    Yn = /([.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s)/g,
    Qn = /^[.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s$/,
    Zn = /((?:\r?\n|\r)+)/,
    Xn = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i,
    ea = /\S/,
    ta = {
      '"': '"',
      "＂": "＂",
      "“": "”",
      "‟": "”",
      "„": "”",
      "⹂": "”",
      "‚": "’",
      "«": "»",
      "‹": "›",
      "‵": "′",
      "‶": "″",
      "‷": "‴",
      "〝": "〞",
      "〟": "〞",
    },
    na = RegExp("(" + Object.keys(ta).join("|") + ")", "g"),
    aa = RegExp("(" + Object.values(ta).join("|") + ")", "g"),
    ra = function (e) {
      if (!e) return !1;
      let t = e.match(aa);
      return null !== t && 1 === t.length;
    },
    oa = /\(/g,
    ia = /\)/g,
    sa = /\S/,
    la = /^\s+/,
    ua = function (e, t) {
      let n = e.split(/[-–—]/);
      if (n.length <= 1) return !1;
      const { prefixes: a, suffixes: r } = t.one;
      return (
        (1 !== n[0].length || !/[a-z]/i.test(n[0])) &&
        !a.hasOwnProperty(n[0]) &&
        ((n[1] = n[1].trim().replace(/[.?!]$/, "")),
        !r.hasOwnProperty(n[1]) &&
          (!0 ===
            /^([a-z\u00C0-\u00FF`"'/]+)[-–—]([a-z0-9\u00C0-\u00FF].*)/i.test(
              e
            ) ||
            !0 === /^([0-9]{1,4})[-–—]([a-z\u00C0-\u00FF`"'/-]+$)/i.test(e)))
      );
    },
    ca = function (e) {
      let t = [];
      const n = e.split(/[-–—]/);
      let a = "-",
        r = e.match(/[-–—]/);
      r && r[0] && (a = r);
      for (let e = 0; e < n.length; e++)
        e === n.length - 1 ? t.push(n[e]) : t.push(n[e] + a);
      return t;
    },
    ha = /\p{L} ?\/ ?\p{L}+$/u,
    da = /\S/,
    ma = /^[!?.]+$/,
    pa = /(\S+)/;
  let ga = [
    ".",
    "?",
    "!",
    ":",
    ";",
    "-",
    "–",
    "—",
    "--",
    "...",
    "(",
    ")",
    "[",
    "]",
    '"',
    "'",
    "`",
    "«",
    "»",
    "*",
  ];
  ga = ga.reduce((e, t) => ((e[t] = !0), e), {});
  const fa = /\p{Letter}/u,
    ya = /[\p{Number}\p{Currency_Symbol}]/u,
    ba = /^[a-z]\.([a-z]\.)+/i,
    va = /[sn]['’]$/,
    wa = /([A-Z]\.)+[A-Z]?,?$/,
    ka = /^[A-Z]\.,?$/,
    Pa = /[A-Z]{2,}('s|,)?$/,
    ja = /([a-z]\.)+[a-z]\.?$/,
    Aa = function (e, t) {
      const n = t.methods.one.killUnicode;
      let a = e.text || "";
      (a = (function (e) {
        let t = (e = (e = (e = e || "").toLowerCase()).trim());
        return (
          (e = (e = (e = e.replace(/[,;.!?]+$/, "")).replace(
            /\u2026/g,
            "..."
          )).replace(/\u2013/g, "-")),
          !1 === /^[:;]/.test(e) &&
            (e = (e = (e = e.replace(/\.{3,}$/g, "")).replace(
              /[",.!:;?)]+$/g,
              ""
            )).replace(/^['"(]+/g, "")),
          "" === (e = (e = e.replace(/[\u200B-\u200D\uFEFF]/g, "")).trim()) &&
            (e = t),
          e.replace(/([0-9]),([0-9])/g, "$1$2")
        );
      })(a)),
        (a = n(a, t)),
        (a = (function (e) {
          return (
            (function (e) {
              return (
                !0 === wa.test(e) ||
                !0 === ja.test(e) ||
                !0 === ka.test(e) ||
                !0 === Pa.test(e)
              );
            })(e) && (e = e.replace(/\./g, "")),
            e
          );
        })(a)),
        (e.normal = a);
    },
    xa = /[ .][A-Z]\.? *$/i,
    Da = /(?:\u2026|\.{2,}) *$/,
    Ia = /\p{L}/u,
    Na = /^[A-Z]\. $/,
    Ea = {
      one: {
        killUnicode: function (e, t) {
          const n = t.model.one.unicode || {};
          let a = (e = e || "").split("");
          return (
            a.forEach((e, t) => {
              n[e] && (a[t] = n[e]);
            }),
            a.join("")
          );
        },
        tokenize: {
          splitSentences: function (e, t) {
            if (
              ((e = e || ""),
              !(e = String(e)) || "string" != typeof e || !1 === sa.test(e))
            )
              return [];
            let n = (function (e) {
                let t = [],
                  n = e.split(Zn);
                for (let e = 0; e < n.length; e++) {
                  let a = n[e].split(Yn);
                  for (let e = 0; e < a.length; e++)
                    a[e + 1] &&
                      !0 === Qn.test(a[e + 1]) &&
                      ((a[e] += a[e + 1]), (a[e + 1] = "")),
                      "" !== a[e] && t.push(a[e]);
                }
                return t;
              })((e = e.replace(" ", " "))),
              a = (function (e) {
                let t = [];
                for (let n = 0; n < e.length; n++) {
                  let a = e[n];
                  if (void 0 !== a && "" !== a) {
                    if (!1 === ea.test(a) || !1 === Xn.test(a)) {
                      if (t[t.length - 1]) {
                        t[t.length - 1] += a;
                        continue;
                      }
                      if (e[n + 1]) {
                        e[n + 1] = a + e[n + 1];
                        continue;
                      }
                    }
                    t.push(a);
                  }
                }
                return t;
              })(n);
            if (
              ((a = (function (e, t) {
                const n = t.methods.one.tokenize.isSentence,
                  a = t.model.one.abbreviations || new Set();
                let r = [];
                for (let t = 0; t < e.length; t++) {
                  let o = e[t];
                  e[t + 1] && !1 === n(o, a)
                    ? (e[t + 1] = o + (e[t + 1] || ""))
                    : o && o.length > 0 && (r.push(o), (e[t] = ""));
                }
                return r;
              })(a, t)),
              (a = (function (e) {
                let t = [];
                for (let n = 0; n < e.length; n += 1) {
                  let a = e[n].match(na);
                  if (null !== a && 1 === a.length) {
                    if (ra(e[n + 1]) && e[n + 1].length < 280) {
                      (e[n] += e[n + 1]),
                        t.push(e[n]),
                        (e[n + 1] = ""),
                        (n += 1);
                      continue;
                    }
                    if (ra(e[n + 2])) {
                      let a = e[n + 1] + e[n + 2];
                      if (a.length < 280) {
                        (e[n] += a),
                          t.push(e[n]),
                          (e[n + 1] = ""),
                          (e[n + 2] = ""),
                          (n += 2);
                        continue;
                      }
                    }
                  }
                  t.push(e[n]);
                }
                return t;
              })(a)),
              (a = (function (e) {
                let t = [];
                for (let n = 0; n < e.length; n += 1) {
                  let a = e[n].match(oa);
                  null !== a &&
                  1 === a.length &&
                  e[n + 1] &&
                  e[n + 1].length < 250 &&
                  null !== e[n + 1].match(ia) &&
                  1 === a.length &&
                  !oa.test(e[n + 1])
                    ? ((e[n] += e[n + 1]),
                      t.push(e[n]),
                      (e[n + 1] = ""),
                      (n += 1))
                    : t.push(e[n]);
                }
                return t;
              })(a)),
              0 === a.length)
            )
              return [e];
            for (let e = 1; e < a.length; e += 1) {
              let t = a[e].match(la);
              null !== t && ((a[e - 1] += t[0]), (a[e] = a[e].replace(la, "")));
            }
            return a;
          },
          isSentence: function (e, t) {
            if (!1 === Ia.test(e)) return !1;
            if (!0 === xa.test(e)) return !1;
            if (3 === e.length && Na.test(e)) return !1;
            if (!0 === Da.test(e)) return !1;
            let n = e
                .replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, "")
                .split(" "),
              a = n[n.length - 1].toLowerCase();
            return !0 !== t.hasOwnProperty(a);
          },
          splitTerms: function (e, t) {
            let n = [],
              a = [];
            if (
              ("number" == typeof (e = e || "") && (e = String(e)),
              (function (e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              })(e))
            )
              return e;
            const r = e.split(pa);
            for (let e = 0; e < r.length; e++)
              !0 !== ua(r[e], t) ? a.push(r[e]) : (a = a.concat(ca(r[e])));
            let o = "";
            for (let e = 0; e < a.length; e++) {
              let t = a[e];
              !0 === da.test(t) &&
              !1 === ga.hasOwnProperty(t) &&
              !1 === ma.test(t)
                ? (n.length > 0
                    ? ((n[n.length - 1] += o), n.push(t))
                    : n.push(o + t),
                  (o = ""))
                : (o += t);
            }
            return (
              o && (0 === n.length && (n[0] = ""), (n[n.length - 1] += o)),
              (n = (function (e) {
                for (let t = 1; t < e.length - 1; t++)
                  ha.test(e[t]) &&
                    ((e[t - 1] += e[t] + e[t + 1]),
                    (e[t] = null),
                    (e[t + 1] = null));
                return e;
              })(n)),
              (n = (function (e) {
                const t = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?[-–—] ?$/,
                  n = /^[0-9]{1,4}([a-z]{1,2})? ?$/;
                for (let a = 0; a < e.length - 1; a += 1)
                  e[a + 1] &&
                    t.test(e[a]) &&
                    n.test(e[a + 1]) &&
                    ((e[a] = e[a] + e[a + 1]), (e[a + 1] = null));
                return e;
              })(n)),
              (n = n.filter((e) => e)),
              n
            );
          },
          splitWhitespace: (e, t) => {
            let {
              str: n,
              pre: a,
              post: r,
            } = (function (e, t) {
              let {
                  prePunctuation: n,
                  postPunctuation: a,
                  emoticons: r,
                } = t.one,
                o = e,
                i = "",
                s = "",
                l = Array.from(e);
              if (r.hasOwnProperty(e.trim()))
                return { str: e.trim(), pre: i, post: " " };
              let u = l.length;
              for (let e = 0; e < u; e += 1) {
                let e = l[0];
                if (!0 !== n[e]) {
                  if (("+" === e || "-" === e) && ya.test(l[1])) break;
                  if ("'" === e && 3 === e.length && ya.test(l[1])) break;
                  if (fa.test(e) || ya.test(e)) break;
                  i += l.shift();
                }
              }
              u = l.length;
              for (let e = 0; e < u; e += 1) {
                let e = l[l.length - 1];
                if (!0 !== a[e]) {
                  if (fa.test(e) || ya.test(e)) break;
                  ("." === e && !0 === ba.test(o)) ||
                    ("'" === e && !0 === va.test(o)) ||
                    (s = l.pop() + s);
                }
              }
              return (
                "" === (e = l.join("")) &&
                  ((o = o.replace(/ *$/, (e) => ((s = e || ""), ""))),
                  (e = o),
                  (i = "")),
                { str: e, pre: i, post: s }
              );
            })(e, t);
            return { text: n, pre: a, post: r, tags: new Set() };
          },
          fromString: function (e, t) {
            const { methods: n, model: a } = t,
              {
                splitSentences: r,
                splitTerms: o,
                splitWhitespace: i,
              } = n.one.tokenize;
            return (
              (e = r((e = e || ""), t).map((e) => {
                let n = o(e, a);
                return (
                  (n = n.map((e) => i(e, a))),
                  n.forEach((e) => {
                    Aa(e, t);
                  }),
                  n
                );
              })),
              e
            );
          },
        },
      },
    };
  let Ta = {},
    Oa = {};
  [
    [
      [
        "approx",
        "apt",
        "bc",
        "cyn",
        "eg",
        "esp",
        "est",
        "etc",
        "ex",
        "exp",
        "prob",
        "pron",
        "gal",
        "min",
        "pseud",
        "fig",
        "jd",
        "lat",
        "lng",
        "vol",
        "fm",
        "def",
        "misc",
        "plz",
        "ea",
        "ps",
        "sec",
        "pt",
        "pref",
        "pl",
        "pp",
        "qt",
        "fr",
        "sq",
        "nee",
        "ss",
        "tel",
        "temp",
        "vet",
        "ver",
        "fem",
        "masc",
        "eng",
        "adj",
        "vb",
        "rb",
        "inf",
        "situ",
        "vivo",
        "vitro",
        "wr",
      ],
    ],
    [
      [
        "dl",
        "ml",
        "gal",
        "qt",
        "pt",
        "tbl",
        "tsp",
        "tbsp",
        "km",
        "dm",
        "cm",
        "mm",
        "mi",
        "td",
        "hr",
        "hrs",
        "kg",
        "hg",
        "dg",
        "cg",
        "mg",
        "µg",
        "lb",
        "oz",
        "sq ft",
        "hz",
        "mps",
        "mph",
        "kmph",
        "kb",
        "mb",
        "tb",
        "lx",
        "lm",
        "fl oz",
        "yb",
      ],
      "Unit",
    ],
    [
      [
        "ad",
        "al",
        "arc",
        "ba",
        "bl",
        "ca",
        "cca",
        "col",
        "corp",
        "ft",
        "fy",
        "ie",
        "lit",
        "ma",
        "md",
        "pd",
        "tce",
      ],
      "Noun",
    ],
    [
      [
        "adj",
        "adm",
        "adv",
        "asst",
        "atty",
        "bldg",
        "brig",
        "capt",
        "cmdr",
        "comdr",
        "cpl",
        "det",
        "dr",
        "esq",
        "gen",
        "gov",
        "hon",
        "jr",
        "llb",
        "lt",
        "maj",
        "messrs",
        "mlle",
        "mme",
        "mr",
        "mrs",
        "ms",
        "mstr",
        "phd",
        "prof",
        "pvt",
        "rep",
        "reps",
        "res",
        "rev",
        "sen",
        "sens",
        "sfc",
        "sgt",
        "sir",
        "sr",
        "supt",
        "surg",
      ],
      "Honorific",
    ],
    [
      [
        "jan",
        "feb",
        "mar",
        "apr",
        "jun",
        "jul",
        "aug",
        "sep",
        "sept",
        "oct",
        "nov",
        "dec",
      ],
      "Month",
    ],
    [["dept", "univ", "assn", "bros", "inc", "ltd", "co"], "Organization"],
    [
      [
        "rd",
        "st",
        "dist",
        "mt",
        "ave",
        "blvd",
        "cl",
        "cres",
        "hwy",
        "ariz",
        "cal",
        "calif",
        "colo",
        "conn",
        "fla",
        "fl",
        "ga",
        "ida",
        "ia",
        "kan",
        "kans",
        "minn",
        "neb",
        "nebr",
        "okla",
        "penna",
        "penn",
        "pa",
        "dak",
        "tenn",
        "tex",
        "ut",
        "vt",
        "va",
        "wis",
        "wisc",
        "wy",
        "wyo",
        "usafa",
        "alta",
        "ont",
        "que",
        "sask",
      ],
      "Place",
    ],
  ].forEach((e) => {
    e[0].forEach((t) => {
      (Ta[t] = !0),
        (Oa[t] = "Abbreviation"),
        void 0 !== e[1] && (Oa[t] = [Oa[t], e[1]]);
    });
  });
  const Ca = [
    "anti",
    "bi",
    "co",
    "contra",
    "de",
    "extra",
    "infra",
    "inter",
    "intra",
    "macro",
    "micro",
    "mis",
    "mono",
    "multi",
    "peri",
    "pre",
    "pro",
    "proto",
    "pseudo",
    "re",
    "sub",
    "supra",
    "trans",
    "tri",
    "un",
    "out",
    "ex",
  ].reduce((e, t) => ((e[t] = !0), e), {});
  let Va = {
      "!": "¡",
      "?": "¿Ɂ",
      '"': '“”"❝❞',
      "'": "‘‛❛❜’",
      "-": "—–",
      a: "ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАаѦѧӐӑӒӓƛæ",
      b: "ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ",
      c: "¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼϲϹϽϾСсєҀҁҪҫ",
      d: "ÐĎďĐđƉƊȡƋƌ",
      e: "ÈÉÊËèéêëĒēĔĕĖėĘęĚěƐȄȅȆȇȨȩɆɇΈΕΞΣέεξϵЀЁЕеѐёҼҽҾҿӖӗ",
      f: "ƑƒϜϝӺӻҒғſ",
      g: "ĜĝĞğĠġĢģƓǤǥǦǧǴǵ",
      h: "ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ",
      I: "ÌÍÎÏ",
      i: "ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇії",
      j: "ĴĵǰȷɈɉϳЈј",
      k: "ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ",
      l: "ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ",
      m: "ΜϺϻМмӍӎ",
      n: "ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ",
      o: "ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϴОФоѲѳӦӧӨөӪӫ",
      p: "ƤΡρϷϸϼРрҎҏÞ",
      q: "Ɋɋ",
      r: "ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ",
      s: "ŚśŜŝŞşŠšƧƨȘșȿЅѕ",
      t: "ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт",
      u: "ÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰυϋύ",
      v: "νѴѵѶѷ",
      w: "ŴŵƜωώϖϢϣШЩшщѡѿ",
      x: "×ΧχϗϰХхҲҳӼӽӾӿ",
      y: "ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ",
      z: "ŹźŻżŽžƵƶȤȥɀΖ",
    },
    za = {};
  Object.keys(Va).forEach(function (e) {
    Va[e].split("").forEach(function (t) {
      za[t] = e;
    });
  });
  const $a = /\//,
    Fa = /[a-z]\.[a-z]/i,
    Ba = /[0-9]/,
    Ma = function (e, t) {
      let n = e.normal || e.text || e.machine;
      const a = t.model.one.aliases;
      if (
        (a.hasOwnProperty(n) && ((e.alias = e.alias || []), e.alias.push(a[n])),
        $a.test(n) && !Fa.test(n) && !Ba.test(n))
      ) {
        let t = n.split($a);
        t.length <= 2 &&
          t.forEach((t) => {
            "" !== (t = t.trim()) &&
              ((e.alias = e.alias || []), e.alias.push(t));
          });
      }
      return e;
    },
    Sa = /^\p{Letter}+-\p{Letter}+$/u,
    Ga = function (e) {
      let t = e.implicit || e.normal || e.text;
      (t = t.replace(/['’]s$/, "")),
        (t = t.replace(/s['’]$/, "s")),
        (t = t.replace(/([aeiou][ktrp])in'$/, "$1ing")),
        Sa.test(t) && (t = t.replace(/-/g, "")),
        (t = t.replace(/^[#@]/, "")),
        t !== e.normal && (e.machine = t);
    },
    La = function (e, t) {
      let n = e.docs;
      for (let a = 0; a < n.length; a += 1)
        for (let r = 0; r < n[a].length; r += 1) t(n[a][r], e.world);
    },
    Ha = {
      compute: {
        alias: (e) => La(e, Ma),
        machine: (e) => La(e, Ga),
        normal: (e) => La(e, Aa),
        freq: function (e) {
          let t = e.docs,
            n = {};
          for (let e = 0; e < t.length; e += 1)
            for (let a = 0; a < t[e].length; a += 1) {
              let r = t[e][a],
                o = r.machine || r.normal;
              (n[o] = n[o] || 0), (n[o] += 1);
            }
          for (let e = 0; e < t.length; e += 1)
            for (let a = 0; a < t[e].length; a += 1) {
              let r = t[e][a],
                o = r.machine || r.normal;
              r.freq = n[o];
            }
        },
        offset: function (e) {
          let t = 0,
            n = 0,
            a = e.document;
          for (let e = 0; e < a.length; e += 1)
            for (let r = 0; r < a[e].length; r += 1) {
              let o = a[e][r];
              (o.offset = {
                index: n,
                start: t + o.pre.length,
                length: o.text.length,
              }),
                (t += o.pre.length + o.text.length + o.post.length),
                (n += 1);
            }
        },
        index: function (e) {
          let t = e.document;
          for (let e = 0; e < t.length; e += 1)
            for (let n = 0; n < t[e].length; n += 1) t[e][n].index = [e, n];
        },
        wordCount: function (e) {
          let t = 0,
            n = e.docs;
          for (let e = 0; e < n.length; e += 1)
            for (let a = 0; a < n[e].length; a += 1)
              "" !== n[e][a].normal && ((t += 1), (n[e][a].wordCount = t));
        },
      },
      methods: Ea,
      model: {
        one: {
          aliases: {
            "&": "and",
            "@": "at",
            "%": "percent",
            plz: "please",
            bein: "being",
          },
          abbreviations: Ta,
          prefixes: Ca,
          suffixes: {
            like: !0,
            ish: !0,
            less: !0,
            able: !0,
            elect: !0,
            type: !0,
            designate: !0,
          },
          prePunctuation: {
            "#": !0,
            "@": !0,
            _: !0,
            "°": !0,
            "​": !0,
            "‌": !0,
            "‍": !0,
            "\ufeff": !0,
          },
          postPunctuation: {
            "%": !0,
            _: !0,
            "°": !0,
            "​": !0,
            "‌": !0,
            "‍": !0,
            "\ufeff": !0,
          },
          lexicon: Oa,
          unicode: za,
          emoticons: {
            "<3": !0,
            "</3": !0,
            "<\\3": !0,
            ":^P": !0,
            ":^p": !0,
            ":^O": !0,
            ":^3": !0,
          },
        },
      },
      hooks: ["alias", "machine", "index", "id"],
    },
    qa = {
      typeahead: function (e) {
        const t = e.model.one.typeahead,
          n = e.docs;
        if (0 === n.length || 0 === Object.keys(t).length) return;
        let a = n[n.length - 1] || [],
          r = a[a.length - 1];
        if (!r.post && t.hasOwnProperty(r.normal)) {
          let n = t[r.normal];
          (r.implicit = n),
            (r.machine = n),
            (r.typeahead = !0),
            e.compute.preTagger &&
              e.last().unTag("*").compute(["lexicon", "preTagger"]);
        }
      },
    },
    Wa = function () {
      const e = this.docs;
      if (0 === e.length) return this;
      let t = e[e.length - 1] || [],
        n = t[t.length - 1];
      return (
        !0 === n.typeahead &&
          n.machine &&
          ((n.text = n.machine), (n.normal = n.machine)),
        this
      );
    },
    Ja = { safe: !0, min: 3 },
    _a = {
      typeahead: function (e = [], t = {}) {
        let n = this.model();
        var a;
        (t = Object.assign({}, Ja, t)),
          (a = e),
          "[object Object]" === Object.prototype.toString.call(a) &&
            (Object.assign(n.one.lexicon, e), (e = Object.keys(e)));
        let r = (function (e, t, n) {
          let a = {},
            r = [],
            o = n.prefixes || {};
          return (
            e.forEach((e) => {
              let i = (e = e.toLowerCase().trim()).length;
              t.max && i > t.max && (i = t.max);
              for (let s = t.min; s < i; s += 1) {
                let i = e.substring(0, s);
                (t.safe && n.model.one.lexicon.hasOwnProperty(i)) ||
                  (!0 !== o.hasOwnProperty(i) && !0 !== a.hasOwnProperty(i)
                    ? (a[i] = e)
                    : r.push(i));
              }
            }),
            (a = Object.assign({}, o, a)),
            r.forEach((e) => {
              delete a[e];
            }),
            a
          );
        })(e, t, this.world());
        return (
          Object.keys(r).forEach((e) => {
            n.one.typeahead.hasOwnProperty(e)
              ? delete n.one.typeahead[e]
              : (n.one.typeahead[e] = r[e]);
          }),
          this
        );
      },
    },
    Ka = {
      model: { one: { typeahead: {} } },
      api: function (e) {
        e.prototype.autoFill = Wa;
      },
      lib: _a,
      compute: qa,
      hooks: ["typeahead"],
    };
  y.extend(U),
    y.extend(ln),
    y.extend(Ct),
    y.extend(bn),
    y.extend(Rn),
    y.plugin(ge),
    y.extend(Ha),
    y.plugin(v),
    y.extend(Ne),
    y.extend(Ka),
    y.extend(Pe),
    y.extend(wn);
  const Ua = y,
    Ra = {
      addendum: "addenda",
      corpus: "corpora",
      criterion: "criteria",
      curriculum: "curricula",
      genus: "genera",
      memorandum: "memoranda",
      opus: "opera",
      ovum: "ova",
      phenomenon: "phenomena",
      referendum: "referenda",
      alga: "algae",
      alumna: "alumnae",
      antenna: "antennae",
      formula: "formulae",
      larva: "larvae",
      nebula: "nebulae",
      vertebra: "vertebrae",
      analysis: "analyses",
      axis: "axes",
      diagnosis: "diagnoses",
      parenthesis: "parentheses",
      prognosis: "prognoses",
      synopsis: "synopses",
      thesis: "theses",
      neurosis: "neuroses",
      appendix: "appendices",
      index: "indices",
      matrix: "matrices",
      ox: "oxen",
      sex: "sexes",
      alumnus: "alumni",
      bacillus: "bacilli",
      cactus: "cacti",
      fungus: "fungi",
      hippopotamus: "hippopotami",
      libretto: "libretti",
      modulus: "moduli",
      nucleus: "nuclei",
      octopus: "octopi",
      radius: "radii",
      stimulus: "stimuli",
      syllabus: "syllabi",
      cookie: "cookies",
      calorie: "calories",
      auntie: "aunties",
      movie: "movies",
      pie: "pies",
      rookie: "rookies",
      tie: "ties",
      zombie: "zombies",
      leaf: "leaves",
      loaf: "loaves",
      thief: "thieves",
      foot: "feet",
      goose: "geese",
      tooth: "teeth",
      beau: "beaux",
      chateau: "chateaux",
      tableau: "tableaux",
      bus: "buses",
      gas: "gases",
      circus: "circuses",
      crisis: "crises",
      virus: "viruses",
      database: "databases",
      excuse: "excuses",
      abuse: "abuses",
      avocado: "avocados",
      barracks: "barracks",
      child: "children",
      clothes: "clothes",
      echo: "echoes",
      embargo: "embargoes",
      epoch: "epochs",
      deer: "deer",
      halo: "halos",
      man: "men",
      woman: "women",
      mosquito: "mosquitoes",
      mouse: "mice",
      person: "people",
      quiz: "quizzes",
      rodeo: "rodeos",
      shoe: "shoes",
      sombrero: "sombreros",
      stomach: "stomachs",
      tornado: "tornados",
      tuxedo: "tuxedos",
    },
    Ya = {
      Comparative: "true¦better",
      Superlative: "true¦earlier",
      PresentTense: "true¦sounds",
      Condition: "true¦lest,unless",
      PastTense: "true¦be2came,d1had,lied,mea0sa1taken,we0;nt;id;en,gan",
      Gerund: "true¦accord0be0go0result0stain0;ing",
      Expression:
        "true¦a0Tb0Pc0Nd0Je0Hg0BhWjeez,lTmSnQoKpHshGtFuCvoi0Vw6y0;a4e3i1u0;ck,p;k00p0;ee,pee;ah,p,s;!a,y;ahoo,h2o1t0;af,f;rd up,w;e1o0;a,ops;e,w;gh,h0;! 0h,m;huh,oh;here nOsk,ut tut;eesh,hh,it,oo;ff,h1l0ow,sst;ease,z;ew,ooey;h1i,o0uch,w,y;h,o,ps;! 0h;h1my go0w1;d,sh;ell;ah,o0;!pe;eh,mm;ah,m1ol0;!s;ao,fao;aBeAi8o2u0;h,mph,rra0zzB;h,y;ly1o0;r5y8;! 0;c1moCsmok0;es;ow;!p hip hoor0;ay;ck,e,llo,y;ha1i,lleluj0;ah;!ha;ah,ee4o1r0;eat scott,r;l1od0sh; grief,bye;ly;! whiz;e0h,t cetera,ww,xcuse me;k,p;'oh,a0rat,uh;m0ng;mit,n0;!it;mon,o0;ngratulations,wabunga;a2oo1r0ye;avo,r;!ya;h,m; 1h0las,men,rgh,ye;!a,em,oy;la",
      Negative: "true¦n0;ever,o0;n,t",
      QuestionWord: "true¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s",
      Reflexive: "true¦h4it5my5o1the0your2;ir1m1;ne3ur0;sel0;f,ves;er0im0;self",
      Plural: "true¦dick0gre0ones,records;ens",
      "Unit|Noun":
        "true¦cEfDgChBinchAk9lb,m6newt5oz,p4qt,t1y0;ardEd;able1b0ea1sp;!l,sp;spo1;a,oundAt,x;on9;!b,g,i1l,m,p0;h,s;!les;!b,elvin,g,m;!es;g,z;al,b;eet,oot,t;m,up0;!s",
      Value: "true¦a few",
      Imperative: "true¦come here",
      Demonym:
        "true¦0:15;1:12;a0Vb0Oc0Dd0Ce08f07g04h02iYjVkTlPmLnIomHpEqatari,rCs7t5u4v3welAz2;am0Gimbabwe0;enezuel0ietnam0I;gAkrai1;aiwTex0hai,rinida0Ju2;ni0Prkmen;a5cotti4e3ingapoOlovak,oma0Spaniard,udRw2y0W;ede,iss;negal0Cr09;sh;mo0uT;o5us0Jw2;and0;a2eru0Fhilippi0Nortugu07uerto r0S;kist3lesti1na2raguay0;ma1;ani;ami00i2orweP;caragu0geri2;an,en;a3ex0Lo2;ngo0Drocc0;cedo1la2;gasy,y07;a4eb9i2;b2thua1;e0Cy0;o,t01;azakh,eny0o2uwaiI;re0;a2orda1;ma0Ap2;anO;celandic,nd4r2sraeli,ta01vo05;a2iB;ni0qi;i0oneU;aiAin2ondur0unO;di;amEe2hanai0reek,uatemal0;or2rm0;gi0;ilipino,ren8;cuadoVgyp4mira3ngli2sto1thiopi0urope0;shm0;ti;ti0;aPominUut3;a9h6o4roat3ub0ze2;ch;!i0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el6o4r3ul2;gaE;azi9it;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;genti2me1;ne;ba1ge2;ri0;ni0;gh0r2;ic0;an",
      Organization:
        "true¦0:4D;a3Gb2Yc2Ed26e22f1Xg1Ph1Ki1Hj1Fk1Dl18m0Wn0Jo0Gp09qu08r01sTtGuBv8w3xiaomi,y1;amaha,m13ou1w13;gov,tu2Z;a3e1orld trade organizati2S;lls fargo,st1;fie28inghou2I;l1rner br3I;gree37l street journ29m17;an halOeriz2Nisa,o1;dafo2Ol1;kswagMvo;b4kip,n2ps,s1;a tod2Yps;es3Ai1;lev33ted natio30;er,s; mobi2Qaco beQd bNeAgi frida9h3im horto2Ymz,o1witt31;shi3Xy1;ota,s r 00;e 1in lizzy;b3carpen37daily ma31guess w2holli0rolling st1Rs1w2;mashing pumpki2Tuprem0;ho;ea1lack eyed pe3Lyrds;ch bo1tl0;ys;l2n3Ds1xas instrumen1J;co,la m15;efoni0Cus;a7e4ieme2Lnp,o2pice gir5quare04ta1ubaru;rbucks,to2R;ny,undgard1;en;a2x pisto1;ls;g1Nrs;few2Ainsbury2QlesforYmsu22;.e.m.,adiohead,b6e3oyal 1yana30;b1dutch she4;ank;aders dige1Gd 1max,vl1R;bu1c1Zhot chili peppe2Nlobst2C;ll;c,s;ant30izno2I;a5bs,e3fiz28hilip morrCi2r1;emier2Audenti16;nk floyd,zza hut;psi2Btro1uge0A;br2Vchina,n2V;lant2Nn1yp12; 2ason20da2I;ld navy,pec,range juli2xf1;am;us;aAb9e6fl,h5i4o1sa,vid3wa;k2tre dame,vart1;is;ia;ke,ntendo,ss0L;l,s;c,st1Htflix,w1; 1sweek;kids on the block,york09;a,c;nd1Vs2t1;ional aca2Io,we0Q;a,cYd0O;aBcdonaldAe7i5lb,o3tv,y1;spa1;ce;b1Mnsanto,ody blu0t1;ley crue,or0O;crosoft,t1;as,subisM;dica2rcedes benz,talli1;ca;id,re;'s,s;c's milk,tt14z1Z;'ore08a3e1g,ittle caesa1K;novo,x1;is,mark; 1bour party;pres0Bz boy;atv,fc,kk,m1od1J;art;iffy lu0Moy divisi0Gpmorgan1sa;! cha07;bm,hop,n1tv;g,te1;l,rpol;asbro,ewlett pack1Ri3o1sbc,yundai;me dep1n1L;ot;tac1zbollah;hi;eneral 6hq,ithub,l5mb,o2reen d0Lu1;cci,ns n ros0;ldman sachs,o1;dye1g0E;ar;axo smith kli03encoV;electr0Km1;oto0W;a4bi,da,edex,i2leetwood mac,o1rito l0D;rd,xcX;at,nancial1restoY; tim0;cebook,nnie mae;b08sa,u3xxon1; m1m1;ob0H;!rosceptics;aiml0Be6isney,o4u1;nkin donu2po0Xran dur1;an;ts;j,w j1;on0;a,f lepp0Zll,peche mode,r spiegZstiny's chi1;ld;aIbc,hEiCloudflaBnn,o3r1;aigsli5eedence clearwater reviv1ossra06;al;ca c7inba6l4m1o0Bst06;ca2p1;aq;st;dplPg1;ate;se;ola;re;a,sco1tigroup;! systems;ev2i1;ck fil-a,na daily;r1y;on;dbury,pital o1rl's jr;ne;aEbc,eBf9l5mw,ni,o1p,rexiteeU;ei3mbardiIston 1;glo1pizza;be;ng;o2ue c1;roV;ckbuster video,omingda1;le; g1g1;oodriL;cht2e ge0rkshire hathaw1;ay;el;idu,nana republ3s1xt5y5;f,kin robbi1;ns;ic;bYcTdidSerosmith,iRlKmEnheuser-busDol,pple9r6s3utodesk,v2y1;er;is,on;hland1sociated F; o1;il;by4g2m1;co;os; compu2bee1;'s;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 5catel2ta1;ir;!-lu1;ce1;nt;jazeera,qae1;da;g,rbnb;as;/dc,a3er,tivision1;! blizz1;ard;demy of scienc0;es;ba",
      Possessive: "true¦its,my,none,our0;!s",
      "Noun|Verb":
        "true¦0:94;1:8F;2:7M;3:8Z;4:99;5:8S;6:7Y;7:6Y;8:8T;9:8C;A:9E;a8Ub80c6Ud65e5Vf58g4Zh4Qi4Ij4Fk4Cl40m3On3Ko3Hp2Hques8Wr1Ss0FtZuXvSwEyDzB;ip,oB;ne,om;awn,e5Uie5N;aLeJhGiEoCrB;ap,e8U;nd0rB;k,ry,sh4Yth;ck,nBpe,re,sh;!d,g;e7IiB;p,sB;k,t1;aBed;r,th0;it,lk,rCsBt3ve,x;h,te;!ehou2raA;aEiDoB;iBm9te,w;ce,d;be,ew,s9;cuum,l3X;pBr6;da5gra5Tlo5P;aOeNhrMiLoJrEuCwiBy5E;n,st;nBrn;e,n70;aDeCiBot,u8;bu5ck44gg0m,p;at,k,nd;ck,de,in,nsBp,v6W;f0i7Z;ll,ne,p,r4Gss,t8CuB;ch,r;ck,de,e,le,me,p,re;e5Cow,u8;ar,e,ll,mp0st,xt;g,lBng1rg70s5x;k,ly;a0Lc0Ge0Dh08i06k04l02m01n00ou7CpUqua6UtIuDwB;ea7HiB;ng,pe,t3;bEit,m,ppCrB;ge,pri2v2J;lBo65;e62y;!je7;aKeJiIoFrCuBy1;dy,ff,mb1;a7DeCiBo55ugg1;ke,ng;am,ss,t3;ckCop,p,rB;e,m;ing,pi1;ck,nk,t3;m,p;ck,ge,in,ke,ll,mp,nd,p1rBte,y;!e,t;aFeed,iElDot,rBur;ay,e4NinBu4;g,k1;a6Dit;ll,n,r7Hte;n,rk;ap,ee1Oow;a69e41i1o4O;eep,iBou3;ce,p,t;ateboa6WiB;!p;de,gnBp,ze;!al;aEeDiCoBuff1;ck,p,re,t,w;ft,p,v0;d,i3K;ck,de,pe,re,ve;aCed,nBrv1Et;se,t2F;l,r3t;aEhedu1o5OrB;aCeBo3L;en,w;pe,t3;le,n,r0O;cBil;k,rifi4;aXeFiEoCuB;b,in,le,n,s5E;a8ck,ll,oBpe,u5;f,t;de,ng,p,s1O;aRcQdo,el,fOgNje7lMmKnJo12pHque8sDturn,vBwa68;eBi1Z;al,r2;er6HoDpe7tCuB;lt,me;!a4N;l6Ert;air,eaBly,o4L;l,t;dezvo2Mt;aBedy;ke,rk;ea2i56;a5Vist0r53;act6Ber1No6EuB;nd,se;a2Uo5S;ch,s5T;c15ge,i2ke,lly,nBpYtY;ge,k;a03eZhXiVlRoLrCsy3uB;mp,n3rcha2sh;aIeGiFoBu48;be,ceDdu4fi1grBje7mi2p,te8;amBe69;!me;ed,ss;ce,de,nt;sBy;er5Rs;cti4i2;iFlDoCp,re,sBw0;e,i5Dt;l,p;iBl;ce,sh;nt,s5A;aCce,e2PuB;g,mp,n6;ce,nBy;!t;ck,le,nBpe,t,vot;!e;a2oB;ne,tograph;ak,eDnCrBt;fu4Lm9;!c2O;!l,r;ckGiFnErtDsCtBu2;ch,eA;s,te;!y;!ic;nt,r;!a6;bje7ff0il,oCrButli3A;b9d0ieA;ze;a48eDoB;d,tB;e,i4;ed,gle7t;aIeGiFoCuB;rd0;ck,d3Cld,nBp,uth,ve;it4VkB;ey;lk,n3Vrr4Tss,x;asu3Fn4CrBss;ge,it;il,nDp,rk3HsCtB;ch,t0;h,k;da5n0oeuv3A;aJeHiFoCuB;mp,st;aCbby,ck,g,oBve;k,t;d,n;cBft,m9nFst;en2k;aBc0He3vH;ch,d,k,p,se;bCcBnd,p,t3un3;e,k;el,o2I;eCiBno3X;ck,ll,ss;el,y;aCo1FuB;i4mp;m,zz;mpHnCr3PssB;ue;cr1Hdex,fluEha1k,se25teBvoi4;nt,rB;e8fa4viB;ew;en4;a7le1Y;aGeEiDoCuB;g,nt;l2Wno21ok,p,r2u2;ghlight,ke,re,t;aBd6lp;d,t;ck,m,ndCrBsh,te;b3Im,ne3Xve8;!le;aIloHossGrDuB;arBe3Un;antee,d;aCiBou2Pumb1;nd,p;de,sp;ip;ss,w;in,me,ng,s,te,ze;aWeTiOlLoHrDuB;ck,el,nBss,zz;c2Wd;aCoBy;st,wn;cBgme,me;tu1V;cDg,il,ld,rB;ce,e20mB;!at;us;aCe1Wip,oBy;at,ck,od,w;g,ke,me,re,sh,vo18;eEgDlCnBre,sh,t,x;an4i1S;e,m,t0;ht,u1K;ld;aCeBn4;d,l;r,tu1G;ce,il,ll,rm,v2L;cho,d6ffe7nJsHxDyeB;!baB;ll;cDerci2hib9pBtra7;eriBo0Q;en4meA;el,han6u2;caBtima5;pe;count0d,vy;aXeQiKoHrCuBye;b,el,mp,plica5;aEeDiCoB;ne,p;ft,nk,p,ve;am,ss;ft,g,in;cCd6ubt,wnloB;ad;k,u09;p,sDt3vB;e,iBor4;de;char6h,liCpB;at3lFu5;ke;al,ba5cFfeElDma16pos9siCtaB;il;gn,re;ay;at,ct;li01rB;ea2;b,ma6n4rBte;e,t;a0Bent0Ah03irc1l00oHrDuB;be,e,rBt;e,l,ve;aDeCoBu0Iy;p,ss,wd;d9ep;ck,ft,sh;at,de,in,lRmKnDpy,re,st,uBv0;gh,nBp1;sZt;ceFdu7fli7glomeGsDtBveL;a7rB;a8ol;eAtru7;ct;ntBrn;ra5;bFfoEmDpB;leBou0Fromi2;meA;a0DeAit,u5;rt;at,iB;ne;lap2oB;r,ur;aCiB;ck,p;im,w;aCeBip;at,ck,er;iEllen6nCrB;ge,m,t;ge,nB;el;n,r;er,re;ke,ll,mp,noe,pDrTsCt3u2ve;se;h,t;!tuB;re;aYeUiTlQoMrEuBypa0U;bb1ck1dgCff0mp,rBst,zz;den,n;et;anHeFiDoadCuB;sh;ca8;be,d6;ge;aBed;ch,k;ch,d;aDg,mb,nCoBtt1x,ycott;k,st,t;d,e;rd,st;aCeBitz,oTur;nd;me;as,d,ke,nd,opsy,te;aDef,lt,nBt;d,ef9;it;r,t;ck,il,l04nFrgDsCtt1;le;e,h;aBe;in;!d,g,k;c01dXge,iWlTnRppOrKsGttEucCwaB;rd;tiB;on;aBempt;ck;k,sB;i8ocia5;te;st;chCmB;our;!iB;ve;eCroa3;ch;al;chBg0sw0;or;aCt0;er;rm;d,m,r;dreDvB;an4;ce;ss;cBe,he,t;eDoB;rd,uA;nt;nt,ss",
      Actor:
        "true¦0:44;1:3A;2:4C;3:45;4:4B;a3Rb38c2Fd23e20f1Sg1Ih1Di19journa3Ml16m0Un0Po0Np04qu02rXsGtCunBvAw6yo5;gi,utub0;e7i6o5r1O;m1rk0;nn0t10;atherm1ld0;eterina19ip;c3Wder1I;aoisea0We6herapi3iktok0r5;anscriRo20;chn5st0;i1RoU;aiKcJeIhowHiFki0oDpCt9u6wee5;p0theart;lt1per6r5;f0ge2Y;intenWv3V;aff0ep6r5;ang0eam0;fa12mo12;ecia32okesp2S;l5me3Kn;di0oi3;ng0s5;sy,t0;girl,m1runn0;cretary,rgea3V;hol2OiQreen0Yulpt2;l2nt;a8e5oof0unningA;c5port0searJver2Q;e5ru0V;ptio1W;bbi,pp0;arter5een;back;aMerform0hLlIoEr6sycho5;logi3;actit1Oe9i7o5;duc0fess2gramm0s5;pe12titu2T;est2Lme miniVnce5;!ss;a6si5;de3D;ch0;dcaQet,li5rnst25;c10tic5;al sci5i1;enti3;a5umb0;nn0y5;er,wright;armaci3otograph0ysi0L;i1Nnel24st2tL;ffic0p5rganiz0;er4tometri3;anny,e7o6u5;n,rse;bo2Jvi6;i5phew;ce;aCeBi8o6u5;m6si0B;m5nk,th0;!my;ni6s5;sus,t0;st0;chan0Lrcha2O;gi7k0nag0t5y2;riar5;ch;ci1stra1W;a6e0Wieutena2Jo5;rd,s0;bor0dy,urea1Twy0;dol,llu29n5;s5vestig4;peZt5;a0EruY;air8ero7isto6o5ygie0J;ste29usekE;ri1;!ine;dress0sty19;arden0eDhostBirl15o8rand5uru;fa6m5pa;a,o5;th0;al5d,lf0;ie,k5te16;eep0;wr5;it0;isha,ntlO;aBella,i7ore6r5;eela1Ii0V;m1st0;g7lmm0Fnanci0r5tt0;e5st la1E; marsh1Kfig5m1;ht0;rm0th0;dit2lectri6mcee,x5;amin0cellency;ci1;aEe9i6riv0u5;de,tche1J;eti6re5;ct2;ci1ti1;a8cor4fenc7put6sign0tecDvel5;op0;ee,y;em1;c05l0;d5nc0rling;!dy;aSeRfo,hLlIo8rit7u5;r4stomer representa5;tive;ic;lCm9n6ordin4rpor0Yu5wboy;nciKri0;gressKs6tro5;ll0;tab0Kul11;edi1m5pos0;a04iss5;ion0;onel,um5;ni3;e5own;an0r5;ic,k;a7e5;erle5f;ad0;ir6nce5plC;ll2;m1wE;lebrity,o;det,pt8r5shi0;et6pe5;nt0;ak0;ain;aJeatbox0iHlogg0oyFrCu5;ddhi3ild0rglAsiness5;m1p6w5;om1;ers5;on;an;ar;i6o5;!k0th0;cklay0de,gadi0;!fri5;end;cyc5sL;li3;nk0r5;b0on6te5;nd0;!eX;cUdNgeYnHpostGrDsBt7u5yatullah;nt5th2;!ie;h6t5;endaUorney;ie3le5;te;sisQtron5;aut,om0;chbis6tis5;an,t;hop;le;aly3im4nou7y5;bo5;dy;nc0;er;st;mi6v5;is2;ni6r5;al;str4;at2;or;coun7t5;or,re5;ss;ta5;nt",
      Uncountable:
        "true¦0:28;1:2R;2:2F;3:35;4:2W;a2Qb2Hc26d1Xe1Nf1Hg19h12i0Xjewel15k0Vl0Qm0Gn0Eo0Dp04rZsMtBv9w5you guys;a7hisky,i6oo5;d,l;ldlife,ne;rmAt2;ernacul25i5;neg24ol1Ktae;eEhCime off,oBr6un5yranny;a,gst15;aff2Jea1Go6ue nor5;th;o07u5;ble5se1Ot;!shoot1;night,othpas1P;er5und2;e,mod2O;a,nnis;aFcEeDhBilk,kiAo9p8t6u5weepstak0;g1Rnshi2Dshi;ati08e5;am,el;ace2Geci0;ap,cc2meth1;n,ttl0;eep,ingl0o5;pp1r18;lf,na1Cri0;ene0Disso18;d0Sfe4l5nd,t0F;m1St;a8e6ic5;e,ke12;c5ins,laxa0Zsearch;ogni0Yrea0Y;bi0in;aBeAhys9last1So7re5;amble,mis0s5ten1W;en1Vsu0H;l5rk;i24yH; 14i3;a20tr0A;nt5ti0J;i0s;bstetri3vercrowd1xyg04;a5ews;il polXtional securi4;aCeAo7u5;m5s1F;ps;n5o1I;ey,o5;gamy;a5cha0Drchandi1Ftallurgy;sl0t;chine5thema1O; learn1ry;aught2e8i7ogi6u5;ck,g11;c,s1K;ce,ghtn1nguis1JteraTv2;ath2isuTss;ara0CindergartMn5;icke08owled0X;ce,gnor8mp7n5;forma02ter5;net,sta08;atiUort5rov;an19;a8eListo7o5ung2;ckey,mework,ne5rserad9spitali4use arrest;s4y;ry;ir,lib03ppiJs5;h5te;ish;ene9l7o6r5um,ymnas13;aGe03;lf,re;ut5yce0J;en; 5ti3;edit1po5;ol;aQicJlour,o7urni5;tu5;re;od,rgive5uri2wl;ne5;ss;cono0MducaDlectrBn9quipAthi3very8x5;ist6per5;ti0C;en0K;body,o09th1;joy5tertain5;ment;ici4o5;ni3;tiU;eBi8o6raugh5ynas4;ts;pe,wnstai5;rs;abet0s5;hon01repu5;te;b5miX;ut;aEelciDhBivi3l9o5urrency;al,ld w7n5ral,ttJuscoC;fusiIt 5;ed;ar;assi3oth0;es;aos,e5;eNw1;us;d,rP;aAi8lood,read7u5;nt1tt2;er;!th;lliarKs5;on;g5ss;ga5;ge;cLdviKeroHirGmCn7ppeal court,rithmet6spi5thleM;rin;ic;i8y5;o6th1;ing;ne;se;en7n5;es4;ty;ds;craft;bi3d5nau9;yna5;mi3;ce;id,ous5;ti3;cs",
      "Person|Noun":
        "true¦a07b01cYdRePfOgMhJjFkiElDmBolive,p7r4s3trini00v1wa0;ng,rd;an,enus,iol0;a,et;ky,on5umm02;ay,e1o0uby;bin,d,se;ed,x;a2e0ol;aHn0;ny;ge,tM;a0eloR;x,ya;a9eo,iE;ng,tL;a2e1o0;lDy;an,w3;de,smi4y;a0iKol8;ll,z0;el;ail,e0;ne;aith,ern,lo;a0dDmir,ula,ve;rl;a4e3i1ol0;ly;ck,x0;ie;an,ja;i0wn;sy;h0liff,rystal;ari0in,ristian;ty;ak4e3i2r0;an0ook;dy;ll;nedict,rg;er;l0rt;fredo,ma",
      Pronoun: "true¦'em,elle,h3i2me,she4th0us,we,you;e0ou;m,y;!l,t;e0im;!'s",
      Singular:
        "true¦0:4O;1:4M;2:3Y;3:47;4:42;5:4Q;6:4C;a46b3Qc2Wd2Ie2Cf25g1Zh1Oin1Lj1Kk1Jl1Dm17n15o10p0Iqu0Hr07sUtIuFvAw7x 4B;a7ha2Y;f2i3Vt08y7;! arou2M;arAe8o7;cabu3Ol4F;gKr7;di43t1F;iety,n3S;p2Dr8s 7;do3As4H;bani1in0; rex,aHeGhingFiDoCr9u8v7;! show;m23n4rntIto0Y;agedy,ib7o3K;e,u7;n0ta3D;p4rq2V;c,er,m7;etC;!y;am,mp2Q;ct4le5x return;aIcHeGhor3Wi1kEoDpin off,tBu9y7;ll7n1Rst3Z;ab29;b7nri13per bowl,rro1I;st2Vtot0;at2Mipe1Wo14rate3Oudent7;! lo09;ft ser3Smeo12;elet6i7;ll,rm33;ab0Scurity gu22min2N;e5ho2C;la2Undwi0Fpi6;av6eBhetor4i8o7;de5om,w;t8v7;erb0M;e,u0;bAc9f7publ4r0Mspi1;er7orm2;e5r0;it0ord label;a1u3G;estion mark,ot1V;aMeJhotocoSiGlEoCr8u7yram11;ddi2SpCrpo0Hs2U;e9o7;bl39s7;pe2Uta1;diction,mi0Droga35ss relea0D;p7rt0;py;a7ebisci1;q1Ste;cn4e8g7;!gy;!r;anut,d8r7t0;cen2Usp2V;al,est0;nop3r28t7;e,hog6;bj2Rc8pia1rde0thers,ve7wn2;n,rview;cu8e7;an;pi2;arra2Nit1Oot7umb2;a1Uhi25;aAe9i8o7ur0é07;nopo3pOrni23sq1Bti2L;li0On03tt6;d4nu,t0;mm0nd0Tte7yf3;ri0;aAegBi9u7;ddi1n7;ch;ght bulb,p03ving room;bor0Ty7; up;eyno1itt6;el3ourn0;c8dices,itia27ni1Qse1Vtel0Dvert7;eb17;en25i2E;aGeaDighBo7uman right;me8sp15tb7;ed;! r7;un; scho0Ori7;se;d7v6; start,pho7;ne;ndful,sh brown,v6ze;aAelat09laci2r8u7;l3y;an7enadi2id;a0Yd slam;df3r7;l4n12;aCet11iref3lBol3r8un7;er0;ee market,i8on7;ti2;ga1;ow2u1;br4mi3n0Q;conoBffi1Bgg,lecto0Hmbas11nApidem4s1Lth4ven9x8yel7;id;ampRempl0Dte5;i0Wt;er17;my;eHiCo9r7ump truck;agonf3i7;er,ve thru;c8g12i3or,ssi2wn7;side;to06umenA;aAgni9nn2s8vide7;nd;conte5incen12tri0Q;ta09;le0O;ath,c8f7ni0terre5;ault Zerr0;al,im0;aSeQhJiIlHoBr7;edit c9uc7;ib7;le;ard;efficBke,lAmmuniqIns8pi2rr0t0Pus7yo1;in;erv7uF;atoW;ic,lM;ie5;er0Gie5;ty,vil wJ;aBeqAick6oco9r7;istmas car7ysanthemum;ol;la1;ue;ndeli2racter7;ist4;iliVllBr7;e0tifica1;hi2naDpCrAt7ucus;erpi7hedr0;ll7;ar;!bohyd7ri2;ra1;it0;l,ry;aIeHlemGoEreakCu7;nAr7tterf3;g7i0;la7;ry;ny;fa7thro9;st;dy,ro7wl;ugh;ish;an,l3;nki9r7;!ri2;er;ng;cPdJlFnCppeti1rBs9tt4utop7;sy;ic;ce5pe7;ct;ray;ec8oma3ti8;ly;do1;i6l7;er7y;gy;en; hominBj8van7;tage;ec7;ti7;ve;em;cAe8qui7;tt0;ta1;te;i8ru0;al;de5;nt",
      Preposition:
        "true¦-,aPbMcLdKexcept,fIinGmid,notwithstandiWoDpXqua,sCt7u4v2w0;/o,hereSith0;! whHin,oW;ersus,i0;a,s-a-vis;n1p0;!on;like,til;h1ill,oward0;!s;an,r0;ough0u;!oM;ans,ince,o that,uch G;f1n0ut;!to;!f;! 0to;effect,part;or,r0;om;espite,own,u3;hez,irca;ar1e0oBy;sides,tween;ri7;bo8cross,ft7lo6m4propos,round,s1t0;!op;! 0;a whole,long 0;as;id0ong0;!st;ng;er;ut",
      SportsTeam:
        "true¦0:1A;1:1H;2:1G;a1Eb16c0Td0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Bm01newToQpJqueens parkIreal salt lake,sAt5utah jazz,vancouver whitecaps,w3yW;ashington 3est ham0Rh10;natio1Oredski2wizar0W;ampa bay 6e5o3;ronto 3ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasC;buccanee0ra0K;a7eattle 5heffield0Kporting kansas0Wt3;. louis 3oke0V;c1Frams;marine0s3;eah15ounG;cramento Rn 3;antonio spu0diego 3francisco gJjose earthquak1;char08paA; ran07;a8h5ittsburgh 4ortland t3;imbe0rail blaze0;pirat1steele0;il3oenix su2;adelphia 3li1;eagl1philNunE;dr1;akland 3klahoma city thunder,rlando magic;athle0Mrai3;de0; 3castle01;england 7orleans 6york 3;city fc,g4je0FknXme0Fred bul0Yy3;anke1;ian0D;pelica2sain0C;patrio0Brevolut3;ion;anchester Be9i3ontreal impact;ami 7lwaukee b6nnesota 3;t4u0Fvi3;kings;imberwolv1wi2;rewe0uc0K;dolphi2heat,marli2;mphis grizz3ts;li1;cXu08;a4eicesterVos angeles 3;clippe0dodDla9; galaxy,ke0;ansas city 3nE;chiefs,roya0E; pace0polis colU;astr06dynamo,rockeTtexa2;olden state warrio0reen bay pac3;ke0;.c.Aallas 7e3i05od5;nver 5troit 3;lio2pisto2ti3;ge0;broncZnuggeM;cowbo4maver3;ic00;ys; uQ;arCelKh8incinnati 6leveland 5ol3;orado r3umbus crew sc;api5ocki1;brow2cavalie0india2;bengaWre3;ds;arlotte horAicago 3;b4cubs,fire,wh3;iteB;ea0ulR;diff3olina panthe0; c3;ity;altimore 9lackburn rove0oston 5rooklyn 3uffalo bilN;ne3;ts;cel4red3; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 3;brav1falco2h4u3;nited;aw9;ns;es;on villa,r3;os;c5di3;amondbac3;ks;ardi3;na3;ls",
      Unit: "true¦a09b06cZdYexXfTgRhePin00joule0DkMlJmDnan0AoCp9quart0Dsq ft,t7volts,w6y2ze3°1µ0;g,s;c,f,n;dXear1o0;ttT; 0s 0;old;att06b;erPon0;!ne04;ascals,e1i0;cZnt02;rcent,tL;hms,uI;/s,e4i0m²,²,³;/h,cro2l0;e0liM;!²;grNsT;gEtL;it1u0;menSx;erRreR;b5elvins,ilo1m0notQ;/h,ph,²;!byIgrGmEs;ct0rtzN;aLogrE;allonLb0ig5rD;ps;a2emtGl0t6; oz,uid ou0;nceH;hrenheit,radG;aby9;eci3m1;aratDe1m0oulombD;²,³;lsius,nti0;gr2lit1m0;et0;er8;am7;b1y0;te5;l,ps;c2tt0;os0;econd1;re0;!s",
      "Adj|Noun":
        "true¦0:13;1:1A;a13b0Xc0Mde0Le0Gf0Ag09h08i06ju05l03mXnVoTpOrKsDt9u6v3w2;atershed,elcome;a2ision0P;gabo5nilla,ria2;b0Mnt;ndergr2pstairs;adua0Tou2;nd;a4e2oken,ri0;en,r2;min0rori0S;boo,n;e6ilv08o4quat,ta3u2well;bordina0Mper6;b0Cndard;ciali0Nl2vereign;e,ve1;cret,n2ri0;ior;a4e2outiSubbiL;ar,bCla0Mnt0p2side1;resenta0Lublican;ci0Gsh;a5eriodic0otenti0r2;emi3incip0o2;!fession0;er,um;rall5st,tie1;ff2pposi07v0;ensi0Ei03;aggTov2;el;aUe5in4o2;biTderYr2;al,t0;iature,or;di2tr0C;an,um;attIiber0u2;sh;stice,veniM;de0mpressioQn2;cumbe1dividu0no04sta1;alf,omelBumdrum;enious,old,raZ;a5e3i2luid;ne;llow,m2;aEiJ;ir,t,vo2;riLuriL;l4pXx2;c2ecuQpeS;ess;d2iH;er;mographSrivaM;hiFlassRo3rude,unn2;ing;m5n2operaJ;creBstitue1tempor3vertab2;le;ary;m3p2;anion,lex;er3u2;ni8;ci0;e6lank,o5r2;i3u2;te;ef;ttom,urgeois;st;cademAd7l3nim0rab;al;e4terna2;ti2;ve;rt;oles2ult;ce1;nt;ic",
      "Noun|Gerund":
        "true¦0:26;1:25;2:1W;3:1I;4:1Y;5:1O;a25b1Oc1Cd17en15f0Zg0Xh0Ui0Sjog20k0Ql0Mm0Jn0Ho0Dp06ques09rXsHtCuAvolunt16w6yEzo2;a8ed5i3or7r6;ap1Oest1Ci1;ki0r1O;i1r2s1Utc1U;nder6pri23;st1Mta4;al4e9hin4i8ra6y1J;c4di0i2v6;el15;mi0p1G;a1Xs1;ai12cIeHhFin1OkatDlZmo4nowCpeBt9u7w6;ea3im1T;f02r6;fi0vi0J;a1Kretc1Iu6;d1AfJ;l0Wn5;b7i0;eb6i0;oar5;ip14o6;rte2u1;a1r0At1;h7o3re6;a1Ge2;edu0Noo0N;aDe9i5o7u6;li0n2;o6wi0;fi0;a8c7hear1Cnde3por1struct6;r1Au3;or5yc0G;di0so2;p0Qti0;aBeacekAla9o7r6ublis0X;a0Peten5in1oces16;iso2si6;tio2;n2yi0;ee0K;cka0Tin1rt0K;f8pe7rgani6vula1;si0zi0;ni0ra1;fe3;e6ur0W;gotia1twor4;a7e6i2onito3;e1ssa0L;nufactu3rke1;a8ea7i6od0Jyi0;cen0Qf1s1;r2si0;n5ug0E;i6n0J;c4lS;ci0magi2n6ro2;nova1terac1;andPea1i7o6un1;l5wO;ki0ri0;athe3rie6ui5;vi0;ar0CenHi8l7or6ros1un5;ecas1mat1;ir1oo5;l7n6;anDdi0;i0li0;di0gin6;ee3;a8eba1irec1oub1r6umO;awi0es05i6;n4vi0;n6ti0;ci0;aFelebra1hDlBo8r6ur7;aw6os00;li0;a7di0lo3mplai2n6o4pi0ve3;duc1sul1;cMti0;apDea3imIo6ubI;ni0tK;a6ee3;n1t1;m9s1te3;ri0;aJeGitElDoBr9u6;il5ll7r6;pi0;yi0;an5;di0;a1m6o4;bi0;esHoa1;c6i0;hi0;gin2lon6t1;gi0;ni0;bys7c4ki0;ki0;it1;c9dverti8gi0rg7ssu6;mi0;ui0;si0;coun1ti0;ti0;ng",
      PhrasalVerb:
        "true¦0:93;1:97;2:8I;3:8W;4:8B;5:84;6:86;7:99;8:91;9:8H;A:8Y;B:8S;C:8V;D:8T;E:71;F:98;G:8Z;H:82;I:7I;J:7A;K:4H;a9Hb7Wc6Td6Ne6Lf5Jg52h4Diron0j49k42l3Gm33n30o2Yp2Equiet Hr1Zs0Lt00uYvacuu6SwOyammerBzL;ero Dip MonL;e0k0;by,ov9up;aReNhMiLor0Nrit1B;mp0n3Hpe0r5s5;ackAeel Di0U;aMiLn35;gh 3Yrd0;n Dr L;do1in,oJ;it 7Bk5lk Mrm 6Bsh Lt85v61;aw3do1o7up;aw3in,oC;rgeBsL;e 2herE;a01eZhWiSoRrNuLypQ;ckErn L;do1in,oJup;aMiLot0y 32;ckl81p F;ck HdL;e 60;n7Yp 3Gs5L;ck NdMe Lghten 6me0p o0Tre0;aw3ba4do1in,up;e Iy 2;by,oG;ink Mrow L;aw3ba4in,up;ba4ov9up;aLe 79ll64;m 2r 5O;ckBke Mlk L;ov9shit,u49;aLba4do1in,leave,o67up;ba4ft9pa6Bw3;a0Xc0Ve0Oh0Ki0Hl0Bm0An09o08p03quar5ItRuPwL;earNiL;ngMtch L;aw3ba4o8M; by;cLi6Dm 2ss0;k 66;aTeSiRoPrMuL;cKd36;aigh2Eet76iL;ke 7Tng L;al6Zup;p Lrm2G;by,in,oG;nKr 2tc4O;p F;cKmp0nd MrLveAy 2P;e Ht 2M;ba4do1up;arKeOiNlMrLurB;ead0ingBuc5;a49it 6I;c5ll o3Dn 2;ak Fe73ll0;aKber 2rt0und like;ap 5Wow Duggl5;ash 6Ooke0;eep OiLow 6;cMp L;o6Eup;e 69;in,oL;ff,v9;de1Agn 4OnLt 6Hz5;gLkE; al6Ble0;aNoLu5X;ot Lut0w 7N;aw3ba4f48oC;cKdeEk6FveA;e Qll1Ond Prv5tL; Ltl5K;do1foMin,o7upL;!on;ot,r60;aw3ba4do1in,o4Wup;oCto;al67out0rL;ap66ew 6K;ilAv5;aYeViToPuL;b 5Zle0n Lstl5;aMba4do1inLo2Jth4Ou5Q;!to;c2Xr8w3;ll Not MuL;g3IndA;a2Wf3Po7;ar8in,o7up;ng 69p oLs5;ff,p19;aLelAinEnt0;c6Id L;o3Oup;cKt0;a00eZiXlUoRrPsyc35uL;ll Nn5Lt L;aLba4do1in,oJto48up;pa4Ew3;a3Kdo1in,o22to46up;attleBess LiOop 2;ah2Fon;iMp Lr50u1Hwer 6O;do1in,o6Oup;nt0;aMuL;gEmp 6;ce u21y 6E;ck Lg0le 4Bn 6p5C;oJup;el 5OncilE;c54ir 3An0ss NtMy L;ba4oG; Hc2R;aw3ba4in,oJ;pLw4Z;e4Yt D;aMerd0oL;dAt54;il Hrrow H;aUeRiQoMuL;ddl5ll I;cKnkeyNp 6uthAve L;aLdo1in,o4Mup;l4Ow3; wi4L;ss0x 2;asur5e3TlMss L;a21up;t 6;ke Mn 6rLs2Ax0;k 6ryA;do,fun,oCsure,up;a03eWiRoMuL;ck0st I;aOc4Gg NoLse0;k Lse4E;aft9ba4do1forw38in57o10u47;in,oJ;d 6;e OghtNnMsLve 01;ten F;e 2k 2; 2e47;ar8do1in;aNt MvelL; oC;do1go,in,o7up;nEve L;in,oL;pLut;en;c5p 2sh MtchBughAy L;do1o5A;in4Qo7;eNick Mnock L;do1oCup;oCup;eMy L;in,up;l Ip L;aw3ba4do1f05in,oJto,up;aNoMuL;ic5mpE;ke3Tt H;c44zz 2;a02eXiUoQuL;nMrrLsh 6;y 2;keMt L;ar8do1;r H;lLneErse3L;d Le 2;ba4dLfast,o25up;ear,o1;de Mt L;ba4on,up;aw3o7;aLlp0;d Nl Ir Lt 2;fLof;rom;f11in,o1WuX;cKm 2nMsh0ve Lz2Q;at,it,to;d Mg LkerQ;do1in,o2Uup;do1in,oL;ut,v9;k 2;aZeUive Sloss IoNrMunL; f0S;ab hold,in44ow 2V; Lof 2J;aNb1Nit,oMr8th1JuL;nd9;ff,n,v9;bo7ft9hQw3;aw3bLdo1in,oJrise,up,w3;a4ir2I;ar 6ek0t L;aLb1Gdo1in,o1Dr8up;cMhLl2Hr8t,w3;ead;ross;d aLng 2;bo7;a0Fe08iZlVoRrNuL;ck Le2P;ar8up;eMighten LownBy 2;aw3oG;eLshe29; 2z5;g 2lNol Lrk I;aLwi22;bo7r8;d 6low 2;aMeLip0;sh0;g 6ke0mLrLtten H;e F;gSlQnOrMsLzzle0;h F;e Lm 2;aw3ba4up;d0isL;h 2;e Ll 1V;aw3fQin,o7;ht ba4ure0;eQnMsL;s 2;cNd L;fLoG;or;e D;d06l 2;cPll Lrm0t1I;aNbMdo1in,oLsho0Gth0Avictim;ff,ut,v9;a4ehi2P;pa0D;e L;do1oGup;at Ldge0nd 13y5;in,o7up;aPi1IoOrL;aMess 6op L;aw3b04in,oC;gBwB; Iubl1C;m 2;a0Bh06l03oPrMut L;aw3ba4do1oCup;ackBeep MoLy0;ss Dwd0;by,do1in,o0Vup;me OoMuntL; o2B;k 6l L;do1oG;aSbRforPin,oOtLu0P;hMoLrue;geth9;rough;ff,n,ut,v9;th,wL;ard;a4y;paLr8w3;rt;eaMose L;in,oCup;n 6r F;aOeMiL;ll0pE;ck Der Lw F;on,up;t 2;lSncel0rPsNtch MveE; in;o1Oup;h Dt L;doubt,oG;ry MvL;e 09;aw3oJ;l Lm H;aMba4do1oJup;ff,n,ut;r8w3;a0We0NiteAl0Go05rRuL;bblOckl06il0Elk 6ndl06rMsLtNy FzzA;t 01;n 0IsL;t D;e I;ov9;anXeaViMush L;oGup;ghRng L;aOba4do1forNin,oMuL;nd9p;n,ut;th;bo7lLr8w3;ong;teL;n 2;k L;do1in,o7up;ch0;arUg 6iSn5oQrOssNttlMunce Lx D;aw3ba4;e 6; ar8;e H;do1;k Dt 2;e 2;l 6;do1up;d 2;aQeed0oLurt0;cNw L;aw3ba4do1o7up;ck;k L;in,oC;ck0nk0stA; oRaOef 2lt0nd L;do1ov9up;er;up;r Mt L;do1in,oCup;do1o7;ff,nL;to;ck Qil0nNrgMsL;h D;ainBe D;g DkB; on;in,o7;aw3do1in,oCup;ff,ut;ay;ct FdRir0sk NuctionA; oG;ff;ar8o7;ouL;nd; o7;d L;do1oLup;ff,n;wn;o7up;ut",
      ProperNoun:
        "true¦barbie,c4diego,e3f2iron maiden,kirby,m0nis,riel,stevens;ercedes,i0;ckey,ssy;inn,lorence,ranco;lmo,uro;atalina,hristi",
      Ordinal:
        "true¦eBf7nin5s3t0zeroE;enDhir1we0;lfCn7;d,t3;e0ixt8;cond,vent7;et0th;e6ie7;i2o0;r0urt3;tie4;ft1rst;ight0lev1;e0h,ie1;en0;th",
      Cardinal:
        "true¦bEeBf5mEnine7one,s4t0zero;en,h2rDw0;e0o;lve,n5;irt6ousands,ree;even2ix2;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illions",
      Multiple: "true¦b3hundred,m3qu2se1t0;housand,r2;pt1xt1;adr0int0;illion",
      City: "true¦0:76;1:64;2:6J;3:6M;4:5V;a6Bb56c4Ld4Be47f3Zg3Kh3Ci33j2Yk2Hl25m1Nn1Do1Ap0Xq0Vr0Os05tRuQvLwDxiBy9z5;a7h5i4Puri4R;a5e5ongsh0;ng3K;greb,nzib5J;ang2e5okoha3Vunfu;katerin3Krev0;a5n0R;m5Kn;arsBeAi6roclBu5;h0xi,zh5S;c7n5;d5nipeg,terth4;hoek,s1N;hi62kl3D;l66xford;aw;a8e6i5ladivost5Polgogr6N;en3lni6U;ni24r5;n2o3saill4Q;lenc4Zncouv3Vr3ughn;lan bat1Erumqi,trecht;aFbilisi,eEheDiBo9r7u5;l23n66r5;in,ku;i5ondh65;es54poli;kyo,m32ron1Rulo5;n,uS;an5jua3l2Wmisoa6Dra3;j4Wshui; hag64ssaloni2K;gucigal28hr0l av1W;briz,i6llinn,mpe59ng5rtu,shk2U;i3Hsh0;an,chu1n0p2Hyu0;aEeDh8kopje,owe1It7u5;ra5zh50;ba0It;aten is58ockholm,rasbou69uttga2Y;an8e6i5;jiazhua1llo1m5Zy0;f53n5;ya1zh4K;gh3Nt4T;att48o1Yv47;cramen18int ClBn5o paulo,ppo3Urajevo; 7aa,t5;a 5o domin3H;a3fe,m1O;antonBdie3Ffrancisco,j5ped3Qsalvad0L;o5u0;se;em,z28;lou5Bpeters27;aAe9i7o5;me,sar5t5C;io;ga,o5yadh;! de janei3H;cife,ims,nn3Lykjavik;b4Uip4lei2Knc2Rwalpindi;ingdao,u5;ez2i0R;aFeEhDiCo9r7u6yong5;ya1;eb5Aya1;a5etor3O;g53to;rt5zn0; 5la4Eo;au prin0Nelizabe26sa04;ls3Rrae5Btts28;iladelph3Inom pe1Coenix;r23tah tik3G;dua,lerZnaji,r4Qt5;na,r34;ak46des0Lm1Or6s5ttawa;a3Xlo;an,d07;a7ew5ing2Hovosibir1Lyc; 5cast38;del26orlea46taip16;g8iro4Xn5pl2Yshv35v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0Y;aFeCi9o6u5;mb2Cni28sc40;gadishu,nt6s5;c15ul;evideo,pelli1Tre31;ami,l6n16s5;kolc,sissauga;an,waukee;cca,d5lbour2Omph43ndo1Essi3;an,ell5i3;in,ín;cau,drAkass2Tl9n8r5shh4A;aca6ib5rakesh,se2M;or;i1Ty;a4EchFdal10i47;mo;id;aDeAi8o6u5vSy2;anMckn0Pdhia3;n5s angel27;d2g bea1O;brev2Ce3Mma5nz,sb2verpo29;!ss28; ma3Ai5;c5pzig;est17; p6g5ho2Xn0Dusan25;os;az,la34;aHharFiClaipeBo9rak0Eu7y5;iv,o5;to;ala lump4n5;mi1sh0;hi0Ilka2Ypavog4si5wlo2;ce;da;ev,n5rkuk;gst2sha5;sa;k5toum;iv;bIdu3llakuric0Rmpa3Fn6ohsiu1ra5un1Jwaguc0R;c0Qj;d5o,p4;ah1Uy;a7e6i5ohannesW;l1Wn0;dd36rusalem;ip4k5;ar2I;bad0mph1PnBrkutVs8taYz5̇zm7;m6tapala5;pa;ir;fah0l6tanb5;ul;am2Yi2H;che2d5;ianap2Mo20;aAe7o5yder2V; chi mi5ms,nolulu;nh;f6lsin5rakli2;ki;ei;ifa,lifax,mCn5rb1Dva3;g8nov01oi;aFdanEenDhCiPlasgBo9raz,u5;a5jr23;dal6ng5yaquil;zh1J;aja2Nupe;ld coa1Bthen5;bu2R;ow;ent;e0Uoa;sk;lw7n5za;dhi5gt1E;nag0U;ay;aisal28es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Pl paso;in5mont2;bur5;gh;aBe8ha0Xisp4o7resd0Lu5;b5esseldorf,nkirk,rb0shanbe;ai,l0I;ha,nggu0rtmu13;hradSl6nv5troit;er;hi;donghIe6k09l5masc1Yr es sala1KugavpiY;i0lU;gu,je2;aJebu,hAleve0Vo5raio02uriti1P;lo7n6penhag0Ar5;do1Nk;akKst0V;gUm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;ng5ttogr14;ch8sha,zh07;gliari,i9lga8mayenJn6pe town,r5tanO;acCdiff;ber19c5;un;ry;ro;aWeNhKirmingh0WoJr9u5;chareTdapeTenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil8tisla7zzav5;il5;le;va;ia;goZst2;op6ubaneshw5;ar;al;iCl9ng8r5;g6l5n;in;en;aluru,hazi;fa6grade,o horizon5;te;st;ji1rut;ghd0AkFn9ot8r7s6yan n4;ur;el,r06;celo3i,ranquil08;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a04b01cc00ddis abaZgartaYhmedWizawl,lSmPnHqaZrEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a8c5kaNtwerp;hora6o3;na;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 6buquerq5eppo,giers,maty;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg",
      Region:
        "true¦0:2N;1:2T;2:2K;a2Qb2Dc1Zd1Ues1Tf1Rg1Lh1Hi1Cj18k13l10m0Pn07o05pZqWrTsKtFuCv9w5y3zacatec2U;akut0o0Du3;cat2k07;a4est 3isconsin,yomi1M;bengal,vi6;rwick2Bshington3;! dc;er4i3;rgin0;acruz,mont;dmurt0t3;ah,tar3; 2La0X;a5e4laxca1Rripu1Xu3;scaDva;langa1nnessee,x2F;bas0Vm3smNtar25;aulip2Dil nadu;a8i6o4taf11u3ylh1F;ffYrr04s1A;me1Cno1Quth 3;cVdU;ber0c3kkim,naloa;hu2ily;n4skatchew2xo3;ny; luis potosi,ta catari1;a3hode9;j3ngp07;asth2shahi;ingh25u3;e3intana roo;bec,en5reta0R;ara7e5rince edward3unjab; i3;sl0B;i,nnsylv3rnambu0B;an0;!na;axa0Ydisha,h3klaho20ntar3reg6ss0Bx0G;io;aJeDo5u3;evo le3nav0W;on;r3tt17va scot0;f8mandy,th3; 3ampton16;c5d4yo3;rk14;ako1N;aroli1;olk;bras1Mva0Cw3; 4foundland3;! and labrador;brunswick,hamp0Xjers4mexiSyork3;! state;ey;galOyarit;a9eghala0Mi5o3;nta1r3;dov0elos;ch5dlanCn4ss3zor11;issippi,ouri;as geraOneso18;ig2oac2;dhy12harasht0Gine,ni4r3ssachusetts;anhao,i el,ylF;p3toba;ur;anca0Ie3incoln0IouisH;e3iR;ds;a5e4h3omi;aka06ul1;ntucky,ra01;bardino,lmyk0ns0Qr3;achay,el0nata0X;alis5har3iangxi;kh3;and;co;daho,llino6n3owa;d4gush3;et0;ia1;is;a5ert4i3un2;dalFm0D;fordZ;mpYrya1waii;ansu,eorg0lou7oa,u3;an4erre3izhou,jarat;ro;ajuato,gdo3;ng;cesterS;lori3uji2;da;sex;ageTe6o4uran3;go;rs3;et;lawaLrbyK;aEeaDh8o3rimea ,umbr0;ahui6l5nnectic4rsi3ventry;ca;ut;i02orado;la;e4hattisgarh,i3uvash0;apQhuahua;chn4rke3;ss0;ya;ra;lFm3;bridge6peche;a8ihar,r7u3;ck3ryat0;ingham3;shi3;re;emen,itish columb0;h0ja cal7lk6s3v6;hkorto3que;st2;an;ar0;iforn0;ia;dygea,guascalientes,lAndhr8r4ss3;am;izo1kans4un3;achal 6;as;na;a 3;pradesh;a5ber4t3;ai;ta;ba4s3;ka;ma",
      Country:
        "true¦0:39;1:2M;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om3DpZqat1KrXsKtCu6v4wal3yemTz2;a25imbabwe;es,lis and futu2Y;a2enezue32ietnam;nuatu,tican city;.5gTkraiZnited 3ruXs2zbeE;a,sr;arab emirat0Kkingdom,states2;! of am2Y;k.,s.2; 28a.;a7haBimor-les0Bo6rinidad4u2;nis0rk2valu;ey,me2Ys and caic1U; and 2-2;toba1K;go,kel0Znga;iw2Wji2nz2S;ki2U;aCcotl1eBi8lov7o5pa2Cri lanka,u4w2yr0;az2ed9itzerl1;il1;d2Rriname;lomon1Wmal0uth 2;afr2JkLsud2P;ak0en0;erra leoEn2;gapo1Xt maart2;en;negKrb0ychellY;int 2moa,n marino,udi arab0;hele25luc0mart20;epublic of ir0Dom2Duss0w2;an26;a3eHhilippinTitcairn1Lo2uerto riM;l1rtugE;ki2Cl3nama,pua new0Ura2;gu6;au,esti2;ne;aAe8i6or2;folk1Hth3w2;ay; k2ern mariana1C;or0N;caragua,ger2ue;!ia;p2ther19w zeal1;al;mib0u2;ru;a6exi5icro0Ao2yanm05;ldova,n2roc4zamb9;a3gol0t2;enegro,serrat;co;c9dagasc00l6r4urit3yot2;te;an0i15;shall0Wtin2;ique;a3div2i,ta;es;wi,ys0;ao,ed01;a5e4i2uxembourg;b2echtenste11thu1F;er0ya;ban0Hsotho;os,tv0;azakh1Ee3iriba03o2uwait,yrgyz1E;rWsovo;eling0Jnya;a2erF;ma15p1B;c6nd5r3s2taly,vory coast;le of m19rael;a2el1;n,q;ia,oI;el1;aiSon2ungary;dur0Mg kong;aAermany,ha0Pibralt9re7u2;a5ern4inea2ya0O;!-biss2;au;sey;deloupe,m,tema0P;e2na0M;ce,nl1;ar;bTmb0;a6i5r2;ance,ench 2;guia0Dpoly2;nes0;ji,nl1;lklandTroeT;ast tim6cu5gypt,l salv5ngl1quatorial3ritr4st2thiop0;on0; guin2;ea;ad2;or;enmark,jibou4ominica3r con2;go;!n B;ti;aAentral african 9h7o4roat0u3yprQzech2; 8ia;ba,racao;c3lo2morPngo-brazzaville,okFsta r03te d'ivoiK;mb0;osD;i2ristmasF;le,na;republic;m2naTpe verde,yman9;bod0ero2;on;aFeChut00o8r4u2;lgar0r2;kina faso,ma,undi;azil,itish 2unei;virgin2; is2;lands;liv0nai4snia and herzegoviGtswaGuvet2; isl1;and;re;l2n7rmuF;ar2gium,ize;us;h3ngladesh,rbad2;os;am3ra2;in;as;fghaFlCmAn5r3ustr2zerbaijH;al0ia;genti2men0uba;na;dorra,g4t2;arct6igua and barbu2;da;o2uil2;la;er2;ica;b2ger0;an0;ia;ni2;st2;an",
      Place:
        "true¦aVbTcPdOeNfMgIhHiFjfk,kDlBm9new eng8or7p5s4t2u1vostok,wake is8y0;akutDyz;laanbaatar,pP;ahiti,he 0;bronx,hamptons;akhalGfo,oho,under3yd;acifUek,h0itcairn;l,x;ange county,d;land;a0co,idHuc;gadRlibu,nhattR;a0gw,hr;s,x;osrae,rasnoyar0ul;sk;ax,cn,nd0st;ianKochina;arlem,kg,nd,ovd;ay village,re0;at 0enwich;brita0lakB;in;co,ra;urope,verglad8;en,fw,own2xb;dg,gk,h0lt;a1ina0uuk;town;morro,tham;cn,e0kk,rooklyn;l air,verly hills;frica,m7n2r3sia,tl1zor0;es;!ant2;adyr,tar0;ct0;ic0; oce0;an;ericas,s",
      WeekDay: "true¦fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s",
      Month: "true¦dec0february,july,nov0octo1sept0;em0;ber",
      Date: "true¦ago,t0week end,yesterd2;mr2o0;d0morrow;ay;!w",
      Duration:
        "true¦century,dAh9m6q5se4w1y0;ear,r;eek1k0;!s;!e4;ason,c;tr,uarter;i0onth;lliseco0nute;nd;our,r;ay,ecade",
      FemaleName:
        "true¦0:IS;1:IW;2:I5;3:I4;4:IM;5:I9;6:JD;7:GQ;8:J9;9:J5;A:HD;B:HN;C:IE;D:J2;E:II;F:H2;G:C4;H:HP;aGIbFDcDJdCSeBIfB0gAAh9Qi9Dj8Ck7Cl5Wm46n3Ko3Gp34qu33r2Bs16t0Fu0Dv03wWxiUyPzI;aMeJineb,oIsof2;e3Rf2la,ra;h3iLlJna,ynI;ab,ep;da,ma;da,h3iIra;nab;aLeKi0GolB3uJvI;etAonDH;i0na;le0sen2;el,gm3Gn,rGAs8T;aoIme0nyi;m5YyAA;aNendDRhiD8iI;dele9lKnI;if45niIo0;e,f44;a,helmi0lIma;a,ow;ka0nB;aOeLiIusa5;ck82kJlAole7viI;anGenIQ;ky,toriBE;da,lA5rIs0;a,nIoniGV;a,iFH;leInesGV;nI7rI;i1y;g9rIxGW;su5te;aZeVhSiOoMrJuIy3;i,la;acIPiIu0L;c2na,sI;hGta;nIr0H;iGya;aKffaEGnIs6;a,gtiI;ng;!nFHra;aJeIomasi0;a,l9Lo87res1;l2ndolwethu;g9Co85rJssI;!a,ie;eIi,ri8;sa,za;bPlNmLnJrIs6tia0wa0;a60yn;iIya;a,ka,s6;arGe3iIm75ra;!ka;a,iI;a,t6;at6it6;a0Gcarlett,e0ChYiUkye,neza0oStOuJyI;bI2lvi1;ha,mayI5ni7sJzI;an3KetAie,y;anIi8;!a,e,nI;aCe;aKeI;fIl5DphI;an4;cHQr5;b2fiA3m0MnIphi1;d3ia,ja,ya;er3lKmon1nJobh8MtI;a,i;dy;lEHv2;aNeJirIo0risEZy5;a,lDD;ba,e0i5lKrI;iIr6Gyl;!d8Efa;ia,lDP;hd,iNki3nKrJu0w0yI;la,ma,na;i,le9on,ron;aJda,ia,nIon;a,on;!ya;k6mI;!aa;lKrJtaye7YvI;da,inj;e0ife;en1i0ma;anA0bMd3Kh1PiBkLlKmJnd3rIs6vannaC;aCi0;ant6i3;lDEma,ome;ee0in8Ou3;in1ri0;a05e00hYiVoIuthDC;bTcSghRl8GnQsKwJxI;anAUie,y;an,e0;aJeIie,lD; merBIann8ll1marD6t7;!lInn1;iIyn;e,nI;a,dG;da,i,na;ayy8B;hel63io;bDFer7yn;a,cJkImas,nGta,ya;ki,o;helHki;ea,iannG7oI;da,n1L;an0bKemGgi0iJnIta,y0;a86ee;han81na;a,eI;cE5kaC;bi0chJe,i0mo0nIquEFy0;di,ia;aEDelIiB;!e,le;een4ia0;aOeNhLipaluk,oKrIute67;iIudenCL;scil3LyamvaB;lly,rt2;ilome0oebe,ylI;is,lis;ggy,nelope,r5t3;ige,m0UnLo5rvaDBtJulI;a,etAin1;ricIt4T;a,e,ia;do3i07;ctav2dJfCUis6lIphCUumBYyunbileg;a,ga,iv2;eIvA9;l2tA;aXeViNoJurIy5;!ay,ul;a,eKor,rJuI;f,r;aCeEma;ll1mi;aOcMhariBJkLlaKna,sIta,vi;anIha;ur;!y;a,iDNki;hoHk9SolI;a,eDE;!mh;hir,lIna,risFsreE;!a,lBO;asuMdLh2i6CnKomi8rgEJtIzanin zah3;aIhal4;li1s6;cy,etA;e9iEP;nngu30;a0Ackenz4e02iNoKrignayani,uriD8yI;a,rI;a,lOna,tH;bi0i3llBDnI;a,iI;ca,ka,qCY;a,cUkaTlOmi,nMrJtzi,yI;ar;aJiam,lI;anEI;!l,nB;dy,eIh,n4;nhHrva;aLdKiCKlI;iIy;cent,e;red;!gros;!e5;ae5hI;ae5el40;ag5EgOi,lLrI;edi77iJjem,on,yI;em,l;em,sF;an4iIliF;nIsC9;a,da;!an,han;b0DcANd0Be,g09ha,i08ja,l06n04rMsoum5YtLuJv80x9FyIz4;bell,ra,soB4;de,rI;a,eE;h8Cild1t4;a,cYgUiLjor4l7Qn4s6tKwa,yI;!aIbe6Uja9lA9;m,nBC;a,ha,in1;!aKbC6eJja,lDna,sIt62;!a,ol,sa;!l1H;! Kh,mJnI;!a,e,n1;!awit,i;aliACcJeduarBfern5EjIlui5W;o6Dul2;ecil2la3;arKeJie,oIr46ueriA;!t;!ry;et44i39;el4Vi75y;dIon,ue5;akran7y;ak,en,iIlo3Q;a,ka,nB;a,re,s4te;daIg4;!l3C;alDd4elIge,isD6on0;ei9in1yn;el,le;a0Oe0DiZoRuMyI;d2la,nI;!a,dJeBCnIsCG;!a,eBB;a,sCE;aCRcKel0QiFlJna,pIz;e,i7;a,u,wa;iIy;a0Te,ja,l2LnB;is,l1TrKttJuIvel4;el5is1;e,ie;aLeJi8na,rI;a84i8;lIn1t7;ei;!in1;aTbb98dSepa,lNnKsJv2zI;!a,be5KetAz4;a,etA;!a,dI;a,sIy;ay,ey,i,y;a,iKja,lI;iIy;a9We;!aI;!nG;ia,ya;!nI;!a,ne;aQda,e0iOjZla,nNoLsKtIx4y5;iIt4;c2t2;e2NlCB;la,nIra;a,ie,o3;a,or1;a,gh,laI;!ni;!h,nI;a,d3e,n5O;cPdon93iOkes6mi96na,rNtKurJvIxmi,y5;ern1in2;a,e53ie,yn;as6iJoI;nya,ya;fa,s6;a,isF;a,la;ey,ie,y;a05e00hYiPlAFoOrKyI;lIra;a,ee,ie;istIy6B;a,en,iJyI;!na;!e,n58;nul,ri,urtnAV;aPerOlAUmKrIzzy;a,stI;en,in;!berlJmernI;aq;eIi,y;e,y;a,stE;!na,ra;aIei3ongordzol;dij1w5;el7MiLjsi,lKnJrI;a,i,ri;d3na,za;ey,i,lB8s4y;ra,s6;bi7cAEdiat7EeAXiSlRmQnyakuma1BrOss6HtLvi7yI;!e,lI;a,eI;e,i8H;a6BeJhIi4MlDri0y;ar69er69ie,leErAXy;!lyn8Cri0;a,en,iIl5Qoli0yn;!ma,nGsF;a5il1;ei8Ai,l4;a,tl6I;a09eZiWoOuI;anMdLliIst61;a8DeIsF;!n9tI;!a,te;e5Hi3Iy;a,i7;!anOcelDdNelHhan7NleMni,sJva0yI;a,ce;eIie;fIlDph5S;a,in1;en,n1;i8y;!a,e,n40;lIng;!i1DlI;!i1C;anOle0nLrKsI;i88sI;!e,i87;i,ri;!a,elHif2AnI;a,etAiIy;!e,f28;a,e89iJnI;a,e88iI;e,n1;cNda,mi,nJque4UsminGvie3y9zI;min8;a8eJiI;ce,e,n1s;!lIsFt0G;e,le;inJk4lDquelI;in1yn;da,ta;da,lSmQnPo0rOsJvaIzaro;!a0lu,na;aKiJlaIob7Z;!n9H;do3;belIdo3;!a,e,l37;a72en1i0ma;di3es,gr6Tji;a9elBogI;en1;a,e9iIo0se;a0na;aTePiKoIusFyacin29;da,ll4rten21snI;a,i9K;lJmaI;ri;aJdIlaJ;a,egard;ry;ath1AiKlJnriet7rmi9sI;sa,t19;en2Qga,mi;di;bi2Bil8ClOnNrKsJtIwa,yl8C;i5Nt4;n5Tti;iImo4Xri4Y;etI;!te;aCnaC;a,ey,l4;a03eXiSlQoOrLunKwI;enIyne1O;!dolD;ay,el;acieJetIiselB;a,chE;!la;ld19ogooI;sh;adys,enIor2yn2G;a,da,na;aLgi,lJna,ov84selIta;a,e,le;da,liI;an;!n0;mMnKorgJrI;ald3Ni,m3Atru86;etAi4S;a,eIna;s25vieve;ma;bJle,mIrnet,yH;al5Ji5;i5BrielI;a,l1;aUeRiQlorPoz2rI;anKeJiI;da,eB;da,ja;!cI;esJiIoi0N;n1s5X;!ca;a,enc2;en,o0;lJn0rnI;anB;ec2ic2;jr,n7rLtIy8;emJiIma,ouma7;ha,ma,n;eh;ah,iBrah,za0;cr4Ld0Oe0Ni0Mk7l05mXn4WrUsOtNuMvI;aKelJiI;!e,ta;inGyn;!ngel2S;geni1ni43;h5Qta;mMperanLtI;eJhIrel5;er;l2Zr8;za;a,eralB;iIma,nest2Jyn;cIka,n;a,ka;a,eNiKmI;aIie,y;!li9;lIn1;ee,iIy;a,e,ja;lIrald;da,y;aXeViOlNma,no3oLsKvI;a,iI;na,ra;a,ie;iIuiI;se;a,en,ie,y;a0c2da,f,nNsKzaI;!betIve7;e,h;aIe,ka;!beI;th;!a,or;anor,nG;!a;!in1na;leEs6;vi;eJiIna,wi0;e,th;l,n;aZeNh2iMjeneLoI;lor5Qminiq4Gn3DrItt4;a,eEis,la,othIthy;ea,y;ba;an0AnaCon9ya;anRbQde,ePiNlKmetr2nIsir5H;a,iI;ce,se;a,iJla,orIphi9;es,is;a,l6A;dIrdI;re;!d59na;!b2ForaCraC;a,d3nI;!a,e;hl2i0l0HmOnMphn1rJvi1WyI;le,na;a,by,cJia,lI;a,en1;ey,ie;a,etAiI;!ca,el1Bka,z;arIia;is;a0Se0Oh05i03lVoKristJynI;di,th2;al,i0;lQnNrJurI;tn1E;aKd2MiIn2Mri9;!nI;a,e,n1;!l4;cepci57n4sI;tanIuelo;ce,za;eIleE;en,tA;aKeoJotI;il4Z;!pat3;ir8rKudI;etAiI;a,ne;a,e,iI;ce,s00;a3er3ndI;i,y;aSeOloe,rI;isKyI;stI;al;sy,tI;a1Qen,iIy;an1e,n1;deKlseJrI;!i8yl;a,y;li9;nNrI;isLlJmI;ai9;a,eIotA;n1tA;!sa;d3elHtI;al,elH;cJlI;esAi42;el2ilI;e,ia,y;itlZlYmilXndWrOsMtIy5;aKeKhIri0;erIleErDy;in1;ri0;a32sI;a31ie;a,iOlMmeKolJrI;ie,ol;!e,in1yn;lIn;!a,la;a,eIie,o7y;ne,y;na,sF;a0Hi0H;a,e,l1;is7l4;in,yn;a0Ie02iZlXoUrI;andi8eRiKoJyI;an0nn;nwDoke;an3CdgMg0XtI;n2WtI;!aJnI;ey,i,y;ny;etI;!t8;an0e,nI;da,na;bbi8glarJlo06nI;i7n4;ka;ancIythe;a,he;an18lja0nIsm3I;i7tI;ou;aVcky,linUni7rQssPtKulaCvI;!erlI;ey,y;hKsy,tI;e,iIy8;e,na;!anI;ie,y;!ie;nIt6yl;adJiI;ce;etAi9;ay,da;!triI;ce,z;rbKyaI;rmI;aa;a3o3ra;a2Sb2Md23g1Zi1Qj5l16m0Xn0Aoi,r05sVtUuQvPwa,yJzI;ra,u0;aLes6gKlJseI;!l;in;un;!nI;a,na;a,i2I;drKgus1RrJsteI;ja;el2;a,ey,i,y;aahua,he0;hJi2Gja,mi7s2DtrI;id;aNlJraqIt21;at;eJi8yI;!n;e,iIy;gh;!nI;ti;iKleJo6pi7;ta;en,n1tA;aIelH;!n1J;a01dje5eZgViTjRnKohito,toIya;inetAnI;el5ia;!aLeJiImK;e,ka;!mItA;ar4;!belJliFmV;sa;!le;a,eliI;ca;ka,sIta;a,sa;elIie;a,iI;a,ca,n1qI;ue;!tA;te;!bJmIstasiNya;ar2;el;aMberLeliKiIy;e,l2naI;!ta;a,ja;!ly;hHiJl2nB;da;a,ra;le;aXba,eQiNlLthKyI;a,c2sI;a,on,sa;ea;iIys0O;e,s0N;a,cJn1sIza;a,e,ha,on,sa;e,ia,ja;c2is6jaLksaLna,sKxI;aIia;!nd3;ia,saI;nd3;ra;ia;i0nJyI;ah,na;a,is,naCoud;la;c6da,leEmOnMsI;haClI;inIyZ;g,n;!h;a,o,slI;ey;ee;en;at6g4nJusI;ti0;es;ie;aXdiUelNrI;eKiI;anNenI;a,e,ne;an0;na;!aMeLiJyI;nn;a,n1;a,e;!ne;!iI;de;e,lDsI;on;yn;!lI;i9yn;ne;aLbJiIrM;!gaL;ey,i8y;!e;gaI;il;dLliyKradhJs6;ha;ya;ah;a,ya",
      FirstName:
        "true¦aLblair,cHdevGgabrieFhinaEjCk9l8m4quinn,re3s0;h0umit;ay,e0iloh;a,lby;g6ne;a1el0ina,org5;!okuh9;naia,r0;ion,lo;ashawn,uca;asCe1ir0rE;an;lsAnyat2rry;am0ess6ie,ude;ie,m5;ta;le;an,on;as2h0;arl0eyenne;ie;ey,sidy;lex2ndr1ubr0;ey;a,ea;is",
      Person:
        "true¦a0Ob0Hc08d05e02g01hZinez,jYkVlSmMnKoJpHr9s7t4v2w0xzibit,yanni;ar0ednesday adams,ill.i.am,oode;hol,rO;a0oltaiO;lentino rossi,n go7;a1heresa may,i0yra banks;ger woods,mbaQ;tum,ylor;a0carlett johanss03hakespeaJinbad,lobodan milosevic,ocratM;ddam hussain,ntigold;a6e5i4o2u0za;mi,n dmc,paul,sh limbau0;gh;d stewart,nald0thko;inho,o;hanYvaldo;ese witherspoVil9mbrandt;ffi,y roma03;a0e08ip07lato,oe,uff daddy;lm06ris hiltS;prah winfrWra;as,e0iles crane,ostradamP; yo,l3ttI;acklemo4essia3i1o0ubarek;by,lie3net,rrissS;randa ju0tt romnR;ly;en;re;ady gaga,e0iberaT;bron jam0e;es;anye west,e1iefer suther0obe bryant;land;ats,ndall,sha;aime,effersCk rowling;a0itlPulk hogan;lle berry,rrisA;ast9otye;ff1m0nya,zekiel;eril lagasse,inem;ie;a1e0ick wolf,rake;gas,nzel washingt4;lt3nB;ar5h3lint2o0;nfuci0olio;us;on;aucCy0;na;dinal wols1son0;! palm9;ey;a5e3o2ro0;ck,n0;te;no;ck,yon0;ce;nksy,rack obama;ristot1shton kutch0;er;le",
      LastName:
        "true¦0:9G;1:9W;2:9Y;3:9O;4:9I;5:8L;6:9L;7:A1;8:9F;9:8A;A:78;B:6G;C:6K;a9Vb8Nc7Ld6Ye6Tf6Fg5Wh59i55j4Qk45l3Nm2Sn2Fo27p1Oquispe,r18s0Ft05vVwOxNyGzD;aytsAEhD;aDou,u;ng,o;aGeun81iDoshiAAun;!lD;diDmaz;rim,z;maDng;da,guc98mo6VsDzaA;aAhiA8;iao,u;aHeGiEoDright,u;jc8Tng;lDmm0nkl0sniewsA;liA2s2;b0iss,lt0;a5Tgn0lDtanabe;k0sh;aHeGiEoDukB;lk5roby5;dBllalDnogr2Zr10ss0val37;ba,obos;lasEsel7P;lGn dFrg8FsEzD;qu7;ily9Pqu7silj9P;en b35ijk,yk;enzue96verde;aLeix1KhHi3j6ka3IoGrFsui,uD;om50rD;c3n0un1;an,embl8UynisA;dor96lst31m4rr9th;at5Ni7NoD;mErD;are70laci65;ps2s0Z;hirBkah8Enaka;a01chXeUhQiNmKoItFuEvDzabo;en8Bobod34;ar7bot4lliv3zuA;aEein0oD;i68j3Myan8W;l6rm0;kol5lovy5re6Rsa,to,uD;ng,sa;iDy60;rn5tD;!h;l5ZmEnDrbu;at8gh;mo6Eo6K;aFeDimizu;hu,vchD;en7Duk;la,r17;gu8mDoh,pulve8Trra4S;jDyD;on5;evi6Giltz,miDneid0roed0ulz,warz;dEtD;!z;!t;ar42h6ito,lFnDr4saAto,v4;ch7d0AtDz;a4Pe,os;as,ihBm3Zo0Q;aOeNiKoGuEyD;a67oo,u;bio,iz,sD;so,u;bEc7Bdrigue57g03j73mDosevelt,ssi,ta7Nux,w3Z;a4Ce0O;ertsDins2;!on;bei0LcEes,vDzzo;as,e8;ci,hards2;ag3es,it0ut0y9;dFmEnDsmu7Zv5F;tan1;ir7os;ic,u;aSeLhJiGoErDut6;asad,if60ochazk1V;lishc23pDrti63u55we67;e2Tov48;cEe09nD;as,to;as61hl0;aDillips;k,m,n5L;de3AetIna,rGtD;ersErovDtersC;!a,ic;en,on;eDic,ry,ss2;i8ra,tz,z;ers;h71k,rk0tEvD;ic,l3T;el,t2O;bJconnor,g2ClGnei5QrEzD;demir,turk;ella3MtDwe5O;ega,iz;iDof6GsC;vDyn1E;ei8;aPri1;aLeJguy1iFoDune44ym3;rodahl,vDwak;ak3Uik5otn57;eEkolDlsCx2;ic,ov6X;ls1miD;!n1;ils2mD;co42ec;gy,kaEray3varD;ro;jiDmu8shiD;ma;aWcUeQiPoIuD;lGnFrDssoli5T;atDpTr68;i,ov4;oz,te4C;d0l0;h3lInr13o0GrEsDza0Y;er,s;aFeEiDoz5r3Ete4C;!n6F;au,i8no,t4N;!l9;i2Rl0;crac5Ohhail5kke3Qll0;hmeFij0j2FlEn2Xrci0ssiDyer19;!er;n0Io;dBti;cartDlaughl6;hy;dMe6Egnu5Fi0jer35kLmJnci5ArFtEyD;er,r;ei,ic,su1O;iEkBqu9roqu6tinD;ez,s;a55c,nD;!o;a53mD;ad5;e5Pin1;rig4Ps1;aSeMiIoGuEyD;!nch;k4nDo;d,gu;mbarDpe2Svr4;di;!nDu,yana1T;coln,dD;bDholm;erg;bed5UfeGhtFitn0kaEn6rDw2H;oy;!j;in1on1;bvDvD;re;iDmmy,rsCu,voie;ne,t12;aTennedy,h3iSlQnez48oJrGuEvar3woD;k,n;cerDmar59znets5;a,o2H;aDem0i31yeziu;sni3RvD;ch3W;bay4Grh0Ksk0UvaFwalDzl5;czDsA;yk;cFlD;!cDen3S;huk;!ev4ic,s;e6uiveD;rt;eff0l4mu8nnun1;hn,llFminsArEstra33to,ur,yDzl5;a,s0;j0HlsC;oe;aMenLha2Qim0RoEuD;ng,r4;e2KhFnErge2Ku2OvD;anB;es,ss2;anEnsD;en,on,t2;nesDsC;en,s1;ki27s1;cGkob3RnsDrv06;en,sD;enDon;!s;ks2obs1;brahimBglesi3Ake4Ll0DnoZoneFshikEto,vanoD;u,v4A;awa;scu;aPeIitchcock,jaltal6oFrist46uD;!aDb0gh9ynh;m3ng;a24dz4fEjga2Tk,rDx3B;ak0Yvat;er,fm3B;iGmingw3NnErD;nand7re8;dDriks1;ers2;kkiEnD;on1;la,n1;dz4g1lvoLmJnsCqIrr0SsFuEyD;as36es;g1ng;anEhiD;mo0Q;i,ov08;ue;alaD;in1;rs1;aNeorgMheorghe,iKjonJoGrEuDw2;o,staf2Utierr7zm3;ayDg4iffitVub0;li1H;lub3Rme0JnEodD;e,m3;calv9zale0H;aj,i;bs2l,mDordaL;en7;iev3A;gnJlGmaFnd2Mo,rDs2Muthi0;cDza;ia;ge;eaElD;agh0i,o;no;e,on;ab0erLiHjeldsted,lor9oFriedm3uD;cDent9ji3E;hs;ntaDrt6urni0;na;lipEsD;ch0;ovD;!ic;hatBnanFrD;arDei8;a,i;deS;ov4;dGinste6riksCsDva0D;cob2YpDtra2W;inoza,osiL;en,s2;er,is2wards;aUeMiKjurhuJoHrisco0ZuEvorakD;!oQ;arte,boEmitru,rDt2U;and,ic;is;g3he0Imingu7n2Ord1AtD;to;us;aDmitr29ssanayake;s,z; GbnaFlEmirDrvis1Lvi,w3;!ov4;gado,ic;th;bo0groot,jo04lEsilDvri9;va;a cruz,e2uD;ca;hl,mcevsAnEt2EviD;d5es,s;ieDku1S;ls1;ki;a06e01hOiobNlarkMoFrD;ivDuz;elli;h1lHntGoFrDs26x;byn,reD;a,ia;ke,p0;i,rer0N;em3liD;ns;!e;anu;aLeIiu,oGriDuJwe;stD;eDiaD;ns1;i,ng,uFwDy;!dhury;!n,onEuD;ng;!g;kEnDpm3tterjee,v7;!d,g;ma,raboD;rty;bGl08ng4rD;eghetEnD;a,y;ti;an,ota0L;cer9lder2mpbeIrFstDvadi07;iDro;llo;doEt0uDvalho;so;so,zo;ll;es;a08eWhTiRlNoGrFyD;rne,tyD;qi;ank5iem,ooks,yant;gdan5nFruya,su,uchEyHziD;c,n5;ard;darDik;enD;ko;ov;aEondD;al;nco,zD;ev4;ancRshwD;as;a01oDuiy3;umDwmD;ik;ckNethov1gu,ktLnJrD;gGisFnD;ascoDds1;ni;ha;er,mD;ann;gtDit7nett;ss2;asD;hi;er,ham;b4ch,ez,hMiley,kk0nHrDu0;bEnDua;es,i0;ieDosa;ri;dDik;a8yopadhyD;ay;ra;er;k,ng;ic;cosZdYguilXkhtXlSnJrGsl3yD;aEd6;in;la;aEsl3;an;ujo,ya;dFgelD;ovD;!a;ersGov,reD;aDjL;ss1;en;en,on,s2;on;eksejGiyGmeiFvD;ar7es;ez;da;ev;ar;ams;ta",
      MaleName:
        "true¦0:DN;1:CO;2:D6;3:AJ;4:CK;5:BZ;6:CF;7:D2;8:BS;9:AR;A:DA;B:D3;C:94;D:BM;aC9bB7cA7d98e8If82g7Fh6Si6Cj5Ek52l4Fm37n2Uo2Op2Gqu2Er1Ms12t0Gu0Fv08wUxTyJzE;aEor0;cEh9Jkaria,n0C;hFkE;!aC7;ar5UeC6;aMoGuE;sEu2LvBJ;if,uf;nGsFusE;ouf,sE;ef;aEg;s,tE;an,h0;hli,nB8ssY;avi3ho4;aNeLiGoEyaBN;jcie87lfgang,odrow,utE;!er;lEnst1;bGey,fredAlE;aAZiE;am,e,s;e97ur;i,nde9sE;!l8t1;lFyE;l1ne;lEt3;a9Xy;aHiEladimir,ojte7U;cFha0kt67nceErgA5va0;!nt;e3Xt65;lentEn9S;inE;!e;ghBElyss59nax,sm0;aXeShOiMoIrGuFyE;!l3ro6s1;n7r59;avAHeEist0oy,um0;ntA9v5Wy;bGd8RmEny;!as,mEoharu;aCBie,y;iCy;mEt5;!my,othy;adGeoFia0KomE;!as;!do8G;!de5;dHrE;en98rE;an97eEy;ll,n96;!dy;dgh,ha,iEnn3req,tsu4R;cAPka;aUcotSeQhMiKoIpenc3tEur1Xylve96zym1;anGeEua85;f0phBCvEwa84;e5Zie;!islaw,l8;lom1uE;leyma6ta;dElCm1yabonga;!dhart74n8;aGeE;lErm0;d1t1;h7Kne,qu11un,wn,y6;aEbasti0k2Cl4Prg4Mth,ymoAE;m5n;!tE;!ie,y;lFmEnti2Gq58ul;!ke5JmDu4;ik,vato7O;aZeVhe9ViRoIuFyE;an,ou;b7DdFf5pe7KssE;!elBI;ol3Fy;an,bLc62dJel,geIh0landAmHnGry,sFyE;!ce;coe,s;!aA1nD;an,eo;l45r;er78g3n8olfo,riE;go;bDeAQ;cEl8;ar6Ic6HhFkEo;!ey,ie,y;a8Vie;gFid,ubByEza;an1KnZ;g9SiE;na9Os;ch6Qfa4lImHndGpha4sFul,wi2HyE;an,mo6U;h7Jm5;alAWol2U;iACon;f,ph;ent2inE;cy,t1;aJeHhilGier6TrE;aka18eE;m,st1;!ip,lip;dA4rcy,tE;ar,e3Er1Y;b4Hdra73tr6JulE;!o19;ctav3Di3liv3m9Yndrej,rIsFtEum7wB;is,to;aFc7k7m0vE;al5S;ma;i,vM;aMeKiGoEu38;aEel,j5l0ma0r3I;h,m;cFg4i46kEl2R;!au,h7Gola;hEkEolC;olC;al,d,il,ls1vE;il8J;hom,tE;e,hE;anEy;!a4i4;a00eXiNoIuFyE;l2Gr1;hamFr6KstaE;fa,p54;ed,mI;di0Xe,hamGis2CntFsEussa;es,he;e,y;ad,ed,mE;ad,ed;cJgu4hai,kHlGnFtchE;!e9;a7Uik;house,o0Ct1;ae5Oe9MolE;aj;ah,hE;aFeE;al,l;el,l;hFlv2rE;le,ri9v2;di,met;ay0hUjd,ks2AlSmadXnRrLs1tGuricFxE;imilianAwe9;e,io;eHhFiCtEus,yC;!eo,hew,ia;eEis;us,w;j,o;cIio,kHlGqu6Ysha9tEv2;iEy;!m,n;in,on;el,oQus;!el90oPus;iHu4;achEcolm,ik;ai,y;amFdi,eEmoud;sh;adEm5G;ou;aXeRiPlo39oLuFyE;le,nd1;cHiGkEth3uk;aEe;!s;gi,s,z;as,iaE;no;g0nn7BrenGuEv81we9;!iE;e,s;!zo;am,oE;n4r;a7Uevi,la4AnIonHst3thaGvE;eEi;nte;bo;!a6Del;!ny;mFnd1rEur54wr54;ry,s;ar,o4Y;aMeIhal7GiFristEu4Ky6J;i0o54;er0p,rE;k,ollE;os;en0iGnErmit,v3U;!dr3XnEt1;e18y;r,th;cp3j5m5Sna6OrFsp7them,uE;ri;im,l;a01eViToHuE;an,lEst2;en,iE;an,en,o,us;aOeMhnLkubCnJrHsE;eFhEi7Vue;!ua;!ph;dEge;i,on;!aEny;h,s,th55;!ath54ie,nD;!l,sEy;ph;o,qu2;an,mE;!mD;d,ffHrEs5;a5YemFmai6oEry;me,ni0Y;i7Fy;!e5OrE;ey,y;cLdBkJmIrGsFvi3yE;dBs1;on,p3;ed,od,rEv4V;e5Bod;al,es4Mis1;a,e,oEub;b,v;ob,quE;es;aXbRchiQgOkeNlija,nuMonut,rKsGtEv0;ai,suE;ki;aFha0i6ZmaEsac;el,il;ac,iaE;h,s;a,vinEw2;!g;k,nngu5F;!r;nacEor;io;ka;ai,rahE;im;aQeKoJuEyd7;be2FgHmber4KsE;eyFsE;a2e2;in,n;h,o;m3ra36sse2wa40;aIctHitHnrFrE;be28m0;iEy;!q0Z;or;th;bMlLmza,nKo,rGsFyE;a47dB;an,s0;lGo4Nry,uEv8;hi44ki,tE;a,o;an,ey;k,s;!im;ib;aWeSiQlenPoMrIuE;ilFsE;!tavo;herme,lerE;mo;aGegEov3;!g,orE;io,y;dy,h5J;nzaFrE;an,d1;lo;!n;lbe4Xno,oE;rg37van4X;oGrE;aEry;ld,rdA;ffr8rge;brFlBrEv2;la14r3Hth,y;e33ielE;!i5;aSePiNlLorrest,rE;anFedEitz;!dDer11r11;cGkE;ie,lE;in,yn;esLisE;!co,z2W;etch3oE;yd;d4lEonn;ip;deriFliEng,rnan05;pe,x;co;bi0di,hd;dYfrXit0lSmLnIo2rGsteb0th0uge6vEymBzra;an,eE;ns,re2X;gi,i0AnErol,v2w2;estAie;oFriqEzo;ue;ch;aJerIiFmE;aIe2Q;lErh0;!iE;o,s;s1y;nu4;be0Bd1iGliFm3t1viEwood;n,s;ot1Ss;!as,j4EsE;ha;a2en;!d2Vg7mHoFuFwE;a26in;arE;do;oWuW;a02eRiPoHrag0uGwFylE;an,l0;ay6ight;a6dl8nc0st2;minHnFri0ugEvydCy29;!lC;!a2HnEov0;e9ie,y;go,iFykC;as;cEk;!k;armuEll1on,rk;id;andNj0lbeMmetri5nKon,rIsGvFwExt3;ay6ey;en,in;hawn,moE;nd;ek,rE;ick;is,nE;is,y;rt;re;an,le,mLnKrGvE;e,iE;!d;en,iGne9rEyl;eEin,yl;l35n;n,o,us;!i4ny;iEon;an,en,on;a08e06hYiar0lOoJrHuFyrE;il,us;rtE;!is;aEistob0S;ig;dy,lHnFrE;ey,neli5y;or,rE;ad;by,e,in,l2t1;aIeGiEyK;fEnt;fo0Et1;meEt5;nt;rGuFyE;!t1;de;enE;ce;aIeGrisE;!toE;ph3;st3;er;d,rEs;b4leE;s,y;cEdric,s7;il;lHmer1rE;ey,lFro9y;ll;!os,t1;eb,v2;a07eZiVlaUoSrFuEyr1;ddy,rtL;aMeHiGuFyE;an,ce,on;ce,no;an,ce;nFtE;!t;dFtE;!on;an,on;dFndE;en,on;!foEl8y;rd;bby,rEyd;is;i6ke;bGlFshE;al;al,lD;ek;nIrEshoi;at,nFtE;!r1B;aEie;rdA;!iFjam2nD;ie,y;to;kaNlazs,nIrE;n8rEt;eEy;tt;ey;dEeF;ar,iE;le;ar16b0Ud0Qf0Ogust2hm0Li0Ija0Hl03mZnSputsiRrIsaHugust5veFyEziz;a0kh0;ry;us;hi;aLchKiJjun,maInGon,tEy0;hEu09;ur;av,oE;ld;an,ndA;!el,ki;ie;ta;aq;as,dIgelAtE;hony,oE;i6nE;!iAy;ne;er,reEy;!as,i,s,w;iGmaEos;nu4r;el;ne,r,t;an,beQdBeKfIi,lHonGphYt1vE;aOin;on;so,zo;an,en;onUrE;ed;c,jaHksandGssaHxE;!andE;er,ru;ar,er;ndE;ro;rtA;ni;dBm7;ar;en;ad,eE;d,t;in;onE;so;aFi,olfAri0vik;!o;mEn;!a;dIeHraFuE;!bakr,lfazl;hEm;am;!l;allJelGoulaye,ulE;!lErG;ah,o;! rE;ahm0;an;ah;av,on",
      Honorific:
        "true¦director1field marsh2lieutenant1rear0sergeant major,vice0; admir1; gener0;al",
      Adjective:
        "true¦0:8H;1:9N;2:8E;3:9E;4:8B;5:98;6:8M;7:8T;8:86;9:99;A:8W;B:7Z;C:60;D:9D;E:7J;a80b7Ic6Wd6Fe5Xf5Cg54h4Ui3Ujuni49k3Rl3Hm34n2Uo2Fp20quart6Ar1Qs0Ut0MuRvNwFye1M;ast58eKhIiHoF;man4oFrthwhi7u0I;dBzy;despr8Zn w7Cs6N;acked0XoleF;!sa7;ather14eFll o5Pste2Q;!k4;aHeGiFola5J;b9Qce versa,gi2Qle;ng4Yrsa5H;ca1lu8U;lt08nLpHrGsFttermo9I;efEu5;b7Age1; Hb2ApGsFti8H;ca7et,ide d3P;er,i4O;f3Xto da3;aYbecom2cXdSeRfPiOkn3MmNpMrJsGto49us0wF;a08iel2N;eBi2Fo47pGuF;pervis0spect2;e1okB;eFu4;cognTgul0NlFsolv0;at0ent2;aArecede01;arri0et;que,vers5;air,orF;eseBtun7S;mploy0nd2xpect0;eFisclos0ue;cid0rF;!a75covCly2sJwF;aFei7W;tCy;heck0onvinc2;ppeal2ssum2tteGuthorF;iz0;nd0;im4Bra;aKeHhough5Jip 1RoGrF;anspare1i3;gethCle8Qp notch,rpA;ena6UmpGrF;r3Ktia8;e9o76;leFst3V;nt0;a09c05e02h01iZkiYle5Mmug,nobbi46oTpQqueami46tKuFymb7L;bHi generis,pFr4;erFre69;! dupCb,vi00;du0p5HsFurb65;eq7Rtanda8C;atu6OeJi0WrFy3Z;aightGin4LungF; o25; fFfF;or6C;adfa84ri7;arGeFirit0lendAot on;c33e1F;k4se; call0lub7mbCphisticIrHuFviT;ndFth10;proof;dAry;at0;ll0n d6C;g22nF;ce5Mg7;am36eC;co1Lem4lfGnFre6;so8; suf45i3G;aGholFient2P;ar4;rlFth2;et;cr0me,tisfac5Z;aNeIheumatoAiGoF;bu7IttBy5;ghtFv5;-w2fE;cIdu79lHnown0sFtard0;is3JoF;lu3na1;e1Duc3H;e1ondi3;bAci5;aQeOicayu6laNopuli79rGuF;bl6Fnjabi;eKiIoF;b6HfGmi3IpFvBx23;er,ort6N;a6u6Q;maFor,sti6va3;!ry;ci6Nexist2ma1UpaA;cAid;ac2Dnt2XrFti3;feDma3Ati3Av6J;i2DrtFss6F;-4RiF;al,s4P;bQffOkNld MnKrJthCutIverF;!aGni5Vseas,t,wF;ei5Urou5U;ll;do14er,si51;d34g1U; bFbFe on o6go2li6;oa6P;fashion0school;!ay; gua6MbFli6;eat;eGsF;ce6er0Io0Z;dia1se;aNeMiLoFuanc0; mo47nHrthFt5P;!eF;rn;chaGdescri6Aprof2JsF;top;la1;ght4;arby,cessa8ighbor4xt;k0usiat2;aNeMiKoGuF;dHltip7;deHlGnFot,st;ochro3Yth4;dy;rn,st;ddle ag0nF;dblVi;ga,nac2re;cHgenta,in,j0Akeshift,mmGnFscu50;da4Ay;ali3Ooth;ab3Mho;aNeKiIoFumber2;ngFuti1I;stand2tF;erm,i3L;ghtwei4QteraF;l,te;ft-w2gFssCth5;al,eFit0I;nda8;nguAps0te4;apGind4nF;ow2;ut;ce co0Dgno5Kll09m01nHpso 2ErF;a3releF;va1; WaVcoSdPe2MfOgrNhibi3Ri02nMoLsHtFvalu4N;aDeF;n4Wrdep24;a6iGolFuboI;ub7ve1;de,gF;nifica1;rdi4O;a3er;own;eriGluenSreq4J;eGiIoFul1E;or;fini3p1Ttermi4I;mpGnside9rF;reD;le3;ccu9deq4Jppropr3Q;fFsitu,vitro;ro1;mJpF;arHeGl0YoFropC;li3r0V;nd2rfeD;ti5;aGeFi0Z;d3Hn48;tu2E;egGiF;c0Rte9;al,itF;ima3;ld;aMelLiJoFuma6;meHnGrrFs0Bur4;if3K;e4Co30; ma2Msick;ghfalut1VspF;an3G;liZpfE;i8llow0ndFrd05tL;sy,y;aiLener3Ciga2Jlob5oKraHuF;ilFng ho;ty;cGtF;efEis;efE;ldBod;nfE;aWeTiRlPoIrF;aGeFil4ozB;q3CtfE;gi7nt31;lk0WoJrF; keeps,eHge0OmCtunFwa3U;ateF;!ly;go2i1Os2Z;liF;sh;ag3Rowe8uF;e1oresce1;e8nF;al,i3;dGmini6rF;ti7; up;bl0l31mili0Lr Fux;oFreach2;ff;aTfSlQmNnLqu5reDthere5veryday,xF;aDem3AplIquisi3traHuF;be3FlF;ta1;!va1V;icF;it; Fti0Y;rou3sui3;erGiF;ne1;ge1;dFe1N;er4;ficie1;gCsF;t,ygo2;er;aUeMiHoGrFue;ea8owW;mina1ne,rma1ubO;dact1Yfficult,m,sGverF;ge1se;creGeNjoi1pa9tF;a1inD;et,te; Ladp0GceKfiJgene9liHpGreliDspe9voF;id,ut;ende1;ca3ghF;tfE;a1ni3;as0;facto;i4ngero05;arZeXhWivil,oMrHuF;stoma8teF;sy;aIeHu0WystalF; cleFli6;ar;epy;vBz0;erNgniza1loMmLnGrpo9veF;rt;cIduLgr1KjHsGtraF;dic0Hry;eq1Ita1;oi1ug5;a1Ci1L;mensu9pass1G;ni5ss5;ci19;ee8intzy;leba3rtaF;in;diac,efE;aUeOiJliSoGrFuck nak0;and new,isk,on1U;gGldface,naF; fiZfiZ;us;gHpartisGzarF;re;an;tiF;me;autifEhiIloHnFsiSyoI;e01iFt;gn;v0w;nd;ul;ckwards,rF;e,rB; priori,b12c0Zd0Tf0Ng0Ih0Hl0Amp7nt07pZrSsPttracti0MuLvIwF;aGkF;wa19;ke,re;ant garGeraF;ge;de;diHtF;heFoimmu6;nt07;to8;hBlF;eep;en;bitJchiv5roItF;iFsy;fiF;ci5;ga1;ra8;ry;pFt;aJetiz2roF;prHximF;ate4;ly;ia3;ll2re1;ing;iquFsy;at0e;ed;cohJiQkaHl,oGriFterW;ght;ne,of;li6;ne;olF;ic;ead;ain05ed,gressiIrF;eeF;ab7;le;ve;fGraA;id;ectGlF;ue1;ioF;na3; JeHvF;erF;se;pt,qF;ua3;hoc,infinitum;cu9tu5u3;al;ra3;erQlOoMrJsGuF;nda1;e1olu3traD;ct;te;eaGuF;pt;st;aFve;rd;aFe;ze;ra1;nt",
      Adverb:
        "true¦a08b05d01eXfRhePinOjustNkinda,likewi00mLnIoDpBquite,r8s4t1up0very,well; to,wards5;h1iny bit,o0wiO;o,t6;en,us;eldom,o0uch;!me1rt0; of;how,times,w0A;a1e0;alT;ndomSthN;ar excellenEer0oint blank; Nhaps;f3n0;ce0ly;! 0;ag03moX; courIten;ewKo0; longEt 0;onIwithstanding;aybe,eanwhiAore0;!ovB;! aboV;deed,steW;lla,n0;ce;or2u0;lArther0;!moK; 0ev3;examp0good,suI;le;n1v0;er; mas0ough;se;e0irect1; 1finite0;ly;ju9trop;ackward,y 0;far,no0; means,w; DbroCd nauseam,gBl6ny3part,s2t 0w4;be6l0mo6wor6;arge,ea5; soon,ide;mo1w0;ay;re;l 1mo0ready,so,ways;st;b1t0;hat;ut;ain;ad;lot,posteriori",
      Conjunction:
        "true¦aVbRcuz,eNhowMiEjustYnoBo9p8supposing,t5wh0yet;e1il0o3;e,st;n1re0thN; if,vM;evL;h0o;erefMo0;!uS;lus,rovided th9;r0therwiK;! not; mattEr,w0;! 0;since,th4w7;f4n0; 0asmuch;as mGcaDorder t0;h0o;at;! 0;only,t0w0;hen;!ev3;ith2ven0;! 0;if,t9;er;e0ut,y the time;cau1f0;ore;se;lt3nd,s 0;far1if,m0soon1t2;uch0; as;hou0;gh",
      Currency:
        "true¦$,aud,bQcOdJeurIfHgbp,hkd,iGjpy,kElDp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotyQł;en,uanP;af,of;h0t5;e0il5;k0q0;elK;oubleJp,upeeJ;e2ound st0;er0;lingG;n0soF;ceEnies;empi7i7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!os;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;e0ny;nt1;aht,itcoin0;!s",
      Determiner:
        "true¦aAboth,d8e5few,le4mu7neiCplenty,s3th2various,wh0;at0ich0;evB;at,e3is,ose;everal,ome;!ast,s;a1l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er",
      "Adj|Present":
        "true¦a07b04cVdQeOfKhollJidRlFmDnarrJoCpAqua9r8s4t2utt3w0;aLet,ound,ro0;ng,ug08;end0hin;er;e2hort,l1mooth,our,pa9tray,u0;re,speT;i2ow;cu6da01leRpaM;eplica00ig01;ck;aGr0;eseTime,omU;bscu1pen,wn;atu0e3odeG;re;a2e1i0;gTve;an;st,y;ow;a2i1oul,r0;ee,inge;rm;iHke,ncy,st;l0mpty,xpress;abo4ic7;amp,e2i1oub0ry,ull;le;ffu9re6;fu8libe0;raE;alm,l5o0;mpleCn3ol,rr1unterfe0;it;e0u7;ct;juga8sum7;ea1o0;se;n,r;ankru1lu0;nt;pt;lig2pproxi0;ma0;te;ht",
      Comparable:
        "true¦0:38;1:3M;2:3B;3:2E;a3Qb39c30d2Re2Kf28g1Wh1Mi1Gj1Fk1Cl15m0Zn0Uo0Tp0Kqu0Ir09sJtEuDvBw5y4za0S;el12ouP;a8e6hi1Ii4ry;ck0Ede,l4n1ry,se;d,y;a4i3P;k,ry;ntiJry;a4erda2ulgar;gue,in,st;g0pcomiG;a7en2Thi6i5ough,r4;anqu29en1ue;dy,g32me0ny,r04;ck,rs25;ll,me,rt,wd3E;aScarReQhOiNkin0ClJmHoFpEt7u5w4;eet,ift;b4dd0Wperfi1Xrre25;sta23t3;a9e8iff,r5u4;pVr1;a5ict,o4;ng;ig2Rn0N;a1ep,rn;le,rk,te0;e1Oi2Rright0;ci1Vft,l4on,re;emn,id;a4el0;ll,rt;e6i4y;g2Im4;!y;ek,nd2O;ck,l0mp3;a4iRrill,y;dy,l01rp;ve0Ixy;ce,y;d,fe,int0l1Ev0U;a9e7i6o4ude;mantic,o16sy,u4;gh,nd;pe,tzy;a4d,mo0A;dy,l;gg5ndom,p4re,w;id;ed;ai2i4;ck,et;hoBi1BlAo9r6u4;ny,r4;e,p3;egna2ic5o4;fouSud;ey,k0;liXor;ain,easa2;ny;dd,i0ld,ranL;aive,e6i5o4;b3isy,rm0Vsy;bb0ce,mb3;a4w;r,t;ad,e6ild,o5u4;nda0Xte;ist,o1;a5ek,l4;low;s0ty;a8ewd,i7o4ucky;f0Gn5o11u4ve0w0Vy0K;d,sy;e0g;ke0tt3ve0;me,r4te;ge;e5i4;nd;en;ol0ui16;cy,ll,n4;secu7t4;e4ima5;llege2rmedia4;te;re;aBe8i7o6u4;ge,m4ng19;b3id;me0t;gh,l0;a4fVsita2;dy,v4;en0y;nd10ppy,r4;d,sh;aEenDhBiAl9oofy,r4;a7e6is0o4ue0X;o4ss;vy;at,en,y;nd,y;ad,ib,ooE;a2d1;a4o4;st0;t3uiR;u1y;aDeeb3i9lat,o7r6u4;ll,n4r0N;!ny;aDesh,iend0;a4rmE;my;erce5nan4;ciB;! ;le;r,ul4;ty;a7erie,sse5v4xtre0B;il;nti4;al;r5s4;tern,y;ly,th0;aBe8i5ru4umb;nk;r5vi4;ne;e,ty;a4ep,nB;d4f,r;!ly;ppRrk;agey,h9l8o6r5u4;dd0r0te;isp,uel;ar4ld,mmon,st0ward0zy;se;evLou1;e4il0;ap,e4;sy;aIiGlDoBr6u4;r0sy;ly;a7i4oad;g5llia2;nt;ht;sh,ve;ld,un4;cy;a5o4ue;nd,o1;ck,nd;g,tt4;er;d,ld,w1;dy;bsu7ng6we4;so4;me;ry;rd",
      "Person|Adj": "true¦brown,du2earnest,frank,mi2r0sa1;a0ich,u1;ndy;sty",
      Infinitive:
        "true¦0:8V;1:8G;2:9D;3:80;4:7N;5:91;6:9H;7:99;8:82;9:9G;A:92;B:8X;C:7K;D:7U;E:7Q;F:87;G:7V;H:7H;a82b7Jc6Sd5Le4Gf45g41h3Wi3Cj39k37l2Ym2Rnou3Vo2Lp25qu24r19s0AtYuTvRwI;aOeNiLors4rI;eJiI;ng,te;ak,st3;d4e7HthI;draw,er;a2d,ep;i2ke,nIrn;d0t;aIie;li9Eni9ry;nIplift;cov0dJear7JlIplug,tie,ve85;ea9o3K;erIo;cut,go,sta9Gval96whelm;aRePhMoLrI;aIemb3;ffi3Fmp3nsI;aDpi8;pp3ugh4;aJiJrIwaE;eat4i2;nk;aIm92;ch,se;ck3ilor,keImp0r7N;! paE;a0Fc0Ee0Ch08i06l04mugg3n03o01pYquXtQuKwI;all71eeIim;p,t4;bKccumb,ffJggeBmm93p2FrI;mouFvi2;er,i5;li80mJsiIveE;de,st;erAit;aMe7SiKrI;ang3eIi2;ng20w;fIng;f4le;gg0rI;t3ve;a3Ui9;a4DeJit,l6KoI;il,of;ak,nd;lIot6Nw;icCve;eak,i0L;aIi6;m,y;ft,nIt;g,k;aKi5LoJriIun;nk,v5X;ot,rt4;ke,rp4tt0;eIll,nd,que7Nv0w;!k,m;avenAul81;dd4tis1Ay;a0BeJip4oI;am,ut;a07b05c03d02fZgroup,heaYiXlVmUnTpRq36sNtLup,vI;amp,eJiIo2V;sCve;l,rt;i8rI;ie2ofC;eFiKtIurfa5;o1XrI;aHiDuctu8;de,gn,st;el,hra1lIreseF;a5e69;d0ew,o05;aHe31o2;a7eFiIoad,y;e2nq3Mve;mbur1nf2U;r1t;inJleDocus,re9uI;el,rbi9;an5e;aDu5;ei2k7Jla3OoIyc3;gni2Wnci3up,v0;oot,uI;ff;ct,d,liI;se,ze;tt3vi9;a9enGit,o7;aVerTinpoiFlumm0VoSrKuI;b3Oke,ni9rIt;poEs6W;eMoI;cKd,fe4BhibCnoJpo1sp0tru6vI;e,i6o4W;un5;la39u8;aGclu6dJf0occupy,sup0FvI;a5LeF;etermi47iD;aGrtr4Vsse44;cei2fo3Hi9mea7plex,sIva6;eve8iB;mp0rItrol,ve,y;a5St5O;bMccuLpKutJverIwe;lap,s19tu6Au1;gr4Pnu22pa5;era7i3Ypo1;py,r;ser2taH;aMe09iJoIultiply;leBu64;micJnIspla5;ce,g3us;!k;iIke,naA;m,ntaH;aPeLiIo1u39;e,ke,ng0quIv4;eIi66;fy;aKnIss4;d,gI;th4;rn,ve;ng26u1E;eep,nI;e3Row;oHuI;gg3xtaI;po1;gno8mWnIrk;cUdSfRgeBhQitia7ju8q14sOtKun5TvI;eIo0T;nt,st;erJimi5QoxiQrI;odu5u6;aDn,prIru5Q;et;iBpi8tIu8;il,ruD;abCibC;eBo2Bu1;iIulA;ca7;i7lu6;b5Cmer1pI;aEer47ly,oJrI;e2Ris5No2;rt,se,veI;ri9;aLeKiIoiBuE;de,jaInd0;ck;ar,iQ;mp0ng,pp4st4ve;ath0et,i2le1UoKrI;aIow;b,pp3ze;!ve4S;ast4er3Li58lRorMrJuI;lf3Tr3P;eJiIolic;ght4;e0Lsh4;b3DeKfeCgIs4B;eIi2;!t;clo1go,sIwa4J;had2Y;ee,i2Q;a0KdCl0Im0CnUquip,rTsStGvQxI;cNeEha3iMpJtI;ing0Uol;eJi8lIo1unA;aHoC;ct,di7;st,t;e2MlI;a0Xu6;alua7oI;ke,l2;chew,pou1tab13;a1u4G;aYcVdTfSgQhan5joy,lPqOrNsuMtKvI;e0VisI;aAi4L;er,i5rI;aHenGuB;e,re;iGol;ui8;arAiB;aAeIra2ulf;nd0;or5;ang0oIu8;r1w;lo1ou0CrJuI;mb0;oaGy3Z;b3ct;bKerApI;hasiIow0;ze;a0Tody,rI;a5oiI;d0l;ap1eDuI;ci3Ode;rIt;ma0Nn;a0Ne02iKo,rIwind3;aw,edAoI;wn;agno1e,ff0g,mi27sLvI;eIulA;rIst;ge,t;ab3bUcPlodAmant3pNru3GsMtI;iIoEu2W;lJngI;ui9;!l;ol2ua6;eIla5o1ro2;n1r1;a2Ne2WlKoIu0K;uIv0;raA;aIo1;im;a38ur1;af4bZcTduDep4fRliQmNnLpKra1TtaGvI;eIol2;lop;aEiDoE;oIy;te,un5;eJoI;li9;an;mCv0;a5i06oIraud,y;rm;ei2iMoKrI;ee,yI;!pt;de,mIup3;missi2Upo1;de,ma7ph0;aJrief,uI;g,nk;rk;mp4rk4uF;a06ea1h04i03l02oJrIurta17;a2ea7ipp3;ales5eZhabCinci6llYmWnIrro6;cTdQfNju8no7qu0sLtKvI;eIin5;ne,rA;aHin25ribu7;er2iIoli27pi8titu7ult;d0st;eJiIroFu1;de,gu8rm;ss;eJoI;ne;mn,n1;eIlu6ur;al,i2;buBe,men5pI;e7i3ly;eDi6u6;r5xiB;ean1iS;rcumveFte;eIoo1;ri9w;ncIre4t0ulk;el;aXeRi6lPoOrLuI;iJrIy;st,y;ld;aJeastfeMiIoad4;ng;ke;il,l12mba0XrrMth0;eIow;ed;!come,gHha2liLqueaKstJtrIwild0;ay;ow;th;e2tt3;in;bysCckfi8ff3tI;he;it;b17c0Vd0Mff0Kgr0Jl0Fm0Bn05pp01rZsSttPuNvKwaI;it,k4;en;eEoI;id;rt;gIto08;meF;aGeBraD;ct;ch;pi8sJtoI;ni9;aKeIi05u8;mb3rt,ss;le;il;re;g0Ji1ou1rI;anAi2;eaKly,oiFrI;ai1o2;nt;r,se;aMiQnJtI;icipa7;eJoIul;un5y;al;ly1;aJu1;se;lgaIze;ma7;iKlI;eAoIu6;t,w;gn;ee;ix,oI;rd;a01jNmiKoJsoI;rb;pt,rn;niIt;st0;er;ouJuB;st;rn;cLhie2knowledAquiItiva7;es5re;ce;ge;eOomKrJusI;e,tom;ue;moJpI;any,li9;da7;te;pt;andOet,i6oKsI;coKol2;ve;li9rt,uI;nd;sh;de;on",
      Modal:
        "true¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ight,ust;an,o0;uld",
      Verb: "true¦born,cannot,gonna,has,keep tabs,msg",
      Participle: "true¦fl3g1s0writt2;e1h2;iv0one;en;own",
      "Actor|Verb":
        "true¦aIbDcAd8engineFfool,g6host,judge,m4nerd,p3recruit,s1ushFvolunteFwi0;mp,tneF;cout,p0;ons6y;arent,ilot;a0ime;n,st9;eek,oof,r0uide;aduCoom;elegBoct0;or;ha1o0;a5nscript,ok;mpion,uffeur;it3o2u0;lly,tch0;er;ss;ch;d0ffili1rchite2;di1voc0;ate;ct",
      "Adj|Gerund":
        "true¦0:2F;1:2H;2:25;3:23;4:20;5:2D;6:27;7:22;a24b1Zc1Hd14e0Yf0Og0Ih0Hi0Ajud1Xl07m04o00pWrQsFtAup9v8w0Pyiel4;ar5eY;lif0s01;aWeBhr9i3ouc7r8wis0;e01oub2us0yi1;ea0Mi8;l2vi1;l2mp0;atisf5creec7hoc0Ekyrocke0lo13oGpFtBu9we8;e12l2;pp1Kr8;gi1pri6roun4;a9ea23i8ri0Aun1C;mula0r3;gge3r8;t2vi1;ark2ee4;a8ot7;ki1ri1;aCe9ive0o8us7;a3l2;defi13fres7ig13laEmai13s0v8war4;ea2itali8ol0Q;si1zi1;gi1ll5mb2vi1;a5erpleAier1Dlun18r8un1J;e8o11;ce4s6vai2;xi1;ffsApNut9ver8wi1;arc7lap0Hp09ri4whel1L;goi1l5st0Y;et0;eande3i9o0Fu8;mb2;s6tiga0;a9i8o0C;fesa0Bmi0vi1;cKg0Vs0;mDn8rri0C;cBsAt9vi8;go1Gti1;e15imida0;pi3ul0;orpo1Drea6;po6;arrowi1ea2orrif5umilia0;lCr8;a0ipZo9uel8;i1li1;undbrea8wi1;ki1;a3ea0Z;aGetc7it0lDoBr9ulf8;il2;ee0Yigh8ust12;te04;r8un4;ebo4th0H;a9o8;a0we3;mi1tte3;di1scina0;mBn9x8;ac0ci0is0plo4;ab2c8du3ga04sT;han0oura03;barras6er02p8;owe3;aJeCi8;s8zz5;appoin0gus0sen0t8;r8u0N;ac0es6;biliDcCfiMgra4mBpres6serAv8;asCelo8;pi1;vi1;an4eaI;a5liH;ta0;maOri1s7un0;aOhLlo6o8ripp2ut0;mEn8rrespon4;cerCfBspi3t8vinQ;in9r8;as0ibu0ol2;ui1;lic0u6;ni1;fCmBp8;e9ro8;mi6;l2ti1;an4;or0;a8ea0il2;llen8rQ;gi1;lOptiva0ri1;eBin4lin4o9rui6u8;d4st2;i2oLri1un8;ci1;coJ;bsoQcLgonJlarImGppea2rEs8;pi3su3to8;n9un4;di1;is7;hi1;ri1;res0;li1;aBu6;si1;mi1;i8zi1;zi1;c8hi1;ele9ompan5;yi1;ra0;ti1;rbi1;ng",
      "Adj|Past":
        "true¦0:30;1:2R;2:2U;a2Jb2Dc1Ud1Be15f10gift0h0Xi0Qj0Pknown,l0Mm0Hn0Fo0Cp05qua04rVsEtAu7v5w3;arp0ea3or5;kIth2T;a3e0W;ri0;n3pd1s0;derstood,i3;fi0t0;ar5hreatCr3wi2R;a3ou19;ck0in0pp0;get0ni1N;aHcaGeEhDimCm01oak0pAt6u3;bsid28gge2Ms3;pe3ta1S;ct0nd0;at0e5r3uV;ength3ip0;en0;am0reotyp0;eci3ik0ott0;al20fi0;pIul1;ar0ut;a3c1Jle2t1S;l0t0;r0tt25;t3ut0;is1Jur1;aAe3;c7duc0f1Cg6l1new0qu5s3;pe2t3;or0ri2;e22ir0;ist1Xul1;eiv0o3;mme09rd0v1V;lli0ti1A;li19;arallel0i0Kl7o6r3ump0;e4o3;ce0Ilo0Hnou1Tpos0te2;fe0Loc8pY;i1Gli0R;a3e19;nn0;c4rgan1Bverlo3;ok0;cupi0;e3ot0;ed0gle2;a5e4ix0o3ut0;di0Vt0G;as0Qlt0;n3rk0;ag0ufact0O;eft,i4o3;ad0st;cens0mit0st0;agg0us0N;mp8n3sol1;br0debt0f6t3volv0;e3ox0F;gr1n3re18;d0si0J;e2l1oX;li0oLrov0;amm10e1o3;ok0r3;ri0E;aNe6i5lavo09oc05r3;a3i0;ct07g0Mm0;niXx0;ar0;duc1l1mbarraKn7quipp0stabliVx3;agger1p3te5;a4e3;ct0rie0S;nd0;ha0QsZ;aJeAi3;gni01miniOre2s3;a7c5grun05t3;o3reBurb0;rt0;iplSou3;nt0rE;bl0;cenVdOf8l7pre6ra5t3velop0;a3ermO;il0;ng0;ss0;ay0ight0;e4o3;rm0;rr0;m3t0;ag0;alcul1eHharg0lGo8r5u3;lt3stomS;iv1;a4owd0u3;sh0;ck0mp0;d0lo9m6n3ok0vX;centr1f4s3troll0;idVolid1;us0;b4pl3;ic1;in0;ur0;assi5os0;lebr1n5r3;ti3;fi0;tralB;a7i6o4roken,urn3;ed,t;il0r0t3und;tl0;as0;k0laIs0;bandon0cJdGffe2lDnBpp9ss7u3ward0;g4thor3;iz0;me3;nt0;o5u3;m0r0;li0re3;ci1;im1ticip1;at0;leg0t3;er0;ct0;ju4o6va3;nc0;st0;ce3knowledg0;pt0;ed",
      "Person|Verb":
        "true¦b8ch7dr6foster,gra5hope,ja9lan4ma2ni9ollie,p1rob,s0tra4wade;pike,t5ue;at,eg,ier2;ck,r0;k,shal;ce;ce,nt;ew;ase,u1;iff,l1ob,u0;ck;aze,ossom",
      "Person|Place":
        "true¦a5darw6h3jordan,k2orlando,s0victo7;a0ydney;lvador,mara,ntiago;ent,obe;amil0ous0;ton;lexand1ust0;in;ria",
      "Person|Date": "true¦a2j0sep;an0une;!uary;p0ugust,v0;ril",
    },
    Qa = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .reduce(function (e, t, n) {
        return (e[t] = n), e;
      }, {}),
    Za = function (e) {
      if (void 0 !== Qa[e]) return Qa[e];
      let t = 0,
        n = 1,
        a = 36,
        r = 1;
      for (; n < e.length; t += a, n++, a *= 36);
      for (let n = e.length - 1; n >= 0; n--, r *= 36) {
        let a = e.charCodeAt(n) - 48;
        a > 10 && (a -= 7), (t += a * r);
      }
      return t;
    },
    Xa = function (e, t, n) {
      const a = Za(t);
      return a < e.symCount ? e.syms[a] : n + a + 1 - e.symCount;
    },
    er = function (e) {
      const t = { nodes: e.split(";"), syms: [], symCount: 0 };
      return (
        e.match(":") &&
          (function (e) {
            const t = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
            for (let n = 0; n < e.nodes.length; n++) {
              const a = t.exec(e.nodes[n]);
              if (!a) {
                e.symCount = n;
                break;
              }
              e.syms[Za(a[1])] = Za(a[2]);
            }
            e.nodes = e.nodes.slice(e.symCount, e.nodes.length);
          })(t),
        (function (e) {
          const t = [],
            n = (a, r) => {
              let o = e.nodes[a];
              "!" === o[0] && (t.push(r), (o = o.slice(1)));
              const i = o.split(/([A-Z0-9,]+)/g);
              for (let o = 0; o < i.length; o += 2) {
                const s = i[o],
                  l = i[o + 1];
                if (!s) continue;
                const u = r + s;
                if ("," === l || void 0 === l) {
                  t.push(u);
                  continue;
                }
                const c = Xa(e, l, a);
                n(c, u);
              }
            };
          return n(0, ""), t;
        })(t)
      );
    },
    tr = ["Possessive", "Pronoun"],
    nr = {
      a: [
        [/(antenn|formul|nebul|vertebr|vit)a$/i, "$1ae"],
        [/ia$/i, "ia"],
      ],
      e: [
        [/(kn|l|w)ife$/i, "$1ives"],
        [/(hive)$/i, "$1s"],
        [/([m|l])ouse$/i, "$1ice"],
        [/([m|l])ice$/i, "$1ice"],
      ],
      f: [
        [/^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves"],
        [
          /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i,
          "$1ves",
        ],
      ],
      i: [[/(octop|vir)i$/i, "$1i"]],
      m: [[/([ti])um$/i, "$1a"]],
      n: [[/^(oxen)$/i, "$1"]],
      o: [[/(al|ad|at|er|et|ed)o$/i, "$1oes"]],
      s: [
        [/(ax|test)is$/i, "$1es"],
        [/(alias|status)$/i, "$1es"],
        [/sis$/i, "ses"],
        [/(bu)s$/i, "$1ses"],
        [/(sis)$/i, "ses"],
        [/^(?!talis|.*hu)(.*)man$/i, "$1men"],
        [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, "$1i"],
      ],
      x: [
        [/(matr|vert|ind|cort)(ix|ex)$/i, "$1ices"],
        [/^(ox)$/i, "$1en"],
      ],
      y: [[/([^aeiouy]|qu)y$/i, "$1ies"]],
      z: [[/(quiz)$/i, "$1zes"]],
    },
    ar = /([xsz]|ch|sh)$/,
    rr = function (e = "", t) {
      let { irregularPlurals: n, uncountable: a } = t.two;
      if (a.hasOwnProperty(e)) return e;
      if (n.hasOwnProperty(e)) return n[e];
      let r = (function (e) {
        let t = e[e.length - 1];
        if (!0 === nr.hasOwnProperty(t))
          for (let n = 0; n < nr[t].length; n += 1) {
            let a = nr[t][n][0];
            if (!0 === a.test(e)) return e.replace(a, nr[t][n][1]);
          }
        return null;
      })(e);
      return null !== r ? r : ar.test(e) ? e + "es" : e + "s";
    },
    or = /\|/;
  let ir = {
      "20th century fox": "Organization",
      "7 eleven": "Organization",
      "motel 6": "Organization",
      g8: "Organization",
      vh1: "Organization",
      km2: "Unit",
      m2: "Unit",
      dm2: "Unit",
      cm2: "Unit",
      mm2: "Unit",
      mile2: "Unit",
      in2: "Unit",
      yd2: "Unit",
      ft2: "Unit",
      m3: "Unit",
      dm3: "Unit",
      cm3: "Unit",
      in3: "Unit",
      ft3: "Unit",
      yd3: "Unit",
      "at&t": "Organization",
      "black & decker": "Organization",
      "h & m": "Organization",
      "johnson & johnson": "Organization",
      "procter & gamble": "Organization",
      "ben & jerry's": "Organization",
      "&": "Conjunction",
      i: ["Pronoun", "Singular"],
      he: ["Pronoun", "Singular"],
      she: ["Pronoun", "Singular"],
      it: ["Pronoun", "Singular"],
      they: ["Pronoun", "Plural"],
      we: ["Pronoun", "Plural"],
      was: ["Copula", "PastTense"],
      is: ["Copula", "PresentTense"],
      are: ["Copula", "PresentTense"],
      am: ["Copula", "PresentTense"],
      were: ["Copula", "PastTense"],
      her: tr,
      his: tr,
      hers: tr,
      their: tr,
      theirs: tr,
      themselves: tr,
      your: tr,
      our: tr,
      ours: tr,
      my: tr,
      its: tr,
      vs: ["Conjunction", "Abbreviation"],
      if: ["Condition", "Preposition"],
      closer: "Comparative",
      closest: "Superlative",
      much: "Adverb",
      may: "Modal",
      babysat: "PastTense",
      blew: "PastTense",
      drank: "PastTense",
      drove: "PastTense",
      forgave: "PastTense",
      skiied: "PastTense",
      spilt: "PastTense",
      stung: "PastTense",
      swam: "PastTense",
      swung: "PastTense",
      guaranteed: "PastTense",
      shrunk: "PastTense",
      nears: "PresentTense",
      nearing: "Gerund",
      neared: "PastTense",
      no: ["Negative", "Expression"],
    },
    sr = {};
  const lr = { two: { irregularPlurals: Ra, uncountable: {} } };
  Object.keys(Ya).forEach((e) => {
    let t = (function (e) {
      if (!e) return {};
      const t = e.split("|").reduce((e, t) => {
          const n = t.split("¦");
          return (e[n[0]] = n[1]), e;
        }, {}),
        n = {};
      return (
        Object.keys(t).forEach(function (e) {
          const a = er(t[e]);
          "true" === e && (e = !0);
          for (let t = 0; t < a.length; t++) {
            const r = a[t];
            !0 === n.hasOwnProperty(r)
              ? !1 === Array.isArray(n[r])
                ? (n[r] = [n[r], e])
                : n[r].push(e)
              : (n[r] = e);
          }
        }),
        n
      );
    })(Ya[e]);
    or.test(e)
      ? Object.keys(t).forEach((t) => {
          if (((sr[t] = e), "Noun|Verb" === e)) {
            let e = rr(t, lr);
            sr[e] = "Plural|Verb";
          }
        })
      : Object.keys(t).forEach((t) => {
          ir[t] = e;
        });
  }),
    [
      ":(",
      ":)",
      ":P",
      ":p",
      ":O",
      ";(",
      ";)",
      ";P",
      ";p",
      ";O",
      ":3",
      ":|",
      ":/",
      ":\\",
      ":$",
      ":*",
      ":@",
      ":-(",
      ":-)",
      ":-P",
      ":-p",
      ":-O",
      ":-3",
      ":-|",
      ":-/",
      ":-\\",
      ":-$",
      ":-*",
      ":-@",
      ":^(",
      ":^)",
      ":^P",
      ":^p",
      ":^O",
      ":^3",
      ":^|",
      ":^/",
      ":^\\",
      ":^$",
      ":^*",
      ":^@",
      "):",
      "(:",
      "$:",
      "*:",
      ")-:",
      "(-:",
      "$-:",
      "*-:",
      ")^:",
      "(^:",
      "$^:",
      "*^:",
      "<3",
      "</3",
      "<\\3",
      "=(",
    ].forEach((e) => (ir[e] = "Emoticon")),
    delete ir[""],
    delete ir.null,
    delete ir[" "];
  const ur = "Singular",
    cr = {
      beforeTags: {
        Determiner: ur,
        Possessive: ur,
        Acronym: ur,
        Noun: ur,
        Adjective: ur,
        PresentTense: ur,
        Gerund: ur,
        PastTense: ur,
        Infinitive: ur,
        Date: ur,
        Ordinal: ur,
        Demonym: ur,
      },
      afterTags: {
        Value: ur,
        Modal: ur,
        Copula: ur,
        PresentTense: ur,
        PastTense: ur,
        Demonym: ur,
        Actor: ur,
      },
      beforeWords: {
        the: ur,
        with: ur,
        without: ur,
        of: ur,
        for: ur,
        any: ur,
        all: ur,
        on: ur,
        cut: ur,
        cuts: ur,
        increase: ur,
        decrease: ur,
        raise: ur,
        drop: ur,
        save: ur,
        saved: ur,
        saves: ur,
        make: ur,
        makes: ur,
        made: ur,
        minus: ur,
        plus: ur,
        than: ur,
        another: ur,
        versus: ur,
        neither: ur,
        about: ur,
        favorite: ur,
        best: ur,
        daily: ur,
        weekly: ur,
        linear: ur,
        binary: ur,
        mobile: ur,
        lexical: ur,
        technical: ur,
        computer: ur,
        scientific: ur,
        security: ur,
        government: ur,
        popular: ur,
        formal: ur,
        no: ur,
        more: ur,
        one: ur,
      },
      afterWords: {
        of: ur,
        system: ur,
        aid: ur,
        method: ur,
        utility: ur,
        tool: ur,
        reform: ur,
        therapy: ur,
        philosophy: ur,
        room: ur,
        authority: ur,
        says: ur,
        said: ur,
        wants: ur,
        wanted: ur,
        is: ur,
        can: ur,
        wise: ur,
      },
    },
    hr = "Infinitive",
    dr = {
      beforeTags: { Modal: hr, Adverb: hr, Negative: hr, Plural: hr },
      afterTags: {
        Determiner: hr,
        Adverb: hr,
        Possessive: hr,
        Reflexive: hr,
        Preposition: hr,
        Cardinal: hr,
        Comparative: hr,
        Superlative: hr,
      },
      beforeWords: {
        i: hr,
        we: hr,
        you: hr,
        they: hr,
        to: hr,
        please: hr,
        will: hr,
        have: hr,
        had: hr,
        would: hr,
        could: hr,
        should: hr,
        do: hr,
        did: hr,
        does: hr,
        can: hr,
        must: hr,
        us: hr,
        me: hr,
        let: hr,
        even: hr,
        when: hr,
        help: hr,
        he: hr,
        she: hr,
        it: hr,
        being: hr,
        bi: hr,
        co: hr,
        contra: hr,
        de: hr,
        inter: hr,
        intra: hr,
        mis: hr,
        pre: hr,
        out: hr,
        counter: hr,
        nobody: hr,
        somebody: hr,
        anybody: hr,
        everybody: hr,
      },
      afterWords: {
        the: hr,
        me: hr,
        you: hr,
        him: hr,
        us: hr,
        her: hr,
        them: hr,
        it: hr,
        himself: hr,
        herself: hr,
        itself: hr,
        myself: hr,
        ourselves: hr,
        themselves: hr,
        something: hr,
        anything: hr,
        a: hr,
        an: hr,
        up: hr,
        down: hr,
        by: hr,
        out: hr,
        off: hr,
        under: hr,
        what: hr,
        all: hr,
        to: hr,
        because: hr,
        although: hr,
        after: hr,
        before: hr,
        how: hr,
        otherwise: hr,
        together: hr,
        though: hr,
        into: hr,
        yet: hr,
        more: hr,
        here: hr,
        there: hr,
      },
    },
    mr = {
      beforeTags: Object.assign({}, dr.beforeTags, cr.beforeTags, {}),
      afterTags: Object.assign({}, dr.afterTags, cr.afterTags, {}),
      beforeWords: Object.assign({}, dr.beforeWords, cr.beforeWords, {}),
      afterWords: Object.assign({}, dr.afterWords, cr.afterWords, {}),
    },
    pr = "Adjective",
    gr = {
      beforeTags: { Determiner: pr, Possessive: pr, Hyphenated: pr },
      afterTags: { Adjective: pr },
      beforeWords: {
        seem: pr,
        seemed: pr,
        seems: pr,
        feel: pr,
        feels: pr,
        felt: pr,
        stay: pr,
        appear: pr,
        appears: pr,
        appeared: pr,
        also: pr,
        over: pr,
        under: pr,
        too: pr,
        it: pr,
        but: pr,
        still: pr,
        really: pr,
        quite: pr,
        well: pr,
        very: pr,
        how: pr,
        deeply: pr,
        hella: pr,
        profoundly: pr,
        extremely: pr,
        so: pr,
        badly: pr,
        mostly: pr,
        totally: pr,
        awfully: pr,
        rather: pr,
        nothing: pr,
        something: pr,
        anything: pr,
        not: pr,
        me: pr,
        is: pr,
      },
      afterWords: { too: pr, also: pr, or: pr },
    },
    fr = "Gerund",
    yr = {
      beforeTags: { Adverb: fr, Preposition: fr, Conjunction: fr },
      afterTags: {
        Adverb: fr,
        Possessive: fr,
        Person: fr,
        Pronoun: fr,
        Determiner: fr,
        Copula: fr,
        Preposition: fr,
        Conjunction: fr,
        Comparative: fr,
      },
      beforeWords: {
        been: fr,
        keep: fr,
        continue: fr,
        stop: fr,
        am: fr,
        be: fr,
        me: fr,
        began: fr,
        start: fr,
        starts: fr,
        started: fr,
        stops: fr,
        stopped: fr,
        help: fr,
        helps: fr,
        avoid: fr,
        avoids: fr,
        love: fr,
        loves: fr,
        loved: fr,
        hate: fr,
        hates: fr,
        hated: fr,
      },
      afterWords: {
        you: fr,
        me: fr,
        her: fr,
        him: fr,
        them: fr,
        their: fr,
        it: fr,
        this: fr,
        there: fr,
        on: fr,
        about: fr,
        for: fr,
      },
    },
    br = {
      beforeTags: Object.assign({}, gr.beforeTags, yr.beforeTags, {
        Imperative: "Gerund",
        Infinitive: "Adjective",
        PresentTense: "Gerund",
        Plural: "Gerund",
      }),
      afterTags: Object.assign({}, gr.afterTags, yr.afterTags, {
        Singular: "Adjective",
      }),
      beforeWords: Object.assign({}, gr.beforeWords, yr.beforeWords, {
        is: "Adjective",
        was: "Adjective",
        of: "Adjective",
        suggest: "Gerund",
        recommend: "Gerund",
      }),
      afterWords: Object.assign({}, gr.afterWords, yr.afterWords, {
        to: "Gerund",
        not: "Gerund",
        the: "Gerund",
      }),
    },
    vr = {
      beforeTags: Object.assign({}, gr.beforeTags, cr.beforeTags, {
        Determiner: void 0,
        Cardinal: "Noun",
        PhrasalVerb: "Adjective",
      }),
      afterTags: Object.assign({}, gr.afterTags, cr.afterTags),
      beforeWords: Object.assign({}, gr.beforeWords, cr.beforeWords, {
        are: "Adjective",
        is: "Adjective",
        was: "Adjective",
        be: "Adjective",
        off: "Adjective",
        out: "Adjective",
      }),
      afterWords: Object.assign({}, gr.afterWords, cr.afterWords),
    };
  let wr = "PastTense";
  const kr = {
      beforeTags: {
        Adverb: wr,
        Pronoun: wr,
        ProperNoun: wr,
        Auxiliary: wr,
        Noun: wr,
      },
      afterTags: {
        Possessive: wr,
        Pronoun: wr,
        Determiner: wr,
        Adverb: wr,
        Comparative: wr,
        Date: wr,
        Gerund: wr,
      },
      beforeWords: {
        be: wr,
        who: wr,
        get: "Adjective",
        had: wr,
        has: wr,
        have: wr,
        been: wr,
        it: wr,
        as: wr,
        for: "Adjective",
      },
      afterWords: {
        by: wr,
        back: wr,
        out: wr,
        in: wr,
        up: wr,
        down: wr,
        before: wr,
        after: wr,
        for: wr,
        the: wr,
        with: wr,
        as: wr,
        on: wr,
        at: wr,
        between: wr,
        to: wr,
        into: wr,
        us: wr,
        them: wr,
        me: wr,
      },
    },
    Pr = {
      beforeTags: Object.assign({}, gr.beforeTags, kr.beforeTags),
      afterTags: Object.assign({}, gr.afterTags, kr.afterTags),
      beforeWords: Object.assign({}, gr.beforeWords, kr.beforeWords),
      afterWords: Object.assign({}, gr.afterWords, kr.afterWords),
    },
    jr = {
      beforeTags: Object.assign({}, gr.beforeTags, dr.beforeTags, {
        Adverb: void 0,
        Negative: void 0,
      }),
      afterTags: Object.assign({}, gr.afterTags, dr.afterTags, {
        Noun: "Adjective",
        Conjunction: void 0,
      }),
      beforeWords: Object.assign({}, gr.beforeWords, dr.beforeWords, {
        have: void 0,
        had: void 0,
        not: void 0,
        went: "Adjective",
        goes: "Adjective",
        got: "Adjective",
        be: "Adjective",
      }),
      afterWords: Object.assign({}, gr.afterWords, dr.afterWords, {
        to: void 0,
        as: "Adjective",
      }),
    },
    Ar = {
      beforeTags: Object.assign({}, yr.beforeTags, cr.beforeTags, {
        Copula: "Gerund",
        PastTense: "Gerund",
        PresentTense: "Gerund",
        Infinitive: "Gerund",
      }),
      afterTags: Object.assign({}, yr.afterTags, cr.afterTags, {}),
      beforeWords: Object.assign({}, yr.beforeWords, cr.beforeWords, {
        are: "Gerund",
        were: "Gerund",
        be: "Gerund",
        no: "Gerund",
        without: "Gerund",
        you: "Gerund",
        we: "Gerund",
        they: "Gerund",
        he: "Gerund",
        she: "Gerund",
        us: "Gerund",
        them: "Gerund",
      }),
      afterWords: Object.assign({}, yr.afterWords, cr.afterWords, {
        the: "Gerund",
        this: "Gerund",
        that: "Gerund",
        me: "Gerund",
        us: "Gerund",
        them: "Gerund",
      }),
    },
    xr = "Singular",
    Dr = "Infinitive",
    Ir = {
      beforeTags: Object.assign({}, dr.beforeTags, cr.beforeTags, {
        Adjective: xr,
        Particle: xr,
      }),
      afterTags: Object.assign({}, dr.afterTags, cr.afterTags, {
        ProperNoun: Dr,
        Gerund: Dr,
        Adjective: Dr,
        Copula: xr,
      }),
      beforeWords: Object.assign({}, dr.beforeWords, cr.beforeWords, {
        is: xr,
        was: xr,
        of: xr,
        have: null,
      }),
      afterWords: Object.assign({}, dr.afterWords, cr.afterWords, {
        instead: Dr,
        about: Dr,
        his: Dr,
        her: Dr,
        to: null,
        by: null,
        in: null,
      }),
    },
    Nr = "Person",
    Er = {
      beforeTags: { Honorific: Nr, Person: Nr },
      afterTags: { Person: Nr, ProperNoun: Nr, Verb: Nr },
      ownTags: { ProperNoun: Nr },
      beforeWords: { hi: Nr, hey: Nr, yo: Nr, dear: Nr, hello: Nr },
      afterWords: {
        said: Nr,
        says: Nr,
        told: Nr,
        tells: Nr,
        feels: Nr,
        felt: Nr,
        seems: Nr,
        thinks: Nr,
        thought: Nr,
        spends: Nr,
        spendt: Nr,
        plays: Nr,
        played: Nr,
        sing: Nr,
        sang: Nr,
        learn: Nr,
        learned: Nr,
        wants: Nr,
        wanted: Nr,
      },
    },
    Tr = "Month",
    Or = {
      beforeTags: { Date: Tr, Value: Tr },
      afterTags: { Date: Tr, Value: Tr },
      beforeWords: {
        by: Tr,
        in: Tr,
        on: Tr,
        during: Tr,
        after: Tr,
        before: Tr,
        between: Tr,
        until: Tr,
        til: Tr,
        sometime: Tr,
        of: Tr,
        this: Tr,
        next: Tr,
        last: Tr,
        previous: Tr,
        following: Tr,
      },
      afterWords: { sometime: Tr, in: Tr, of: Tr, until: Tr, the: Tr },
    },
    Cr = {
      beforeTags: Object.assign({}, Er.beforeTags, Or.beforeTags),
      afterTags: Object.assign({}, Er.afterTags, Or.afterTags),
      beforeWords: Object.assign({}, Er.beforeWords, Or.beforeWords),
      afterWords: Object.assign({}, Er.afterWords, Or.afterWords),
    },
    Vr = "Place",
    zr = {
      beforeTags: { Place: Vr },
      afterTags: { Place: Vr, Abbreviation: Vr },
      beforeWords: { in: Vr, by: Vr, near: Vr, from: Vr, to: Vr },
      afterWords: {
        in: Vr,
        by: Vr,
        near: Vr,
        from: Vr,
        to: Vr,
        government: Vr,
        council: Vr,
        region: Vr,
        city: Vr,
      },
    };
  let $r = "Unit";
  const Fr = {
      "Actor|Verb": mr,
      "Adj|Gerund": br,
      "Adj|Noun": vr,
      "Adj|Past": Pr,
      "Adj|Present": jr,
      "Noun|Verb": Ir,
      "Noun|Gerund": Ar,
      "Person|Noun": {
        beforeTags: Object.assign({}, cr.beforeTags, Er.beforeTags),
        afterTags: Object.assign({}, cr.afterTags, Er.afterTags),
        beforeWords: Object.assign({}, cr.beforeWords, Er.beforeWords, {
          i: "Infinitive",
          we: "Infinitive",
        }),
        afterWords: Object.assign({}, cr.afterWords, Er.afterWords),
      },
      "Person|Date": Cr,
      "Person|Verb": {
        beforeTags: Object.assign(
          {},
          cr.beforeTags,
          Er.beforeTags,
          dr.beforeTags
        ),
        afterTags: Object.assign({}, cr.afterTags, Er.afterTags, dr.afterTags),
        beforeWords: Object.assign(
          {},
          cr.beforeWords,
          Er.beforeWords,
          dr.beforeWords
        ),
        afterWords: Object.assign(
          {},
          cr.afterWords,
          Er.afterWords,
          dr.afterWords
        ),
      },
      "Person|Place": {
        beforeTags: Object.assign({}, zr.beforeTags, Er.beforeTags),
        afterTags: Object.assign({}, zr.afterTags, Er.afterTags),
        beforeWords: Object.assign({}, zr.beforeWords, Er.beforeWords),
        afterWords: Object.assign({}, zr.afterWords, Er.afterWords),
      },
      "Person|Adj": {
        beforeTags: Object.assign({}, Er.beforeTags, gr.beforeTags),
        afterTags: Object.assign({}, Er.afterTags, gr.afterTags),
        beforeWords: Object.assign({}, Er.beforeWords, gr.beforeWords),
        afterWords: Object.assign({}, Er.afterWords, gr.afterWords),
      },
      "Unit|Noun": {
        beforeTags: { Value: $r },
        afterTags: {},
        beforeWords: {
          per: $r,
          every: $r,
          each: $r,
          square: $r,
          cubic: $r,
          sq: $r,
          metric: $r,
        },
        afterWords: { per: $r, squared: $r, cubed: $r, long: $r },
      },
    },
    Br = (e, t) => {
      let n = Object.keys(e).reduce(
        (t, n) => (
          (t[n] = "Infinitive" === e[n] ? "PresentTense" : "Plural"), t
        ),
        {}
      );
      return Object.assign(n, t);
    };
  Fr["Plural|Verb"] = {
    beforeWords: Br(Fr["Noun|Verb"].beforeWords, {
      had: "Plural",
      have: "Plural",
    }),
    afterWords: Br(Fr["Noun|Verb"].afterWords, {
      his: "PresentTense",
      her: "PresentTense",
      its: "PresentTense",
      in: null,
      to: null,
      is: "PresentTense",
      by: "PresentTense",
    }),
    beforeTags: Br(Fr["Noun|Verb"].beforeTags, {
      Conjunction: "PresentTense",
      Noun: void 0,
      ProperNoun: "PresentTense",
    }),
    afterTags: Br(Fr["Noun|Verb"].afterTags, {
      Gerund: "Plural",
      Noun: "PresentTense",
      Value: "PresentTense",
    }),
  };
  const Mr = Fr,
    Sr = "Adjective",
    Gr = "Infinitive",
    Lr = "PresentTense",
    Hr = "Singular",
    qr = "PastTense",
    Wr = "Adverb",
    Jr = "Plural",
    _r = "Actor",
    Kr = "Verb",
    Ur = "Noun",
    Rr = "LastName",
    Yr = "Modal",
    Qr = "Participle",
    Zr = [
      null,
      null,
      { ea: Hr, ia: Ur, ic: Sr, ly: Wr, "'n": Kr, "'t": Kr },
      {
        oed: qr,
        ued: qr,
        xed: qr,
        " so": Wr,
        "'ll": Yr,
        "'re": "Copula",
        azy: Sr,
        eer: Ur,
        end: Kr,
        ped: qr,
        ffy: Sr,
        ify: Gr,
        ing: "Gerund",
        ize: Gr,
        ibe: Gr,
        lar: Sr,
        mum: Sr,
        nes: Lr,
        nny: Sr,
        ous: Sr,
        que: Sr,
        ger: Ur,
        ber: Ur,
        rol: Hr,
        sis: Hr,
        ogy: Hr,
        oid: Hr,
        ian: Hr,
        zes: Lr,
        eld: qr,
        ken: Qr,
        ven: Qr,
        ten: Qr,
        ect: Gr,
        ict: Gr,
        ign: Gr,
        ful: Sr,
        bal: Sr,
      },
      {
        amed: qr,
        aped: qr,
        ched: qr,
        lked: qr,
        rked: qr,
        reed: qr,
        nded: qr,
        mned: Sr,
        cted: qr,
        dged: qr,
        ield: Hr,
        akis: Rr,
        cede: Gr,
        chuk: Rr,
        czyk: Rr,
        ects: Lr,
        ends: Kr,
        enko: Rr,
        ette: Hr,
        iary: Hr,
        wner: Hr,
        fies: Lr,
        fore: Wr,
        gate: Gr,
        gone: Sr,
        ices: Jr,
        ints: Jr,
        ruct: Gr,
        ines: Jr,
        ions: Jr,
        ners: Jr,
        pers: Jr,
        lers: Jr,
        less: Sr,
        llen: Sr,
        made: Sr,
        nsen: Rr,
        oses: Lr,
        ould: Yr,
        some: Sr,
        sson: Rr,
        ians: Jr,
        tion: Hr,
        tage: Ur,
        ique: Hr,
        tive: Sr,
        tors: Ur,
        vice: Hr,
        lier: Hr,
        fier: Hr,
        wned: qr,
        gent: Hr,
        tist: _r,
        pist: _r,
        rist: _r,
        mist: _r,
        yist: _r,
        vist: _r,
        ists: _r,
        lite: Hr,
        site: Hr,
        rite: Hr,
        mite: Hr,
        bite: Hr,
        mate: Hr,
        date: Hr,
        ndal: Hr,
        vent: Hr,
        uist: _r,
        gist: _r,
        note: Hr,
        cide: Hr,
        ence: Hr,
        wide: Sr,
        vide: Gr,
        ract: Gr,
        duce: Gr,
        pose: Gr,
        eive: Gr,
        lyze: Gr,
        lyse: Gr,
        iant: Sr,
        nary: Sr,
        erer: _r,
      },
      {
        elist: _r,
        holic: Hr,
        phite: Hr,
        tized: qr,
        urned: qr,
        eased: qr,
        ances: Jr,
        bound: Sr,
        ettes: Jr,
        fully: Wr,
        ishes: Lr,
        ities: Jr,
        marek: Rr,
        nssen: Rr,
        ology: Ur,
        osome: Hr,
        tment: Hr,
        ports: Jr,
        rough: Sr,
        tches: Lr,
        tieth: "Ordinal",
        tures: Jr,
        wards: Wr,
        where: Wr,
        archy: Ur,
        pathy: Ur,
        opoly: Ur,
        embly: Ur,
        phate: Ur,
        ndent: Hr,
        scent: Hr,
        onist: _r,
        anist: _r,
        alist: _r,
        olist: _r,
        icist: _r,
        ounce: Gr,
        iable: Sr,
        borne: Sr,
        gnant: Sr,
        inant: Sr,
        igent: Sr,
        atory: Sr,
        rient: Hr,
        dient: Hr,
        maker: _r,
      },
      {
        auskas: Rr,
        parent: Hr,
        cedent: Hr,
        ionary: Hr,
        cklist: Hr,
        keeper: _r,
        logist: _r,
        teenth: "Value",
        worker: _r,
        master: _r,
        writer: _r,
      },
      { logists: _r, opoulos: Rr, borough: "Place", sdottir: Rr },
    ],
    Xr = "Adjective",
    eo = "Noun",
    to = "Verb",
    no = [
      null,
      null,
      {},
      { neo: eo, bio: eo, "de-": to, "re-": to, "un-": to },
      {
        anti: eo,
        auto: eo,
        faux: Xr,
        hexa: eo,
        kilo: eo,
        mono: eo,
        nano: eo,
        octa: eo,
        poly: eo,
        semi: Xr,
        tele: eo,
        "pro-": Xr,
        "mis-": to,
        "dis-": to,
        "pre-": Xr,
      },
      {
        anglo: eo,
        centi: eo,
        ethno: eo,
        ferro: eo,
        grand: eo,
        hepta: eo,
        hydro: eo,
        intro: eo,
        macro: eo,
        micro: eo,
        milli: eo,
        nitro: eo,
        penta: eo,
        quasi: Xr,
        radio: eo,
        tetra: eo,
        "omni-": Xr,
        "post-": Xr,
      },
      {
        pseudo: Xr,
        "extra-": Xr,
        "hyper-": Xr,
        "inter-": Xr,
        "intra-": Xr,
        "deca-": Xr,
      },
      { electro: eo },
    ],
    ao = "Adjective",
    ro = "Infinitive",
    oo = "PresentTense",
    io = "Singular",
    so = "PastTense",
    lo = "Adverb",
    uo = "Expression",
    co = "Actor",
    ho = "Verb",
    mo = "Noun",
    po = "LastName",
    go = {
      a: [
        [/.[aeiou]na$/, mo, "tuna"],
        [/.[oau][wvl]ska$/, po],
        [/.[^aeiou]ica$/, io, "harmonica"],
        [/^([hyj]a+)+$/, uo, "haha"],
      ],
      c: [[/.[^aeiou]ic$/, ao]],
      d: [
        [/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/, so, "popped"],
        [/.[aeo]{2}[bdgmnprvz]ed$/, so, "rammed"],
        [/.[aeiou][sg]hed$/, so, "gushed"],
        [/.[aeiou]red$/, so, "hired"],
        [/.[aeiou]r?ried$/, so, "hurried"],
        [/[^aeiou]ard$/, io, "steward"],
        [/[aeiou][^aeiou]id$/, ao, ""],
        [/.[vrl]id$/, ao, "livid"],
        [/..led$/, so, "hurled"],
        [/.[iao]sed$/, so, ""],
        [/[aeiou]n?[cs]ed$/, so, ""],
        [/[aeiou][rl]?[mnf]ed$/, so, ""],
        [/[aeiou][ns]?c?ked$/, so, "bunked"],
        [/[aeiou]gned$/, so],
        [/[aeiou][nl]?ged$/, so],
        [/.[tdbwxyz]ed$/, so],
        [/[^aeiou][aeiou][tvx]ed$/, so],
        [/.[cdflmnprstv]ied$/, so, "emptied"],
      ],
      e: [
        [/.[lnr]ize$/, ro, "antagonize"],
        [/.[^aeiou]ise$/, ro, "antagonise"],
        [/.[aeiou]te$/, ro, "bite"],
        [/.[^aeiou][ai]ble$/, ao, "fixable"],
        [/.[^aeiou]eable$/, ao, "maleable"],
        [/.[ts]ive$/, ao, "festive"],
        [/[a-z]-like$/, ao, "woman-like"],
      ],
      h: [
        [/.[^aeiouf]ish$/, ao, "cornish"],
        [/.v[iy]ch$/, po, "..ovich"],
        [/^ug?h+$/, uo, "ughh"],
        [/^uh[ -]?oh$/, uo, "uhoh"],
        [/[a-z]-ish$/, ao, "cartoon-ish"],
      ],
      i: [[/.[oau][wvl]ski$/, po, "polish-male"]],
      k: [[/^(k){2}$/, uo, "kkkk"]],
      l: [
        [/.[gl]ial$/, ao, "familial"],
        [/.[^aeiou]ful$/, ao, "fitful"],
        [/.[nrtumcd]al$/, ao, "natal"],
        [/.[^aeiou][ei]al$/, ao, "familial"],
      ],
      m: [
        [/.[^aeiou]ium$/, io, "magnesium"],
        [/[^aeiou]ism$/, io, "schism"],
        [/^[hu]m+$/, uo, "hmm"],
        [/^\d+ ?[ap]m$/, "Date", "3am"],
      ],
      n: [
        [/.[lsrnpb]ian$/, ao, "republican"],
        [/[^aeiou]ician$/, co, "musician"],
        [/[aeiou][ktrp]in'$/, "Gerund", "cookin'"],
      ],
      o: [
        [/^no+$/, uo, "noooo"],
        [/^(yo)+$/, uo, "yoo"],
        [/^wo{2,}[pt]?$/, uo, "woop"],
      ],
      r: [
        [/.[bdfklmst]ler$/, "Noun"],
        [/[aeiou][pns]er$/, io],
        [/[^i]fer$/, ro],
        [/.[^aeiou][ao]pher$/, co],
        [/.[lk]er$/, "Noun"],
        [/.ier$/, "Comparative"],
      ],
      t: [
        [/.[di]est$/, "Superlative"],
        [/.[icldtgrv]ent$/, ao],
        [/[aeiou].*ist$/, ao],
        [/^[a-z]et$/, ho],
      ],
      s: [
        [/.[^aeiou]ises$/, oo],
        [/.[rln]ates$/, oo],
        [/.[^z]ens$/, ho],
        [/.[lstrn]us$/, io],
        [/.[aeiou]sks$/, oo],
        [/.[aeiou]kes$/, oo],
        [/[aeiou][^aeiou]is$/, io],
        [/[a-z]'s$/, mo],
        [/^yes+$/, uo],
      ],
      v: [[/.[^aeiou][ai][kln]ov$/, po]],
      y: [
        [/.[cts]hy$/, ao],
        [/.[st]ty$/, ao],
        [/.[tnl]ary$/, ao],
        [/.[oe]ry$/, io],
        [/[rdntkbhs]ly$/, lo],
        [/.(gg|bb|zz)ly$/, ao],
        [/...lly$/, lo],
        [/.[gk]y$/, ao],
        [/[bszmp]{2}y$/, ao],
        [/.[ai]my$/, ao],
        [/[ea]{2}zy$/, ao],
        [/.[^aeiou]ity$/, io],
      ],
    },
    fo = "Verb",
    yo = "Noun",
    bo = {
      leftTags: [
        ["Adjective", yo],
        ["Possessive", yo],
        ["Determiner", yo],
        ["Adverb", fo],
        ["Pronoun", fo],
        ["Value", yo],
        ["Ordinal", yo],
        ["Modal", fo],
        ["Superlative", yo],
        ["Demonym", yo],
        ["Honorific", "Person"],
      ],
      leftWords: [
        ["i", fo],
        ["first", yo],
        ["it", fo],
        ["there", fo],
        ["not", fo],
        ["because", yo],
        ["if", yo],
        ["but", yo],
        ["who", fo],
        ["this", yo],
        ["his", yo],
        ["when", yo],
        ["you", fo],
        ["very", "Adjective"],
        ["old", yo],
        ["never", fo],
        ["before", yo],
        ["a", yo],
        ["the", yo],
        ["been", fo],
      ],
      rightTags: [
        ["Copula", yo],
        ["PastTense", yo],
        ["Conjunction", yo],
        ["Modal", yo],
      ],
      rightWords: [
        ["there", fo],
        ["me", fo],
        ["man", "Adjective"],
        ["him", fo],
        ["it", fo],
        ["were", yo],
        ["took", yo],
        ["himself", fo],
        ["went", yo],
        ["who", yo],
        ["jr", "Person"],
      ],
    },
    vo = function (e) {
      let t = {};
      return (
        e.forEach((e) => {
          let n = e[0] || "",
            a = n[n.length - 1] || "";
          (t[a] = t[a] || []), t[a].push(e);
        }),
        t
      );
    },
    wo = /^([0-9]+)/,
    ko = function (e) {
      const t = /\|/;
      return e.split(/,/).map((e) => {
        let n = e.split(t);
        return (function (e = "", t = "") {
          let n = (t = String(t)).match(wo);
          if (null === n) return [e, t];
          let a = Number(n[1]) || 0,
            r = e.substring(0, a);
          return [e, r + t.replace(wo, "")];
        })(n[0], n[1]);
      });
    },
    Po = function (e = {}) {
      return (
        ((e = Object.assign({}, e)).rules = ko(e.rules)),
        (e.rules = vo(e.rules)),
        e.rev && ((e.rev = ko(e.rev)), (e.rev = vo(e.rev))),
        (e.exceptions = ko(e.exceptions)),
        (e.exceptions = e.exceptions.reduce(
          (e, t) => ((e[t[0]] = t[1]), e),
          {}
        )),
        e
      );
    },
    jo = function (e) {
      let { rules: t, exceptions: n, rev: a } = e;
      var r;
      return (
        (r = n),
        (n = Object.entries(r).reduce((e, t) => ((e[t[1]] = t[0]), e), {})),
        { reversed: !Boolean(e.reversed), rules: t, exceptions: n, rev: a }
      );
    },
    Ao = Po({
      rules:
        "een|1,egan|2in,on|in,pun|1in,ewn|2,ave|ive,poke|1eak,hose|2ose,roke|1eak,roze|1eeze,ode|ide,orbade|3id,hone|1ine,tole|1eal,rose|1ise,woke|1ake,wrote|2ite,made|2ke,came|1ome,ove|ive,ore|ear,elped|3,elcomed|6,hared|4,nvited|5,eclared|6,eard|3,avelled|4,ombined|6,uided|4,etired|5,choed|3,ncelled|4,epeated|5,moked|4,entred|5,dhered|5,esired|5,ompeted|6,erseded|6,ramed|4,qualled|4,iloted|4,stponed|6,uelled|3,opelled|4,gnored|5,xtruded|6,caled|4,ndured|5,lamed|4,quared|5,mpeded|5,rouped|4,efeated|5,robed|4,lid|3e,magined|6,nselled|4,uthored|6,ebuted|4,shrined|6,tialled|4,erfered|6,eaped|3,yped|3,laked|4,tirred|3,ooted|3,leated|4,ncited|5,oubted|4,mpelled|4,nnulled|4,pined|4,ircled|5,ecited|5,reathed|6,nvaded|5,onfided|6,pedited|6,alcined|6,ycotted|5,dmired|5,xcreted|6,ubed|3,taked|4,onfined|6,heated|4,rimed|4,amelled|4,achined|6,litzed|4,xcited|5,xpelled|4,xtolled|4,ouled|3,imicked|4,ivalled|4,eeped|3,naked|4,tyled|4,iased|3,nhaled|5,oeuvred|6,grammed|6,kied|2,miled|4,pited|4,eterred|4,hoked|4,kidded|3,ollided|6,pleted|5,cided|4,plored|5,stored|5,longed|4,filed|4,rbed|2,suaded|5,ciled|4,edded|2,tined|4,phoned|5,fled|3,nited|4,iped|3,hauled|4,treated|5,nnelled|4,basted|5,njured|5,twined|5,uzzed|3,did|1o,odded|2,vided|4,old|ell,pared|4,mbed|2,stood|2and,pired|4,held|1old,vened|4,cored|4,read|4,piled|4,aped|3,gled|3,named|4,arred|2,oated|3,kled|3,ooled|3,uned|3,figured|6,bid|3,ound|ind,oped|2,ibed|3,quired|5,uled|3,oded|3,ceded|4,cured|4,sided|4,voked|4,rled|2,outed|3,mined|4,urred|2,ighted|4,umed|3,sured|4,iked|3,mmed|1,pled|3,fed|1,bbed|1,eled|2,luded|4,aid|1y,ferred|3,tled|3,dled|3,raded|4,oted|3,eed|2,aled|2,lined|4,mped|2,fted|2,lted|2,gged|1,eted|2,xed|1,bled|3,pted|2,tured|4,uted|3,ued|2,iled|2,nned|1,yed|1,rted|2,pped|1,tted|1,wed|1,lled|2,ited|2,med|1,sted|2,ssed|2,ged|2,ved|2,nted|2,ked|1,cted|2,ced|2,ied|y,hed|1,sed|2,ded|1,zed|2,ned|1,red|1,ated|3,ell|all,rought|1ing,hought|1ink,eft|1ave,eant|3,ealt|3,eat|3,hot|2ot,urt|3,eapt|3,elt|1el,went|go,built|4d,at|it,got|1et,ut|2,it|2,et|2,ent|2d,ept|1ep,st|2,truck|2ike,nuck|1eak,tunk|1ink,ank|ink,ook|ake,ug|ig,ang|ing,ung|ing,nderlay|5ie,dezvous|7,wam|1im,drew|2aw,saw|1ee,ew|ow",
      exceptions:
        "was|is,were|are,had|2ve,led|2ad,met|2et,cited|4,focused|5,sought|1eek,lost|3e,defined|6,died|3,hired|4,bought|1uy,ran|1un,controlled|7,taught|1each,hoped|4,shed|4,refined|6,caught|2tch,flew|2y,owed|3,fought|1ight,fired|4,fed|2ed,pied|3,fared|4,tied|3,fled|3e,cared|4,ate|eat,dyed|3,lit|2ght,winged|4,bred|3ed,pent|3,wired|4,persevered|9,baked|4,dined|4,fined|4,shored|5,hid|3e,padded|3,waned|4,wove|1eave,lied|3,wasted|5,sloped|5,joked|4,ached|4,baled|4,bit|3e,bled|3ed,boned|4,caned|4,dispelled|6,egged|3,hung|1ang,patrolled|6,tasted|5,faked|4,bored|4,eyed|3,gamed|4,gassed|3,pored|4,timed|4,toned|4,zoned|4,poked|4,dared|4,been|2,said|2y,found|1ind,took|1ake,came|1ome,gave|1ive,fell|1all,brought|2ing,rose|1ise,put|3,sent|3d,spent|4d,spoke|2eak,left|2ave,won|1in,told|1ell,meant|4,heard|4,got|1et,arose|2ise,read|4,let|3,hit|3,cost|4,dealt|4,laid|2y,drove|2ive,sat|1it,cast|4,beat|4,lent|3d,sang|1ing,banned|3,jarred|3,wound|1ind,omitted|4,quit|4,slid|4e,rang|1ing,fit|3,rent|3d,bet|3,sank|1ink,reaped|4,manned|3,rode|1ide,rebutted|5,bound|1ind,barred|3,recast|6,netted|3,tanned|3,plotted|4,tore|1ear,spun|2in,pitted|3,shone|2ine,donned|3,dove|1ive,spat|2it,bent|3d,leapt|4,seeped|4,sewn|3,twinned|4,wrung|2ing,deterred|5,blew|2ow",
      rev: "egin|2an,lan|3ned,nderpin|7ned,kin|3ned,hin|3ned,pan|3ned,can|3ned,un|2ned,n|1ed,ecome|2ame,hoose|2se,trike|2uck,lee|2d,trive|2ove,vercome|4ame,reeze|1oze,hake|1ook,nderlie|5ay,istake|3ook,etake|2ook,wake|1oke,write|2ote,make|2de,rtake|2ook,see|1aw,e|1d,elp|3ed,roup|4ed,oop|3ed,velop|5ed,eep|1pt,mp|2ed,p|1ped,hink|1ought,eek|ought,reak|1oke,neak|1uck,tink|1unk,rink|1ank,k|1ed,ommit|5ted,ermit|5ted,oadcast|7,dmit|4ted,hoot|2t,plit|4,hut|3,llot|4ted,nit|3ted,orget|3ot,egret|5ted,hrust|5,ormat|5ted,hat|3ted,lat|3ted,urt|3,cquit|5ted,urst|4,ransmit|7ted,emit|4ted,pot|3ted,cut|3,submit|6ted,set|3,t|1ed,now|1ew,trew|4n,draw|2ew,throw|3ew,grow|2ew,w|1ed,uy|ought,ey|2ed,pay|2id,oy|2ed,ay|2ed,y|ied,ravel|5led,ancel|5led,qual|4led,uel|3led,ounsel|6led,nitial|6led,nnul|4led,namel|5led,xtol|4led,ival|4led,teal|1ole,eel|1lt,trol|4led,sell|1old,nnel|4led,pel|3led,l|1ed,ransfer|7red,pur|3red,lur|3red,tir|3red,par|3red,nfer|4red,wear|1ore,bear|1ore,efer|4red,cur|3red,r|1ed,pread|5,hed|3,rind|1ound,mbed|4ded,reed|2d,hred|4ded,eread|5,orbid|3ade,leed|2d,kid|3ded,build|4t,od|2ded,stand|2ood,hold|1eld,bid|3,d|1ed,cho|3ed,go|went,do|1id,tem|3med,um|2med,rim|3med,kim|3med,wim|1am,lam|3med,m|1ed,lug|3ged,ig|ug,pring|2ang,gg|2ed,ang|ung,long|4ed,og|2ged,ling|1ung,ag|2ged,ub|2bed,ib|2bed,ob|2bed,rb|2ed,ab|2bed,mb|2ed,imic|4ked,dezvous|7,s|1ed,ki|2ed,z|1ed,f|1ed,x|1ed,h|1ed",
    }),
    xo = Po({
      rules:
        "as|1ve,tudies|3y,mbodies|4y,evies|2y,arties|3y,emedies|4y,mpties|3y,eadies|3y,obbies|3y,ullies|3y,nesties|4y,zzes|2,pies|1y,nies|1y,oes|1,xes|1,plies|2y,ries|1y,shes|2,sses|2,ches|2,fies|1y,s|",
      exceptions: "are|is,focuses|5,relies|3y,flies|2y,gasses|3,has|2ve",
      rev: "uy|2s,oy|2s,ey|2s,ay|2s,y|ies,adio|4s,aboo|4s,o|1es,tograph|7s,erth|4s,gh|2s,h|1es,as|2ses,s|1es,ic|2s,zz|2es,x|1es,f|1s,b|1s,g|1s,m|1s,w|1s,p|1s,k|1s,l|1s,d|1s,n|1s,r|1s,t|1s,e|1s",
    }),
    Do = Po({
      rules:
        "omoting|4e,haring|3e,ploring|4e,mbining|4e,nviting|4e,belling|3,ntoring|4e,uiding|3e,orging|3e,dhering|4e,alysing|4e,nciling|4e,mpeding|4e,uoting|3e,evoting|4e,nsating|4e,gnoring|4e,roding|3e,iaising|4e,esaling|4e,rowsing|4e,rfering|4e,kating|3e,robing|3e,tponing|4e,mmuting|4e,laning|3e,moking|3e,nfining|4e,nduring|4e,nciting|4e,busing|3e,eleting|4e,esiring|4e,rbating|4e,larging|4e,ploding|4e,haking|3e,hading|3e,biding|3e,udding|2,neating|4e,craping|4e,efuting|4e,thoring|4e,eusing|3e,agining|4e,rekking|3,suading|4e,ubating|4e,ronzing|4e,euvring|4e,bliging|4e,laking|3e,riming|3e,asising|4e,lunging|4e,cilling|3,pinging|4e,hoking|3e,creting|4e,ralling|3,miling|3e,wathing|4e,edoring|4e,odding|2,aloging|4e,rseding|4e,xcusing|4e,halling|3,ialling|3,inuting|4e,xciting|4e,chuting|4e,hrining|4e,eciting|4e,xuding|3e,isusing|4e,uizzing|3,ithing|3e,izzling|4e,haling|3e,dmiring|4e,rsaking|4e,parging|4e,ixating|4e,anuring|4e,iecing|3e,erusing|4e,eething|4e,entring|4e,goating|4e,langing|4e,stining|4e,lescing|4e,erlying|3ie,pleting|4e,ausing|3e,ciding|3e,enging|3e,casing|3e,cising|3e,esiding|4e,uning|2e,delling|3,storing|4e,tiring|3e,leging|3e,piling|3e,tising|3e,ecuting|4e,eduling|4e,uelling|3,liding|3e,uging|2e,celling|3,ubing|2e,laming|3e,ebating|4e,njuring|4e,scaping|4e,truding|4e,chising|4e,vading|3e,shaping|4e,iping|2e,naming|3e,ulging|3e,raking|3e,fling|2e,taping|3e,noting|3e,lading|3e,scaling|4e,riding|3e,rasing|3e,coping|3e,ruling|3e,wining|3e,viding|3e,quiring|4e,velling|3,alyzing|4e,laring|3e,coring|3e,ranging|4e,ousing|3e,puting|3e,vening|3e,idding|2,hining|3e,urging|3e,coding|3e,niting|3e,nelling|3,dising|3e,uising|3e,caring|3e,lapsing|4e,erging|3e,pating|3e,mining|3e,ibuting|4e,coming|3e,paring|3e,taking|3e,hasing|3e,vising|3e,ituting|4e,writing|4e,eezing|3e,piring|3e,luting|3e,voking|3e,iguring|4e,uming|2e,curing|3e,mising|3e,iking|2e,edding|2,luding|3e,suring|3e,rising|3e,ribing|3e,rading|3e,ceding|3e,nsing|2e,kling|2e,fusing|3e,azing|2e,cling|2e,nising|3e,ducing|3e,rcing|2e,gling|2e,easing|3e,uating|3e,lising|3e,lining|3e,mating|3e,mming|1,pling|2e,bbing|1,vating|3e,dling|2e,dating|3e,rsing|2e,dging|2e,tling|2e,turing|3e,icing|2e,acing|2e,gating|3e,gging|1,tating|3e,rring|1,nning|1,uing|1e,bling|2e,iating|3e,cating|3e,aging|2e,osing|2e,ncing|2e,nating|3e,pping|1,lating|3e,tting|1,rating|3e,ving|1e,izing|2e,ing|",
      exceptions:
        "being|is,using|2e,making|3e,creating|5e,changing|5e,owing|2e,raising|4e,competing|6e,defining|5e,counselling|7,hiring|3e,filing|3e,controlling|7,totalling|5,infringing|7e,citing|3e,dying|1ie,doping|3e,baking|3e,hoping|3e,refining|5e,exchanging|7e,charging|5e,stereotyping|9e,voting|3e,tying|1ie,discharging|8e,basing|3e,lying|1ie,expediting|7e,typing|3e,breathing|6e,framing|4e,boring|3e,dining|3e,firing|3e,hiding|3e,appraising|7e,tasting|4e,waning|3e,distilling|6,baling|3e,boning|3e,faring|3e,honing|3e,wasting|4e,phoning|4e,luring|3e,propelling|6,timing|3e,wading|3e,abating|4e,compelling|6,vying|1ie,fading|3e,biting|3e,zoning|3e,dispelling|6,pasting|4e,praising|5e,telephoning|8e,daring|3e,waking|3e,shoring|4e,gaming|3e,padding|3,rerouting|6e,fringing|5e,braising|5e,coking|3e,recreating|7e,sloping|4e,sunbathing|7e,overcharging|9e,everchanging|9e,patrolling|6,joking|3e,extolling|5,expelling|5,reappraising|9e,wadding|3,gaping|3e,poking|3e,persevering|8e,pining|3e,recordkeeping|10e,landfilling|7,liming|3e,interchanging|10e,toting|3e,roping|3e,wiring|3e,aching|3e,gassing|3,getting|3,travelling|6,putting|3,sitting|3,betting|3,mapping|3,tapping|3,letting|3,hitting|3,tanning|3,netting|3,popping|3,fitting|3,deterring|5,barring|3,banning|3,vetting|3,omitting|4,wetting|3,plotting|4,budding|3,clotting|4,hemming|3,slotting|4,singeing|5,reprogramming|9,jetting|3,kidding|3,befitting|5,podding|3,wedding|3,donning|3,warring|3,penning|3,gutting|3,cueing|3,refitting|5,petting|3,cramming|4,napping|3,tinning|3",
      rev: "lan|3ning,egin|4ning,can|3ning,pan|3ning,hin|3ning,kin|3ning,win|3ning,un|2ning,pin|3ning,n|1ing,ounsel|6ling,otal|4ling,abel|4ling,evel|4ling,ancel|5ling,istil|5ling,xcel|4ling,tencil|6ling,piral|5ling,arshal|6ling,nitial|6ling,hrivel|6ling,xtol|4ling,andfil|6ling,trol|4ling,fuel|4ling,model|5ling,nnel|4ling,pel|3ling,l|1ing,ransfer|7ring,lur|3ring,tir|3ring,tar|3ring,pur|3ring,car|3ring,nfer|4ring,efer|4ring,cur|3ring,r|1ing,ermit|5ting,ransmit|7ting,ommit|5ting,nit|3ting,orget|5ting,abysit|6ting,dmit|4ting,hut|3ting,hat|3ting,utfit|5ting,but|3ting,egret|5ting,llot|4ting,mat|3ting,pot|3ting,lit|3ting,emit|4ting,submit|6ting,pit|3ting,rot|3ting,quit|4ting,cut|3ting,set|3ting,t|1ing,tem|3ming,wim|3ming,kim|3ming,um|2ming,rim|3ming,m|1ing,tep|3ping,wap|3ping,top|3ping,hop|3ping,cap|3ping,rop|3ping,rap|3ping,lap|3ping,ip|2ping,p|1ing,ye|2ing,oe|2ing,ie|ying,ee|2ing,e|ing,hed|3ding,hred|4ding,bed|3ding,bid|3ding,d|1ing,ki|2ing,rek|3king,k|1ing,isc|3ing,echarg|6ing,ng|2ing,g|1ging,uiz|3zing,z|1ing,mb|2ing,rb|2ing,b|1bing,o|1ing,x|1ing,f|1ing,s|1ing,w|1ing,y|1ing,h|1ing",
    }),
    Io = Po({
      rules:
        "roken|1ake,hosen|2ose,allen|3,rozen|1eeze,asten|4,engthen|5,essen|3,hrunken|2ink,lain|2y,poken|1eak,tolen|1eal,eaten|3,un|in,itten|2e,gotten|1et,ighten|4,idden|2e,worn|1ear,sen|2,aken|3,ven|2,wn|1,rought|1ing,uilt|3d,urst|4,ealt|3,reamt|4,urt|3,nelt|2el,eapt|3,eft|1ave,eant|3,hot|2ot,pat|1it,et|2,ut|2,it|2,ent|2d,ept|1ep,urned|3,reated|5,eard|3,eld|old,ead|3,lid|3e,old|ell,ped|2ed,pilled|4,ound|ind,ved|2,aid|1y,ug|ig,ung|ing,ade|1ke,hone|1ine,come|4,gone|2,nuck|1eak,unk|ink",
      exceptions:
        "been|2,bled|3ed,bought|1uy,fed|2ed,fled|3e,flown|2y,fought|1ight,had|2ve,hung|1ang,led|2ad,lit|2ght,met|2et,run|3,sat|1eat,seen|3,sought|1eek,woven|1eave,bet|3,brought|2ing,dealt|4,dived|4,heard|4,left|2ave,made|2ke,read|4,shaved|5,slain|3y",
      rev: "uy|ought,ly|1own,ay|1id,rake|1oken,hoose|2sen,reate|5d,lee|2d,reeze|1ozen,aste|4n,rove|4n,hine|1one,lide|3,hrive|5d,come|4,ite|2ten,ide|2den,se|2n,ake|3n,ive|3n,uild|3t,old|eld,ind|ound,eed|1d,end|2t,urn|3ed,ean|3t,un|2,in|un,urst|4,right|5en,eight|5en,urt|3,eet|1t,hoot|2t,pit|1at,eat|3en,get|1otten,set|3,ut|2,it|2,ream|4t,ig|ug,ang|ung,ing|ung,all|3en,neel|2lt,ell|old,pill|4ed,teal|1olen,eap|3t,eep|1pt,ength|5en,ess|3en,hrink|2unken,neak|1uck,eek|ought,peak|1oken,ink|unk,wear|1orn,go|2ne,w|1n",
    }),
    No = jo(Ao),
    Eo = jo(xo),
    To = jo(Do),
    Oo = jo(Io),
    Co = Po({
      rules:
        "ig|2ger,ng|2er,hin|3ner,n|1er,ot|2ter,lat|3ter,t|1er,ray|3er,y|ier,ross|4er,im|2mer,m|1er,f|1er,b|1er,er|2,r|1er,p|1er,h|1er,w|1er,k|1er,l|1er,d|1er,e|1r",
      exceptions:
        "good|better,bad|worse,wet|3ter,lay|3er,neat|4ter,fat|3ter,mad|3der,sad|3der,wide|4r,late|4r,safe|4r,fine|4r,dire|4r,fake|4r,pale|4r,rare|4r,rude|4r,sore|4r",
      rev: "arger|4,esser|5,igger|2,impler|5,reer|3,hinner|3,remier|6,urer|3,aucher|5,almer|3,raver|4,uter|3,iviner|5,erier|4,enuiner|6,rosser|4,uger|3,andomer|5,emoter|5,quarer|5,taler|4,iper|3,hiter|4,rther|5,rmer|2,ayer|2,immer|2,somer|4,amer|3,adder|2,nger|2,fer|1,tler|3,cer|2,ber|1,uer|2,bler|3,tter|1,rer|1,ser|2,per|1,her|1,wer|1,ker|1,ner|1,ler|1,ter|1,der|1,ier|y",
    }),
    Vo = Po({
      rules:
        "east|4,uthwest|7,ot|2test,it|2test,lat|3test,weet|4test,t|1est,ig|2gest,ng|2est,hin|3nest,n|1est,nner|4most,uter|4most,r|1est,rey|3est,ricey|3iest,y|iest,ross|4est,f|1est,b|1est,m|1est,p|1est,h|1est,w|1est,k|1est,l|1est,d|1est,e|1st",
      exceptions:
        "good|best,bad|worst,wet|3test,far|1urthest,gay|3est,neat|4test,shy|3est,fat|3test,late|4st,wide|4st,fine|4st,severe|6st,fake|4st,pale|4st,rare|4st,rude|4st,sore|4st,dire|4st",
      rev: "east|4,argest|4,iggest|2,implest|5,afest|3,uthwest|7,hinnest|3,ncerest|5,urthest|ar,ravest|4,utest|3,eriest|4,rossest|4,dsomest|5,ugest|3,riciest|3ey,emotest|5,quarest|5,rangest|5,ipest|3,urest|3,cest|2,ermost|2,fest|1,best|1,amest|3,itest|3,ngest|2,uest|2,yest|1,tlest|3,mest|1,blest|3,sest|2,pest|1,hest|1,ttest|1,west|1,rest|1,kest|1,nest|1,lest|1,test|1,dest|1,iest|y",
    }),
    zo = {
      fromPast: Ao,
      fromPresent: xo,
      fromGerund: Do,
      fromParticiple: Io,
      toPast: No,
      toPresent: Eo,
      toGerund: To,
      toParticiple: Oo,
      toComparative: Co,
      toSuperlative: Vo,
      fromComparative: jo(Co),
      fromSuperlative: jo(Vo),
    },
    $o = [
      "academy",
      "administration",
      "agence",
      "agences",
      "agencies",
      "agency",
      "airlines",
      "airways",
      "army",
      "assoc",
      "associates",
      "association",
      "assurance",
      "authority",
      "autorite",
      "aviation",
      "bank",
      "banque",
      "board",
      "boys",
      "brands",
      "brewery",
      "brotherhood",
      "brothers",
      "bureau",
      "cafe",
      "co",
      "caisse",
      "capital",
      "care",
      "cathedral",
      "center",
      "centre",
      "chemicals",
      "choir",
      "chronicle",
      "church",
      "circus",
      "clinic",
      "clinique",
      "club",
      "co",
      "coalition",
      "coffee",
      "collective",
      "college",
      "commission",
      "committee",
      "communications",
      "community",
      "company",
      "comprehensive",
      "computers",
      "confederation",
      "conference",
      "conseil",
      "consulting",
      "containers",
      "corporation",
      "corps",
      "corp",
      "council",
      "crew",
      "data",
      "departement",
      "department",
      "departments",
      "design",
      "development",
      "directorate",
      "division",
      "drilling",
      "education",
      "eglise",
      "electric",
      "electricity",
      "energy",
      "ensemble",
      "enterprise",
      "enterprises",
      "entertainment",
      "estate",
      "etat",
      "faculty",
      "federation",
      "financial",
      "fm",
      "foundation",
      "fund",
      "gas",
      "gazette",
      "girls",
      "government",
      "group",
      "guild",
      "herald",
      "holdings",
      "hospital",
      "hotel",
      "hotels",
      "inc",
      "industries",
      "institut",
      "institute",
      "institutes",
      "insurance",
      "international",
      "interstate",
      "investment",
      "investments",
      "investors",
      "journal",
      "laboratory",
      "labs",
      "llc",
      "ltd",
      "limited",
      "machines",
      "magazine",
      "management",
      "marine",
      "marketing",
      "markets",
      "media",
      "memorial",
      "ministere",
      "ministry",
      "military",
      "mobile",
      "motor",
      "motors",
      "musee",
      "museum",
      "news",
      "observatory",
      "office",
      "oil",
      "optical",
      "orchestra",
      "organization",
      "partners",
      "partnership",
      "petrol",
      "petroleum",
      "pharmacare",
      "pharmaceutical",
      "pharmaceuticals",
      "pizza",
      "plc",
      "police",
      "polytechnic",
      "post",
      "power",
      "press",
      "productions",
      "quartet",
      "radio",
      "reserve",
      "resources",
      "restaurant",
      "restaurants",
      "savings",
      "school",
      "securities",
      "service",
      "services",
      "societe",
      "society",
      "sons",
      "subcommittee",
      "syndicat",
      "systems",
      "telecommunications",
      "telegraph",
      "television",
      "times",
      "tribunal",
      "tv",
      "union",
      "university",
      "utilities",
      "workers",
    ].reduce((e, t) => ((e[t] = !0), e), {}),
    Fo = [
      [/([^v])ies$/i, "$1y"],
      [/(ise)s$/i, "$1"],
      [/(kn|[^o]l|w)ives$/i, "$1ife"],
      [
        /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i,
        "$1f",
      ],
      [/^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f"],
      [/(antenn|formul|nebul|vertebr|vit)ae$/i, "$1a"],
      [/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, "$1us"],
      [/(buffal|tomat|tornad)(oes)$/i, "$1o"],
      [/(ause)s$/i, "$1"],
      [/(ease)s$/i, "$1"],
      [/(ious)es$/i, "$1"],
      [/(ouse)s$/i, "$1"],
      [/(ose)s$/i, "$1"],
      [/(..[aeiu]s)es$/i, "$1"],
      [/(vert|ind|cort)(ices)$/i, "$1ex"],
      [/(matr|append)(ices)$/i, "$1ix"],
      [/([xo]|ch|ss|sh)es$/i, "$1"],
      [/men$/i, "man"],
      [/(n)ews$/i, "$1ews"],
      [/([ti])a$/i, "$1um"],
      [/([^aeiouy]|qu)ies$/i, "$1y"],
      [/(s)eries$/i, "$1eries"],
      [/(m)ovies$/i, "$1ovie"],
      [/(cris|ax|test)es$/i, "$1is"],
      [/(alias|status)es$/i, "$1"],
      [/(ss)$/i, "$1"],
      [/(ic)s$/i, "$1"],
      [/s$/i, ""],
    ],
    Bo = function (e, t) {
      const { irregularPlurals: n } = t.two;
      let a =
        ((r = n), Object.keys(r).reduce((e, t) => ((e[r[t]] = t), e), {}));
      var r;
      if (a.hasOwnProperty(e)) return a[e];
      for (let t = 0; t < Fo.length; t++)
        if (!0 === Fo[t][0].test(e)) return e.replace(Fo[t][0], Fo[t][1]);
      return e;
    },
    Mo = {
      toPlural: rr,
      toSingular: Bo,
      all: function (e, t) {
        let n = [e],
          a = rr(e, t);
        a !== e && n.push(a);
        let r = Bo(e, t);
        return r !== e && n.push(r), n;
      },
    },
    So = /^.([0-9]+)/,
    Go = function (e, t, n) {
      if (t.exceptions.hasOwnProperty(e))
        return (
          n && console.log("exception, ", e, t.exceptions[e]),
          (function (e, t) {
            let n = t.exceptions[e],
              a = n.match(So);
            if (null === a) return t.exceptions[e];
            let r = Number(a[1]) || 0;
            return e.substr(0, r) + n.replace(So, "");
          })(e, t)
        );
      let a = t.rules;
      t.reversed && (a = t.rev),
        (a = (function (e, t = {}) {
          let n = t[e[e.length - 1]] || [];
          return t[""] && (n = n.concat(t[""])), n;
        })(e, a));
      for (let t = 0; t < a.length; t += 1) {
        let r = a[t][0];
        if (e.endsWith(r)) {
          n && console.log("rule, ", a[t]);
          let o = new RegExp(r + "$");
          return e.replace(o, a[t][1]);
        }
      }
      return n && console.log(" x - " + e), e;
    };
  let Lo = {
    Gerund: ["ing"],
    Actor: ["erer"],
    Infinitive: [
      "ate",
      "ize",
      "tion",
      "rify",
      "then",
      "ress",
      "ify",
      "age",
      "nce",
      "ect",
      "ise",
      "ine",
      "ish",
      "ace",
      "ash",
      "ure",
      "tch",
      "end",
      "ack",
      "and",
      "ute",
      "ade",
      "ock",
      "ite",
      "ase",
      "ose",
      "use",
      "ive",
      "int",
      "nge",
      "lay",
      "est",
      "ain",
      "ant",
      "ent",
      "eed",
      "er",
      "le",
      "unk",
      "ung",
      "upt",
      "en",
    ],
    PastTense: ["ept", "ed", "lt", "nt", "ew", "ld"],
    PresentTense: [
      "rks",
      "cks",
      "nks",
      "ngs",
      "mps",
      "tes",
      "zes",
      "ers",
      "les",
      "acks",
      "ends",
      "ands",
      "ocks",
      "lays",
      "eads",
      "lls",
      "els",
      "ils",
      "ows",
      "nds",
      "ays",
      "ams",
      "ars",
      "ops",
      "ffs",
      "als",
      "urs",
      "lds",
      "ews",
      "ips",
      "es",
      "ts",
      "ns",
    ],
    Participle: ["ken", "wn"],
  };
  Lo = Object.keys(Lo).reduce(
    (e, t) => (Lo[t].forEach((n) => (e[n] = t)), e),
    {}
  );
  const Ho = Lo,
    qo = function (e) {
      let t = e.substring(e.length - 3);
      if (!0 === Ho.hasOwnProperty(t)) return Ho[t];
      let n = e.substring(e.length - 2);
      return !0 === Ho.hasOwnProperty(n)
        ? Ho[n]
        : "s" === e.substring(e.length - 1)
        ? "PresentTense"
        : null;
    },
    Wo = {
      are: "be",
      were: "be",
      been: "be",
      is: "be",
      am: "be",
      was: "be",
      be: "be",
      being: "be",
    },
    Jo = function (e, t, n) {
      const {
        fromPast: a,
        fromPresent: r,
        fromGerund: o,
        fromParticiple: i,
      } = t.two.models;
      let {
          prefix: s,
          verb: l,
          particle: u,
        } = (function (e, t) {
          let n = "",
            a = {};
          t.one && t.one.prefixes && (a = t.one.prefixes);
          let [r, o] = e.split(/ /);
          return (
            o && !0 === a[r] && ((n = r), (r = o), (o = "")),
            { prefix: n, verb: r, particle: o }
          );
        })(e, t),
        c = "";
      if ((n || (n = qo(e)), Wo.hasOwnProperty(e))) c = Wo[e];
      else if ("Participle" === n) c = Go(l, i);
      else if ("PastTense" === n) c = Go(l, a);
      else if ("PresentTense" === n) c = Go(l, r);
      else {
        if ("Gerund" !== n) return e;
        c = Go(l, o);
      }
      return u && (c += " " + u), s && (c = s + " " + c), c;
    },
    _o = function (e, t) {
      const {
        toPast: n,
        toPresent: a,
        toGerund: r,
        toParticiple: o,
      } = t.two.models;
      if ("be" === e)
        return {
          Infinitive: e,
          Gerund: "being",
          PastTense: "was",
          PresentTense: "is",
        };
      let [i, s] = ((e) => (/ /.test(e) ? e.split(/ /) : [e, ""]))(e),
        l = {
          Infinitive: e,
          PastTense: Go(i, n),
          PresentTense: Go(i, a),
          Gerund: Go(i, r),
          FutureTense: "will " + e,
        },
        u = Go(i, o);
      return (
        u !== e && u !== l.PastTense && (l.Participle = u),
        s &&
          Object.keys(l).forEach((e) => {
            l[e] += " " + s;
          }),
        l
      );
    },
    Ko = {
      toInfinitive: Jo,
      conjugate: _o,
      all: function (e, t) {
        let n = _o(e, t);
        return delete n.FutureTense, Object.values(n).filter((e) => e);
      },
    },
    Uo = function (e, t) {
      const n = t.two.models.toSuperlative;
      return Go(e, n);
    },
    Ro = function (e, t) {
      const n = t.two.models.toComparative;
      return Go(e, n);
    },
    Yo = function (e = "", t = []) {
      const n = e.length;
      for (let a = n <= 6 ? n - 1 : 6; a >= 1; a -= 1) {
        let r = e.substring(n - a, e.length);
        if (!0 === t[r.length].hasOwnProperty(r))
          return e.slice(0, n - a) + t[r.length][r];
      }
      return null;
    },
    Qo = "ically",
    Zo = new Set([
      "analyt" + Qo,
      "chem" + Qo,
      "class" + Qo,
      "clin" + Qo,
      "crit" + Qo,
      "ecolog" + Qo,
      "electr" + Qo,
      "empir" + Qo,
      "frant" + Qo,
      "grammat" + Qo,
      "ident" + Qo,
      "ideolog" + Qo,
      "log" + Qo,
      "mag" + Qo,
      "mathemat" + Qo,
      "mechan" + Qo,
      "med" + Qo,
      "method" + Qo,
      "method" + Qo,
      "mus" + Qo,
      "phys" + Qo,
      "phys" + Qo,
      "polit" + Qo,
      "pract" + Qo,
      "rad" + Qo,
      "satir" + Qo,
      "statist" + Qo,
      "techn" + Qo,
      "technolog" + Qo,
      "theoret" + Qo,
      "typ" + Qo,
      "vert" + Qo,
      "whims" + Qo,
    ]),
    Xo = [
      null,
      {},
      { ly: "" },
      { ily: "y", bly: "ble", ply: "ple" },
      { ally: "al", rply: "rp" },
      {
        ually: "ual",
        ially: "ial",
        cally: "cal",
        eally: "eal",
        rally: "ral",
        nally: "nal",
        mally: "mal",
        eeply: "eep",
        eaply: "eap",
      },
      { ically: "ic" },
    ],
    ei = new Set([
      "early",
      "only",
      "hourly",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "mostly",
      "duly",
      "unduly",
      "especially",
      "undoubtedly",
      "conversely",
      "namely",
      "exceedingly",
      "presumably",
      "accordingly",
      "overly",
      "best",
      "latter",
      "little",
      "long",
      "low",
    ]),
    ti = {
      wholly: "whole",
      fully: "full",
      truly: "true",
      gently: "gentle",
      singly: "single",
      customarily: "customary",
      idly: "idle",
      publically: "public",
      quickly: "fast",
      well: "good",
    },
    ni = [
      null,
      { y: "ily" },
      { ly: "ly", ic: "ically" },
      {
        ial: "ially",
        ual: "ually",
        tle: "tly",
        ble: "bly",
        ple: "ply",
        ary: "arily",
      },
      {},
      {},
      {},
    ],
    ai = {
      cool: "cooly",
      whole: "wholly",
      full: "fully",
      good: "well",
      idle: "idly",
      public: "publicly",
      single: "singly",
      special: "especially",
    },
    ri = function (e) {
      if (ai.hasOwnProperty(e)) return ai[e];
      return Yo(e, ni) || e + "ly";
    },
    oi = [
      null,
      { y: "iness" },
      { le: "ility", al: "ality", ay: "ayness" },
      {
        ial: "y",
        ing: "ment",
        ess: "essness",
        ous: "ousness",
        ive: "ivity",
        ect: "ection",
      },
      {
        ting: "ting",
        ring: "ring",
        cial: "ciality",
        nate: "nation",
        rate: "ration",
        bing: "bingness",
        atic: "acy",
        sing: "se",
        iful: "y",
        ible: "ibility",
      },
      { erate: "eration" },
      { ionate: "ion" },
    ],
    ii = {
      clean: "cleanliness",
      naive: "naivety",
      dramatic: "drama",
      ironic: "irony",
      deep: "depth",
      automatic: "automation",
      simple: "simplicity",
      boring: "boredom",
      free: "freedom",
      wise: "wisdom",
      fortunate: "fortune",
      gentle: "gentleness",
      quiet: "quiet",
      expensive: "expense",
      offensive: "offence",
    },
    si = new Set(["terrible", "annoying"]),
    li = {
      toSuperlative: Uo,
      toComparative: Ro,
      toAdverb: ri,
      toNoun: function (e) {
        if (ii.hasOwnProperty(e)) return ii[e];
        if (si.has(e)) return null;
        return Yo(e, oi) || e + "ness";
      },
      fromAdverb: function (e) {
        return e.endsWith("ly")
          ? Zo.has(e)
            ? e.replace(/ically/, "ical")
            : ei.has(e)
            ? null
            : ti.hasOwnProperty(e)
            ? ti[e]
            : Yo(e, Xo) || e
          : null;
      },
      fromSuperlative: function (e, t) {
        const n = t.two.models.fromSuperlative;
        return Go(e, n);
      },
      fromComparative: function (e, t) {
        const n = t.two.models.fromComparative;
        return Go(e, n);
      },
      all: function (e, t) {
        let n = [e];
        return (
          n.push(Uo(e, t)),
          n.push(Ro(e, t)),
          n.push(ri(e)),
          (n = n.filter((e) => e)),
          (n = new Set(n)),
          Array.from(n)
        );
      },
    },
    ui = { noun: Mo, verb: Ko, adjective: li },
    ci = {
      Singular: (e, t, n, a) => {
        let r = a.one.lexicon,
          o = n.two.transform.noun.toPlural(e, a);
        r[o] || (t[o] = t[o] || "Plural");
      },
      Actor: (e, t, n, a) => {
        let r = a.one.lexicon,
          o = n.two.transform.noun.toPlural(e, a);
        r[o] || (t[o] = t[o] || ["Plural", "Actor"]);
      },
      Comparable: (e, t, n, a) => {
        let r = a.one.lexicon,
          { toSuperlative: o, toComparative: i } = n.two.transform.adjective,
          s = o(e, a);
        r[s] || (t[s] = t[s] || "Superlative");
        let l = i(e, a);
        r[l] || (t[l] = t[l] || "Comparative"), (t[e] = "Adjective");
      },
      Demonym: (e, t, n, a) => {
        let r = n.two.transform.noun.toPlural(e, a);
        t[r] = t[r] || ["Demonym", "Plural"];
      },
      Infinitive: (e, t, n, a) => {
        let r = a.one.lexicon,
          o = n.two.transform.verb.conjugate(e, a);
        Object.entries(o).forEach((e) => {
          r[e[1]] || t[e[1]] || (t[e[1]] = e[0]);
        });
      },
      PhrasalVerb: (e, t, n, a) => {
        let r = a.one.lexicon;
        t[e] = ["PhrasalVerb", "Infinitive"];
        let o = a.one._multiCache,
          [i, s] = e.split(" ");
        r[i] || (t[i] = t[i] || "Infinitive");
        let l = n.two.transform.verb.conjugate(i, a);
        delete l.FutureTense,
          Object.entries(l).forEach((e) => {
            if ("Actor" === e[0] || "" === e[1]) return;
            t[e[1]] || r[e[1]] || (t[e[1]] = e[0]), (o[e[1]] = !0);
            let n = e[1] + " " + s;
            t[n] = t[n] || [e[0], "PhrasalVerb"];
          });
      },
      Multiple: (e, t) => {
        (t[e] = ["Multiple", "Cardinal"]),
          (t[e + "th"] = ["Multiple", "Ordinal"]),
          (t[e + "ths"] = ["Multiple", "Fraction"]);
      },
      Cardinal: (e, t) => {
        t[e] = ["TextValue", "Cardinal"];
      },
      Ordinal: (e, t) => {
        (t[e] = ["TextValue", "Ordinal"]),
          (t[e + "s"] = ["TextValue", "Fraction"]);
      },
    },
    hi = {
      e: [
        "mice",
        "louse",
        "antennae",
        "formulae",
        "nebulae",
        "vertebrae",
        "vitae",
      ],
      i: [
        "tia",
        "octopi",
        "viri",
        "radii",
        "nuclei",
        "fungi",
        "cacti",
        "stimuli",
      ],
      n: ["men"],
      t: ["feet"],
    },
    di = new Set(["formulas", "koalas", "israelis", "menus"]),
    mi = [
      "bus",
      "mas",
      "was",
      "las",
      "ias",
      "xas",
      "vas",
      "cis",
      "lis",
      "nis",
      "ois",
      "ris",
      "sis",
      "tis",
      "xis",
      "aus",
      "cus",
      "eus",
      "fus",
      "gus",
      "ius",
      "lus",
      "nus",
      "ous",
      "pus",
      "rus",
      "sus",
      "tus",
      "xus",
      "'s",
      "ss",
    ],
    pi = function (e) {
      if (!e || e.length <= 3) return !1;
      if (di.has(e)) return !0;
      let t = e[e.length - 1];
      return hi.hasOwnProperty(t)
        ? hi[t].find((t) => e.endsWith(t))
        : "s" === t && !mi.find((t) => e.endsWith(t));
    },
    gi = {
      two: {
        quickSplit: function (e) {
          const t = /[,:;]/;
          let n = [];
          return (
            e.forEach((e) => {
              let a = 0;
              e.forEach((r, o) => {
                t.test(r.post) &&
                  (function (e, t) {
                    let n = e[t];
                    if (!n) return !1;
                    const a = new Set(["may", "april", "august", "jan"]);
                    if ("like" === n.normal || a.has(n.normal)) return !1;
                    if (n.tags.has("Place") || n.tags.has("Date")) return !1;
                    if (e[t - 1]) {
                      let r = e[t - 1];
                      if (r.tags.has("Date") || a.has(r.normal)) return !1;
                      if (r.tags.has("Adjective") || n.tags.has("Adjective"))
                        return !1;
                    }
                    let r = n.normal;
                    return (
                      (1 !== r.length && 2 !== r.length && 4 !== r.length) ||
                      !/^[0-9]+$/.test(r)
                    );
                  })(e, o + 1) &&
                  (n.push(e.slice(a, o + 1)), (a = o + 1));
              }),
                a < e.length && n.push(e.slice(a, e.length));
            }),
            n
          );
        },
        expandLexicon: function (e, t) {
          const { methods: n, model: a } = t;
          let r = {},
            o = {};
          return (
            Object.keys(e).forEach((t) => {
              let i = e[t],
                s = (t = (t = t.toLowerCase().trim()).replace(
                  /'s\b/,
                  ""
                )).split(/ /);
              s.length > 1 && (o[s[0]] = !0),
                !0 === ci.hasOwnProperty(i) && ci[i](t, r, n, a),
                (r[t] = r[t] || i);
            }),
            delete r[""],
            delete r.null,
            delete r[" "],
            { lex: r, _multi: o }
          );
        },
        transform: ui,
        looksPlural: pi,
      },
    },
    fi = function (e, t, n) {
      return Object.entries(e.exceptions).reduce(
        (e, a) => (t && (e[a[0]] = t), (e[a[1]] = n), e),
        {}
      );
    };
  let yi = { two: { models: zo } };
  const bi = {
      "Actor|Verb": "Actor",
      "Adj|Gerund": "Adjective",
      "Adj|Noun": "Adjective",
      "Adj|Past": "Adjective",
      "Adj|Present": "Adjective",
      "Noun|Verb": "Singular",
      "Noun|Gerund": "Gerund",
      "Person|Noun": "Noun",
      "Person|Date": "Month",
      "Person|Verb": "FirstName",
      "Person|Place": "Person",
      "Person|Adj": "Adjective",
      "Plural|Verb": "Plural",
      "Unit|Noun": "Noun",
    },
    vi = function (e, t) {
      const n = { model: t, methods: gi };
      let { lex: a, _multi: r } = gi.two.expandLexicon(e, n);
      return (
        Object.assign(t.one.lexicon, a), Object.assign(t.one._multiCache, r), t
      );
    },
    wi = function (e, t, n) {
      let a = _o(e, yi);
      (t[a.PastTense] = t[a.PastTense] || "PastTense"),
        (t[a.Gerund] = t[a.Gerund] || "Gerund"),
        !0 === n && (t[a.PresentTense] = t[a.PresentTense] || "PresentTense");
    };
  let ki = {
    one: { _multiCache: {}, lexicon: ir },
    two: {
      irregularPlurals: Ra,
      models: zo,
      suffixPatterns: Zr,
      prefixPatterns: no,
      endsWith: go,
      neighbours: bo,
      regexNormal: [
        [/^[\w.]+@[\w.]+\.[a-z]{2,3}$/, "Email"],
        [/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/, "Url", "http.."],
        [
          /^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/,
          "Url",
          ".com",
        ],
        [/^[PMCE]ST$/, "Timezone", "EST"],
        [/^ma?c'.*/, "LastName", "mc'neil"],
        [/^o'[drlkn].*/, "LastName", "o'connor"],
        [/^ma?cd[aeiou]/, "LastName", "mcdonald"],
        [/^(lol)+[sz]$/, "Expression", "lol"],
        [/^wo{2,}a*h?$/, "Expression", "wooah"],
        [/^(hee?){2,}h?$/, "Expression", "hehe"],
        [/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/, "Verb", "un-vite"],
        [/^(m|k|cm|km)\/(s|h|hr)$/, "Unit", "5 k/m"],
        [/^(ug|ng|mg)\/(l|m3|ft3)$/, "Unit", "ug/L"],
      ],
      regexText: [
        [/^#[\p{Number}_]*\p{Letter}/u, "HashTag"],
        [/^@\w{2,}$/, "AtMention"],
        [/^([A-Z]\.){2}[A-Z]?/i, ["Acronym", "Noun"], "F.B.I"],
        [/.{3}[lkmnp]in['‘’‛‵′`´]$/, "Gerund", "chillin'"],
        [/.{4}s['‘’‛‵′`´]$/, "Possessive", "flanders'"],
        [
          /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u,
          "Emoji",
          "emoji-class",
        ],
      ],
      regexNumbers: [
        [/^@1?[0-9](am|pm)$/i, "Time", "3pm"],
        [/^@1?[0-9]:[0-9]{2}(am|pm)?$/i, "Time", "3:30pm"],
        [/^'[0-9]{2}$/, "Year"],
        [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, "Time", "3:12:31"],
        [
          /^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i,
          "Time",
          "1:12pm",
        ],
        [
          /^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i,
          "Time",
          "1:12:31pm",
        ],
        [/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i, "Date", "iso-date"],
        [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, "Date", "iso-dash"],
        [/^[0-9]{1,4}\/[0-9]{1,2}\/([0-9]{4}|[0-9]{2})$/, "Date", "iso-slash"],
        [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, "Date", "iso-dot"],
        [/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i, "Date", "12-dec-2019"],
        [/^utc ?[+-]?[0-9]+$/, "Timezone", "utc-9"],
        [/^(gmt|utc)[+-][0-9]{1,2}$/i, "Timezone", "gmt-3"],
        [/^[0-9]{3}-[0-9]{4}$/, "PhoneNumber", "421-0029"],
        [
          /^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/,
          "PhoneNumber",
          "1-800-",
        ],
        [
          /^[-+]?\p{Currency_Symbol}[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?([kmb]|bn)?\+?$/u,
          ["Money", "Value"],
          "$5.30",
        ],
        [
          /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\p{Currency_Symbol}\+?$/u,
          ["Money", "Value"],
          "5.30£",
        ],
        [
          /^[-+]?[$£]?[0-9]([0-9,.])+(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i,
          ["Money", "Value"],
          "$400usd",
        ],
        [
          /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/,
          ["Cardinal", "NumericValue"],
          "5,999",
        ],
        [
          /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/,
          ["Ordinal", "NumericValue"],
          "53rd",
        ],
        [/^\.[0-9]+\+?$/, ["Cardinal", "NumericValue"], ".73th"],
        [
          /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/,
          ["Percent", "Cardinal", "NumericValue"],
          "-4%",
        ],
        [/^\.[0-9]+%$/, ["Percent", "Cardinal", "NumericValue"], ".3%"],
        [
          /^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/,
          ["Fraction", "NumericValue"],
          "2/3rds",
        ],
        [
          /^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/,
          ["Value", "NumberRange"],
          "3-4",
        ],
        [
          /^[0-9]{1,2}(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9]{1,2}(:[0-9][0-9])?(am|pm)$/,
          ["Time", "NumberRange"],
          "3-4pm",
        ],
        [/^[0-9.]+([a-z°]{1,4})$/, "NumericValue", "9km"],
      ],
      switches: sr,
      clues: Mr,
      uncountable: {},
      orgWords: $o,
    },
  };
  var Pi;
  (Pi = (function (e, t) {
    return (
      Object.keys(e).forEach((n) => {
        "Uncountable" === e[n] &&
          ((t.two.uncountable[n] = !0), (e[n] = "Uncountable"));
      }),
      t
    );
  })((Pi = vi((Pi = ki).one.lexicon, Pi)).one.lexicon, Pi)),
    (Pi = (function (e, t) {
      let n = {};
      const a = t.one.lexicon;
      return (
        Object.keys(e).forEach((r) => {
          const o = e[r];
          if (
            ((n[r] = bi[o]),
            ("Noun|Verb" !== o && "Person|Verb" !== o && "Actor|Verb" !== o) ||
              wi(r, a, !1),
            "Adj|Present" === o &&
              (wi(r, a, !0),
              (function (e, t, n) {
                let a = Uo(e, n);
                t[a] = t[a] || "Superlative";
                let r = Ro(e, n);
                t[r] = t[r] || "Comparative";
              })(r, a, t)),
            "Adj|Gerund" === o || "Noun|Gerund" === o)
          ) {
            let e = Jo(r, yi, "Gerund");
            a[e] || (n[e] = "Infinitive");
          }
          if (
            (("Noun|Gerund" !== o && "Adj|Noun" !== o && "Person|Noun" !== o) ||
              (function (e, t, n) {
                let a = rr(e, n);
                t[a] = t[a] || "Plural";
              })(r, a, t),
            "Adj|Past" === o)
          ) {
            let e = Jo(r, yi, "PastTense");
            a[e] || (n[e] = "Infinitive");
          }
        }),
        (t = vi(n, t))
      );
    })(Pi.two.switches, Pi)),
    (Pi = (function (e) {
      let { lexicon: t } = e.one;
      const {
        toPast: n,
        toPresent: a,
        toGerund: r,
        toSuperlative: o,
        toComparative: i,
      } = e.two.models;
      let s = {},
        l = {};
      return (
        (l = fi(n, "Infinitive", "PastTense")),
        Object.assign(s, l),
        (l = fi(a, "Infinitive", "Verb")),
        Object.assign(s, l),
        (l = fi(r, "Infinitive", "Gerund")),
        Object.assign(s, l),
        (l = fi(o, "Adjective", "Superlative")),
        Object.assign(s, l),
        (l = fi(i, "Adjective", "Comparative")),
        Object.assign(s, l),
        (e.one.lexicon = Object.assign(s, t)),
        e
      );
    })(Pi)),
    (ki = (function (e) {
      const { irregularPlurals: t } = e.two,
        { lexicon: n } = e.one;
      return (
        Object.entries(t).forEach((e) => {
          (n[e[0]] = n[e[0]] || "Singular"), (n[e[1]] = n[e[1]] || "Plural");
        }),
        e
      );
    })(Pi));
  const ji = ki,
    Ai = function (e, t, n, a) {
      const r = a.methods.one.setTag;
      "-" === e[t].post &&
        e[t + 1] &&
        r([e[t], e[t + 1]], "Hyphenated", a, null, "1-punct-hyphen''");
    },
    xi = /^(under|over|mis|re|un|dis|semi)-?/,
    Di = function (e, t, n) {
      const a = n.two.switches;
      let r = e[t];
      if (a.hasOwnProperty(r.normal)) r.switch = a[r.normal];
      else if (xi.test(r.normal)) {
        let e = r.normal.replace(xi, "");
        e.length > 3 && a.hasOwnProperty(e) && (r.switch = a[e]);
      }
    },
    Ii = function (e, t, n) {
      if (!t || 0 === t.length) return;
      const a =
        "undefined" != typeof process && process.env
          ? process.env
          : self.env || {};
      a &&
        a.DEBUG_TAGS &&
        ((e, t, n = "") => {
          let a = e.text || "[" + e.implicit + "]";
          var r;
          "string" != typeof t &&
            t.length > 2 &&
            (t = t.slice(0, 2).join(", #") + " +"),
            (t = "string" != typeof t ? t.join(", #") : t),
            console.log(
              ` ${((r = a), "[33m[3m" + r + "[0m").padEnd(24)} [32m→[0m #${t.padEnd(22)}  ${((
                e
              ) => "[3m" + e + "[0m")(n)}`
            );
        })(e, t, n),
        (e.tags = e.tags || new Set()),
        "string" == typeof t ? e.tags.add(t) : t.forEach((t) => e.tags.add(t));
    },
    Ni = [
      "Acronym",
      "Abbreviation",
      "ProperNoun",
      "Uncountable",
      "Possessive",
      "Pronoun",
      "Activity",
      "Honorific",
    ],
    Ei = function (e, t, n) {
      let a = e[t],
        r = Array.from(a.tags);
      for (let e = 0; e < r.length; e += 1)
        if (n.one.tagSet[r[e]]) {
          let t = n.one.tagSet[r[e]].parents;
          Ii(a, t, ` -inferred by #${r[e]}`);
        }
      !(function (e) {
        !e.tags.has("Noun") ||
          e.tags.has("Plural") ||
          e.tags.has("Singular") ||
          e.tags.has("Date") ||
          Ni.find((t) => e.tags.has(t)) ||
          (pi(e.normal)
            ? Ii(e, "Plural", "3-plural-guess")
            : Ii(e, "Singular", "3-singular-guess"));
      })(a),
        (function (e) {
          let t = e.tags;
          if (t.has("Verb") && 1 === t.size) {
            let t = qo(e.normal);
            t && Ii(e, t, "3-verb-tense-guess");
          }
        })(a);
    },
    Ti = /^\p{Lu}[\p{Ll}'’]/u,
    Oi = /[0-9]/,
    Ci = ["Date", "Month", "WeekDay", "Unit", "Expression"],
    Vi = /[IVX]/,
    zi = /^[IVXLCDM]{2,}$/,
    $i = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
    Fi = { li: !0, dc: !0, md: !0, dm: !0, ml: !0 },
    Bi = function (e, t, n) {
      let a = e[t];
      a.index = a.index || [0, 0];
      let r = a.index[1],
        o = a.text || "";
      return 0 !== r && !0 === Ti.test(o) && !1 === Oi.test(o)
        ? Ci.find((e) => a.tags.has(e)) ||
          a.pre.match(/["']$/) ||
          "the" === a.normal
          ? null
          : (Ei(e, t, n),
            a.tags.has("Noun") || a.tags.clear(),
            Ii(a, "ProperNoun", "2-titlecase"),
            !0)
        : o.length >= 2 &&
          zi.test(o) &&
          Vi.test(o) &&
          $i.test(o) &&
          !Fi[a.normal]
        ? (Ii(a, "RomanNumeral", "2-xvii"), !0)
        : null;
    },
    Mi = function (e = "", t = []) {
      const n = e.length;
      let a = 7;
      n <= a && (a = n - 1);
      for (let r = a; r > 1; r -= 1) {
        let a = e.substring(n - r, n);
        if (!0 === t[a.length].hasOwnProperty(a)) return t[a.length][a];
      }
      return null;
    },
    Si = function (e, t, n) {
      let a = e[t];
      if (0 === a.tags.size) {
        let e = Mi(a.normal, n.two.suffixPatterns);
        if (null !== e) return Ii(a, e, "2-suffix"), (a.confidence = 0.7), !0;
        if (
          a.implicit &&
          ((e = Mi(a.implicit, n.two.suffixPatterns)), null !== e)
        )
          return Ii(a, e, "2-implicit-suffix"), (a.confidence = 0.7), !0;
      }
      return null;
    },
    Gi = /['‘’‛‵′`´]/,
    Li = function (e, t) {
      for (let n = 0; n < t.length; n += 1)
        if (!0 === t[n][0].test(e)) return t[n];
      return null;
    },
    Hi = function (e, t, n, a) {
      const r = a.methods.one.setTag;
      let {
          regexText: o,
          regexNormal: i,
          regexNumbers: s,
          endsWith: l,
        } = n.two,
        u = e[t],
        c = u.machine || u.normal,
        h = u.text;
      Gi.test(u.post) && !Gi.test(u.pre) && (h += u.post.trim());
      let d = Li(h, o) || Li(c, i);
      return (
        !d && /[0-9]/.test(c) && (d = Li(c, s)),
        d ||
          0 !== u.tags.size ||
          (d = (function (e = "", t) {
            let n = e[e.length - 1];
            if (!0 === t.hasOwnProperty(n)) {
              let a = t[n] || [];
              for (let t = 0; t < a.length; t += 1)
                if (!0 === a[t][0].test(e)) return a[t];
            }
            return null;
          })(c, l)),
        d
          ? (r([u], d[1], a, null, `2-regex-'${d[2] || d[0]}'`),
            (u.confidence = 0.6),
            !0)
          : null
      );
    },
    qi = function (e, t, n) {
      let a = e[t];
      if (0 === a.tags.size) {
        let e = (function (e = "", t = []) {
          const n = e.length;
          let a = 7;
          a > n - 3 && (a = n - 3);
          for (let n = a; n > 2; n -= 1) {
            let a = e.substring(0, n);
            if (!0 === t[a.length].hasOwnProperty(a)) return t[a.length][a];
          }
          return null;
        })(a.normal, n.two.prefixPatterns);
        if (null !== e) return Ii(a, e, "2-prefix"), (a.confidence = 0.5), !0;
      }
      return null;
    },
    Wi = new Set([
      "in",
      "on",
      "by",
      "until",
      "for",
      "to",
      "during",
      "throughout",
      "through",
      "within",
      "before",
      "after",
      "of",
      "this",
      "next",
      "last",
      "circa",
      "around",
      "post",
      "pre",
      "budget",
      "classic",
      "plan",
      "may",
    ]),
    Ji = function (e) {
      if (!e) return !1;
      let t = e.normal || e.implicit;
      return (
        !!Wi.has(t) ||
        !!(
          e.tags.has("Date") ||
          e.tags.has("Month") ||
          e.tags.has("WeekDay") ||
          e.tags.has("Year")
        ) ||
        !!e.tags.has("ProperNoun")
      );
    },
    _i = function (e) {
      return !(
        !e ||
        (!e.tags.has("Ordinal") &&
          !(e.tags.has("Cardinal") && e.normal.length < 3) &&
          "is" !== e.normal &&
          "was" !== e.normal)
      );
    },
    Ki = function (e) {
      return (
        e &&
        (e.tags.has("Date") ||
          e.tags.has("Month") ||
          e.tags.has("WeekDay") ||
          e.tags.has("Year"))
      );
    },
    Ui = function (e, t) {
      const n = e[t];
      if (
        n.tags.has("NumericValue") &&
        n.tags.has("Cardinal") &&
        4 === n.normal.length
      ) {
        let a = Number(n.normal);
        if (a && !isNaN(a) && a > 1400 && a < 2100) {
          let r = e[t - 1],
            o = e[t + 1];
          if (Ji(r) || Ji(o)) return Ii(n, "Year", "2-tagYear");
          if (a >= 1920 && a < 2025) {
            if (_i(r) || _i(o)) return Ii(n, "Year", "2-tagYear-close");
            if (Ki(e[t - 2]) || Ki(e[t + 2]))
              return Ii(n, "Year", "2-tagYear-far");
            if (
              r &&
              (r.tags.has("Determiner") || r.tags.has("Possessive")) &&
              o &&
              o.tags.has("Noun") &&
              !o.tags.has("Plural")
            )
              return Ii(n, "Year", "2-tagYear-noun");
          }
        }
      }
      return null;
    },
    Ri = function (e, t, n, a) {
      const r = a.methods.one.setTag,
        o = e[t],
        i = ["PastTense", "PresentTense", "Auxiliary", "Modal", "Particle"];
      o.tags.has("Verb") &&
        (i.find((e) => o.tags.has(e)) ||
          r([o], "Infinitive", a, null, "2-verb-type''"));
    },
    Yi = /^[A-Z]('s|,)?$/,
    Qi = /^[A-Z-]+$/,
    Zi = /^[A-Z]+s$/,
    Xi = /([A-Z]\.)+[A-Z]?,?$/,
    es = /[A-Z]{2,}('s|,)?$/,
    ts = /([a-z]\.)+[a-z]\.?$/,
    ns = { I: !0, A: !0 },
    as = { la: !0, ny: !0, us: !0, dc: !0, gb: !0 },
    rs = function (e, t, n) {
      let a = e[t];
      return a.tags.has("RomanNumeral") || a.tags.has("Acronym")
        ? null
        : (function (e, t) {
            let n = e.text;
            if (!1 === Qi.test(n)) {
              if (!(n.length > 3 && !0 === Zi.test(n))) return !1;
              n = n.replace(/s$/, "");
            }
            return !(
              n.length > 5 ||
              ns.hasOwnProperty(n) ||
              t.one.lexicon.hasOwnProperty(e.normal) ||
              (!0 !== Xi.test(n) &&
                !0 !== ts.test(n) &&
                !0 !== Yi.test(n) &&
                !0 !== es.test(n))
            );
          })(a, n)
        ? (a.tags.clear(),
          Ii(a, ["Acronym", "Noun"], "3-no-period-acronym"),
          !0 === as[a.normal] && Ii(a, "Place", "3-place-acronym"),
          !0 === Zi.test(a.text) && Ii(a, "Plural", "3-plural-acronym"),
          !0)
        : !ns.hasOwnProperty(a.text) && Yi.test(a.text)
        ? (a.tags.clear(),
          Ii(a, ["Acronym", "Noun"], "3-one-letter-acronym"),
          !0)
        : a.tags.has("Organization") && a.text.length <= 3
        ? (Ii(a, "Acronym", "3-org-acronym"), !0)
        : a.tags.has("Organization") && Qi.test(a.text) && a.text.length <= 6
        ? (Ii(a, "Acronym", "3-titlecase-acronym"), !0)
        : null;
    },
    os = function (e, t) {
      if (!e) return null;
      let n = t.find((t) => e.normal === t[0]);
      return n ? n[1] : null;
    },
    is = function (e, t) {
      if (!e) return null;
      let n = t.find((t) => e.tags.has(t[0]));
      return n ? n[1] : null;
    },
    ss = function (e, t, n) {
      const {
        leftTags: a,
        leftWords: r,
        rightWords: o,
        rightTags: i,
      } = n.two.neighbours;
      let s = e[t];
      if (0 === s.tags.size) {
        let l = null;
        if (
          ((l = l || os(e[t - 1], r)),
          (l = l || os(e[t + 1], o)),
          (l = l || is(e[t - 1], a)),
          (l = l || is(e[t + 1], i)),
          l)
        )
          return (
            Ii(s, l, "3-[neighbour]"), Ei(e, t, n), (e[t].confidence = 0.2), !0
          );
      }
      return null;
    },
    ls = function (e, t, n) {
      return (
        !!e &&
        !e.tags.has("FirstName") &&
        !e.tags.has("Place") &&
        (!!(
          e.tags.has("ProperNoun") ||
          e.tags.has("Organization") ||
          e.tags.has("Acronym")
        ) ||
          (!(n || ((a = e.text), !/^\p{Lu}[\p{Ll}'’]/u.test(a))) &&
            (0 !== t || e.tags.has("Singular"))))
      );
      var a;
    },
    us = function (e, t, n, a) {
      const r = n.model.two.orgWords,
        o = n.methods.one.setTag;
      let i = e[t];
      if (!0 === r[i.machine || i.normal] && ls(e[t - 1], t - 1, a)) {
        o([e[t]], "Organization", n, null, "3-[org-word]");
        for (let r = t; r >= 0 && ls(e[r], r, a); r -= 1)
          o([e[r]], "Organization", n, null, "3-[org-word]");
      }
      return null;
    },
    cs = function (e, t, n) {
      let a = !1,
        r = e[t].tags;
      (0 === r.size ||
        (1 === r.size &&
          (r.has("Hyphenated") || r.has("HashTag") || r.has("Prefix")))) &&
        (a = !0),
        a &&
          (Ii(e[t], "Noun", "3-[fallback]"),
          Ei(e, t, n),
          (e[t].confidence = 0.1));
    },
    hs = /^[A-Z][a-z]/,
    ds = (e, t) =>
      e[t].tags.has("ProperNoun") && hs.test(e[t].text) ? "Noun" : null,
    ms = (e, t, n) => (0 !== t || e[1] ? null : n),
    ps = {
      "Adj|Gerund": (e, t) => ds(e, t),
      "Adj|Noun": (e, t) =>
        ds(e, t) ||
        (function (e, t) {
          return !e[t + 1] && e[t - 1] && e[t - 1].tags.has("Determiner")
            ? "Noun"
            : null;
        })(e, t),
      "Actor|Verb": (e, t) => ds(e, t),
      "Adj|Past": (e, t) => ds(e, t),
      "Adj|Present": (e, t) => ds(e, t),
      "Noun|Gerund": (e, t) => ds(e, t),
      "Noun|Verb": (e, t) => ds(e, t) || ms(e, t, "Infinitive"),
      "Plural|Verb": (e, t) =>
        ds(e, t) ||
        ms(e, t, "PresentTense") ||
        (function (e, t, n) {
          return 0 === t && e.length > 3 ? "Plural" : null;
        })(e, t),
      "Person|Noun": (e, t) => ds(e, t),
      "Person|Verb": (e, t) => (0 !== t ? ds(e, t) : null),
      "Person|Adj": (e, t) =>
        (0 === t && e.length > 1) || ds(e, t) ? "Person" : null,
    },
    gs = ps,
    fs =
      "undefined" != typeof process && process.env
        ? process.env
        : self.env || {},
    ys = /^(under|over|mis|re|un|dis|semi)-?/,
    bs = (e, t) => {
      if (!e || !t) return null;
      let n = e.normal || e.implicit,
        a = null;
      return (
        t.hasOwnProperty(n) && (a = t[n]),
        a && fs.DEBUG_TAGS && console.log(`\n  [2m[3m     ↓ - '${n}' [0m`),
        a
      );
    },
    vs = (e, t = {}, n) => {
      if (!e || !t) return null;
      let a = Array.from(e.tags).sort((e, t) =>
          (n[e] ? n[e].parents.length : 0) > (n[t] ? n[t].parents.length : 0)
            ? -1
            : 1
        ),
        r = a.find((e) => t[e]);
      return (
        r &&
          fs.DEBUG_TAGS &&
          console.log(`  [2m[3m      ↓ - '${e.normal || e.implicit}' (#${r})  [0m`),
        (r = t[r]),
        r
      );
    },
    ws = function (e, t, n) {
      const a = n.model,
        r = n.methods.one.setTag,
        { switches: o, clues: i } = a.two,
        s = e[t];
      let l = s.normal || s.implicit || "";
      if ((ys.test(l) && !o[l] && (l = l.replace(ys, "")), s.switch)) {
        let o = s.switch;
        if (s.tags.has("Acronym") || s.tags.has("PhrasalVerb")) return;
        let u = (function (e, t, n, a) {
          if (!n) return null;
          const r = a.one.tagSet;
          let o = bs(e[t + 1], n.afterWords);
          return (
            (o = o || bs(e[t - 1], n.beforeWords)),
            (o = o || vs(e[t - 1], n.beforeTags, r)),
            (o = o || vs(e[t + 1], n.afterTags, r)),
            o
          );
        })(e, t, i[o], a);
        gs[o] && (u = gs[o](e, t) || u),
          u
            ? (r([s], u, n, null, `3-[switch] (${o})`), Ei(e, t, a))
            : fs.DEBUG_TAGS && console.log(`\n -> X  - '${l}'  : (${o})  `);
      }
    },
    ks = { there: !0, this: !0, it: !0, him: !0, her: !0, us: !0 },
    Ps = function (e) {
      if (e.filter((e) => !e.tags.has("ProperNoun")).length <= 3) return !1;
      const t = /^[a-z]/;
      return e.every((e) => !t.test(e.text));
    },
    js = function (e, t, n, a) {
      for (let r = 0; r < e.length; r += 1)
        Di(e, r, t),
          !1 === a && Bi(e, r, t),
          Si(e, r, t),
          Hi(e, r, t, n),
          qi(e, r, t),
          Ui(e, r);
    },
    As = function (e, t, n, a) {
      for (let n = 0; n < e.length; n += 1) {
        let a = rs(e, n, t);
        Ei(e, n, t), (a = a || ss(e, n, t)), (a = a || cs(e, n, t));
      }
      for (let t = 0; t < e.length; t += 1)
        us(e, t, n, a), ws(e, t, n), Ri(e, t, 0, n), Ai(e, t, 0, n);
      !(function (e, t) {
        const n = t.methods.one.setTag,
          a = t.model.one._multiCache || {};
        let r = e[0];
        if (
          ("Noun|Verb" === r.switch || r.tags.has("Infinitive")) &&
          e.length >= 2
        ) {
          if (e.length < 4 && !ks[e[1].normal]) return;
          if (!r.tags.has("PhrasalVerb") && a.hasOwnProperty(r.normal)) return;
          (e[1].tags.has("Noun") || e[1].tags.has("Determiner")) &&
            ((e.slice(1, 3).some((e) => e.tags.has("Verb")) &&
              !r.tags.has("#PhrasalVerb")) ||
              n([r], "Imperative", t, null, "3-[imperative]"));
        }
      })(e, n);
    },
    xs = {
      Possessive: (e) => {
        let t = e.machine || e.normal || e.text;
        return (t = t.replace(/'s$/, "")), t;
      },
      Plural: (e, t) => {
        let n = e.machine || e.normal || e.text;
        return t.methods.two.transform.noun.toSingular(n, t.model);
      },
      Copula: () => "is",
      PastTense: (e, t) => {
        let n = e.machine || e.normal || e.text;
        return t.methods.two.transform.verb.toInfinitive(
          n,
          t.model,
          "PastTense"
        );
      },
      Gerund: (e, t) => {
        let n = e.machine || e.normal || e.text;
        return t.methods.two.transform.verb.toInfinitive(n, t.model, "Gerund");
      },
      PresentTense: (e, t) => {
        let n = e.machine || e.normal || e.text;
        return e.tags.has("Infinitive")
          ? n
          : t.methods.two.transform.verb.toInfinitive(
              n,
              t.model,
              "PresentTense"
            );
      },
      Comparative: (e, t) => {
        let n = e.machine || e.normal || e.text;
        return t.methods.two.transform.adjective.fromComparative(n, t.model);
      },
      Superlative: (e, t) => {
        let n = e.machine || e.normal || e.text;
        return t.methods.two.transform.adjective.fromSuperlative(n, t.model);
      },
      Adverb: (e, t) => {
        const { fromAdverb: n } = t.methods.two.transform.adjective;
        return n(e.machine || e.normal || e.text);
      },
    },
    Ds = {
      Adverb: "RB",
      Comparative: "JJR",
      Superlative: "JJS",
      Adjective: "JJ",
      TO: "Conjunction",
      Modal: "MD",
      Auxiliary: "MD",
      Gerund: "VBG",
      PastTense: "VBD",
      Participle: "VBN",
      PresentTense: "VBZ",
      Infinitive: "VB",
      Particle: "RP",
      Verb: "VB",
      Pronoun: "PRP",
      Cardinal: "CD",
      Conjunction: "CC",
      Determiner: "DT",
      Preposition: "IN",
      QuestionWord: "WP",
      Expression: "UH",
      Possessive: "POS",
      ProperNoun: "NNP",
      Person: "NNP",
      Place: "NNP",
      Organization: "NNP",
      Singular: "NNP",
      Plural: "NNS",
      Noun: "NN",
      There: "EX",
    },
    Is = {
      preTagger: function (e) {
        const { methods: t, model: n, world: a } = e;
        let r = e.docs;
        !(function (e, t, n) {
          e.forEach((e) => {
            !(function (e, t, n, a) {
              const r = a.methods.one.setTag;
              if (0 === t && e.length >= 3) {
                const t = /:/;
                if (e[0].post.match(t)) {
                  let t = e[1];
                  if (
                    t.tags.has("Value") ||
                    t.tags.has("Email") ||
                    t.tags.has("PhoneNumber")
                  )
                    return;
                  r([e[0]], "Expression", a, null, "2-punct-colon''");
                }
              }
            })(e, 0, 0, n);
            for (let t = 0; t < e.length; t += 1);
          });
        })(r, 0, a);
        let o = t.two.quickSplit(r);
        for (let e = 0; e < o.length; e += 1) {
          let t = o[e];
          const r = Ps(t);
          js(t, n, a, r), As(t, n, a, r);
        }
        return o;
      },
      root: function (e) {
        const t = e.world,
          n = Object.keys(xs);
        e.docs.forEach((e) => {
          for (let a = 0; a < e.length; a += 1) {
            const r = e[a];
            for (let e = 0; e < n.length; e += 1)
              if (r.tags.has(n[e])) {
                let a = (0, xs[n[e]])(r, t);
                r.normal !== a && (r.root = a);
                break;
              }
          }
        });
      },
      penn: function (e) {
        e.compute("tagRank"),
          e.docs.forEach((e) => {
            e.forEach((e) => {
              e.penn = (function (e) {
                if (e.tags.has("ProperNoun") && e.tags.has("Plural"))
                  return "NNPS";
                if (e.tags.has("Possessive") && e.tags.has("Pronoun"))
                  return "PRP$";
                if ("there" === e.normal) return "EX";
                if ("to" === e.normal) return "TO";
                let t = e.tagRank || [];
                for (let e = 0; e < t.length; e += 1)
                  if (Ds.hasOwnProperty(t[e])) return Ds[t[e]];
                return null;
              })(e);
            });
          });
      },
    },
    Ns = ["Person", "Place", "Organization"],
    Es = {
      Noun: { not: ["Verb", "Adjective", "Adverb", "Value", "Determiner"] },
      Singular: { is: "Noun", not: ["Plural", "Uncountable"] },
      ProperNoun: { is: "Noun" },
      Person: {
        is: "Singular",
        also: ["ProperNoun"],
        not: ["Place", "Organization", "Date"],
      },
      FirstName: { is: "Person" },
      MaleName: { is: "FirstName", not: ["FemaleName", "LastName"] },
      FemaleName: { is: "FirstName", not: ["MaleName", "LastName"] },
      LastName: { is: "Person", not: ["FirstName"] },
      Honorific: { is: "Person", not: ["FirstName", "LastName", "Value"] },
      Place: { is: "Singular", not: ["Person", "Organization"] },
      Country: { is: "Place", also: ["ProperNoun"], not: ["City"] },
      City: { is: "Place", also: ["ProperNoun"], not: ["Country"] },
      Region: { is: "Place", also: ["ProperNoun"] },
      Address: {},
      Organization: { is: "ProperNoun", not: ["Person", "Place"] },
      SportsTeam: { is: "Organization" },
      School: { is: "Organization" },
      Company: { is: "Organization" },
      Plural: { is: "Noun", not: ["Singular", "Uncountable"] },
      Uncountable: { is: "Noun" },
      Pronoun: { is: "Noun", not: Ns },
      Actor: { is: "Noun", not: ["Place", "Organization"] },
      Activity: { is: "Noun", not: ["Person", "Place"] },
      Unit: { is: "Noun", not: Ns },
      Demonym: { is: "Noun", also: ["ProperNoun"], not: Ns },
      Possessive: { is: "Noun" },
      Reflexive: { is: "Pronoun" },
    };
  let Ts = Object.assign(
    {},
    Es,
    {
      Verb: { not: ["Noun", "Adjective", "Adverb", "Value", "Expression"] },
      PresentTense: { is: "Verb", not: ["PastTense"] },
      Infinitive: { is: "PresentTense", not: ["Gerund"] },
      Imperative: { is: "Infinitive", not: ["PastTense", "Gerund", "Copula"] },
      Gerund: { is: "PresentTense", not: ["Copula"] },
      PastTense: { is: "Verb", not: ["PresentTense", "Gerund"] },
      Copula: { is: "Verb" },
      Modal: { is: "Verb", not: ["Infinitive"] },
      Participle: { is: "PastTense" },
      Auxiliary: {
        is: "Verb",
        not: ["PastTense", "PresentTense", "Gerund", "Conjunction"],
      },
      PhrasalVerb: { is: "Verb" },
      Particle: {
        is: "PhrasalVerb",
        not: ["PastTense", "PresentTense", "Copula", "Gerund"],
      },
      Passive: { is: "Verb" },
    },
    {
      Value: { not: ["Verb", "Adjective", "Adverb"] },
      Ordinal: { is: "Value", not: ["Cardinal"] },
      Cardinal: { is: "Value", not: ["Ordinal"] },
      Fraction: { is: "Value", not: ["Noun"] },
      Multiple: { is: "TextValue" },
      RomanNumeral: { is: "Cardinal", not: ["TextValue"] },
      TextValue: { is: "Value", not: ["NumericValue"] },
      NumericValue: { is: "Value", not: ["TextValue"] },
      Money: { is: "Cardinal" },
      Percent: { is: "Value" },
    },
    {
      Date: { not: ["Verb", "Adverb", "Adjective"] },
      Month: { is: "Date", also: ["Noun"], not: ["Year", "WeekDay", "Time"] },
      WeekDay: { is: "Date", also: ["Noun"] },
      Year: { is: "Date", not: ["RomanNumeral"] },
      FinancialQuarter: { is: "Date", not: "Fraction" },
      Holiday: { is: "Date", also: ["Noun"] },
      Season: { is: "Date" },
      Timezone: { is: "Date", also: ["Noun"], not: ["ProperNoun"] },
      Time: { is: "Date", not: ["AtMention"] },
      Duration: { is: "Date", also: ["Noun"] },
    },
    {
      Adjective: { not: ["Noun", "Verb", "Adverb", "Value"] },
      Comparable: { is: "Adjective" },
      Comparative: { is: "Adjective" },
      Superlative: { is: "Adjective", not: ["Comparative"] },
      NumberRange: {},
      Adverb: { not: ["Noun", "Verb", "Adjective", "Value"] },
      Determiner: {
        not: [
          "Noun",
          "Verb",
          "Adjective",
          "Adverb",
          "QuestionWord",
          "Conjunction",
        ],
      },
      Conjunction: {
        not: ["Noun", "Verb", "Adjective", "Adverb", "Value", "QuestionWord"],
      },
      Preposition: {
        not: [
          "Noun",
          "Verb",
          "Adjective",
          "Adverb",
          "QuestionWord",
          "Determiner",
        ],
      },
      QuestionWord: { not: ["Determiner"] },
      Currency: { is: "Noun" },
      Expression: { not: ["Noun", "Adjective", "Verb", "Adverb"] },
      Abbreviation: {},
      Url: {
        not: [
          "HashTag",
          "PhoneNumber",
          "Verb",
          "Adjective",
          "Value",
          "AtMention",
          "Email",
        ],
      },
      PhoneNumber: {
        not: ["HashTag", "Verb", "Adjective", "Value", "AtMention", "Email"],
      },
      HashTag: {},
      AtMention: { is: "Noun", not: ["HashTag", "Email"] },
      Emoji: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] },
      Emoticon: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] },
      Email: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] },
      Acronym: { not: ["Plural", "RomanNumeral"] },
      Negative: { not: ["Noun", "Adjective", "Value", "Expression"] },
      Condition: { not: ["Verb", "Adjective", "Noun", "Value"] },
      There: {
        not: [
          "Verb",
          "Adjective",
          "Noun",
          "Value",
          "Conjunction",
          "Preposition",
        ],
      },
      Prefix: { not: ["Abbreviation", "Acronym", "ProperNoun"] },
      Hyphenated: {},
    }
  );
  const Os = {
      compute: Is,
      methods: gi,
      model: ji,
      tags: Ts,
      hooks: ["preTagger"],
    },
    Cs = /[,)"';:\-–—.…]/,
    Vs = function (e, t) {
      if (!e.found) return;
      let n = e.termList();
      for (let e = 0; e < n.length - 1; e++) {
        const t = n[e];
        if (Cs.test(t.post)) return;
      }
      (n[0].implicit = n[0].normal),
        (n[0].text += t),
        (n[0].normal += t),
        n.slice(1).forEach((e) => {
          (e.implicit = e.normal), (e.text = ""), (e.normal = "");
        });
      for (let e = 0; e < n.length - 1; e++)
        n[e].post = n[e].post.replace(/ /, "");
    },
    zs = function () {
      let e = this.not("@hasContraction"),
        t = e.match("(we|they|you) are");
      return (
        Vs(t, "'re"),
        (t = e.match("(he|she|they|it|we|you) will")),
        Vs(t, "'ll"),
        (t = e.match("(he|she|they|it|we) is")),
        Vs(t, "'s"),
        (t = e.match("#Person is")),
        Vs(t, "'s"),
        (t = e.match("#Person would")),
        Vs(t, "'d"),
        (t = e.match(
          "(is|was|had|would|should|could|do|does|have|has|can) not"
        )),
        Vs(t, "n't"),
        (t = e.match("(i|we|they) have")),
        Vs(t, "'ve"),
        (t = e.match("(would|should|could) have")),
        Vs(t, "'ve"),
        (t = e.match("i am")),
        Vs(t, "'m"),
        (t = e.match("going to")),
        this
      );
    },
    $s = /^\p{Lu}[\p{Ll}'’]/u,
    Fs = function (e, t, n) {
      let [a, r] = t;
      n &&
        0 !== n.length &&
        ((n = n.map(
          (e, t) => (
            (e.implicit = e.text),
            (e.machine = e.text),
            (e.pre = ""),
            (e.post = ""),
            (e.text = ""),
            (e.normal = ""),
            (e.index = [a, r + t]),
            e
          )
        )),
        n[0] &&
          ((n[0].pre = e[a][r].pre),
          (n[n.length - 1].post = e[a][r].post),
          (n[0].text = e[a][r].text),
          (n[0].normal = e[a][r].normal)),
        e[a].splice(r, 1, ...n));
    },
    Bs = /'/,
    Ms = /'/,
    Ss = { that: !0, there: !0, let: !0, here: !0, everywhere: !0 },
    Gs = { in: !0, by: !0, for: !0 },
    Ls = /'/,
    Hs = function (e, t, n, a) {
      let r = t.update();
      r.document = [e];
      let o = n + a;
      n > 0 && (n -= 1),
        e[o] && (o += 1),
        (r.ptrs = [[0, n, o]]),
        r.compute(["lexicon", "preTagger"]),
        (function (e) {
          e.forEach((e, t) => {
            e.index && (e.index[1] = t);
          });
        })(e);
    },
    qs = {
      d: (e, t) =>
        (function (e, t) {
          let n = e[t].normal.split(Ms)[0];
          return "how" === n || "what" === n
            ? [n, "did"]
            : !0 ===
              ((e, t) =>
                !(!e[t + 1] || "better" != e[t + 1].normal) ||
                e.slice(t + 1, t + 3).some((e) => e.tags.has("PastTense")))(
                e,
                t
              )
            ? [n, "had"]
            : [n, "would"];
        })(e, t),
      t: (e, t) =>
        (function (e, t) {
          if ("ain't" === e[t].normal || "aint" === e[t].normal) {
            if (e[t + 1] && "never" === e[t + 1].normal) return ["have"];
            let n = (function (e, t) {
              for (let n = t - 1; n >= 0; n -= 1)
                if (
                  e[n].tags.has("Noun") ||
                  e[n].tags.has("Pronoun") ||
                  e[n].tags.has("Plural") ||
                  e[n].tags.has("Singular")
                )
                  return e[n];
              return null;
            })(e, t);
            if (n) {
              if ("we" === n.normal || "they" === n.normal)
                return ["are", "not"];
              if ("i" === n.normal) return ["am", "not"];
              if (n.tags && n.tags.has("Plural")) return ["are", "not"];
            }
            return ["is", "not"];
          }
          return [e[t].normal.replace(/n't/, ""), "not"];
        })(e, t),
      s: (e, t, n) =>
        ((e, t) => {
          let n = e[t];
          if (Ss.hasOwnProperty(n.machine || n.normal)) return !1;
          if (n.tags.has("Possessive")) return !0;
          if (n.tags.has("QuestionWord")) return !1;
          if ("he's" === n.normal || "she's" === n.normal) return !1;
          let a = e[t + 1];
          if (!a) return !0;
          if ("it's" === n.normal) return !!a.tags.has("#Noun");
          if (a.tags.has("Verb"))
            return !!a.tags.has("Infinitive") || !!a.tags.has("PresentTense");
          if (a.tags.has("Noun")) {
            let e = a.machine || a.normal;
            return !(
              "here" === e ||
              "there" === e ||
              "everywhere" === e ||
              a.tags.has("Possessive") ||
              (a.tags.has("ProperNoun") && !n.tags.has("ProperNoun"))
            );
          }
          if (e[t - 1] && !0 === Gs[e[t - 1].normal]) return !0;
          let r = e[t + 2];
          return (
            !(!r || !r.tags.has("Noun") || r.tags.has("Pronoun")) ||
            (a.tags.has("Adjective") ||
              a.tags.has("Adverb") ||
              a.tags.has("Verb"),
            !1)
          );
        })(e, t)
          ? n.methods.one.setTag([e[t]], "Possessive", n, "2-contraction")
          : (function (e, t) {
              let n = e[t].normal.split(Bs)[0];
              if (
                ((e, t) =>
                  e.slice(t + 1, t + 3).some((e) => e.tags.has("PastTense")))(
                  e,
                  t
                )
              )
                return [n, "has"];
              if ("let" === n) return [n, "us"];
              if ("there" === n) {
                let a = e[t + 1];
                if (a && a.tags.has("Plural")) return [n, "are"];
              }
              return [n, "is"];
            })(e, t),
    },
    Ws = function (e, t) {
      let n = t.fromText(e.join(" "));
      return n.compute("id"), n.docs[0];
    },
    Js = {
      contractionTwo: (e) => {
        let { world: t, document: n } = e;
        n.forEach((a, r) => {
          for (let o = a.length - 1; o >= 0; o -= 1) {
            if (a[o].implicit) return;
            let i = null;
            !0 === Ls.test(a[o].normal) && ([, i] = a[o].normal.split(Ls));
            let s = null;
            qs.hasOwnProperty(i) && (s = qs[i](a, o, t)),
              s && ((s = Ws(s, e)), Fs(n, [r, o], s), Hs(n[r], e, o, s.length));
          }
        });
      },
    },
    _s = {
      compute: Js,
      api: function (e) {
        class t extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = "Contraction");
          }
          expand() {
            return (
              this.docs.forEach((e) => {
                let t = $s.test(e[0].text);
                e.forEach((t, n) => {
                  (t.text = t.implicit),
                    delete t.implicit,
                    n < e.length - 1 && "" === t.post && (t.post += " "),
                    (t.dirty = !0);
                }),
                  t &&
                    (e[0].text = (function (e = "") {
                      return e.replace(/^ *[a-z\u00C0-\u00FF]/, (e) =>
                        e.toUpperCase()
                      );
                    })(e[0].text));
              }),
              this.compute("normal"),
              this
            );
          }
        }
        (e.prototype.contractions = function () {
          let e = this.match("@hasContraction+");
          return new t(this.document, e.pointer);
        }),
          (e.prototype.contract = zs);
      },
      hooks: ["contractionTwo"],
    },
    Ks = "(i|we|they)";
  let Us = [].concat(
      [
        {
          match: "(got|were|was|is|are|am) (#PastTense|#Participle)",
          tag: "Passive",
          reason: "got-walked",
        },
        {
          match: "(was|were|is|are|am) being (#PastTense|#Participle)",
          tag: "Passive",
          reason: "was-being",
        },
        {
          match: "(had|have|has) been (#PastTense|#Participle)",
          tag: "Passive",
          reason: "had-been",
        },
        {
          match: "will be being? (#PastTense|#Participle)",
          tag: "Passive",
          reason: "will-be-cleaned",
        },
        {
          match: "#Noun [(#PastTense|#Participle)] by (the|a) #Noun",
          group: 0,
          tag: "Passive",
          reason: "suffered-by",
        },
      ],
      [
        {
          match: "[(all|both)] #Determiner #Noun",
          group: 0,
          tag: "Noun",
          reason: "all-noun",
        },
        {
          match: "#Copula [(just|alone)]$",
          group: 0,
          tag: "Adjective",
          reason: "not-adverb",
        },
        {
          match: "#Singular is #Adverb? [#PastTense$]",
          group: 0,
          tag: "Adjective",
          reason: "is-filled",
        },
        {
          match: "[#PastTense] #Singular is",
          group: 0,
          tag: "Adjective",
          reason: "smoked-poutine",
        },
        {
          match: "[#PastTense] #Plural are",
          group: 0,
          tag: "Adjective",
          reason: "baked-onions",
        },
        {
          match: "well [#PastTense]",
          group: 0,
          tag: "Adjective",
          reason: "well-made",
        },
        {
          match: "#Copula [fucked up?]",
          group: 0,
          tag: "Adjective",
          reason: "swears-adjective",
        },
        {
          match: "#Singular (seems|appears) #Adverb? [#PastTense$]",
          group: 0,
          tag: "Adjective",
          reason: "seems-filled",
        },
        {
          match: "#Copula #Adjective? [(out|in|through)]$",
          group: 0,
          tag: "Adjective",
          reason: "still-out",
        },
        {
          match: "^[#Adjective] (the|your) #Noun",
          group: 0,
          notIf: "(all|even)",
          tag: "Infinitive",
          reason: "shut-the",
        },
        {
          match: "the [said] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "the-said-card",
        },
        {
          match:
            "[#Hyphenated (#Hyphenated && #PastTense)] (#Noun|#Conjunction)",
          group: 0,
          tag: "Adjective",
          notIf: "#Adverb",
          reason: "faith-based",
        },
        {
          match: "[#Hyphenated (#Hyphenated && #Gerund)] (#Noun|#Conjunction)",
          group: 0,
          tag: "Adjective",
          notIf: "#Adverb",
          reason: "self-driving",
        },
        {
          match:
            "[#PastTense (#Hyphenated && #PhrasalVerb)] (#Noun|#Conjunction)",
          group: 0,
          tag: "Adjective",
          reason: "dammed-up",
        },
        {
          match: "(#Hyphenated && #Value) fold",
          tag: "Adjective",
          reason: "two-fold",
        },
        {
          match: "must (#Hyphenated && #Infinitive)",
          tag: "Adjective",
          reason: "must-win",
        },
        {
          match: "(#Hyphenated && #Infinitive) #Hyphenated",
          tag: "Adjective",
          notIf: "#PhrasalVerb",
          reason: "vacuum-sealed",
        },
        { match: "too much", tag: "Adverb Adjective", reason: "bit-4" },
        {
          match: "a bit much",
          tag: "Determiner Adverb Adjective",
          reason: "bit-3",
        },
        {
          match:
            "[(un|contra|extra|inter|intra|macro|micro|mid|mis|mono|multi|pre|sub|tri|ex)] #Adjective",
          group: 0,
          tag: ["Adjective", "Prefix"],
          reason: "un-skilled",
        },
      ],
      [
        {
          match: "#Adverb [#Adverb] (and|or|then)",
          group: 0,
          tag: "Adjective",
          reason: "kinda-sparkly-and",
        },
        {
          match:
            "[(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "dark-green",
        },
        {
          match: "#Copula [far too] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "far-too",
        },
        {
          match: "#Copula [still] (in|#Gerund|#Adjective)",
          group: 0,
          tag: "Adverb",
          reason: "was-still-walking",
        },
      ],
      [
        {
          match: "(a|an) [#Gerund]",
          group: 0,
          tag: "Adjective",
          reason: "a|an",
        },
        {
          match: "as [#Gerund] as",
          group: 0,
          tag: "Adjective",
          reason: "as-gerund-as",
        },
        {
          match: "more [#Gerund] than",
          group: 0,
          tag: "Adjective",
          reason: "more-gerund-than",
        },
        {
          match: "(so|very|extremely) [#Gerund]",
          group: 0,
          tag: "Adjective",
          reason: "so-gerund",
        },
        {
          match: "(found|found) it #Adverb? [#Gerund]",
          group: 0,
          tag: "Adjective",
          reason: "found-it-gerund",
        },
        {
          match: "a (little|bit|wee) bit? [#Gerund]",
          group: 0,
          tag: "Adjective",
          reason: "a-bit-gerund",
        },
        {
          match: "#Gerund [#Gerund]",
          group: 0,
          tag: "Adjective",
          notIf: "(impersonating|practicing|considering|assuming)",
          reason: "looking-annoying",
        },
      ],
      [
        {
          match: "#Determiner [#Adjective] #Copula",
          group: 0,
          tag: "Noun",
          reason: "the-adj-is",
        },
        {
          match: "#Adjective [#Adjective] #Copula",
          group: 0,
          tag: "Noun",
          reason: "adj-adj-is",
        },
        {
          match: "(his|its) [%Adj|Noun%]",
          group: 0,
          tag: "Noun",
          notIf: "#Hyphenated",
          reason: "his-fine",
        },
        {
          match: "#Copula #Adverb? [all]",
          group: 0,
          tag: "Noun",
          reason: "is-all",
        },
        {
          match: "(have|had) [#Adjective] #Preposition .",
          group: 0,
          tag: "Noun",
          reason: "have-fun",
        },
        {
          match: "#Gerund (giant|capital|center|zone|application)",
          tag: "Noun",
          reason: "brewing-giant",
        },
        {
          match: "#Preposition (a|an) [#Adjective]$",
          group: 0,
          tag: "Noun",
          reason: "an-instant",
        },
        {
          match: "no [#Adjective] #Modal",
          group: 0,
          tag: "Noun",
          reason: "no-golden",
        },
        {
          match: "[brand #Gerund?] new",
          group: 0,
          tag: "Adverb",
          reason: "brand-new",
        },
        {
          match: "(#Determiner|#Comparative|new|different) [kind]",
          group: 0,
          tag: "Noun",
          reason: "some-kind",
        },
        {
          match: "#Possessive [%Adj|Noun%] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "her-favourite",
        },
        {
          match: "must && #Hyphenated .",
          tag: "Adjective",
          reason: "must-win",
        },
        {
          match: "#Determiner [#Adjective]$",
          tag: "Noun",
          notIf: "(this|that|#Comparative|#Superlative)",
          reason: "the-south",
        },
        {
          match: "(#Noun && #Hyphenated) (#Adjective && #Hyphenated)",
          tag: "Adjective",
          notIf: "(this|that|#Comparative|#Superlative)",
          reason: "company-wide",
        },
        {
          match: "#Determiner [#Adjective] (#Copula|#Determiner)",
          notIf: "(#Comparative|#Superlative)",
          group: 0,
          tag: "Noun",
          reason: "the-poor",
        },
      ],
      [
        {
          match: "[still] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "still-advb",
        },
        {
          match: "[still] #Verb",
          group: 0,
          tag: "Adverb",
          reason: "still-verb",
        },
        { match: "[so] #Adjective", group: 0, tag: "Adverb", reason: "so-adv" },
        {
          match: "[way] #Comparative",
          group: 0,
          tag: "Adverb",
          reason: "way-adj",
        },
        {
          match: "[way] #Adverb #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "way-too-adj",
        },
        { match: "[all] #Verb", group: 0, tag: "Adverb", reason: "all-verb" },
        {
          match: "#Verb  [like]",
          group: 0,
          notIf: "(#Modal|#PhrasalVerb)",
          tag: "Adverb",
          reason: "verb-like",
        },
        { match: "(barely|hardly) even", tag: "Adverb", reason: "barely-even" },
        { match: "[even] #Verb", group: 0, tag: "Adverb", reason: "even-walk" },
        {
          match: "[even] #Comparative",
          group: 0,
          tag: "Adverb",
          reason: "even-worse",
        },
        {
          match: "[even] (#Determiner|#Possessive)",
          group: 0,
          tag: "#Adverb",
          reason: "even-the",
        },
        { match: "even left", tag: "#Adverb #Verb", reason: "even-left" },
        {
          match: "[way] #Adjective",
          group: 0,
          tag: "#Adverb",
          reason: "way-over",
        },
        {
          match:
            "#PresentTense [(hard|quick|long|bright|slow|fast|backwards|forwards)]",
          notIf: "#Copula",
          group: 0,
          tag: "Adverb",
          reason: "lazy-ly",
        },
        {
          match: "[much] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "bit-1",
        },
        {
          match: "#Copula [#Adverb]$",
          group: 0,
          tag: "Adjective",
          reason: "is-well",
        },
        {
          match: "a [(little|bit|wee) bit?] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "a-bit-cold",
        },
        {
          match: "[(super|pretty)] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "super-strong",
        },
        {
          match: "(become|fall|grow) #Adverb? [#PastTense]",
          group: 0,
          tag: "Adjective",
          reason: "overly-weakened",
        },
        {
          match: "(a|an) #Adverb [#Participle] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "completely-beaten",
        },
        {
          match: "#Determiner #Adverb? [close]",
          group: 0,
          tag: "Adjective",
          reason: "a-close",
        },
        {
          match: "#Gerund #Adverb? [close]",
          group: 0,
          tag: "Adverb",
          reason: "being-close",
        },
        {
          match: "(the|those|these|a|an) [#Participle] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "blown-motor",
        },
        {
          match: "(#PresentTense|#PastTense) [back]",
          group: 0,
          tag: "Adverb",
          notIf: "(#PhrasalVerb|#Copula)",
          reason: "charge-back",
        },
        {
          match: "#Verb [around]",
          group: 0,
          tag: "Adverb",
          notIf: "#PhrasalVerb",
          reason: "send-around",
        },
        {
          match: "[later] #PresentTense",
          group: 0,
          tag: "Adverb",
          reason: "later-say",
        },
      ],
      [
        { match: "[sun] the #Ordinal", tag: "WeekDay", reason: "sun-the-5th" },
        { match: "[sun] #Date", group: 0, tag: "WeekDay", reason: "sun-feb" },
        {
          match: "#Date (on|this|next|last|during)? [sun]",
          group: 0,
          tag: "WeekDay",
          reason: "1pm-sun",
        },
        {
          match: "(in|by|before|during|on|until|after|of|within|all) [sat]",
          group: 0,
          tag: "WeekDay",
          reason: "sat",
        },
        {
          match: "(in|by|before|during|on|until|after|of|within|all) [wed]",
          group: 0,
          tag: "WeekDay",
          reason: "wed",
        },
        {
          match: "(in|by|before|during|on|until|after|of|within|all) [march]",
          group: 0,
          tag: "Month",
          reason: "march",
        },
        { match: "[sat] #Date", group: 0, tag: "WeekDay", reason: "sat-feb" },
        {
          match: "#Preposition [(march|may)]",
          group: 0,
          tag: "Month",
          reason: "in-month",
        },
        {
          match: "(this|next|last) (march|may) !#Infinitive",
          tag: "#Date #Month",
          reason: "this-month",
        },
        {
          match: "(march|may) the? #Value",
          tag: "#Month #Date #Date",
          reason: "march-5th",
        },
        {
          match: "#Value of? (march|may)",
          tag: "#Date #Date #Month",
          reason: "5th-of-march",
        },
        {
          match: "[(march|may)] .? #Date",
          group: 0,
          tag: "Month",
          reason: "march-and-feb",
        },
        {
          match: "#Date .? [(march|may)]",
          group: 0,
          tag: "Month",
          reason: "feb-and-march",
        },
        {
          match: "#Adverb [(march|may)]",
          group: 0,
          tag: "Verb",
          reason: "quickly-march",
        },
        {
          match: "[(march|may)] #Adverb",
          group: 0,
          tag: "Verb",
          reason: "march-quickly",
        },
      ],
      [
        { match: "#Holiday (day|eve)", tag: "Holiday", reason: "holiday-day" },
        { match: "#Value of #Month", tag: "Date", reason: "value-of-month" },
        { match: "#Cardinal #Month", tag: "Date", reason: "cardinal-month" },
        {
          match: "#Month #Value to #Value",
          tag: "Date",
          reason: "value-to-value",
        },
        { match: "#Month the #Value", tag: "Date", reason: "month-the-value" },
        {
          match: "(#WeekDay|#Month) #Value",
          tag: "Date",
          reason: "date-value",
        },
        {
          match: "#Value (#WeekDay|#Month)",
          tag: "Date",
          reason: "value-date",
        },
        {
          match: "(#TextValue && #Date) #TextValue",
          tag: "Date",
          reason: "textvalue-date",
        },
        { match: "#Month #NumberRange", tag: "Date", reason: "aug 20-21" },
        {
          match: "#WeekDay #Month #Ordinal",
          tag: "Date",
          reason: "week mm-dd",
        },
        {
          match: "#Month #Ordinal #Cardinal",
          tag: "Date",
          reason: "mm-dd-yyy",
        },
        {
          match:
            "(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time",
          tag: "Timezone",
          reason: "std-time",
        },
        {
          match:
            "(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time",
          tag: "Timezone",
          reason: "eastern-time",
        },
        {
          match: "#Time [(eastern|mountain|pacific|central|est|pst|gmt)]",
          group: 0,
          tag: "Timezone",
          reason: "5pm-central",
        },
        {
          match: "(central|western|eastern) european time",
          tag: "Timezone",
          reason: "cet",
        },
      ],
      [
        {
          match: "(the|any) [more]",
          group: 0,
          tag: "Singular",
          reason: "more-noun",
        },
        {
          match: "[more] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "more-noun",
        },
        { match: "(right|rights) of .", tag: "Noun", reason: "right-of" },
        { match: "a [bit]", group: 0, tag: "Singular", reason: "bit-2" },
        { match: "a [must]", group: 0, tag: "Singular", reason: "must-2" },
        { match: "(we|us) [all]", group: 0, tag: "Noun", reason: "we all" },
        { match: "due to [#Verb]", group: 0, tag: "Noun", reason: "due-to" },
        {
          match: "some [#Verb] #Plural",
          group: 0,
          tag: "Noun",
          reason: "determiner6",
        },
        {
          match: "#Possessive #Ordinal [#PastTense]",
          group: 0,
          tag: "Noun",
          reason: "first-thought",
        },
        {
          match: "(the|this|those|these) #Adjective [%Verb|Noun%]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "the-adj-verb",
        },
        {
          match: "(the|this|those|these) #Adverb #Adjective [#Verb]",
          group: 0,
          tag: "Noun",
          reason: "determiner4",
        },
        {
          match: "the [#Verb] #Preposition .",
          group: 0,
          tag: "Noun",
          reason: "determiner1",
        },
        {
          match: "(a|an|the) [#Verb] of",
          group: 0,
          tag: "Noun",
          reason: "the-verb-of",
        },
        {
          match: "#Determiner #Noun of [#Verb]",
          group: 0,
          tag: "Noun",
          notIf: "#Gerund",
          reason: "noun-of-noun",
        },
        {
          match: "#PastTense #Preposition [#PresentTense]",
          group: 0,
          notIf: "#Gerund",
          tag: "Noun",
          reason: "ended-in-ruins",
        },
        {
          match: "#Conjunction [u]",
          group: 0,
          tag: "Pronoun",
          reason: "u-pronoun-2",
        },
        { match: "[u] #Verb", group: 0, tag: "Pronoun", reason: "u-pronoun-1" },
        {
          match:
            "#Determiner [(western|eastern|northern|southern|central)] #Noun",
          group: 0,
          tag: "Noun",
          reason: "western-line",
        },
        {
          match: "(#Singular && @hasHyphen) #PresentTense",
          tag: "Noun",
          reason: "hyphen-verb",
        },
        { match: "is no [#Verb]", group: 0, tag: "Noun", reason: "is-no-verb" },
        { match: "do [so]", group: 0, tag: "Noun", reason: "so-noun" },
        {
          match: "#Determiner [(shit|damn|hell)]",
          group: 0,
          tag: "Noun",
          reason: "swears-noun",
        },
        {
          match: "to [(shit|hell)]",
          group: 0,
          tag: "Noun",
          reason: "to-swears",
        },
        {
          match: "(the|these) [#Singular] (were|are)",
          group: 0,
          tag: "Plural",
          reason: "singular-were",
        },
        {
          match: "a #Noun+ or #Adverb+? [#Verb]",
          group: 0,
          tag: "Noun",
          reason: "noun-or-noun",
        },
        {
          match:
            "(the|those|these|a|an) #Adjective? [#PresentTense #Particle?]",
          group: 0,
          tag: "Noun",
          notIf: "(seem|appear|include|#Gerund|#Copula)",
          reason: "det-inf",
        },
        {
          match: "#Noun #Actor",
          tag: "Actor",
          notIf: "#Person",
          reason: "thing-doer",
        },
        { match: "#Gerund #Actor", tag: "Actor", reason: "gerund-doer" },
        { match: "co #Singular", tag: "Actor", reason: "co-noun" },
        {
          match: "[#Noun+] #Actor",
          group: 0,
          tag: "Actor",
          notIf: "#Honorific",
          reason: "air-traffic-controller",
        },
        {
          match:
            "(urban|cardiac|cardiovascular|respiratory|medical|clinical|visual|graphic|creative|dental|exotic|fine|certified|registered|technical|virtual|professional|amateur|junior|senior|special|pharmaceutical|theoretical)+ #Noun? #Actor",
          tag: "Actor",
          reason: "fine-artist",
        },
        {
          match:
            "#Noun+ (coach|chef|king|engineer|fellow|personality|boy|girl|man|woman)",
          tag: "Actor",
          reason: "dance-coach",
        },
        { match: "chief . officer", tag: "Actor", reason: "chief-x-officer" },
        { match: "chief of #Noun+", tag: "Actor", reason: "chief-of-police" },
        {
          match: "senior? vice? president of #Noun+",
          tag: "Actor",
          reason: "president-of",
        },
        {
          match: "#Determiner [sun]",
          group: 0,
          tag: "Singular",
          reason: "the-sun",
        },
        {
          match: "#Verb (a|an) [#Value]$",
          group: 0,
          tag: "Singular",
          reason: "did-a-value",
        },
        {
          match: "the [(can|will|may)]",
          group: 0,
          tag: "Singular",
          reason: "the can",
        },
        {
          match: "#FirstName #Acronym? (#Possessive && #LastName)",
          tag: "Possessive",
          reason: "name-poss",
        },
        {
          match: "#Organization+ #Possessive",
          tag: "Possessive",
          reason: "org-possessive",
        },
        {
          match: "#Place+ #Possessive",
          tag: "Possessive",
          reason: "place-possessive",
        },
        {
          match: "#Possessive #PresentTense #Particle?",
          notIf: "(#Gerund|her)",
          tag: "Noun",
          reason: "possessive-verb",
        },
        {
          match: "(my|our|their|her|his|its) [(#Plural && #Actor)] #Noun",
          tag: "Possessive",
          reason: "my-dads",
        },
        {
          match: "#Value of a [second]",
          group: 0,
          unTag: "Value",
          tag: "Singular",
          reason: "10th-of-a-second",
        },
        {
          match: "#Value [seconds]",
          group: 0,
          unTag: "Value",
          tag: "Plural",
          reason: "10-seconds",
        },
        {
          match: "in [#Infinitive]",
          group: 0,
          tag: "Singular",
          reason: "in-age",
        },
        {
          match: "a [#Adjective] #Preposition",
          group: 0,
          tag: "Noun",
          reason: "a-minor-in",
        },
        {
          match: "#Determiner [#Singular] said",
          group: 0,
          tag: "Actor",
          reason: "the-actor-said",
        },
        {
          match:
            "#Determiner #Noun [(feel|sense|process|rush|side|bomb|bully|challenge|cover|crush|dump|exchange|flow|function|issue|lecture|limit|march|process)] !(#Preposition|to|#Adverb)?",
          group: 0,
          tag: "Noun",
          reason: "the-noun-sense",
        },
        {
          match: "[#PresentTense] (of|by|for) (a|an|the) #Noun #Copula",
          group: 0,
          tag: "Plural",
          reason: "photographs-of",
        },
        {
          match: "#Infinitive and [%Noun|Verb%]",
          group: 0,
          tag: "Infinitive",
          reason: "fight and win",
        },
        {
          match: "#Noun and [#Verb] and #Noun",
          group: 0,
          tag: "Noun",
          reason: "peace-and-flowers",
        },
        {
          match: "the #Cardinal [%Adj|Noun%]",
          group: 0,
          tag: "Noun",
          reason: "the-1992-classic",
        },
        {
          match: "#Copula the [%Adj|Noun%] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "the-premier-university",
        },
        {
          match: "i #Verb [me] #Noun",
          group: 0,
          tag: "Possessive",
          reason: "scottish-me",
        },
        {
          match:
            "[#PresentTense] (music|class|lesson|night|party|festival|league|ceremony)",
          group: 0,
          tag: "Noun",
          reason: "dance-music",
        },
      ],
      [
        {
          match: "(this|that|the|a|an) [#Gerund #Infinitive]",
          group: 0,
          tag: "Singular",
          reason: "the-planning-process",
        },
        {
          match: "(that|the) [#Gerund #PresentTense]",
          group: 0,
          ifNo: "#Copula",
          tag: "Plural",
          reason: "the-paving-stones",
        },
        {
          match: "#Determiner [#Gerund] #Noun",
          group: 0,
          tag: "Adjective",
          reason: "the-gerund-noun",
        },
        {
          match: "#Pronoun #Infinitive [#Gerund] #PresentTense",
          group: 0,
          tag: "Noun",
          reason: "tipping-sucks",
        },
        {
          match: "#Adjective [#Gerund]",
          group: 0,
          tag: "Noun",
          notIf: "(still|even|just)",
          reason: "early-warning",
        },
        {
          match: "[#Gerund] #Adverb? not? #Copula",
          group: 0,
          tag: "Activity",
          reason: "gerund-copula",
        },
        {
          match: "[#Gerund] #Modal",
          group: 0,
          tag: "Activity",
          reason: "gerund-modal",
        },
        {
          match: "#Singular for [%Noun|Gerund%]",
          group: 0,
          tag: "Gerund",
          reason: "noun-for-gerund",
        },
        {
          match: "#Comparative (for|at) [%Noun|Gerund%]",
          group: 0,
          tag: "Gerund",
          reason: "better-for-gerund",
        },
        {
          match: "#PresentTense the [#Gerund]",
          group: 0,
          tag: "Noun",
          reason: "keep-the-touching",
        },
      ],
      [
        {
          match: "#Infinitive (this|that|the) [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "do-this-dance",
        },
        {
          match: "#Gerund #Determiner [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "running-a-show",
        },
        {
          match: "#Determiner (only|further|just|more|backward) [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "the-only-reason",
        },
        {
          match: "(the|this|a|an) [#Infinitive] #Adverb? #Verb",
          group: 0,
          tag: "Noun",
          reason: "determiner5",
        },
        {
          match: "#Determiner #Adjective #Adjective? [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "a-nice-inf",
        },
        {
          match: "#Determiner #Demonym [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "mexican-train",
        },
        {
          match: "#Adjective #Noun+ [#Infinitive] #Copula",
          group: 0,
          tag: "Noun",
          reason: "career-move",
        },
        {
          match: "at some [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "at-some-inf",
        },
        {
          match: "(go|goes|went) to [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "goes-to-verb",
        },
        {
          match: "(a|an) #Adjective? #Noun [#Infinitive] (#Preposition|#Noun)",
          group: 0,
          tag: "Noun",
          reason: "a-noun-inf",
        },
        {
          match: "(a|an) #Noun [#Infinitive]$",
          group: 0,
          tag: "Noun",
          reason: "a-noun-inf2",
        },
        {
          match: "#Gerund #Adjective? for [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "running-for",
        },
        {
          match: "#Gerund #Adjective to [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "running-to",
        },
        {
          match: "about [#Infinitive]",
          group: 0,
          tag: "Singular",
          reason: "about-love",
        },
        {
          match: "#Plural on [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "on-stage",
        },
        {
          match: "any [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "any-charge",
        },
        {
          match: "no [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "no-doubt",
        },
        {
          match: "number of [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "number-of-x",
        },
        {
          match: "(taught|teaches|learns|learned) [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "teaches-x",
        },
        {
          match: "(try|use|attempt|build|make) [#Verb #Particle?]",
          notIf: "(#Copula|#Noun|sure|fun|up)",
          group: 0,
          tag: "Noun",
          reason: "do-verb",
        },
        {
          match: "^[#Infinitive] (is|was)",
          group: 0,
          tag: "Noun",
          reason: "checkmate-is",
        },
        {
          match: "#Infinitive much [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "get-much",
        },
        {
          match: "[cause] #Pronoun #Verb",
          group: 0,
          tag: "Conjunction",
          reason: "cause-cuz",
        },
        {
          match: "the #Singular [#Infinitive] #Noun",
          group: 0,
          tag: "Noun",
          notIf: "#Pronoun",
          reason: "cardio-dance",
        },
        {
          match: "#Determiner #Modal [#Noun]",
          group: 0,
          tag: "PresentTense",
          reason: "should-smoke",
        },
        {
          match: "(this|that) [#Plural]",
          group: 0,
          tag: "PresentTense",
          notIf: "#Preposition",
          reason: "this-verbs",
        },
        {
          match:
            "(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)",
          group: 0,
          tag: "Infinitive",
          reason: "let-him-glue",
        },
        {
          match: "#Verb (all|every|each|most|some|no) [#PresentTense]",
          notIf: "#Modal",
          group: 0,
          tag: "Noun",
          reason: "all-presentTense",
        },
        {
          match: "(had|have|#PastTense) #Adjective [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "better",
          reason: "adj-presentTense",
        },
        {
          match: "#Value #Adjective [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "one-big-reason",
        },
        {
          match: "#PastTense #Adjective+ [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "(#Copula|better)",
          reason: "won-wide-support",
        },
        {
          match: "(many|few|several|couple) [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "many-poses",
        },
        {
          match: "#Determiner #Adverb #Adjective [%Noun|Verb%]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "very-big-dream",
        },
        {
          match: "from #Noun to [%Noun|Verb%]",
          group: 0,
          tag: "Noun",
          reason: "start-to-finish",
        },
        {
          match: "(for|with|of) #Noun (and|or|not) [%Noun|Verb%]",
          group: 0,
          tag: "Noun",
          notIf: "#Pronoun",
          reason: "for-food-and-gas",
        },
        {
          match: "#Adjective #Adjective [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "adorable-little-store",
        },
        {
          match: "#Gerund #Adverb? #Comparative [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "higher-costs",
        },
        {
          match: "(#Noun && @hasComma) #Noun (and|or) [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "noun-list",
        },
        {
          match: "(many|any|some|several) [#PresentTense] for",
          group: 0,
          tag: "Noun",
          reason: "any-verbs-for",
        },
        {
          match: "to #PresentTense #Noun [#PresentTense] #Preposition",
          group: 0,
          tag: "Noun",
          reason: "gas-exchange",
        },
        {
          match: "#PastTense (until|as|through|without) [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "waited-until-release",
        },
        {
          match: "#Gerund like #Adjective? [#PresentTense]",
          group: 0,
          tag: "Plural",
          reason: "like-hot-cakes",
        },
        {
          match: "some #Adjective [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "some-reason",
        },
        {
          match: "for some [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "for-some-reason",
        },
        {
          match: "(same|some|the|that|a) kind of [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "some-kind-of",
        },
        {
          match: "(same|some|the|that|a) type of [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "some-type-of",
        },
        {
          match: "#Gerund #Adjective #Preposition [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "doing-better-for-x",
        },
        {
          match: "(get|got|have) #Comparative [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "got-better-aim",
        },
        {
          match: "whose [#PresentTense] #Copula",
          group: 0,
          tag: "Noun",
          reason: "whos-name-was",
        },
        {
          match: "#PhrasalVerb #Particle #Preposition [#PresentTense]",
          group: 0,
          tag: "Noun",
          reason: "given-up-on-x",
        },
        {
          match: "there (are|were) #Adjective? [#PresentTense]",
          group: 0,
          tag: "Plural",
          reason: "there-are",
        },
        {
          match: "#Value [#PresentTense] of",
          group: 0,
          notIf: "(one|1|#Copula|#Infinitive)",
          tag: "Plural",
          reason: "2-trains",
        },
        {
          match: "[#PresentTense] (are|were) #Adjective",
          group: 0,
          tag: "Plural",
          reason: "compromises-are-possible",
        },
        {
          match: "^[(hope|guess|thought|think)] #Pronoun #Verb",
          group: 0,
          tag: "Infinitive",
          reason: "suppose-i",
        },
        {
          match: "#Possessive #Adjective [#Verb]",
          group: 0,
          tag: "Noun",
          notIf: "#Copula",
          reason: "our-full-support",
        },
        {
          match: "[(tastes|smells)] #Adverb? #Adjective",
          group: 0,
          tag: "PresentTense",
          reason: "tastes-good",
        },
        {
          match: "#Copula #Gerund [#PresentTense] !by?",
          group: 0,
          tag: "Noun",
          notIf: "going",
          reason: "ignoring-commute",
        },
        {
          match: "#Determiner #Adjective? [(shed|thought|rose|bid|saw|spelt)]",
          group: 0,
          tag: "Noun",
          reason: "noun-past",
        },
        {
          match: "how to [%Noun|Verb%]",
          group: 0,
          tag: "Infinitive",
          reason: "how-to-noun",
        },
        {
          match: "which [%Noun|Verb%] #Noun",
          group: 0,
          tag: "Infinitive",
          reason: "which-boost-it",
        },
        {
          match: "#Gerund [%Plural|Verb%]",
          group: 0,
          tag: "Plural",
          reason: "asking-questions",
        },
        {
          match:
            "(ready|available|difficult|hard|easy|made|attempt|try) to [%Noun|Verb%]",
          group: 0,
          tag: "Infinitive",
          reason: "ready-to-noun",
        },
        {
          match: "(bring|went|go|drive|run|bike) to [%Noun|Verb%]",
          group: 0,
          tag: "Noun",
          reason: "bring-to-noun",
        },
        {
          match: "#Modal #Noun [%Noun|Verb%]",
          group: 0,
          tag: "Infinitive",
          reason: "would-you-look",
        },
        {
          match: "#Copula just [#Infinitive]",
          group: 0,
          tag: "Noun",
          reason: "is-just-spam",
        },
        {
          match: "^%Noun|Verb% %Plural|Verb%",
          tag: "Imperative #Plural",
          reason: "request-copies",
        },
        {
          match: "#Adjective #Plural and [%Plural|Verb%]",
          group: 0,
          tag: "#Plural",
          reason: "pickles-and-drinks",
        },
        {
          match: "#Determiner #Year [#Verb]",
          group: 0,
          tag: "Noun",
          reason: "the-1968-film",
        },
        {
          match: "#Determiner [#PhrasalVerb #Particle]",
          group: 0,
          tag: "Noun",
          reason: "the-break-up",
        },
        {
          match: "#Determiner [%Adj|Noun%] #Noun",
          group: 0,
          tag: "Adjective",
          notIf: "(#Pronoun|#Possessive|#ProperNoun)",
          reason: "the-individual-goals",
        },
        {
          match: "[%Noun|Verb%] or #Infinitive",
          group: 0,
          tag: "Infinitive",
          reason: "work-or-prepare",
        },
        {
          match: "to #Infinitive [#PresentTense]",
          group: 0,
          tag: "Noun",
          notIf: "(#Gerund|#Copula|help)",
          reason: "to-give-thanks",
        },
      ],
      [
        {
          match: "#Money and #Money #Currency?",
          tag: "Money",
          reason: "money-and-money",
        },
        {
          match: "#Value #Currency [and] #Value (cents|ore|centavos|sens)",
          group: 0,
          tag: "money",
          reason: "and-5-cents",
        },
        {
          match: "#Value (mark|rand|won|rub|ore)",
          tag: "#Money #Currency",
          reason: "4 mark",
        },
      ],
      [
        {
          match: "[(half|quarter)] of? (a|an)",
          group: 0,
          tag: "Fraction",
          reason: "millionth",
        },
        {
          match: "#Adverb [half]",
          group: 0,
          tag: "Fraction",
          reason: "nearly-half",
        },
        { match: "[half] the", group: 0, tag: "Fraction", reason: "half-the" },
        {
          match: "#Cardinal and a half",
          tag: "Fraction",
          reason: "and-a-half",
        },
        {
          match: "#Value (halves|halfs|quarters)",
          tag: "Fraction",
          reason: "two-halves",
        },
        { match: "a #Ordinal", tag: "Fraction", reason: "a-quarter" },
        {
          match: "[#Cardinal+] (#Fraction && /s$/)",
          tag: "Fraction",
          reason: "seven-fifths",
        },
        {
          match: "[#Cardinal+ #Ordinal] of .",
          group: 0,
          tag: "Fraction",
          reason: "ordinal-of",
        },
        {
          match: "[(#NumericValue && #Ordinal)] of .",
          group: 0,
          tag: "Fraction",
          reason: "num-ordinal-of",
        },
        {
          match: "(a|one) #Cardinal?+ #Ordinal",
          tag: "Fraction",
          reason: "a-ordinal",
        },
        {
          match: "#Cardinal+ out? of every? #Cardinal",
          tag: "Fraction",
          reason: "out-of",
        },
      ],
      [
        { match: "#Cardinal [second]", tag: "Unit", reason: "one-second" },
        {
          match:
            "!once? [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)",
          group: 0,
          tag: "Value",
          reason: "a-is-one",
        },
        {
          match: "1 #Value #PhoneNumber",
          tag: "PhoneNumber",
          reason: "1-800-Value",
        },
        {
          match: "#NumericValue #PhoneNumber",
          tag: "PhoneNumber",
          reason: "(800) PhoneNumber",
        },
        {
          match: "#Demonym #Currency",
          tag: "Currency",
          reason: "demonym-currency",
        },
        {
          match: "#Value [(buck|bucks|grand)]",
          group: 0,
          tag: "Currency",
          reason: "value-bucks",
        },
        {
          match: "[#Value+] #Currency",
          group: 0,
          tag: "Money",
          reason: "15 usd",
        },
        {
          match: "[second] #Noun",
          group: 0,
          tag: "Ordinal",
          reason: "second-noun",
        },
        {
          match: "#Value+ [#Currency]",
          group: 0,
          tag: "Unit",
          reason: "5-yan",
        },
        {
          match: "#Value [(foot|feet)]",
          group: 0,
          tag: "Unit",
          reason: "foot-unit",
        },
        {
          match: "#Value [#Abbreviation]",
          group: 0,
          tag: "Unit",
          reason: "value-abbr",
        },
        { match: "#Value [k]", group: 0, tag: "Unit", reason: "value-k" },
        { match: "#Unit an hour", tag: "Unit", reason: "unit-an-hour" },
        {
          match: "(minus|negative) #Value",
          tag: "Value",
          reason: "minus-value",
        },
        {
          match: "#Value (point|decimal) #Value",
          tag: "Value",
          reason: "value-point-value",
        },
        {
          match: "#Determiner [(half|quarter)] #Ordinal",
          group: 0,
          tag: "Value",
          reason: "half-ordinal",
        },
        {
          match: "#Multiple+ and #Value",
          tag: "Value",
          reason: "magnitude-and-value",
        },
        {
          match: "#Value #Unit [(per|an) (hr|hour|sec|second|min|minute)]",
          group: 0,
          tag: "Unit",
          reason: "12-miles-per-second",
        },
        {
          match: "#Value [(square|cubic)] #Unit",
          group: 0,
          tag: "Unit",
          reason: "square-miles",
        },
        {
          match: "^[#Value] (#Determiner|#Gerund)",
          group: 0,
          tag: "Expression",
          unTag: "Value",
          reason: "numbered-list",
        },
      ],
      [
        {
          match: "#Copula [(#Noun|#PresentTense)] #LastName",
          group: 0,
          tag: "FirstName",
          reason: "copula-noun-lastname",
        },
        {
          match:
            "(sister|pope|brother|father|aunt|uncle|grandpa|grandfather|grandma) #ProperNoun",
          tag: "Person",
          reason: "lady-titlecase",
          safe: !0,
        },
        {
          match: "#FirstName [#Determiner #Noun] #LastName",
          group: 0,
          tag: "Person",
          reason: "first-noun-last",
        },
        {
          match:
            "#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun",
          tag: "Person",
          reason: "titlecase-acronym-titlecase",
          safe: !0,
        },
        {
          match: "#Acronym #LastName",
          tag: "Person",
          reason: "acronym-lastname",
          safe: !0,
        },
        {
          match: "#Person (jr|sr|md)",
          tag: "Person",
          reason: "person-honorific",
        },
        {
          match: "#Honorific #Acronym",
          tag: "Person",
          reason: "Honorific-TitleCase",
        },
        {
          match: "#Person #Person the? #RomanNumeral",
          tag: "Person",
          reason: "roman-numeral",
        },
        {
          match: "#FirstName [/^[^aiurck]$/]",
          group: 0,
          tag: ["Acronym", "Person"],
          reason: "john-e",
        },
        {
          match: "#Noun van der? #Noun",
          tag: "Person",
          reason: "van der noun",
          safe: !0,
        },
        {
          match: "(king|queen|prince|saint|lady) of #Noun",
          tag: "Person",
          reason: "king-of-noun",
          safe: !0,
        },
        { match: "(prince|lady) #Place", tag: "Person", reason: "lady-place" },
        {
          match: "(king|queen|prince|saint) #ProperNoun",
          tag: "Person",
          reason: "saint-foo",
        },
        {
          match: "al (#Person|#ProperNoun)",
          tag: "Person",
          reason: "al-borlen",
          safe: !0,
        },
        { match: "#FirstName de #Noun", tag: "Person", reason: "bill-de-noun" },
        {
          match: "#FirstName (bin|al) #Noun",
          tag: "Person",
          reason: "bill-al-noun",
        },
        {
          match: "#FirstName #Acronym #ProperNoun",
          tag: "Person",
          reason: "bill-acronym-title",
        },
        {
          match: "#FirstName #FirstName #ProperNoun",
          tag: "Person",
          reason: "bill-firstname-title",
        },
        {
          match: "#Honorific #FirstName? #ProperNoun",
          tag: "Person",
          reason: "dr-john-Title",
        },
        {
          match: "#FirstName the #Adjective",
          tag: "Person",
          reason: "name-the-great",
        },
        {
          match: "#ProperNoun (van|al|bin) #ProperNoun",
          tag: "Person",
          reason: "title-van-title",
          safe: !0,
        },
        {
          match: "#ProperNoun (de|du) la? #ProperNoun",
          tag: "Person",
          reason: "title-de-title",
        },
        {
          match: "#Singular #Acronym #LastName",
          tag: "#FirstName #Person .",
          reason: "title-acro-noun",
          safe: !0,
        },
        {
          match: "[#ProperNoun] #Person",
          group: 0,
          tag: "Person",
          reason: "proper-person",
          safe: !0,
        },
        {
          match: "#Person [#ProperNoun #ProperNoun]",
          group: 0,
          tag: "Person",
          notIf: "#Possessive",
          reason: "three-name-person",
          safe: !0,
        },
        {
          match: "#FirstName #Acronym? [#ProperNoun]",
          group: 0,
          tag: "LastName",
          notIf: "#Possessive",
          reason: "firstname-titlecase",
        },
        {
          match: "#FirstName [#FirstName]",
          group: 0,
          tag: "LastName",
          reason: "firstname-firstname",
        },
        {
          match: "#FirstName #Acronym #Noun",
          tag: "Person",
          reason: "n-acro-noun",
          safe: !0,
        },
        {
          match: "#FirstName [(de|di|du|van|von)] #Person",
          group: 0,
          tag: "LastName",
          reason: "de-firstname",
        },
        {
          match: "[#Actor+] #Person",
          group: 0,
          tag: "Person",
          reason: "baker-sam-smith",
        },
        {
          match:
            "[(lieutenant|corporal|sergeant|captain|qeen|king|admiral|major|colonel|marshal|president|queen|king)+] #ProperNoun",
          group: 0,
          tag: "Honorific",
          reason: "seargeant-john",
        },
        {
          match:
            "[(private|general|major|rear|prime|field|count|miss)] #Honorific? #Person",
          group: 0,
          tag: ["Honorific", "Person"],
          reason: "ambg-honorifics",
        },
        {
          match: "#Honorific #FirstName [#Singular]",
          group: 0,
          tag: "LastName",
          notIf: "#Possessive",
          reason: "dr-john-foo",
          safe: !0,
        },
        {
          match:
            "[(his|her) (majesty|honour|worship|excellency|honorable)] #Person",
          group: 0,
          tag: "Honorific",
          reason: "his-excellency",
        },
        {
          match: "#Honorific #Actor",
          tag: "Honorific",
          reason: "Lieutenant colonel",
        },
        {
          match: "(first|second|third|1st|2nd|3rd) #Actor",
          tag: "Honorific",
          reason: "first lady",
        },
        { match: "#Person #RomanNumeral", tag: "Person", reason: "louis-IV" },
      ],
      [
        {
          match: "%Person|Date% #Acronym? #ProperNoun",
          tag: "Person",
          reason: "jan-thierson",
        },
        {
          match: "%Person|Noun% #Acronym? #ProperNoun",
          tag: "Person",
          reason: "switch-person",
          safe: !0,
        },
        {
          match: "%Person|Noun% #Organization",
          tag: "Organization",
          reason: "olive-garden",
        },
        {
          match: "%Person|Verb% #Acronym? #ProperNoun",
          tag: "Person",
          reason: "verb-propernoun",
          ifNo: "#Actor",
        },
        {
          match:
            "[%Person|Verb%] (will|had|has|said|says|told|did|learned|wants|wanted)",
          group: 0,
          tag: "Person",
          reason: "person-said",
        },
        {
          match:
            "[%Person|Place%] (harbor|harbour|pier|town|city|place|dump|landfill)",
          group: 0,
          tag: "Place",
          reason: "sydney-harbour",
        },
        {
          match: "(west|east|north|south) [%Person|Place%]",
          group: 0,
          tag: "Place",
          reason: "east-sydney",
        },
        {
          match: "#Modal [%Person|Verb%]",
          group: 0,
          tag: "Verb",
          reason: "would-mark",
        },
        {
          match: "#Adverb [%Person|Verb%]",
          group: 0,
          tag: "Verb",
          reason: "really-mark",
        },
        {
          match: "[%Person|Verb%] (#Adverb|#Comparative)",
          group: 0,
          tag: "Verb",
          reason: "drew-closer",
        },
        { match: "%Person|Verb% #Person", tag: "Person", reason: "rob-smith" },
        {
          match: "%Person|Verb% #Acronym #ProperNoun",
          tag: "Person",
          reason: "rob-a-smith",
        },
        { match: "[will] #Verb", group: 0, tag: "Modal", reason: "will-verb" },
        {
          match: "(will && @isTitleCase) #ProperNoun",
          tag: "Person",
          reason: "will-name",
        },
        {
          match: "(#FirstName && !#Possessive) [#Singular] #Verb",
          group: 0,
          safe: !0,
          tag: "LastName",
          reason: "jack-layton",
        },
        {
          match: "^[#Singular] #Person #Verb",
          group: 0,
          safe: !0,
          tag: "Person",
          reason: "sherwood-anderson",
        },
        {
          match: "(a|an) [#Person]$",
          group: 0,
          unTag: "Person",
          reason: "a-warhol",
        },
      ],
      [
        {
          match: "#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)",
          tag: "#Copula #Adverb #Adjective",
          reason: "sometimes-adverb",
        },
        {
          match: "(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense",
          group: 0,
          tag: "Modal",
          reason: "i-better",
        },
        {
          match: "(#Modal|i|they|we|do) not? [like]",
          group: 0,
          tag: "PresentTense",
          reason: "modal-like",
        },
        {
          match: "#Noun #Adverb? [left]",
          group: 0,
          tag: "PastTense",
          reason: "left-verb",
        },
        {
          match: "will #Adverb? not? #Adverb? [be] #Gerund",
          group: 0,
          tag: "Copula",
          reason: "will-be-copula",
        },
        {
          match: "will #Adverb? not? #Adverb? [be] #Adjective",
          group: 0,
          tag: "Copula",
          reason: "be-copula",
        },
        {
          match: "[march] (up|down|back|toward)",
          notIf: "#Date",
          group: 0,
          tag: "Infinitive",
          reason: "march-to",
        },
        {
          match: "#Modal [march]",
          group: 0,
          tag: "Infinitive",
          reason: "must-march",
        },
        { match: "[may] be", group: 0, tag: "Verb", reason: "may-be" },
        {
          match: "[(subject|subjects|subjected)] to",
          group: 0,
          tag: "Verb",
          reason: "subject to",
        },
        {
          match: "[home] to",
          group: 0,
          tag: "PresentTense",
          reason: "home to",
        },
        {
          match: "[open] #Determiner",
          group: 0,
          tag: "Infinitive",
          reason: "open-the",
        },
        {
          match: "(were|was) being [#PresentTense]",
          group: 0,
          tag: "PastTense",
          reason: "was-being",
        },
        {
          match: "(had|has|have) [been /en$/]",
          group: 0,
          tag: "Auxiliary Participle",
          reason: "had-been-broken",
        },
        {
          match: "(had|has|have) [been /ed$/]",
          group: 0,
          tag: "Auxiliary PastTense",
          reason: "had-been-smoked",
        },
        {
          match: "(had|has) #Adverb? [been] #Adverb? #PastTense",
          group: 0,
          tag: "Auxiliary",
          reason: "had-been-adj",
        },
        {
          match: "(had|has) to [#Noun] (#Determiner|#Possessive)",
          group: 0,
          tag: "Infinitive",
          reason: "had-to-noun",
        },
        {
          match: "have [#PresentTense]",
          group: 0,
          tag: "PastTense",
          notIf: "(come|gotten)",
          reason: "have-read",
        },
        {
          match: "(does|will|#Modal) that [work]",
          group: 0,
          tag: "PastTense",
          reason: "does-that-work",
        },
        {
          match: "[(sound|sounds)] #Adjective",
          group: 0,
          tag: "PresentTense",
          reason: "sounds-fun",
        },
        {
          match: "[(look|looks)] #Adjective",
          group: 0,
          tag: "PresentTense",
          reason: "looks-good",
        },
        {
          match: "[(need|needs)] to #Infinitive",
          group: 0,
          tag: "PresentTense",
          reason: "need-to-learn",
        },
        {
          match: "[(start|starts|stop|stops|begin|begins)] #Gerund",
          group: 0,
          tag: "Verb",
          reason: "starts-thinking",
        },
        {
          match: "(have|had) read",
          tag: "Modal #PastTense",
          reason: "read-read",
        },
        {
          match: "(is|was|were) [(under|over) #PastTense]",
          group: 0,
          tag: "Adverb Adjective",
          reason: "was-under-cooked",
        },
        {
          match: "[shit] (#Determiner|#Possessive|them)",
          group: 0,
          tag: "Verb",
          reason: "swear1-verb",
        },
        {
          match: "[damn] (#Determiner|#Possessive|them)",
          group: 0,
          tag: "Verb",
          reason: "swear2-verb",
        },
        {
          match: "[fuck] (#Determiner|#Possessive|them)",
          group: 0,
          tag: "Verb",
          reason: "swear3-verb",
        },
        {
          match: "#Plural that %Noun|Verb%",
          tag: ". #Preposition #Infinitive",
          reason: "jobs-that-work",
        },
        {
          match: "[works] for me",
          group: 0,
          tag: "PresentTense",
          reason: "works-for-me",
        },
        {
          match: "as #Pronoun [please]",
          group: 0,
          tag: "Infinitive",
          reason: "as-we-please",
        },
        {
          match:
            "[(co|mis|de|inter|intra|pre|re|un|out|under|over|counter)] #Verb",
          group: 0,
          tag: ["Verb", "Prefix"],
          notIf: "(#Copula|#PhrasalVerb)",
          reason: "co-write",
        },
        {
          match: "#PastTense and [%Adj|Past%]",
          group: 0,
          tag: "PastTense",
          reason: "dressed-and-left",
        },
        {
          match: "[%Adj|Past%] and #PastTense",
          group: 0,
          tag: "PastTense",
          reason: "dressed-and-left",
        },
      ],
      [
        {
          match: "(slowly|quickly) [#Adjective]",
          group: 0,
          tag: "Verb",
          reason: "slowly-adj",
        },
        {
          match: "does (#Adverb|not)? [#Adjective]",
          group: 0,
          tag: "PresentTense",
          reason: "does-mean",
        },
        {
          match: "[(fine|okay|cool|ok)] by me",
          group: 0,
          tag: "Adjective",
          reason: "okay-by-me",
        },
        {
          match: "i (#Adverb|do)? not? [mean]",
          group: 0,
          tag: "PresentTense",
          reason: "i-mean",
        },
        {
          match: "will #Adjective",
          tag: "Auxiliary Infinitive",
          reason: "will-adj",
        },
        {
          match: "#Pronoun [#Adjective] #Determiner #Adjective? #Noun",
          group: 0,
          tag: "Verb",
          reason: "he-adj-the",
        },
        {
          match: "#Copula [%Adj|Present%] to #Verb",
          group: 0,
          tag: "Verb",
          reason: "adj-to",
        },
        {
          match: "#Copula [#Adjective] (well|badly|quickly|slowly)",
          group: 0,
          tag: "Verb",
          reason: "done-well",
        },
        {
          match: "#Adjective and [#Gerund] !#Preposition?",
          group: 0,
          tag: "Adjective",
          reason: "rude-and-x",
        },
        {
          match: "#Copula #Adverb? (over|under) [#PastTense]",
          group: 0,
          tag: "Adjective",
          reason: "over-cooked",
        },
        {
          match: "#Copula #Adjective+ (and|or) [#PastTense]$",
          group: 0,
          tag: "Adjective",
          reason: "bland-and-overcooked",
        },
        {
          match: "got #Adverb? [#PastTense] of",
          group: 0,
          tag: "Adjective",
          reason: "got-tired-of",
        },
        {
          match:
            "(seem|seems|seemed|appear|appeared|appears|feel|feels|felt|sound|sounds|sounded) (#Adverb|#Adjective)? [#PastTense]",
          group: 0,
          tag: "Adjective",
          reason: "felt-loved",
        },
        {
          match: "(seem|feel|seemed|felt) [#PastTense #Particle?]",
          group: 0,
          tag: "Adjective",
          reason: "seem-confused",
        },
        {
          match: "a (bit|little|tad) [#PastTense #Particle?]",
          group: 0,
          tag: "Adjective",
          reason: "a-bit-confused",
        },
        {
          match: "not be [%Adj|Past% #Particle?]",
          group: 0,
          tag: "Adjective",
          reason: "do-not-be-confused",
        },
        {
          match: "#Copula just [%Adj|Past% #Particle?]",
          group: 0,
          tag: "Adjective",
          reason: "is-just-right",
        },
        {
          match: "as [#Infinitive] as",
          group: 0,
          tag: "Adjective",
          reason: "as-pale-as",
        },
        {
          match: "[%Adj|Past%] and #Adjective",
          group: 0,
          tag: "Adjective",
          reason: "faled-and-oppressive",
        },
        {
          match: "or [#PastTense] #Noun",
          group: 0,
          tag: "Adjective",
          notIf: "(#Copula|#Pronoun)",
          reason: "or-heightened-emotion",
        },
      ],
      [
        {
          match: "will (#Adverb|not)+? [have] (#Adverb|not)+? #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "will-have-vb",
        },
        {
          match: "[#Copula] (#Adverb|not)+? (#Gerund|#PastTense)",
          group: 0,
          tag: "Auxiliary",
          reason: "copula-walking",
        },
        {
          match: "[(#Modal|did)+] (#Adverb|not)+? #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "modal-verb",
        },
        {
          match:
            "#Modal (#Adverb|not)+? [have] (#Adverb|not)+? [had] (#Adverb|not)+? #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "would-have",
        },
        {
          match: "[(has|had)] (#Adverb|not)+? #PastTense",
          group: 0,
          tag: "Auxiliary",
          reason: "had-walked",
        },
        {
          match: "[(do|does|did|will|have|had|has|got)] (not|#Adverb)+? #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "have-had",
        },
        {
          match: "[about to] #Adverb? #Verb",
          group: 0,
          tag: ["Auxiliary", "Verb"],
          reason: "about-to",
        },
        {
          match: "#Modal (#Adverb|not)+? [be] (#Adverb|not)+? #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "would-be",
        },
        {
          match:
            "[(#Modal|had|has)] (#Adverb|not)+? [been] (#Adverb|not)+? #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "had-been",
        },
        {
          match: "[(be|being|been)] #Participle",
          group: 0,
          tag: "Auxiliary",
          reason: "being-driven",
        },
        {
          match: "[may] #Adverb? #Infinitive",
          group: 0,
          tag: "Auxiliary",
          reason: "may-want",
        },
        {
          match:
            "#Copula (#Adverb|not)+? [(be|being|been)] #Adverb+? #PastTense",
          group: 0,
          tag: "Auxiliary",
          reason: "being-walked",
        },
        {
          match: "will [be] #PastTense",
          group: 0,
          tag: "Auxiliary",
          reason: "will-be-x",
        },
        {
          match: "[(be|been)] (#Adverb|not)+? #Gerund",
          group: 0,
          tag: "Auxiliary",
          reason: "been-walking",
        },
        {
          match: "[used to] #PresentTense",
          group: 0,
          tag: "Auxiliary",
          reason: "used-to-walk",
        },
        {
          match: "#Copula (#Adverb|not)+? [going to] #Adverb+? #PresentTense",
          group: 0,
          tag: "Auxiliary",
          reason: "going-to-walk",
        },
        {
          match: "#Imperative [(me|him|her)]",
          group: 0,
          tag: "Reflexive",
          reason: "tell-him",
        },
        {
          match: "(is|was) #Adverb? [no]",
          group: 0,
          tag: "Negative",
          reason: "is-no",
        },
        {
          match: "[(been|had|became|came)] #PastTense",
          group: 0,
          notIf: "#PhrasalVerb",
          tag: "Auxiliary",
          reason: "been-told",
        },
        {
          match: "[(being|having|getting)] #Verb",
          group: 0,
          tag: "Auxiliary",
          reason: "being-born",
        },
        {
          match: "[be] #Gerund",
          group: 0,
          tag: "Auxiliary",
          reason: "be-walking",
        },
        {
          match: "[better] #PresentTense",
          group: 0,
          tag: "Modal",
          notIf: "(#Copula|#Gerund)",
          reason: "better-go",
        },
        {
          match: "even better",
          tag: "Adverb #Comparative",
          reason: "even-better",
        },
      ],
      [
        {
          match: "(#Verb && @hasHyphen) up",
          tag: "PhrasalVerb",
          reason: "foo-up",
        },
        {
          match: "(#Verb && @hasHyphen) off",
          tag: "PhrasalVerb",
          reason: "foo-off",
        },
        {
          match: "(#Verb && @hasHyphen) over",
          tag: "PhrasalVerb",
          reason: "foo-over",
        },
        {
          match: "(#Verb && @hasHyphen) out",
          tag: "PhrasalVerb",
          reason: "foo-out",
        },
        {
          match: "[#Verb (in|out|up|down|off|back)] (on|in)",
          notIf: "#Copula",
          tag: "PhrasalVerb Particle",
          reason: "walk-in-on",
        },
        {
          match: "(lived|went|crept|go) [on] for",
          group: 0,
          tag: "PhrasalVerb",
          reason: "went-on",
        },
        {
          match: "#Verb (up|down|in|on|for)$",
          tag: "PhrasalVerb #Particle",
          notIf: "#PhrasalVerb",
          reason: "come-down$",
        },
        {
          match: "help [(stop|end|make|start)]",
          group: 0,
          tag: "Infinitive",
          reason: "help-stop",
        },
        {
          match: "[(stop|start|finish|help)] #Gerund",
          group: 0,
          tag: "Infinitive",
          reason: "start-listening",
        },
        {
          match:
            "#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]",
          group: 0,
          tag: "Adverb",
          reason: "phrasal-pronoun-advb",
        },
      ],
      [
        {
          match: "^do not? [#Infinitive #Particle?]",
          notIf: Ks,
          group: 0,
          tag: "Imperative",
          reason: "do-eat",
        },
        {
          match: "^please do? not? [#Infinitive #Particle?]",
          group: 0,
          tag: "Imperative",
          reason: "please-go",
        },
        {
          match: "^just do? not? [#Infinitive #Particle?]",
          group: 0,
          tag: "Imperative",
          reason: "just-go",
        },
        {
          match: "^[#Infinitive] it #Comparative",
          notIf: Ks,
          group: 0,
          tag: "Imperative",
          reason: "do-it-better",
        },
        {
          match: "^[#Infinitive] it (please|now|again|plz)",
          notIf: Ks,
          group: 0,
          tag: "Imperative",
          reason: "do-it-please",
        },
        {
          match: "^[#Infinitive] (#Adjective|#Adverb)$",
          group: 0,
          tag: "Imperative",
          notIf: "(so|such|rather|enough)",
          reason: "go-quickly",
        },
        {
          match: "^[#Infinitive] (up|down|over) #Determiner",
          group: 0,
          tag: "Imperative",
          reason: "turn-down",
        },
        {
          match:
            "^[#Infinitive] (your|my|the|a|an|any|each|every|some|more|with|on)",
          group: 0,
          notIf: "like",
          tag: "Imperative",
          reason: "eat-my-shorts",
        },
        {
          match: "^[#Infinitive] (him|her|it|us|me|there)",
          group: 0,
          tag: "Imperative",
          reason: "tell-him",
        },
        {
          match: "^[#Infinitive] #Adjective #Noun$",
          group: 0,
          tag: "Imperative",
          reason: "avoid-loud-noises",
        },
        {
          match: "^[#Infinitive] (#Adjective|#Adverb)? and #Infinitive",
          group: 0,
          tag: "Imperative",
          reason: "call-and-reserve",
        },
        {
          match: "^(go|stop|wait|hurry) please?$",
          tag: "Imperative",
          reason: "go",
        },
        {
          match: "^(somebody|everybody) [#Infinitive]",
          group: 0,
          tag: "Imperative",
          reason: "somebody-call",
        },
        {
          match: "^let (us|me) [#Infinitive]",
          group: 0,
          tag: "Imperative",
          reason: "lets-leave",
        },
        {
          match: "^[(shut|close|open|start|stop|end|keep)] #Determiner #Noun",
          group: 0,
          tag: "Imperative",
          reason: "shut-the-door",
        },
        {
          match: "^[go] to .",
          group: 0,
          tag: "Imperative",
          reason: "go-to-toronto",
        },
        {
          match: "^#Modal you [#Infinitive]",
          group: 0,
          tag: "Imperative",
          reason: "would-you-",
        },
        {
          match: "^never [#Infinitive]",
          group: 0,
          tag: "Imperative",
          reason: "never-stop",
        },
        {
          match: "^come #Infinitive",
          tag: "Imperative",
          notIf: "on",
          reason: "come-have",
        },
        {
          match: "^come and? #Infinitive",
          tag: "Imperative . Imperative",
          notIf: "#PhrasalVerb",
          reason: "come-and-have",
        },
        {
          match: "^stay (out|away|back)",
          tag: "Imperative",
          reason: "stay-away",
        },
        {
          match: "^[(stay|be|keep)] #Adjective",
          group: 0,
          tag: "Imperative",
          reason: "stay-cool",
        },
        {
          match: "^[keep it] #Adjective",
          group: 0,
          tag: "Imperative",
          reason: "keep-it-cool",
        },
        {
          match: "^do not [#Infinitive]",
          group: 0,
          tag: "Imperative",
          reason: "do-not-be",
        },
        {
          match: "[#Infinitive] (yourself|yourselves)",
          group: 0,
          tag: "Imperative",
          reason: "allow-yourself",
        },
        {
          match: "[#Infinitive] what .",
          group: 0,
          tag: "Imperative",
          reason: "look-what",
        },
        {
          match: "^[#Infinitive] #Gerund",
          group: 0,
          tag: "Imperative",
          reason: "keep-playing",
        },
        {
          match: "^[#Infinitive] (to|for|into|toward|here|there)",
          group: 0,
          tag: "Imperative",
          reason: "go-to",
        },
        {
          match: "^[#Infinitive] (and|or) #Infinitive",
          group: 0,
          tag: "Imperative",
          reason: "inf-and-inf",
        },
        {
          match: "^[%Noun|Verb%] to",
          group: 0,
          tag: "Imperative",
          reason: "commit-to",
        },
        {
          match: "^[#Infinitive] #Adjective? #Singular #Singular",
          group: 0,
          tag: "Imperative",
          reason: "maintain-eye-contact",
        },
        {
          match: "do not (forget|omit|neglect) to [#Infinitive]",
          group: 0,
          tag: "Imperative",
          reason: "do-not-forget",
        },
      ],
      [
        {
          match: "(that|which) were [%Adj|Gerund%]",
          group: 0,
          tag: "Gerund",
          reason: "that-were-growing",
        },
        {
          match: "#Gerund [#Gerund] #Plural",
          group: 0,
          tag: "Adjective",
          reason: "hard-working-fam",
        },
      ],
      [
        { match: "u r", tag: "#Pronoun #Copula", reason: "u r" },
        {
          match: "#Noun [(who|whom)]",
          group: 0,
          tag: "Determiner",
          reason: "captain-who",
        },
        {
          match: "[had] #Noun+ #PastTense",
          group: 0,
          tag: "Condition",
          reason: "had-he",
        },
        {
          match: "[were] #Noun+ to #Infinitive",
          group: 0,
          tag: "Condition",
          reason: "were-he",
        },
        {
          match: "some sort of",
          tag: "Adjective Noun Conjunction",
          reason: "some-sort-of",
        },
        {
          match: "of some sort",
          tag: "Conjunction Adjective Noun",
          reason: "of-some-sort",
        },
        {
          match: "[such] (a|an|is)? #Noun",
          group: 0,
          tag: "Determiner",
          reason: "such-skill",
        },
        {
          match: "[right] (before|after|in|into|to|toward)",
          group: 0,
          tag: "#Adverb",
          reason: "right-into",
        },
        {
          match: "#Preposition [about]",
          group: 0,
          tag: "Adjective",
          reason: "at-about",
        },
        {
          match: "(are|#Modal|see|do|for) [ya]",
          group: 0,
          tag: "Pronoun",
          reason: "are-ya",
        },
        {
          match: "[long live] .",
          group: 0,
          tag: "#Adjective #Infinitive",
          reason: "long-live",
        },
        {
          match: "[plenty] of",
          group: 0,
          tag: "#Uncountable",
          reason: "plenty-of",
        },
        {
          match: "(always|nearly|barely|practically) [there]",
          group: 0,
          tag: "Adjective",
          reason: "always-there",
        },
        {
          match: "[there] (#Adverb|#Pronoun)? #Copula",
          group: 0,
          tag: "There",
          reason: "there-is",
        },
        {
          match: "#Copula [there] .",
          group: 0,
          tag: "There",
          reason: "is-there",
        },
        {
          match: "#Modal #Adverb? [there]",
          group: 0,
          tag: "There",
          reason: "should-there",
        },
        {
          match: "^[do] (you|we|they)",
          group: 0,
          tag: "QuestionWord",
          reason: "do-you",
        },
        {
          match: "^[does] (he|she|it|#ProperNoun)",
          group: 0,
          tag: "QuestionWord",
          reason: "does-he",
        },
        { match: "a [while]", group: 0, tag: "Noun", reason: "a-while" },
        {
          match: "guess who",
          tag: "#Infinitive #QuestionWord",
          reason: "guess-who",
        },
      ],
      [
        {
          match: "#Noun (&|n) #Noun",
          tag: "Organization",
          reason: "Noun-&-Noun",
        },
        {
          match: "#Organization of the? #ProperNoun",
          tag: "Organization",
          reason: "org-of-place",
          safe: !0,
        },
        {
          match: "#Organization #Country",
          tag: "Organization",
          reason: "org-country",
        },
        {
          match: "#ProperNoun #Organization",
          tag: "Organization",
          reason: "titlecase-org",
        },
        {
          match: "#ProperNoun (ltd|co|inc|dept|assn|bros)",
          tag: "Organization",
          reason: "org-abbrv",
        },
        {
          match: "the [#Acronym]",
          group: 0,
          tag: "Organization",
          reason: "the-acronym",
          safe: !0,
        },
        {
          match: "(world|global|international|national|#Demonym) #Organization",
          tag: "Organization",
          reason: "global-org",
        },
        {
          match: "#Noun+ (public|private) school",
          tag: "School",
          reason: "noun-public-school",
        },
      ],
      [
        {
          match:
            "(west|north|south|east|western|northern|southern|eastern)+ #Place",
          tag: "Region",
          reason: "west-norfolk",
        },
        {
          match:
            "#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]",
          group: 0,
          tag: "Region",
          reason: "us-state",
        },
        {
          match: "portland [or]",
          group: 0,
          tag: "Region",
          reason: "portland-or",
        },
        {
          match:
            "#ProperNoun+ (district|region|province|county|prefecture|municipality|territory|burough|reservation)",
          tag: "Region",
          reason: "foo-district",
        },
        {
          match:
            "(district|region|province|municipality|territory|burough|state) of #ProperNoun",
          tag: "Region",
          reason: "district-of-Foo",
        },
        {
          match: "in [#ProperNoun] #Place",
          group: 0,
          tag: "Place",
          reason: "propernoun-place",
        },
        {
          match:
            "#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)",
          tag: "Address",
          reason: "address-st",
        },
      ],
      [
        {
          match: "[so] #Noun",
          group: 0,
          tag: "Conjunction",
          reason: "so-conj",
        },
        {
          match:
            "[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)",
          group: 0,
          tag: "Conjunction",
          reason: "how-he-is-x",
        },
        {
          match: "#Copula [(who|what|where|why|how|when)] #Noun",
          group: 0,
          tag: "Conjunction",
          reason: "when-he",
        },
        {
          match: "#Verb [that] #Pronoun",
          group: 0,
          tag: "Conjunction",
          reason: "said-that-he",
        },
        {
          match: "#Noun [that] #Copula",
          group: 0,
          tag: "Conjunction",
          reason: "that-are",
        },
        {
          match: "#Noun [that] #Verb #Adjective",
          group: 0,
          tag: "Conjunction",
          reason: "that-seem",
        },
        {
          match: "#Noun #Copula not? [that] #Adjective",
          group: 0,
          tag: "Adverb",
          reason: "that-adj",
        },
        {
          match: "#Verb #Adverb? #Noun [(that|which)]",
          group: 0,
          tag: "Preposition",
          reason: "that-prep",
        },
        {
          match: "@hasComma [which] (#Pronoun|#Verb)",
          group: 0,
          tag: "Preposition",
          reason: "which-copula",
        },
        {
          match: "#Noun [like] #Noun",
          group: 0,
          tag: "Preposition",
          reason: "noun-like",
        },
        {
          match: "^[like] #Determiner",
          group: 0,
          tag: "Preposition",
          reason: "like-the",
        },
        {
          match: "a #Noun [like] (#Noun|#Determiner)",
          group: 0,
          tag: "Preposition",
          reason: "a-noun-like",
        },
        {
          match: "#Adverb [like]",
          group: 0,
          tag: "Verb",
          reason: "really-like",
        },
        {
          match: "(not|nothing|never) [like]",
          group: 0,
          tag: "Preposition",
          reason: "nothing-like",
        },
        {
          match: "#Infinitive #Pronoun [like]",
          group: 0,
          tag: "Preposition",
          reason: "treat-them-like",
        },
        {
          match: "[#QuestionWord] (#Pronoun|#Determiner)",
          group: 0,
          tag: "Preposition",
          reason: "how-he",
        },
        {
          match: "[#QuestionWord] #Participle",
          group: 0,
          tag: "Preposition",
          reason: "when-stolen",
        },
        {
          match: "[how] (#Determiner|#Copula|#Modal|#PastTense)",
          group: 0,
          tag: "QuestionWord",
          reason: "how-is",
        },
        {
          match: "#Plural [(who|which|when)] .",
          group: 0,
          tag: "Preposition",
          reason: "people-who",
        },
      ],
      [
        {
          match: "holy (shit|fuck|hell)",
          tag: "Expression",
          reason: "swears-expression",
        },
        {
          match: "^[(well|so|okay|now)] !#Adjective?",
          group: 0,
          tag: "Expression",
          reason: "well-",
        },
        { match: "^come on", tag: "Expression", reason: "come-on" },
        {
          match: "(say|says|said) [sorry]",
          group: 0,
          tag: "Expression",
          reason: "say-sorry",
        },
        {
          match: "^(ok|alright|shoot|hell|anyways)",
          tag: "Expression",
          reason: "ok-",
        },
        { match: "^(say && @hasComma)", tag: "Expression", reason: "say-" },
        { match: "^(like && @hasComma)", tag: "Expression", reason: "like-" },
        {
          match: "^[(dude|man|girl)] #Pronoun",
          group: 0,
          tag: "Expression",
          reason: "dude-i",
        },
      ]
    ),
    Rs = null;
  const Ys = {
      postTagger: function (e) {
        const { world: t } = e,
          { model: n, methods: a } = t;
        Rs = Rs || a.one.buildNet(n.two.matches, t);
        let r = a.two.quickSplit(e.document).map((e) => {
            let t = e[0];
            return [t.index[0], t.index[1], t.index[1] + e.length];
          }),
          o = e.update(r);
        return o.cache(), o.sweep(Rs), e.uncache(), e;
      },
      tagger: (e) => e.compute(["lexicon", "preTagger", "postTagger"]),
    },
    Qs = {
      api: function (e) {
        (e.prototype.confidence = function () {
          let e = 0,
            t = 0;
          return (
            this.docs.forEach((n) => {
              n.forEach((n) => {
                (t += 1), (e += n.confidence || 1);
              });
            }),
            0 === t ? 1 : ((e) => Math.round(100 * e) / 100)(e / t)
          );
        }),
          (e.prototype.tagger = function () {
            return this.compute(["tagger"]);
          });
      },
      compute: Ys,
      model: { two: { matches: Us } },
      hooks: ["postTagger"],
    },
    Zs = Qs,
    Xs = {
      lib: {
        lazy: function (e, t) {
          let n = t;
          "string" == typeof t && (n = this.buildNet([{ match: t }]));
          let a = this.tokenize(e),
            r = (function (e, t) {
              let n = (function (e) {
                return Object.keys(e.hooks).filter(
                  (e) => !e.startsWith("#") && !e.startsWith("%")
                );
              })(t);
              if (0 === n.length) return e;
              e._cache || e.cache();
              let a = e._cache;
              return e.filter((e, t) => n.some((e) => a[t].has(e)));
            })(a, n);
          return r.found
            ? (r.compute(["index", "tagger"]), r.match(t))
            : a.none();
        },
      },
    },
    el = function (e, t, n) {
      let a = e
          .split(/ /g)
          .map((e) => `{${e}}`)
          .join(" "),
        r = this.match(a);
      return (
        n && (r = r.if(n)),
        r.has("#Verb")
          ? (function (e, t) {
              let n = t;
              return (
                e.forEach((e) => {
                  e.has("#Infinitive") ||
                    (n = (function (e, t) {
                      let n = (0, e.methods.two.transform.verb.conjugate)(
                        t,
                        e.model
                      );
                      return e.has("#Gerund")
                        ? n.Gerund
                        : e.has("#PastTense")
                        ? n.PastTense
                        : e.has("#PresentTense")
                        ? n.PresentTense
                        : e.has("#Gerund")
                        ? n.Gerund
                        : t;
                    })(e, t)),
                    e.replaceWith(n);
                }),
                e
              );
            })(r, t)
          : r.has("#Noun")
          ? (function (e, t) {
              let n = t;
              e.has("#Plural") &&
                (n = (0, e.methods.two.transform.noun.toPlural)(t, e.model)),
                e.replaceWith(n);
            })(r, t)
          : r.has("#Adverb")
          ? (function (e, t) {
              const { toAdverb: n } = e.methods.two.transform.adjective;
              let a = n(t);
              a && e.replaceWith(a);
            })(r, t)
          : r.has("#Adjective")
          ? (function (e, t) {
              const { toComparative: n, toSuperlative: a } =
                e.methods.two.transform.adjective;
              let r = t;
              e.has("#Comparative")
                ? (r = n(r, e.model))
                : e.has("#Superlative") && (r = a(r, e.model)),
                r && e.replaceWith(r);
            })(r, t)
          : this
      );
    },
    tl = {
      api: function (e) {
        e.prototype.swap = el;
      },
    };
  Ua.plugin(Os), Ua.plugin(_s), Ua.plugin(Zs), Ua.plugin(Xs), Ua.plugin(tl);
  const nl = Ua,
    al = function (e) {
      let t = this;
      return (
        (t = (function (e) {
          let t = e.parentheses();
          return (
            (t = t.filter(
              (e) => e.wordCount() >= 3 && e.has("#Verb") && e.has("#Noun")
            )),
            e.splitOn(t)
          );
        })(t)),
        (t = (function (e) {
          let t = e.quotations();
          return (
            (t = t.filter(
              (e) => e.wordCount() >= 3 && e.has("#Verb") && e.has("#Noun")
            )),
            e.splitOn(t)
          );
        })(t)),
        (t = (function (e) {
          let t = e.match("@hasComma");
          return (
            (t = t.filter((e) => {
              if (1 === e.growLeft(".").wordCount()) return !1;
              if (1 === e.growRight(". .").wordCount()) return !1;
              let t = e.grow(".");
              return (
                (t = t.ifNo("@hasComma @hasComma")),
                (t = t.ifNo("@hasComma (and|or) .")),
                (t = t.ifNo("(#City && @hasComma) #Country")),
                (t = t.ifNo("(#WeekDay && @hasComma) #Date")),
                (t = t.ifNo("(#Date+ && @hasComma) #Value")),
                (t = t.ifNo("(#Adjective && @hasComma) #Adjective")),
                t.found
              );
            })),
            e.splitAfter(t)
          );
        })(t)),
        (t = t.splitAfter("(@hasEllipses|@hasSemicolon|@hasDash|@hasColon)")),
        (t = t.splitAfter("^#Pronoun (said|says)")),
        (t = t.splitBefore("(said|says) #ProperNoun$")),
        (t = t.splitBefore(". . if .{4}")),
        (t = t.splitBefore("and while")),
        (t = t.splitBefore("now that")),
        (t = t.splitBefore("ever since")),
        (t = t.splitBefore("(supposing|although)")),
        (t = t.splitBefore("even (while|if|though)")),
        (t = t.splitBefore("(whereas|whose)")),
        (t = t.splitBefore("as (though|if)")),
        (t = t.splitBefore("(til|until)")),
        "number" == typeof e && (t = t.get(e)),
        t
      );
    },
    rl = { this: "Noun", then: "Pivot" },
    ol = [
      { match: "[that] #Determiner #Noun", group: 0, chunk: "Pivot" },
      { match: "#PastTense [that]", group: 0, chunk: "Pivot" },
      { match: "[so] #Determiner", group: 0, chunk: "Pivot" },
      { match: "#Copula #Adverb+? [#Adjective]", group: 0, chunk: "Adjective" },
      { match: "#Adjective and #Adjective", chunk: "Adjective" },
      { match: "#Adverb+ and #Adverb #Verb", chunk: "Verb" },
      { match: "#Gerund #Adjective", chunk: "Verb" },
      { match: "#Gerund to #Verb", chunk: "Verb" },
      { match: "#PresentTense and #PresentTense", chunk: "Verb" },
      { match: "#Adverb #Negative", chunk: "Verb" },
      { match: "(want|wants|wanted) to #Infinitive", chunk: "Verb" },
      { match: "#Verb #Reflexive", chunk: "Verb" },
      {
        match: "#PresentTense [#Pronoun] #Determiner",
        group: 0,
        chunk: "Verb",
      },
      { match: "#Verb [to] #Adverb? #Infinitive", group: 0, chunk: "Verb" },
      { match: "[#Preposition] #Gerund", group: 0, chunk: "Verb" },
      { match: "#Infinitive [that] <Noun>", group: 0, chunk: "Verb" },
      { match: "#Noun of #Determiner? #Noun", chunk: "Noun" },
      { match: "#Value+ #Adverb? #Adjective", chunk: "Noun" },
      { match: "the [#Adjective] #Noun", chunk: "Noun" },
      { match: "#Singular in #Determiner? #Singular", chunk: "Noun" },
      { match: "#Plural [in] #Determiner? #Noun", group: 0, chunk: "Pivot" },
      {
        match: "#Noun and #Determiner? #Noun",
        notIf: "(#Possessive|#Pronoun)",
        chunk: "Noun",
      },
    ];
  let il = null;
  const sl = function (e, t) {
      if (
        ("undefined" != typeof process && process.env
          ? process.env
          : self.env || {}
        ).DEBUG_CHUNKS
      ) {
        let n = (e.normal + "'").padEnd(8);
        console.log(`  | '${n}  →  [34m${t.padEnd(12)}[0m [2m -fallback- [0m`);
      }
      e.chunk = t;
    },
    ll = {
      chunks: function (e) {
        const { document: t, world: n } = e;
        (function (e) {
          for (let t = 0; t < e.length; t += 1)
            for (let n = 0; n < e[t].length; n += 1) {
              let a = e[t][n];
              !0 !== rl.hasOwnProperty(a.normal)
                ? a.tags.has("Verb")
                  ? (a.chunk = "Verb")
                  : a.tags.has("Noun") ||
                    a.tags.has("Determiner") ||
                    a.tags.has("Value")
                  ? (a.chunk = "Noun")
                  : a.tags.has("QuestionWord") && (a.chunk = "Pivot")
                : (a.chunk = rl[a.normal]);
            }
        })(t),
          (function (e) {
            for (let t = 0; t < e.length; t += 1)
              for (let n = 0; n < e[t].length; n += 1) {
                let a = e[t][n];
                if (a.chunk) continue;
                let r = e[t][n + 1],
                  o = e[t][n - 1];
                if (a.tags.has("Adjective")) {
                  if (o && o.tags.has("Copula")) {
                    a.chunk = "Adjective";
                    continue;
                  }
                  if (o && o.tags.has("Determiner")) {
                    a.chunk = "Noun";
                    continue;
                  }
                  if (r && r.tags.has("Noun")) {
                    a.chunk = "Noun";
                    continue;
                  }
                } else if (a.tags.has("Adverb") || a.tags.has("Negative")) {
                  if (o && o.tags.has("Adjective")) {
                    a.chunk = "Adjective";
                    continue;
                  }
                  if (o && o.tags.has("Verb")) {
                    a.chunk = "Verb";
                    continue;
                  }
                  if (r && r.tags.has("Adjective")) {
                    a.chunk = "Adjective";
                    continue;
                  }
                  if (r && r.tags.has("Verb")) {
                    a.chunk = "Verb";
                    continue;
                  }
                }
              }
          })(t),
          (function (e, t, n) {
            const { methods: a } = n;
            (il = il || a.one.buildNet(ol, n)), e.sweep(il);
          })(e, 0, n),
          (function (e) {
            for (let t = 0; t < e.length; t += 1)
              for (let n = 0; n < e[t].length; n += 1) {
                let a = e[t][n];
                void 0 === a.chunk &&
                  (a.tags.has("Conjunction") || a.tags.has("Preposition")
                    ? sl(a, "Pivot")
                    : a.tags.has("Adverb")
                    ? sl(a, "Verb")
                    : (a.chunk = "Noun"));
              }
          })(t),
          (function (e) {
            let t = [],
              n = null;
            e.forEach((e) => {
              for (let a = 0; a < e.length; a += 1) {
                let r = e[a];
                n && r.chunk === n
                  ? t[t.length - 1].terms.push(r)
                  : (t.push({ chunk: r.chunk, terms: [r] }), (n = r.chunk));
              }
            }),
              t.forEach((e) => {
                if ("Verb" === e.chunk) {
                  const t = e.terms.find((e) => e.tags.has("Verb"));
                  t || e.terms.forEach((e) => (e.chunk = null));
                }
              });
          })(t);
      },
    },
    ul = {
      compute: ll,
      api: function (e) {
        class t extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = "Chunks");
          }
          isVerb() {
            return this.filter((e) => e.has("<Verb>"));
          }
          isNoun() {
            return this.filter((e) => e.has("<Noun>"));
          }
          isAdjective() {
            return this.filter((e) => e.has("<Adjective>"));
          }
          isPivot() {
            return this.filter((e) => e.has("<Pivot>"));
          }
          debug() {
            return this.toView().debug("chunks"), this;
          }
          update(e) {
            let n = new t(this.document, e);
            return (n._cache = this._cache), n;
          }
        }
        (e.prototype.chunks = function (e) {
          let n = (function (e) {
            let t = [],
              n = null,
              a = null;
            e.docs.forEach((e) => {
              e.forEach((e) => {
                e.chunk !== a &&
                  (n && ((n[2] = e.index[1]), t.push(n)),
                  (a = e.chunk),
                  (n = [e.index[0], e.index[1]]));
              });
            }),
              n && t.push(n);
            let r = e.update(t);
            return (r = r.map((e) => (e.has("<Noun>") ? e.nouns() : e))), r;
          })(this);
          return (n = n.getNth(e)), new t(this.document, n.pointer);
        }),
          (e.prototype.clauses = al);
      },
      hooks: ["chunks"],
    },
    cl = /\./g,
    hl = function (e) {
      const { fromComparative: t, fromSuperlative: n } =
        e.methods.two.transform.adjective;
      let a = e.text("normal");
      return e.has("#Comparative")
        ? t(a, e.model)
        : e.has("#Superlative")
        ? n(a, e.model)
        : a;
    },
    dl = /\(/,
    ml = /\)/,
    pl = function (e, t) {
      for (; t < e.length; t += 1)
        if (e[t].post && ml.test(e[t].post)) return t;
      return null;
    },
    gl = /'s$/,
    fl = {
      '"': '"',
      "＂": "＂",
      "'": "'",
      "“": "”",
      "‘": "’",
      "‟": "”",
      "‛": "’",
      "„": "”",
      "⹂": "”",
      "‚": "’",
      "«": "»",
      "‹": "›",
      "‵": "′",
      "‶": "″",
      "‷": "‴",
      "〝": "〞",
      "`": "´",
      "〟": "〞",
    },
    yl = RegExp("(" + Object.keys(fl).join("|") + ")"),
    bl = RegExp("(" + Object.values(fl).join("|") + ")"),
    vl = function (e, t) {
      const n = e[t].pre.match(yl)[0] || "";
      if (!n || !fl[n]) return null;
      const a = fl[n];
      for (; t < e.length; t += 1)
        if (e[t].post && e[t].post.match(a)) return t;
      return null;
    },
    wl = function (e) {
      let t = this.splitAfter("@hasComma");
      return (t = t.match("#PhoneNumber+")), (t = t.getNth(e)), t;
    },
    kl = [
      ["hyphenated", "@hasHyphen ."],
      ["hashTags", "#HashTag"],
      ["emails", "#Email"],
      ["emoji", "#Emoji"],
      ["emoticons", "#Emoticon"],
      ["atMentions", "#AtMention"],
      ["urls", "#Url"],
      ["conjunctions", "#Conjunction"],
      ["prepositions", "#Preposition"],
      ["abbreviations", "#Abbreviation"],
      ["honorifics", "#Honorific"],
    ];
  let Pl = [
    ["emojis", "emoji"],
    ["atmentions", "atMentions"],
  ];
  const jl = {
      api: function (e) {
        (function (e) {
          class t extends e {
            constructor(e, t, n) {
              super(e, t, n), (this.viewType = "Acronyms");
            }
            strip() {
              return (
                this.docs.forEach((e) => {
                  e.forEach((e) => {
                    (e.text = e.text.replace(cl, "")),
                      (e.normal = e.normal.replace(cl, ""));
                  });
                }),
                this
              );
            }
            addPeriods() {
              return (
                this.docs.forEach((e) => {
                  e.forEach((e) => {
                    (e.text = e.text.replace(cl, "")),
                      (e.normal = e.normal.replace(cl, "")),
                      (e.text = e.text.split("").join(".") + "."),
                      (e.normal = e.normal.split("").join(".") + ".");
                  });
                }),
                this
              );
            }
          }
          e.prototype.acronyms = function (e) {
            let n = this.match("#Acronym");
            return (n = n.getNth(e)), new t(n.document, n.pointer);
          };
        })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.viewType = "Adjectives");
              }
              json(e = {}) {
                const {
                  toAdverb: t,
                  toNoun: n,
                  toSuperlative: a,
                  toComparative: r,
                } = this.methods.two.transform.adjective;
                return (
                  (e.normal = !0),
                  this.map((o) => {
                    let i = o.toView().json(e)[0] || {},
                      s = hl(o);
                    return (
                      (i.adjective = {
                        adverb: t(s),
                        noun: n(s),
                        superlative: a(s, this.model),
                        comparative: r(s, this.model),
                      }),
                      i
                    );
                  }, [])
                );
              }
              adverbs() {
                return this.before("#Adverb+$").concat(this.after("^#Adverb+"));
              }
              conjugate(e) {
                const {
                  toComparative: t,
                  toSuperlative: n,
                  toNoun: a,
                  toAdverb: r,
                } = this.methods.two.transform.adjective;
                return this.getNth(e).map((e) => {
                  let o = hl(e);
                  return {
                    Adjective: o,
                    Comparative: t(o, this.model),
                    Superlative: n(o, this.model),
                    Noun: a(o, this.model),
                    Adverb: r(o, this.model),
                  };
                }, []);
              }
              toComparative(e) {
                const { toComparative: t } =
                  this.methods.two.transform.adjective;
                return this.getNth(e).map((e) => {
                  let n = hl(e),
                    a = t(n, this.model);
                  return e.replaceWith(a);
                });
              }
              toSuperlative(e) {
                const { toSuperlative: t } =
                  this.methods.two.transform.adjective;
                return this.getNth(e).map((e) => {
                  let n = hl(e),
                    a = t(n, this.model);
                  return e.replaceWith(a);
                });
              }
              toAdverb(e) {
                const { toAdverb: t } = this.methods.two.transform.adjective;
                return this.getNth(e).map((e) => {
                  let n = hl(e),
                    a = t(n, this.model);
                  return e.replaceWith(a);
                });
              }
              toNoun(e) {
                const { toNoun: t } = this.methods.two.transform.adjective;
                return this.getNth(e).map((e) => {
                  let n = hl(e),
                    a = t(n, this.model);
                  return e.replaceWith(a);
                });
              }
            }
            (e.prototype.adjectives = function (e) {
              let n = this.match("#Adjective");
              return (n = n.getNth(e)), new t(n.document, n.pointer);
            }),
              (e.prototype.superlatives = function (e) {
                let n = this.match("#Superlative");
                return (n = n.getNth(e)), new t(n.document, n.pointer);
              }),
              (e.prototype.comparatives = function (e) {
                let n = this.match("#Comparative");
                return (n = n.getNth(e)), new t(n.document, n.pointer);
              });
          })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.viewType = "Adverbs");
              }
              json(e = {}) {
                const t = this.methods.two.transform.adjective.fromAdverb;
                return (
                  (e.normal = !0),
                  this.map((n) => {
                    let a = n.toView().json(e)[0] || {};
                    return (a.adverb = { adjective: t(a.normal) }), a;
                  }, [])
                );
              }
            }
            e.prototype.adverbs = function (e) {
              let n = this.match("#Adverb");
              return (n = n.getNth(e)), new t(n.document, n.pointer);
            };
          })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.viewType = "Possessives");
              }
              strip() {
                return (function (e) {
                  return (
                    e.docs.forEach((e) => {
                      e[0].pre = e[0].pre.replace(dl, "");
                      let t = e[e.length - 1];
                      t.post = t.post.replace(ml, "");
                    }),
                    e
                  );
                })(this);
              }
            }
            e.prototype.parentheses = function (e) {
              let n = (function (e) {
                let t = [];
                return (
                  e.docs.forEach((e) => {
                    for (let n = 0; n < e.length; n += 1) {
                      let a = e[n];
                      if (a.pre && dl.test(a.pre)) {
                        let a = pl(e, n);
                        if (null !== a) {
                          let [r, o] = e[n].index;
                          t.push([r, o, a + 1, e[n].id]), (n = a);
                        }
                      }
                    }
                  }),
                  e.update(t)
                );
              })(this);
              return (n = n.getNth(e)), new t(n.document, n.pointer);
            };
          })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.viewType = "Possessives");
              }
              strip() {
                return (
                  this.docs.forEach((e) => {
                    e.forEach((e) => {
                      (e.text = e.text.replace(gl, "")),
                        (e.normal = e.normal.replace(gl, ""));
                    });
                  }),
                  this
                );
              }
            }
            e.prototype.possessives = function (e) {
              let n = (function (e) {
                let t = e.match("#Possessive+");
                return (
                  t.has("#Person") && (t = t.growLeft("#Person+")),
                  t.has("#Place") && (t = t.growLeft("#Place+")),
                  t.has("#Organization") && (t = t.growLeft("#Organization+")),
                  t
                );
              })(this);
              return (n = n.getNth(e)), new t(n.document, n.pointer);
            };
          })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.viewType = "Possessives");
              }
              strip() {
                return (function (e) {
                  e.docs.forEach((e) => {
                    e[0].pre = e[0].pre.replace(yl, "");
                    let t = e[e.length - 1];
                    t.post = t.post.replace(bl, "");
                  });
                })(this);
              }
            }
            e.prototype.quotations = function (e) {
              let n = (function (e) {
                let t = [];
                return (
                  e.docs.forEach((e) => {
                    for (let n = 0; n < e.length; n += 1) {
                      let a = e[n];
                      if (a.pre && yl.test(a.pre)) {
                        let a = vl(e, n);
                        if (null !== a) {
                          let [r, o] = e[n].index;
                          t.push([r, o, a + 1, e[n].id]), (n = a);
                        }
                      }
                    }
                  }),
                  e.update(t)
                );
              })(this);
              return (n = n.getNth(e)), new t(n.document, n.pointer);
            };
          })(e),
          (function (e) {
            kl.forEach((t) => {
              e.prototype[t[0]] = function (e) {
                let n = this.match(t[1]);
                return "number" == typeof e ? n.get(e) : n;
              };
            }),
              (e.prototype.phoneNumbers = wl),
              Pl.forEach((t) => {
                e.prototype[t[0]] = e.prototype[t[1]];
              });
          })(e);
      },
    },
    Al = function (e, t) {
      e.docs.forEach((e) => {
        e.forEach(t);
      });
    },
    xl = {
      case: (e) => {
        Al(e, (e) => {
          e.text = e.text.toLowerCase();
        });
      },
      unicode: (e) => {
        const t = e.world,
          n = t.methods.one.killUnicode;
        Al(e, (e) => (e.text = n(e.text, t)));
      },
      whitespace: (e) => {
        Al(e, (e) => {
          (e.post = e.post.replace(/\s+/g, " ")),
            (e.post = e.post.replace(/\s([.,?!:;])/g, "$1")),
            (e.pre = e.pre.replace(/\s+/g, ""));
        });
      },
      punctuation: (e) => {
        Al(e, (e) => {
          (e.post = e.post.replace(/[–—-]/g, " ")),
            (e.post = e.post.replace(/[,:;]/g, "")),
            (e.post = e.post.replace(/\.{2,}/g, "")),
            (e.post = e.post.replace(/\?{2,}/g, "?")),
            (e.post = e.post.replace(/!{2,}/g, "!")),
            (e.post = e.post.replace(/\?!+/g, "?"));
        });
        let t = e.docs,
          n = t[t.length - 1];
        if (n && n.length > 0) {
          let e = n[n.length - 1];
          e.post = e.post.replace(/ /g, "");
        }
      },
      contractions: (e) => {
        e.contractions().expand();
      },
      acronyms: (e) => {
        e.acronyms().strip();
      },
      parentheses: (e) => {
        e.parentheses().strip();
      },
      possessives: (e) => {
        e.possessives().strip();
      },
      quotations: (e) => {
        e.quotations().strip();
      },
      emoji: (e) => {
        e.emojis().remove();
      },
      honorifics: (e) => {
        e.match("#Honorific+ #Person").honorifics().remove();
      },
      adverbs: (e) => {
        e.adverbs().remove();
      },
      nouns: (e) => {
        e.nouns().toSingular();
      },
      verbs: (e) => {
        e.verbs().toInfinitive();
      },
      numbers: (e) => {
        e.numbers().toNumber();
      },
    },
    Dl = (e) => e.split("|").reduce((e, t) => ((e[t] = !0), e), {}),
    Il = "unicode|punctuation|whitespace|acronyms",
    Nl = "|case|contractions|parentheses|quotations|emoji|honorifics",
    El = {
      light: Dl(Il),
      medium: Dl(Il + Nl),
      heavy: Dl(Il + Nl + "|possessives|adverbs|nouns|verbs"),
    },
    Tl = {
      api: function (e) {
        e.prototype.normalize = function (e = "light") {
          return (
            "string" == typeof e && (e = El[e]),
            Object.keys(e).forEach((t) => {
              xl.hasOwnProperty(t) && xl[t](this, e[t]);
            }),
            this
          );
        };
      },
    },
    Ol = [
      "after",
      "although",
      "as if",
      "as long as",
      "as",
      "because",
      "before",
      "even if",
      "even though",
      "ever since",
      "if",
      "in order that",
      "provided that",
      "since",
      "so that",
      "than",
      "that",
      "though",
      "unless",
      "until",
      "what",
      "whatever",
      "when",
      "whenever",
      "where",
      "whereas",
      "wherever",
      "whether",
      "which",
      "whichever",
      "who",
      "whoever",
      "whom",
      "whomever",
      "whose",
    ],
    Cl = function (e) {
      if (e.before("#Preposition$").found) return !0;
      if (!e.before().found) return !1;
      for (let t = 0; t < Ol.length; t += 1) if (e.has(Ol[t])) return !0;
      return !1;
    },
    Vl = function (e, t) {
      if (e.has("#Plural")) return !0;
      if (e.has("#Noun and #Noun")) return !0;
      if (e.has("(we|they)")) return !0;
      if (
        !0 ===
        t.has(
          "(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)"
        )
      )
        return !1;
      if (e.has("#Singular")) return !1;
      let n = t.text("normal");
      return n.length > 3 && n.endsWith("s") && !n.endsWith("ss");
    },
    zl = function (e) {
      let t = (function (e) {
        let t = e.clone();
        return (
          (t = t.match("#Noun+")),
          (t = t.remove("(#Adjective|#Preposition|#Determiner|#Value)")),
          (t = t.not("#Possessive")),
          (t = t.first()),
          t.found ? t : e
        );
      })(e);
      return {
        determiner: e.match("#Determiner").eq(0),
        adjectives: e.match("#Adjective"),
        number: e.values(),
        isPlural: Vl(e, t),
        isSubordinate: Cl(e),
        root: t,
      };
    },
    $l = (e) => e.text(),
    Fl = (e) => e.json({ terms: !1, normal: !0 }).map((e) => e.normal),
    Bl = function (e) {
      if (!e.found) return null;
      let t = e.values(0);
      return t.found ? (t.parse()[0] || {}).num : null;
    },
    Ml = { tags: !0 },
    Sl = { tags: !0 },
    Gl = {
      api: function (e) {
        class t extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = "Nouns");
          }
          parse(e) {
            return this.getNth(e).map(zl);
          }
          json(e) {
            let t = "object" == typeof e ? e : {};
            return this.getNth(e).map((e) => {
              let n = e.toView().json(t)[0] || {};
              return (
                t &&
                  !0 !== t.noun &&
                  (n.noun = (function (e) {
                    let t = zl(e);
                    return {
                      root: $l(t.root),
                      number: Bl(t.number),
                      determiner: $l(t.determiner),
                      adjectives: Fl(t.adjectives),
                      isPlural: t.isPlural,
                      isSubordinate: t.isSubordinate,
                    };
                  })(e)),
                n
              );
            }, []);
          }
          isPlural(e) {
            let t = this.filter((e) => zl(e).isPlural);
            return t.getNth(e);
          }
          isSingular(e) {
            let t = this.filter((e) => !zl(e).isPlural);
            return t.getNth(e);
          }
          adjectives(e) {
            let t = this.update([]);
            return (
              this.forEach((e) => {
                let n = zl(e).adjectives;
                n.found && (t = t.concat(n));
              }),
              t.getNth(e)
            );
          }
          toPlural(e) {
            return this.getNth(e).map((e) =>
              (function (e, t) {
                if (!0 === t.isPlural) return e;
                if (
                  !(function (e) {
                    let { root: t } = e;
                    return !t.has(
                      "^(#Uncountable|#Possessive|#ProperNoun|#Place|#Pronoun|#Acronym)+$"
                    );
                  })(t)
                )
                  return e;
                const { methods: n, model: a } = e.world,
                  { toPlural: r } = n.two.transform.noun;
                let o = r(t.root.text({ keepPunct: !1 }), a);
                e.match(t.root).replaceWith(o, Ml).tag("Plural", "toPlural"),
                  t.determiner.has("(a|an)") && e.remove(t.determiner);
                let i = t.root.after("not? #Adverb+? [#Copula]", 0);
                return (
                  i.found &&
                    (i.has("is")
                      ? e.replace(i, "are")
                      : i.has("was") && e.replace(i, "were")),
                  e
                );
              })(e, zl(e))
            );
          }
          toSingular(e) {
            return this.getNth(e).map((e) =>
              (function (e, t) {
                if (!1 === t.isPlural) return e;
                const { methods: n, model: a } = e.world,
                  { toSingular: r } = n.two.transform.noun;
                let o = r(t.root.text("normal"), a);
                return e.replace(t.root, o, Sl).tag("Singular", "toPlural"), e;
              })(e, zl(e))
            );
          }
          update(e) {
            let n = new t(this.document, e);
            return (n._cache = this._cache), n;
          }
        }
        e.prototype.nouns = function (e) {
          let n = (function (e) {
            let t = e.clauses().match("<Noun>"),
              n = t.match("@hasComma");
            return (
              (n = n.not("#Place")),
              n.found && (t = t.splitAfter(n)),
              (t = t.splitOn("#Expression")),
              (t = t.splitOn("(he|she|we|you|they|i)")),
              (t = t.splitOn("(#Noun|#Adjective) [(he|him|she|it)]", 0)),
              (t = t.splitOn("[(he|him|she|it)] (#Determiner|#Value)", 0)),
              (t = t.splitBefore("#Noun [(the|a|an)] #Adjective? #Noun", 0)),
              (t = t.splitOn("[(here|there)] #Noun", 0)),
              (t = t.splitOn("[#Noun] (here|there)", 0)),
              (t = t.splitBefore("(our|my|their|your)")),
              (t = t.splitOn("#Noun [#Determiner]", 0)),
              (t = t.if("#Noun")),
              t
            );
          })(this);
          return (n = n.getNth(e)), new t(this.document, n.pointer);
        };
      },
    },
    Ll = {
      ones: {
        zeroth: 0,
        first: 1,
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5,
        sixth: 6,
        seventh: 7,
        eighth: 8,
        ninth: 9,
        zero: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
      },
      teens: {
        tenth: 10,
        eleventh: 11,
        twelfth: 12,
        thirteenth: 13,
        fourteenth: 14,
        fifteenth: 15,
        sixteenth: 16,
        seventeenth: 17,
        eighteenth: 18,
        nineteenth: 19,
        ten: 10,
        eleven: 11,
        twelve: 12,
        thirteen: 13,
        fourteen: 14,
        fifteen: 15,
        sixteen: 16,
        seventeen: 17,
        eighteen: 18,
        nineteen: 19,
      },
      tens: {
        twentieth: 20,
        thirtieth: 30,
        fortieth: 40,
        fourtieth: 40,
        fiftieth: 50,
        sixtieth: 60,
        seventieth: 70,
        eightieth: 80,
        ninetieth: 90,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fourty: 40,
        fifty: 50,
        sixty: 60,
        seventy: 70,
        eighty: 80,
        ninety: 90,
      },
      multiples: {
        hundredth: 100,
        thousandth: 1e3,
        millionth: 1e6,
        billionth: 1e9,
        trillionth: 1e12,
        quadrillionth: 1e15,
        quintillionth: 1e18,
        sextillionth: 1e21,
        septillionth: 1e24,
        hundred: 100,
        thousand: 1e3,
        million: 1e6,
        billion: 1e9,
        trillion: 1e12,
        quadrillion: 1e15,
        quintillion: 1e18,
        sextillion: 1e21,
        septillion: 1e24,
        grand: 1e3,
      },
    },
    Hl = (e, t) => {
      if (Ll.ones.hasOwnProperty(e)) {
        if (t.ones || t.teens) return !1;
      } else if (Ll.teens.hasOwnProperty(e)) {
        if (t.ones || t.teens || t.tens) return !1;
      } else if (Ll.tens.hasOwnProperty(e) && (t.ones || t.teens || t.tens))
        return !1;
      return !0;
    },
    ql = function (e) {
      let t = "0.";
      for (let n = 0; n < e.length; n++) {
        let a = e[n];
        if (!0 === Ll.ones.hasOwnProperty(a)) t += Ll.ones[a];
        else if (!0 === Ll.teens.hasOwnProperty(a)) t += Ll.teens[a];
        else if (!0 === Ll.tens.hasOwnProperty(a)) t += Ll.tens[a];
        else {
          if (!0 !== /^[0-9]$/.test(a)) return 0;
          t += a;
        }
      }
      return parseFloat(t);
    },
    Wl = (e) =>
      (e = (e = (e = (e = (e = (e = (e = e.replace(/1st$/, "1")).replace(
        /2nd$/,
        "2"
      )).replace(/3rd$/, "3")).replace(/([4567890])r?th$/, "$1")).replace(
        /^[$€¥£¢]/,
        ""
      )).replace(/[%$€¥£¢]$/, "")).replace(/,/g, "")).replace(
        /([0-9])([a-z\u00C0-\u00FF]{1,2})$/,
        "$1"
      ),
    Jl = /^([0-9,. ]+)\/([0-9,. ]+)$/,
    _l = { "a few": 3, "a couple": 2, "a dozen": 12, "two dozen": 24, zero: 0 },
    Kl = (e) => Object.keys(e).reduce((t, n) => t + e[n], 0),
    Ul = function (e) {
      if (!0 === _l.hasOwnProperty(e)) return _l[e];
      if ("a" === e || "an" === e) return 1;
      const t = ((e) => {
        const t = [
          { reg: /^(minus|negative)[\s-]/i, mult: -1 },
          { reg: /^(a\s)?half[\s-](of\s)?/i, mult: 0.5 },
        ];
        for (let n = 0; n < t.length; n++)
          if (!0 === t[n].reg.test(e))
            return { amount: t[n].mult, str: e.replace(t[n].reg, "") };
        return { amount: 1, str: e };
      })(e);
      let n = null,
        a = {},
        r = 0,
        o = !1;
      const i = (e = t.str).split(/[ -]/);
      for (let e = 0; e < i.length; e++) {
        let s = i[e];
        if (((s = Wl(s)), !s || "and" === s)) continue;
        if ("-" === s || "negative" === s) {
          o = !0;
          continue;
        }
        if (
          ("-" === s.charAt(0) && ((o = !0), (s = s.substring(1))),
          "point" === s)
        )
          return (
            (r += Kl(a)),
            (r += ql(i.slice(e + 1, i.length))),
            (r *= t.amount),
            r
          );
        const l = s.match(Jl);
        if (l) {
          const e = parseFloat(l[1].replace(/[, ]/g, "")),
            t = parseFloat(l[2].replace(/[, ]/g, ""));
          t && (r += e / t || 0);
        } else {
          if (
            (Ll.tens.hasOwnProperty(s) &&
              a.ones &&
              1 === Object.keys(a).length &&
              ((r = 100 * a.ones), (a = {})),
            !1 === Hl(s, a))
          )
            return null;
          if (/^[0-9.]+$/.test(s)) a.ones = parseFloat(s);
          else if (!0 === Ll.ones.hasOwnProperty(s)) a.ones = Ll.ones[s];
          else if (!0 === Ll.teens.hasOwnProperty(s)) a.teens = Ll.teens[s];
          else if (!0 === Ll.tens.hasOwnProperty(s)) a.tens = Ll.tens[s];
          else if (!0 === Ll.multiples.hasOwnProperty(s)) {
            let t = Ll.multiples[s];
            if (t === n) return null;
            if (100 === t && void 0 !== i[e + 1]) {
              const n = i[e + 1];
              Ll.multiples[n] && ((t *= Ll.multiples[n]), (e += 1));
            }
            null === n || t < n
              ? ((r += (Kl(a) || 1) * t), (n = t), (a = {}))
              : ((r += Kl(a)), (n = t), (r = (r || 1) * t), (a = {}));
          }
        }
      }
      return (
        (r += Kl(a)),
        (r *= t.amount),
        (r *= o ? -1 : 1),
        0 === r && 0 === Object.keys(a).length ? null : r
      );
    },
    Rl = /s$/,
    Yl = function (e) {
      let t = e.text("reduced");
      return Ul(t);
    };
  let Ql = { half: 2, halve: 2, quarter: 4 };
  const Zl = function (e) {
      let t =
        (function (e) {
          let t = e.text("reduced");
          return Ql.hasOwnProperty(t)
            ? { numerator: 1, denominator: Ql[t] }
            : null;
        })((e = e.clone())) ||
        (function (e) {
          let t = e
            .text("reduced")
            .match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/);
          return t && t[1] && t[0]
            ? { numerator: Number(t[1]), denominator: Number(t[2]) }
            : null;
        })(e) ||
        (function (e) {
          let t = e.match("[<num>#Value+] out of every? [<den>#Value+]");
          if (!0 !== t.found) return null;
          let { num: n, den: a } = t.groups();
          return n && a
            ? ((n = Yl(n)),
              (a = Yl(a)),
              n && a && "number" == typeof n && "number" == typeof a
                ? { numerator: n, denominator: a }
                : null)
            : null;
        })(e) ||
        (function (e) {
          let t = e.match("[<num>(#Cardinal|a)+] [<den>#Fraction+]");
          if (!0 !== t.found) return null;
          let { num: n, den: a } = t.groups();
          n = n.has("a") ? 1 : Yl(n);
          let r = a.text("reduced");
          return (
            Rl.test(r) && ((r = r.replace(Rl, "")), (a = a.replaceWith(r))),
            (a = Ql.hasOwnProperty(r) ? Ql[r] : Yl(a)),
            "number" == typeof n && "number" == typeof a
              ? { numerator: n, denominator: a }
              : null
          );
        })(e) ||
        (function (e) {
          let t = e.match("^#Ordinal$");
          return !0 !== t.found
            ? null
            : e.lookAhead("^of .")
            ? { numerator: 1, denominator: Yl(t) }
            : null;
        })(e) ||
        null;
      return (
        null !== t &&
          t.numerator &&
          t.denominator &&
          ((t.decimal = t.numerator / t.denominator),
          (t.decimal = ((e) => {
            let t = Math.round(1e3 * e) / 1e3;
            return 0 === t && 0 !== e ? e : t;
          })(t.decimal))),
        t
      );
    },
    Xl = function (e) {
      if (e < 1e6) return String(e);
      let t;
      return (
        (t = "number" == typeof e ? e.toFixed(0) : e),
        -1 === t.indexOf("e+")
          ? t
          : t
              .replace(".", "")
              .split("e+")
              .reduce(function (e, t) {
                return e + Array(t - e.length + 2).join(0);
              })
      );
    },
    eu = [
      ["ninety", 90],
      ["eighty", 80],
      ["seventy", 70],
      ["sixty", 60],
      ["fifty", 50],
      ["forty", 40],
      ["thirty", 30],
      ["twenty", 20],
    ],
    tu = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ],
    nu = [
      [1e24, "septillion"],
      [1e20, "hundred sextillion"],
      [1e21, "sextillion"],
      [1e20, "hundred quintillion"],
      [1e18, "quintillion"],
      [1e17, "hundred quadrillion"],
      [1e15, "quadrillion"],
      [1e14, "hundred trillion"],
      [1e12, "trillion"],
      [1e11, "hundred billion"],
      [1e9, "billion"],
      [1e8, "hundred million"],
      [1e6, "million"],
      [1e5, "hundred thousand"],
      [1e3, "thousand"],
      [100, "hundred"],
      [1, "one"],
    ],
    au = function (e) {
      let t = [];
      if (e > 100) return t;
      for (let n = 0; n < eu.length; n++)
        e >= eu[n][1] && ((e -= eu[n][1]), t.push(eu[n][0]));
      return tu[e] && t.push(tu[e]), t;
    },
    ru = function (e) {
      let t = e.num;
      if (0 === t || "0" === t) return "zero";
      t > 1e21 && (t = Xl(t));
      let n = [];
      t < 0 && (n.push("minus"), (t = Math.abs(t)));
      let a = (function (e) {
        let t = e,
          n = [];
        return (
          nu.forEach((a) => {
            if (e >= a[0]) {
              let e = Math.floor(t / a[0]);
              (t -= e * a[0]), e && n.push({ unit: a[1], count: e });
            }
          }),
          n
        );
      })(t);
      for (let e = 0; e < a.length; e++) {
        let t = a[e].unit;
        "one" === t && ((t = ""), n.length > 1 && n.push("and")),
          (n = n.concat(au(a[e].count))),
          n.push(t);
      }
      return (
        (n = n.concat(
          ((e) => {
            const t = [
              "zero",
              "one",
              "two",
              "three",
              "four",
              "five",
              "six",
              "seven",
              "eight",
              "nine",
            ];
            let n = [],
              a = Xl(e).match(/\.([0-9]+)/);
            if (!a || !a[0]) return n;
            n.push("point");
            let r = a[0].split("");
            for (let e = 0; e < r.length; e++) n.push(t[r[e]]);
            return n;
          })(t)
        )),
        (n = n.filter((e) => e)),
        0 === n.length && (n[0] = ""),
        n.join(" ")
      );
    },
    ou = {
      one: "first",
      two: "second",
      three: "third",
      five: "fifth",
      eight: "eighth",
      nine: "ninth",
      twelve: "twelfth",
      twenty: "twentieth",
      thirty: "thirtieth",
      forty: "fortieth",
      fourty: "fourtieth",
      fifty: "fiftieth",
      sixty: "sixtieth",
      seventy: "seventieth",
      eighty: "eightieth",
      ninety: "ninetieth",
    },
    iu = (e) => {
      let t = ru(e).split(" "),
        n = t[t.length - 1];
      return (
        ou.hasOwnProperty(n)
          ? (t[t.length - 1] = ou[n])
          : (t[t.length - 1] = n.replace(/y$/, "i") + "th"),
        t.join(" ")
      );
    },
    su = function (e) {
      class t extends e {
        constructor(e, t, n) {
          super(e, t, n), (this.viewType = "Fractions");
        }
        parse(e) {
          return this.getNth(e).map(Zl);
        }
        get(e) {
          return this.getNth(e).map(Zl);
        }
        json(e) {
          return this.getNth(e).map((t) => {
            let n = t.toView().json(e)[0],
              a = Zl(t);
            return (n.fraction = a), n;
          }, []);
        }
        toDecimal(e) {
          return (
            this.getNth(e).forEach((e) => {
              let { decimal: t } = Zl(e);
              (e = e.replaceWith(String(t), !0)).tag("NumericValue"),
                e.unTag("Fraction");
            }),
            this
          );
        }
        toFraction(e) {
          return (
            this.getNth(e).forEach((e) => {
              let t = Zl(e);
              if (
                t &&
                "number" == typeof t.numerator &&
                "number" == typeof t.denominator
              ) {
                let n = `${t.numerator}/${t.denominator}`;
                this.replace(e, n);
              }
            }),
            this
          );
        }
        toOrdinal(e) {
          return (
            this.getNth(e).forEach((e) => {
              let t = (function (e) {
                if (!e.numerator || !e.denominator) return "";
                let t = ru({ num: e.numerator }),
                  n = iu({ num: e.denominator });
                return (
                  2 === e.denominator && (n = "half"),
                  t && n ? (1 !== e.numerator && (n += "s"), `${t} ${n}`) : ""
                );
              })(Zl(e));
              e.after("^#Noun").found && (t += " of"), e.replaceWith(t);
            }),
            this
          );
        }
        toCardinal(e) {
          return (
            this.getNth(e).forEach((e) => {
              let t = (function (e) {
                return e.numerator && e.denominator
                  ? `${ru({ num: e.numerator })} out of ${ru({
                      num: e.denominator,
                    })}`
                  : "";
              })(Zl(e));
              e.replaceWith(t);
            }),
            this
          );
        }
        toPercentage(e) {
          return (
            this.getNth(e).forEach((e) => {
              let { decimal: t } = Zl(e),
                n = 100 * t;
              (n = Math.round(100 * n) / 100), e.replaceWith(`${n}%`);
            }),
            this
          );
        }
      }
      e.prototype.fractions = function (e) {
        let n = (function (e, t) {
          let n = e.match("#Fraction+");
          return (
            (n = n.filter((e) => !e.lookBehind("#Value and$").found)),
            (n = n.notIf("#Value seconds")),
            "number" == typeof t && (n = n.eq(t)),
            n
          );
        })(this);
        return (n = n.getNth(e)), new t(this.document, n.pointer);
      };
    },
    lu = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty",
    uu = function (e) {
      let t = e.match("#Value+");
      if (
        (t.has("#NumericValue #NumericValue") &&
          (t.has("#Value @hasComma #Value")
            ? t.splitAfter("@hasComma")
            : t.has("#NumericValue #Fraction")
            ? t.splitAfter("#NumericValue #Fraction")
            : (t = t.splitAfter("#NumericValue"))),
        t.has("#Value #Value #Value") &&
          !t.has("#Multiple") &&
          t.has("(" + lu + ") #Cardinal #Cardinal") &&
          (t = t.splitAfter("(" + lu + ") #Cardinal")),
        t.has("#Value #Value"))
      ) {
        t.has("#NumericValue #NumericValue") && (t = t.splitOn("#Year")),
          t.has(
            "(" +
              lu +
              ") (eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)"
          ) && (t = t.splitAfter("(" + lu + ")"));
        let e = t.match("#Cardinal #Cardinal");
        if (
          e.found &&
          !t.has("(point|decimal|#Fraction)") &&
          !e.has("#Cardinal (#Multiple|point|decimal)")
        ) {
          let n = t.has(
              `(one|two|three|four|five|six|seven|eight|nine) (${lu})`
            ),
            a = e.has("(" + lu + ") #Cardinal"),
            r = e.has("#Multiple #Value");
          n ||
            a ||
            r ||
            e.terms().forEach((e) => {
              t = t.splitOn(e);
            });
        }
        t.match("#Ordinal #Ordinal").match("#TextValue").found &&
          !t.has("#Multiple") &&
          (t.has("(" + lu + ") #Ordinal") || (t = t.splitAfter("#Ordinal"))),
          (t = t.splitBefore("#Ordinal [#Cardinal]", 0)),
          t.has("#TextValue #NumericValue") &&
            !t.has("(" + lu + "|#Multiple)") &&
            (t = t.splitBefore("#TextValue #NumericValue"));
      }
      return (
        (t = t.splitAfter("#NumberRange")), (t = t.splitBefore("#Year")), t
      );
    },
    cu = function (e) {
      if ("string" == typeof e) return { num: Ul(e) };
      let t = e.text("reduced"),
        n = e.growRight("#Unit").match("#Unit$").text("machine"),
        a = /[0-9],[0-9]/.test(e.text("text"));
      if (1 === e.terms().length && !e.has("#Multiple")) {
        let r = (function (e, t) {
          let n = (e = e.replace(/,/g, "")).split(/([0-9.,]*)/),
            [a, r] = n,
            o = n.slice(2).join("");
          return "" !== r && t.length < 2
            ? ((r = Number(r || e)),
              "number" != typeof r && (r = null),
              (o = o || ""),
              ("st" !== o && "nd" !== o && "rd" !== o && "th" !== o) ||
                (o = ""),
              { prefix: a || "", num: r, suffix: o })
            : null;
        })(t, e);
        if (null !== r) return (r.hasComma = a), (r.unit = n), r;
      }
      let r = e.match("#Fraction{2,}$");
      r = !1 === r.found ? e.match("^#Fraction$") : r;
      let o = null;
      r.found &&
        (r.has("#Value and #Value #Fraction") &&
          (r = r.match("and #Value #Fraction")),
        (o = Zl(r)),
        (t = (e = (e = e.not(r)).not("and$")).text("reduced")));
      let i = 0;
      return (
        t && (i = Ul(t) || 0),
        o && o.decimal && (i += o.decimal),
        {
          hasComma: a,
          prefix: "",
          num: i,
          suffix: "",
          isOrdinal: e.has("#Ordinal"),
          isText: e.has("#TextValue"),
          isFraction: e.has("#Fraction"),
          isMoney: e.has("#Money"),
          unit: n,
        }
      );
    },
    hu = {
      "¢": "cents",
      $: "dollars",
      "£": "pounds",
      "¥": "yen",
      "€": "euros",
      "₡": "colón",
      "฿": "baht",
      "₭": "kip",
      "₩": "won",
      "₹": "rupees",
      "₽": "ruble",
      "₺": "liras",
    },
    du = { "%": "percent", "°": "degrees" },
    mu = function (e) {
      let t = { suffix: "", prefix: e.prefix };
      return (
        hu.hasOwnProperty(e.prefix) &&
          ((t.suffix += " " + hu[e.prefix]), (t.prefix = "")),
        du.hasOwnProperty(e.suffix) && (t.suffix += " " + du[e.suffix]),
        t.suffix && 1 === e.num && (t.suffix = t.suffix.replace(/s$/, "")),
        !t.suffix && e.suffix && (t.suffix += " " + e.suffix),
        t
      );
    },
    pu = function (e, t) {
      if ("TextOrdinal" === t) {
        let { prefix: t, suffix: n } = mu(e);
        return t + iu(e) + n;
      }
      if ("Ordinal" === t)
        return (
          e.prefix +
          (function (e) {
            let t = e.num;
            if (!t && 0 !== t) return null;
            let n = t % 100;
            if (n > 10 && n < 20) return String(t) + "th";
            const a = { 0: "th", 1: "st", 2: "nd", 3: "rd" };
            let r = Xl(t),
              o = r.slice(r.length - 1, r.length);
            return (r += a[o] ? a[o] : "th"), r;
          })(e) +
          e.suffix
        );
      if ("TextCardinal" === t) {
        let { prefix: t, suffix: n } = mu(e);
        return t + ru(e) + n;
      }
      let n = e.num;
      return (
        e.hasComma && (n = n.toLocaleString()), e.prefix + String(n) + e.suffix
      );
    },
    gu = {
      api: function (e) {
        su(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.viewType = "Numbers");
              }
              parse(e) {
                return this.getNth(e).map(cu);
              }
              get(e) {
                return this.getNth(e)
                  .map(cu)
                  .map((e) => e.num);
              }
              json(e) {
                let t = "object" == typeof e ? e : {};
                return this.getNth(e).map((e) => {
                  let n = e.toView().json(t)[0],
                    a = cu(e);
                  return (
                    (n.number = {
                      prefix: a.prefix,
                      num: a.num,
                      suffix: a.suffix,
                      hasComma: a.hasComma,
                      unit: a.unit,
                    }),
                    n
                  );
                }, []);
              }
              units() {
                return this.growRight("#Unit").match("#Unit$");
              }
              isOrdinal() {
                return this.if("#Ordinal");
              }
              isCardinal() {
                return this.if("#Cardinal");
              }
              toNumber() {
                return (
                  this.if("#TextValue").forEach((e) => {
                    let t = cu(e);
                    if (null === t.num) return;
                    let n = e.has("#Ordinal") ? "Ordinal" : "Cardinal",
                      a = pu(t, n);
                    e.replaceWith(a, { tags: !0 }), e.tag("NumericValue");
                  }),
                  this
                );
              }
              toLocaleString() {
                return (
                  this.forEach((e) => {
                    let t = cu(e);
                    if (null === t.num) return;
                    let n = t.num.toLocaleString();
                    if (e.has("#Ordinal")) {
                      let e = pu(t, "Ordinal").match(/[a-z]+$/);
                      e && (n += e[0] || "");
                    }
                    e.replaceWith(n, { tags: !0 });
                  }),
                  this
                );
              }
              toText() {
                let e = this.map((e) => {
                  if (e.has("#TextValue")) return e;
                  let t = cu(e);
                  if (null === t.num) return e;
                  let n = e.has("#Ordinal") ? "TextOrdinal" : "TextCardinal",
                    a = pu(t, n);
                  return e.replaceWith(a, { tags: !0 }), e.tag("TextValue"), e;
                });
                return new t(e.document, e.pointer);
              }
              toCardinal() {
                let e = this.map((e) => {
                  if (!e.has("#Ordinal")) return e;
                  let t = cu(e);
                  if (null === t.num) return e;
                  let n = e.has("#TextValue") ? "TextCardinal" : "Cardinal",
                    a = pu(t, n);
                  return e.replaceWith(a, { tags: !0 }), e.tag("Cardinal"), e;
                });
                return new t(e.document, e.pointer);
              }
              toOrdinal() {
                let e = this.map((e) => {
                  if (e.has("#Ordinal")) return e;
                  let t = cu(e);
                  if (null === t.num) return e;
                  let n = e.has("#TextValue") ? "TextOrdinal" : "Ordinal",
                    a = pu(t, n);
                  return e.replaceWith(a, { tags: !0 }), e.tag("Ordinal"), e;
                });
                return new t(e.document, e.pointer);
              }
              isEqual(e) {
                return this.filter((t) => cu(t).num === e);
              }
              greaterThan(e) {
                return this.filter((t) => cu(t).num > e);
              }
              lessThan(e) {
                return this.filter((t) => cu(t).num < e);
              }
              between(e, t) {
                return this.filter((n) => {
                  let a = cu(n).num;
                  return a > e && a < t;
                });
              }
              set(e) {
                if (void 0 === e) return this;
                "string" == typeof e && (e = cu(e).num);
                let n = this.map((t) => {
                  let n = cu(t);
                  if (((n.num = e), null === n.num)) return t;
                  let a = t.has("#Ordinal") ? "Ordinal" : "Cardinal";
                  t.has("#TextValue") &&
                    (a = t.has("#Ordinal") ? "TextOrdinal" : "TextCardinal");
                  let r = pu(n, a);
                  return (
                    n.hasComma &&
                      "Cardinal" === a &&
                      (r = Number(r).toLocaleString()),
                    (t = t.not("#Currency")).replaceWith(r, { tags: !0 }),
                    t
                  );
                });
                return new t(n.document, n.pointer);
              }
              add(e) {
                if (!e) return this;
                "string" == typeof e && (e = cu(e).num);
                let n = this.map((t) => {
                  let n = cu(t);
                  if (null === n.num) return t;
                  n.num += e;
                  let a = t.has("#Ordinal") ? "Ordinal" : "Cardinal";
                  n.isText &&
                    (a = t.has("#Ordinal") ? "TextOrdinal" : "TextCardinal");
                  let r = pu(n, a);
                  return t.replaceWith(r, { tags: !0 }), t;
                });
                return new t(n.document, n.pointer);
              }
              subtract(e, t) {
                return this.add(-1 * e, t);
              }
              increment(e) {
                return this.add(1, e);
              }
              decrement(e) {
                return this.add(-1, e);
              }
              update(e) {
                let n = new t(this.document, e);
                return (n._cache = this._cache), n;
              }
            }
            (t.prototype.toNice = t.prototype.toLocaleString),
              (t.prototype.isBetween = t.prototype.between),
              (t.prototype.minus = t.prototype.subtract),
              (t.prototype.plus = t.prototype.add),
              (t.prototype.equals = t.prototype.isEqual),
              (e.prototype.numbers = function (e) {
                let n = uu(this);
                return (n = n.getNth(e)), new t(this.document, n.pointer);
              }),
              (e.prototype.percentages = function (e) {
                let n = uu(this);
                return (
                  (n = n.filter(
                    (e) => e.has("#Percent") || e.after("^percent")
                  )),
                  (n = n.getNth(e)),
                  new t(this.document, n.pointer)
                );
              }),
              (e.prototype.money = function (e) {
                let n = uu(this);
                return (
                  (n = n.filter(
                    (e) => e.has("#Money") || e.after("^#Currency")
                  )),
                  (n = n.getNth(e)),
                  new t(this.document, n.pointer)
                );
              }),
              (e.prototype.values = e.prototype.numbers);
          })(e);
      },
    },
    fu = { people: !0, emails: !0, phoneNumbers: !0, places: !0 },
    yu = function (e = {}) {
      return (
        !1 !== (e = Object.assign({}, fu, e)).people &&
          this.people().replaceWith("██████████"),
        !1 !== e.emails && this.emails().replaceWith("██████████"),
        !1 !== e.places && this.places().replaceWith("██████████"),
        !1 !== e.phoneNumbers && this.phoneNumbers().replaceWith("███████"),
        this
      );
    },
    bu = {
      api: function (e) {
        e.prototype.redact = yu;
      },
    },
    vu = bu,
    wu = function (e) {
      let t = null;
      return (
        e.has("#PastTense")
          ? (t = "PastTense")
          : e.has("#FutureTense")
          ? (t = "FutureTense")
          : e.has("#PresentTense") && (t = "PresentTense"),
        { tense: t }
      );
    },
    ku = function (e) {
      let t = (function (e) {
          let t = e;
          return 1 === t.length
            ? t
            : ((t = t.if("#Verb")),
              1 === t.length
                ? t
                : ((t = t.ifNo(
                    "(after|although|as|because|before|if|since|than|that|though|when|whenever|where|whereas|wherever|whether|while|why|unless|until|once)"
                  )),
                  (t = t.ifNo("^even (if|though)")),
                  (t = t.ifNo("^so that")),
                  (t = t.ifNo("^rather than")),
                  (t = t.ifNo("^provided that")),
                  1 === t.length
                    ? t
                    : ((t = t.ifNo(
                        "(that|which|whichever|who|whoever|whom|whose|whomever)"
                      )),
                      1 === t.length
                        ? t
                        : ((t = t.ifNo(
                            "(despite|during|before|through|throughout)"
                          )),
                          1 === t.length
                            ? t
                            : (0 === t.length && (t = e), t.eq(0))))));
        })(e.clauses()).chunks(),
        n = e.none(),
        a = e.none(),
        r = e.none();
      return (
        t.forEach((e, t) => {
          0 !== t || e.has("<Verb>")
            ? a.found || !e.has("<Verb>")
              ? a.found && (r = r.concat(e))
              : (a = e)
            : (n = e);
        }),
        a.found && !n.found && (n = a.before("<Noun>+").first()),
        { subj: n, verb: a, pred: r, grammar: wu(a) }
      );
    },
    Pu = {
      api: function (e) {
        class t extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = "Sentences");
          }
          json(e = {}) {
            return this.map((t) => {
              let n = t.toView().json(e)[0] || {},
                { subj: a, verb: r, pred: o, grammar: i } = ku(t);
              return (
                (n.sentence = {
                  subject: a.text("normal"),
                  verb: r.text("normal"),
                  predicate: o.text("normal"),
                  grammar: i,
                }),
                n
              );
            }, []);
          }
          toPastTense(e) {
            return this.getNth(e).map((e) => {
              ku(e);
              return (function (e) {
                let t = e.verbs(),
                  n = t.eq(0);
                if (n.has("#PastTense")) return e;
                if ((n.toPastTense(), t.length > 1)) {
                  (t = t.slice(1)),
                    (t = t.filter((e) => !e.lookBehind("to$").found)),
                    (t = t.if("#PresentTense")),
                    (t = t.notIf("#Gerund"));
                  let n = e.match("to #Verb+ #Conjunction #Verb").terms();
                  (t = t.not(n)), t.found && t.verbs().toPastTense();
                }
                return e;
              })(e);
            });
          }
          toPresentTense(e) {
            return this.getNth(e).map((e) => {
              ku(e);
              return (function (e) {
                let t = e.verbs();
                return (
                  t.eq(0).toPresentTense(),
                  t.length > 1 &&
                    ((t = t.slice(1)),
                    (t = t.filter((e) => !e.lookBehind("to$").found)),
                    (t = t.notIf("#Gerund")),
                    t.found && t.verbs().toPresentTense()),
                  e
                );
              })(e);
            });
          }
          toFutureTense(e) {
            return this.getNth(e).map((e) => {
              ku(e);
              return (function (e) {
                let t = e.verbs();
                if (
                  (t.eq(0).toFutureTense(),
                  (t = (e = e.fullSentence()).verbs()),
                  t.length > 1)
                ) {
                  t = t.slice(1);
                  let e = t.filter(
                    (e) =>
                      !(
                        e.lookBehind("to$").found ||
                        (!e.has("#Copula #Gerund") &&
                          (e.has("#Gerund") ||
                            (!e.has("#Copula") &&
                              e.has("#PresentTense") &&
                              !e.has("#Infinitive") &&
                              e.lookBefore("(he|she|it|that|which)$").found)))
                      )
                  );
                  e.found &&
                    e.forEach((e) => {
                      if (e.has("#Copula"))
                        return (
                          e.match("was").replaceWith("is"),
                          void e.match("is").replaceWith("will be")
                        );
                      e.toInfinitive();
                    });
                }
                return e;
              })(e);
            });
          }
          toInfinitive(e) {
            return this.getNth(e).map((e) => {
              ku(e);
              return (function (e) {
                return e.verbs().toInfinitive(), e;
              })(e);
            });
          }
          toNegative(e) {
            return this.getNth(e).map(
              (e) => (
                ku(e),
                (function (e) {
                  return e.verbs().first().toNegative().compute("chunks"), e;
                })(e)
              )
            );
          }
          toPositive(e) {
            return this.getNth(e).map(
              (e) => (
                ku(e),
                (function (e) {
                  return e.verbs().first().toPositive().compute("chunks"), e;
                })(e)
              )
            );
          }
          isQuestion(e) {
            return this.questions(e);
          }
          isExclamation(e) {
            let t = this.filter((e) => e.lastTerm().has("@hasExclamation"));
            return t.getNth(e);
          }
          isStatement(e) {
            let t = this.filter(
              (e) => !e.isExclamation().found && !e.isQuestion().found
            );
            return t.getNth(e);
          }
          update(e) {
            let n = new t(this.document, e);
            return (n._cache = this._cache), n;
          }
        }
        (t.prototype.toPresent = t.prototype.toPresentTense),
          (t.prototype.toPast = t.prototype.toPastTense),
          (t.prototype.toFuture = t.prototype.toFutureTense);
        const n = {
          sentences: function (e) {
            let n = this.map((e) => e.fullSentence());
            return (n = n.getNth(e)), new t(this.document, n.pointer);
          },
          questions: function (e) {
            return (function (e) {
              const t = /\?/,
                { document: n } = e;
              return e.filter((e) => {
                let a = e.docs[0] || [],
                  r = a[a.length - 1];
                return (
                  !(!r || n[r.index[0]].length !== a.length) &&
                  (!!t.test(r.post) ||
                    (function (e) {
                      let t = e.clauses();
                      return !(
                        /\.\.$/.test(e.out("text")) ||
                        (e.has("^#QuestionWord") && e.has("@hasComma")) ||
                        (!e.has("or not$") &&
                          !e.has("^#QuestionWord") &&
                          !e.has(
                            "^(do|does|did|is|was|can|could|will|would|may) #Noun"
                          ) &&
                          !e.has("^(have|must) you") &&
                          !t.has(
                            "(do|does|is|was) #Noun+ #Adverb? (#Adjective|#Infinitive)$"
                          ))
                      );
                    })(e))
                );
              });
            })(this).getNth(e);
          },
        };
        Object.assign(e.prototype, n);
      },
    },
    ju = function (e) {
      let t = {};
      (t.firstName = e.match("#FirstName+")),
        (t.lastName = e.match("#LastName+")),
        (t.honorific = e.match("#Honorific+"));
      let n = t.lastName,
        a = t.firstName;
      return (
        (a.found && n.found) ||
          a.found ||
          n.found ||
          !e.has("^#Honorific .$") ||
          (t.lastName = e.match(".$")),
        t
      );
    },
    Au = "male",
    xu = "female",
    Du = {
      mr: Au,
      mrs: xu,
      miss: xu,
      madam: xu,
      king: Au,
      queen: xu,
      duke: Au,
      duchess: xu,
      baron: Au,
      baroness: xu,
      count: Au,
      countess: xu,
      prince: Au,
      princess: xu,
      sire: Au,
      dame: xu,
      lady: xu,
      ayatullah: Au,
      congressman: Au,
      congresswoman: xu,
      "first lady": xu,
      mx: null,
    },
    Iu = function (e, t) {
      let { firstName: n, honorific: a } = e;
      if (n.has("#FemaleName")) return xu;
      if (n.has("#MaleName")) return Au;
      if (a.found) {
        let e = a.text("normal");
        if (((e = e.replace(/\./g, "")), Du.hasOwnProperty(e))) return Du[e];
        if (/^her /.test(e)) return xu;
        if (/^his /.test(e)) return Au;
      }
      let r = t.after();
      if (!r.has("#Person") && r.has("#Pronoun")) {
        let e = r.match("#Pronoun");
        if (e.has("(they|their)")) return null;
        let t = e.has("(he|his)"),
          n = e.has("(she|her|hers)");
        if (t && !n) return Au;
        if (n && !t) return xu;
      }
      return null;
    },
    Nu = function (e) {
      let t = this.clauses(),
        n = t.people();
      return (
        (n = n.concat(t.places())),
        (n = n.concat(t.organizations())),
        (n = n.not("(someone|man|woman|mother|brother|sister|father)")),
        (n = n.sort("seq")),
        (n = n.getNth(e)),
        n
      );
    },
    Eu = {
      api: function (e) {
        (function (e) {
          class t extends e {
            constructor(e, t, n) {
              super(e, t, n), (this.viewType = "People");
            }
            parse(e) {
              return this.getNth(e).map(ju);
            }
            json(e) {
              let t = "object" == typeof e ? e : {};
              return this.getNth(e).map((e) => {
                let n = e.toView().json(t)[0],
                  a = ju(e);
                return (
                  (n.person = {
                    firstName: a.firstName.text("normal"),
                    lastName: a.lastName.text("normal"),
                    honorific: a.honorific.text("normal"),
                    presumed_gender: Iu(a, e),
                  }),
                  n
                );
              }, []);
            }
            presumedMale() {
              return this.filter((e) =>
                e.has("(#MaleName|mr|mister|sr|jr|king|pope|prince|sir)")
              );
            }
            presumedFemale() {
              return this.filter((e) =>
                e.has("(#FemaleName|mrs|miss|queen|princess|madam)")
              );
            }
            update(e) {
              let n = new t(this.document, e);
              return (n._cache = this._cache), n;
            }
          }
          e.prototype.people = function (e) {
            let n = this.match("#Honorific+? #Person+");
            return (n = n.getNth(e)), new t(this.document, n.pointer);
          };
        })(e),
          (function (e) {
            e.prototype.places = function (t) {
              let n = (function (e) {
                let t = e.match("(#Place|#Address)+"),
                  n = t.match("@hasComma");
                return (
                  (n = n.filter(
                    (e) =>
                      !!e.has("(asia|africa|europe|america)$") ||
                      !e.has("(#City|#Region|#ProperNoun)$") ||
                      !e.after("^(#Country|#Region)").found
                  )),
                  (t = t.splitAfter(n)),
                  t
                );
              })(this);
              return (n = n.getNth(t)), new e(this.document, n.pointer);
            };
          })(e),
          (function (e) {
            e.prototype.organizations = function (e) {
              return this.match("#Organization+").getNth(e);
            };
          })(e),
          (function (e) {
            e.prototype.topics = Nu;
          })(e);
      },
    },
    Tu = function (e, t) {
      let n = { pre: e.none(), post: e.none() };
      if (!e.has("#Adverb")) return n;
      let a = e.splitOn(t);
      return 3 === a.length
        ? { pre: a.eq(0).adverbs(), post: a.eq(2).adverbs() }
        : a.eq(0).isDoc(t)
        ? ((n.post = a.eq(1).adverbs()), n)
        : ((n.pre = a.eq(0).adverbs()), n);
    },
    Ou = function (e, t) {
      let n = e.splitBefore(t);
      if (n.length <= 1) return e.none();
      let a = n.eq(0);
      return (a = a.not("(#Adverb|#Negative|#Prefix)")), a;
    },
    Cu = function (e) {
      return e.match("#Negative");
    },
    Vu = function (e) {
      if (!e.has("(#Particle|#PhrasalVerb)"))
        return { verb: e.none(), particle: e.none() };
      let t = e.match("#Particle$");
      return { verb: e.not(t), particle: t };
    },
    zu = function (e) {
      let t = e.clone();
      t.contractions().expand();
      const n = (function (e) {
        let t = e;
        return (
          e.wordCount() > 1 &&
            (t = e.not("(#Negative|#Auxiliary|#Modal|#Adverb|#Prefix)")),
          t.length > 1 && !t.has("#Phrasal #Particle") && (t = t.last()),
          (t = t.not("(want|wants|wanted) to")),
          t.found || (t = e.not("#Negative")),
          t
        );
      })(t);
      return {
        root: n,
        prefix: t.match("#Prefix"),
        adverbs: Tu(t, n),
        auxiliary: Ou(t, n),
        negative: Cu(t),
        phrasal: Vu(n),
      };
    },
    $u = { tense: "PresentTense" },
    Fu = { conditional: !0 },
    Bu = { tense: "FutureTense" },
    Mu = { progressive: !0 },
    Su = { tense: "PastTense" },
    Gu = { complete: !0, progressive: !1 },
    Lu = { passive: !0 },
    Hu = function (e) {
      let t = {};
      return (
        e.forEach((e) => {
          Object.assign(t, e);
        }),
        t
      );
    },
    qu = {
      imperative: [["#Imperative", []]],
      "want-infinitive": [
        ["^(want|wants|wanted) to #Infinitive$", [$u]],
        ["^wanted to #Infinitive$", [Su]],
        ["^will want to #Infinitive$", [Bu]],
      ],
      "gerund-phrase": [
        ["^#PastTense #Gerund$", [Su]],
        ["^#PresentTense #Gerund$", [$u]],
        ["^#Infinitive #Gerund$", [$u]],
        ["^will #Infinitive #Gerund$", [Bu]],
        ["^have #PastTense #Gerund$", [Su]],
        ["^will have #PastTense #Gerund$", [Su]],
      ],
      "simple-present": [
        ["^#PresentTense$", [$u]],
        ["^#Infinitive$", [$u]],
      ],
      "simple-past": [["^#PastTense$", [Su]]],
      "simple-future": [["^will #Adverb? #Infinitive", [Bu]]],
      "present-progressive": [["^(is|are|am) #Gerund$", [$u, Mu]]],
      "past-progressive": [["^(was|were) #Gerund$", [Su, Mu]]],
      "future-progressive": [["^will be #Gerund$", [Bu, Mu]]],
      "present-perfect": [["^(has|have) #PastTense$", [Su, Gu]]],
      "past-perfect": [
        ["^had #PastTense$", [Su, Gu]],
        ["^had #PastTense to #Infinitive", [Su, Gu]],
      ],
      "future-perfect": [["^will have #PastTense$", [Bu, Gu]]],
      "present-perfect-progressive": [["^(has|have) been #Gerund$", [Su, Mu]]],
      "past-perfect-progressive": [["^had been #Gerund$", [Su, Mu]]],
      "future-perfect-progressive": [["^will have been #Gerund$", [Bu, Mu]]],
      "passive-past": [
        ["(got|were|was) #Passive", [Su, Lu]],
        ["^(was|were) being #Passive", [Su, Lu]],
        ["^(had|have) been #Passive", [Su, Lu]],
      ],
      "passive-present": [
        ["^(is|are|am) #Passive", [$u, Lu]],
        ["^(is|are|am) being #Passive", [$u, Lu]],
        ["^has been #Passive", [$u, Lu]],
      ],
      "passive-future": [
        ["will have been #Passive", [Bu, Lu, Fu]],
        ["will be being? #Passive", [Bu, Lu, Fu]],
      ],
      "present-conditional": [["would be #PastTense", [$u, Fu]]],
      "past-conditional": [["would have been #PastTense", [Su, Fu]]],
      "auxiliary-future": [
        ["(is|are|am|was) going to (#Infinitive|#PresentTense)", [Bu]],
      ],
      "auxiliary-past": [
        ["^did #Infinitive$", [Su, { plural: !1 }]],
        ["^used to #Infinitive$", [Su, Gu]],
      ],
      "auxiliary-present": [
        ["^(does|do) #Infinitive$", [$u, Gu, { plural: !0 }]],
      ],
      "modal-past": [["^(could|must|should|shall) have #PastTense$", [Su]]],
      "modal-infinitive": [["^#Modal #Infinitive$", []]],
      infinitive: [["^#Infinitive$", []]],
    };
  let Wu = [];
  Object.keys(qu).map((e) => {
    qu[e].forEach((t) => {
      Wu.push({ name: e, match: t[0], data: Hu(t[1]) });
    });
  });
  const Ju = Wu,
    _u = function (e, t) {
      let n = {};
      e = (function (e, t) {
        return (
          (e = e.clone()),
          t.adverbs.post && t.adverbs.post.found && e.remove(t.adverbs.post),
          t.adverbs.pre && t.adverbs.pre.found && e.remove(t.adverbs.pre),
          e.has("#Negative") && (e = e.remove("#Negative")),
          e.has("#Prefix") && (e = e.remove("#Prefix")),
          t.root.has("#PhrasalVerb #Particle") && e.remove("#Particle$"),
          e.not("#Adverb")
        );
      })(e, t);
      for (let t = 0; t < Ju.length; t += 1) {
        let a = Ju[t];
        if (!0 === e.has(a.match)) {
          (n.form = a.name), Object.assign(n, a.data);
          break;
        }
      }
      return (
        n.form || (e.has("^#Verb$") && (n.form = "infinitive")),
        n.tense ||
          (n.tense = t.root.has("#PastTense") ? "PastTense" : "PresentTense"),
        (n.copula = t.root.has("#Copula")),
        n
      );
    },
    Ku = function (e) {
      return !(e.length <= 1) && (e.parse()[0] || {}).isSubordinate;
    },
    Uu = function (e, t) {
      return (
        !!t.has("(are|were|does)") ||
        !!e.has("(those|they|we)") ||
        (!(!e.found || !e.isPlural) && e.isPlural().found)
      );
    },
    Ru = function (e) {
      let t = (function (e) {
        let t = e.before();
        t = (function (e) {
          let t = e.clauses();
          return (
            (t = t.filter(
              (e, t) =>
                !(
                  e.has(
                    "^(if|unless|while|but|for|per|at|by|that|which|who|from)"
                  ) ||
                  (t > 0 && e.has("^#Verb . #Noun+$")) ||
                  (t > 0 && e.has("^#Adverb"))
                )
            )),
            0 === t.length ? e : t
          );
        })(t);
        let n = t.nouns(),
          a = n.last(),
          r = a.match("(i|he|she|we|you|they)");
        if (r.found) return r.nouns();
        let o = n.if("^(that|this|those)");
        return o.found ||
          (!1 === n.found && ((o = t.match("^(that|this|those)")), o.found))
          ? o
          : ((a = n.last()),
            Ku(a) && (n.remove(a), (a = n.last())),
            Ku(a) && (n.remove(a), (a = n.last())),
            a);
      })(e);
      return { subject: t, plural: Uu(t, e) };
    },
    Yu = (e) => e,
    Qu = (e, t) => {
      let n = Ru(e),
        a = n.subject;
      return !(!a.has("i") && !a.has("we")) || n.plural;
    },
    Zu = function (e, t) {
      if (e.has("were")) return "are";
      let { subject: n, plural: a } = Ru(e);
      return n.has("i") ? "am" : n.has("we") || a ? "are" : "is";
    },
    Xu = function (e, t) {
      let n = Ru(e),
        a = n.subject;
      return a.has("i") || a.has("we") || n.plural ? "do" : "does";
    },
    ec = function (e) {
      return e.has("#Infinitive")
        ? "Infinitive"
        : e.has("#Participle")
        ? "Participle"
        : e.has("#PastTense")
        ? "PastTense"
        : e.has("#Gerund")
        ? "Gerund"
        : e.has("#PresentTense")
        ? "PresentTense"
        : void 0;
    },
    tc = function (e, t) {
      const { toInfinitive: n } = e.methods.two.transform.verb;
      let a = t.root.text({ keepPunct: !1 });
      return (a = n(a, e.model, ec(e))), a && e.replace(t.root, a), e;
    },
    nc = (e) =>
      e.has("will not") ? e.replace("will not", "have not") : e.remove("will"),
    ac = function (e) {
      return e && e.isView
        ? e.json({ normal: !0, terms: !1, text: !1 }).map((e) => e.normal)
        : [];
    },
    rc = function (e) {
      return e && e.isView ? e.text("normal") : "";
    },
    oc = function (e) {
      const { toInfinitive: t } = e.methods.two.transform.verb;
      return t(e.text("normal"), e.model, ec(e));
    },
    ic = { tags: !0 },
    sc = function (e, t) {
      const { toInfinitive: n } = e.methods.two.transform.verb,
        { root: a, auxiliary: r } = t;
      let o = r.terms().harden(),
        i = a.text("normal");
      if (
        ((i = n(i, e.model, ec(a))),
        i && e.replace(a, i, ic).tag("Verb").firstTerm().tag("Infinitive"),
        o.found && e.remove(o),
        t.negative.found)
      ) {
        e.has("not") || e.prepend("not");
        let t = Xu(e);
        e.prepend(t);
      }
      return (
        e
          .fullSentence()
          .compute(["lexicon", "preTagger", "postTagger", "chunks"]),
        e
      );
    },
    lc = { tags: !0 },
    uc = {
      noAux: (e, t) => (t.auxiliary.found && (e = e.remove(t.auxiliary)), e),
      simple: (e, t) => {
        const { conjugate: n, toInfinitive: a } = e.methods.two.transform.verb,
          r = t.root;
        if (r.has("#Modal")) return e;
        let o = r.text({ keepPunct: !1 });
        return (
          (o = a(o, e.model, ec(r))),
          (o = n(o, e.model).PastTense),
          (o = "been" === o ? "was" : o),
          "was" === o &&
            (o = ((e, t) => {
              let { subject: n, plural: a } = Ru(e);
              return a || n.has("we") ? "were" : "was";
            })(e)),
          o && e.replace(r, o, lc),
          e
        );
      },
      both: function (e, t) {
        return t.negative.found
          ? (e.replace("will", "did"), e)
          : ((e = uc.simple(e, t)), (e = uc.noAux(e, t)));
      },
      hasHad: (e) => (e.replace("has", "had", lc), e),
      hasParticiple: (e, t) => {
        const { conjugate: n, toInfinitive: a } = e.methods.two.transform.verb,
          r = t.root;
        let o = r.text("normal");
        return (o = a(o, e.model, ec(r))), n(o, e.model).Participle;
      },
    },
    cc = {
      infinitive: uc.simple,
      "simple-present": uc.simple,
      "simple-past": Yu,
      "simple-future": uc.both,
      "present-progressive": (e) => (
        e.replace("are", "were", lc), e.replace("(is|are|am)", "was", lc), e
      ),
      "past-progressive": Yu,
      "future-progressive": (e, t) => (
        e.match(t.root).insertBefore("was"), e.remove("(will|be)"), e
      ),
      "present-perfect": uc.hasHad,
      "past-perfect": Yu,
      "future-perfect": (e, t) => (
        e.match(t.root).insertBefore("had"),
        e.has("will") && (e = nc(e)),
        e.remove("have"),
        e
      ),
      "present-perfect-progressive": uc.hasHad,
      "past-perfect-progressive": Yu,
      "future-perfect-progressive": (e) => (
        e.remove("will"), e.replace("have", "had", lc), e
      ),
      "passive-past": (e) => (e.replace("have", "had", lc), e),
      "passive-present": (e) => (e.replace("(is|are)", "was", lc), e),
      "passive-future": (e, t) => (
        t.auxiliary.has("will be") &&
          (e.match(t.root).insertBefore("had been"), e.remove("(will|be)")),
        t.auxiliary.has("will have been") &&
          (e.replace("have", "had", lc), e.remove("will")),
        e
      ),
      "present-conditional": (e) => (e.replace("be", "have been"), e),
      "past-conditional": Yu,
      "auxiliary-future": (e) => (e.replace("(is|are|am)", "was", lc), e),
      "auxiliary-past": Yu,
      "auxiliary-present": (e) => (e.replace("(do|does)", "did", lc), e),
      "modal-infinitive": (e, t) => (
        e.has("can")
          ? e.replace("can", "could", lc)
          : (uc.simple(e, t),
            e.match("#Modal").insertAfter("have").tag("Auxiliary")),
        e
      ),
      "modal-past": Yu,
      "want-infinitive": (e) => (
        e.replace("(want|wants)", "wanted", lc), e.remove("will"), e
      ),
      "gerund-phrase": (e, t) => (
        (t.root = t.root.not("#Gerund$")), uc.simple(e, t), nc(e), e
      ),
    },
    hc = function (e, t, n) {
      return cc.hasOwnProperty(n)
        ? ((e = cc[n](e, t)).fullSentence().compute(["tagger", "chunks"]), e)
        : e;
    },
    dc = { tags: !0 },
    mc = (e, t) => {
      const { conjugate: n, toInfinitive: a } = e.methods.two.transform.verb,
        r = t.root;
      let o = r.text("normal");
      return (
        (o = a(o, e.model, ec(r))),
        !1 === Qu(e) && (o = n(o, e.model).PresentTense),
        r.has("#Copula") && (o = Zu(e)),
        o && (e = e.replace(r, o, dc)).not("#Particle").tag("PresentTense"),
        e
      );
    },
    pc = (e, t) => {
      const { conjugate: n, toInfinitive: a } = e.methods.two.transform.verb,
        r = t.root;
      let o = r.text("normal");
      return (
        (o = a(o, e.model, ec(r))),
        !1 === Qu(e) && (o = n(o, e.model).Gerund),
        o && (e = e.replace(r, o, dc)).not("#Particle").tag("Gerund"),
        e
      );
    },
    gc = {
      infinitive: mc,
      "simple-present": (e, t) => {
        const { conjugate: n } = e.methods.two.transform.verb;
        let { root: a } = t;
        if (!a.has("#Infinitive")) return mc(e, t);
        {
          let t = Ru(e).subject;
          if (Qu(e) || t.has("i")) return e;
          let r = a.text("normal"),
            o = n(r, e.model).PresentTense;
          r !== o && e.replace(a, o, dc);
        }
        return e;
      },
      "simple-past": mc,
      "simple-future": (e, t) => {
        const { root: n, auxiliary: a } = t;
        if (a.has("will") && n.has("be")) {
          let t = Zu(e);
          e.replace(n, t),
            (e = e.remove("will")).replace("not " + t, t + " not");
        } else mc(e, t), (e = e.remove("will"));
        return e;
      },
      "present-progressive": Yu,
      "past-progressive": (e, t) => {
        let n = Zu(e);
        return e.replace("(were|was)", n, dc);
      },
      "future-progressive": (e) => (
        e.match("will").insertBefore("is"), e.remove("be"), e.remove("will")
      ),
      "present-perfect": (e, t) => (mc(e, t), e.remove("(have|had|has)")),
      "past-perfect": (e, t) => {
        let n = Ru(e).subject;
        return Qu(e) || n.has("i")
          ? ((e = tc(e, t)).remove("had"), e)
          : (e.replace("had", "has", dc), e);
      },
      "future-perfect": (e) => (
        e.match("will").insertBefore("has"), e.remove("have").remove("will")
      ),
      "present-perfect-progressive": Yu,
      "past-perfect-progressive": (e) => e.replace("had", "has", dc),
      "future-perfect-progressive": (e) => (
        e.match("will").insertBefore("has"), e.remove("have").remove("will")
      ),
      "passive-past": (e, t) => {
        let n = Zu(e);
        return e.has("(had|have|has)") && e.has("been")
          ? (e.replace("(had|have|has)", n, dc), e.replace("been", "being"), e)
          : e.replace("(got|was|were)", n);
      },
      "passive-present": Yu,
      "passive-future": (e) => (
        e.replace("will", "is"), e.replace("be", "being")
      ),
      "present-conditional": Yu,
      "past-conditional": (e) => (e.replace("been", "be"), e.remove("have")),
      "auxiliary-future": (e, t) => (pc(e, t), e.remove("(going|to)"), e),
      "auxiliary-past": (e, t) => {
        if (t.auxiliary.has("did")) {
          let n = Xu(e);
          return e.replace(t.auxiliary, n), e;
        }
        return pc(e, t), e.replace(t.auxiliary, "is"), e;
      },
      "auxiliary-present": Yu,
      "modal-infinitive": Yu,
      "modal-past": (e, t) => (
        ((e, t) => {
          const { toInfinitive: n } = e.methods.two.transform.verb,
            a = t.root;
          let r = t.root.text("normal");
          (r = n(r, e.model, ec(a))), r && (e = e.replace(t.root, r, dc));
        })(e, t),
        e.remove("have")
      ),
      "gerund-phrase": (e, t) => (
        (t.root = t.root.not("#Gerund$")), mc(e, t), e.remove("(will|have)")
      ),
      "want-infinitive": (e, t) => {
        let n = "wants";
        return (
          Qu(e) && (n = "want"),
          e.replace("(want|wanted|wants)", n, dc),
          e.remove("will"),
          e
        );
      },
    },
    fc = function (e, t, n) {
      return gc.hasOwnProperty(n)
        ? ((e = gc[n](e, t)).fullSentence().compute(["tagger", "chunks"]), e)
        : e;
    },
    yc = { tags: !0 },
    bc = (e, t) => {
      const { toInfinitive: n } = e.methods.two.transform.verb,
        { root: a, auxiliary: r } = t;
      if (a.has("#Modal")) return e;
      let o = a.text("normal");
      return (
        (o = n(o, e.model, ec(a))),
        o && (e = e.replace(a, o, yc)).not("#Particle").tag("Verb"),
        e.prepend("will").match("will").tag("Auxiliary"),
        e.remove(r),
        e
      );
    },
    vc = (e, t) => {
      const { conjugate: n, toInfinitive: a } = e.methods.two.transform.verb,
        { root: r, auxiliary: o } = t;
      let i = r.text("normal");
      return (
        (i = a(i, e.model, ec(r))),
        i &&
          ((i = n(i, e.model).Gerund),
          e.replace(r, i, yc),
          e.not("#Particle").tag("PresentTense")),
        e.remove(o),
        e.prepend("will be").match("will be").tag("Auxiliary"),
        e
      );
    },
    wc = {
      infinitive: bc,
      "simple-present": bc,
      "simple-past": bc,
      "simple-future": Yu,
      "present-progressive": vc,
      "past-progressive": vc,
      "future-progressive": Yu,
      "present-perfect": (e) => (
        e.match("(have|has)").replaceWith("will have"), e
      ),
      "past-perfect": (e) => e.replace("(had|has)", "will have"),
      "future-perfect": Yu,
      "present-perfect-progressive": (e) => e.replace("has", "will have"),
      "past-perfect-progressive": (e) => e.replace("had", "will have"),
      "future-perfect-progressive": Yu,
      "passive-past": (e) =>
        e.has("got")
          ? e.replace("got", "will get")
          : e.has("(was|were)")
          ? (e.replace("(was|were)", "will be"), e.remove("being"))
          : e.has("(have|has|had) been")
          ? e.replace("(have|has|had) been", "will be")
          : e,
      "passive-present": (e) => (
        e.replace("being", "will be"), e.remove("(is|are|am)"), e
      ),
      "passive-future": Yu,
      "present-conditional": (e) => e.replace("would", "will"),
      "past-conditional": (e) => e.replace("would", "will"),
      "auxiliary-future": Yu,
      "auxiliary-past": (e) =>
        e.has("used") && e.has("to")
          ? (e.replace("used", "will"), e.remove("to"))
          : (e.replace("did", "will"), e),
      "auxiliary-present": (e) => e.replace("(do|does)", "will"),
      "modal-infinitive": Yu,
      "modal-past": Yu,
      "gerund-phrase": (e, t) => (
        (t.root = t.root.not("#Gerund$")), bc(e, t), e.remove("(had|have)")
      ),
      "want-infinitive": (e) => (
        e.replace("(want|wants|wanted)", "will want"), e
      ),
    },
    kc = function (e, t, n) {
      return e.has("will") || e.has("going to")
        ? e
        : wc.hasOwnProperty(n)
        ? ((e = wc[n](e, t)).fullSentence().compute(["tagger", "chunks"]), e)
        : e;
    },
    Pc = { tags: !0 },
    jc = { tags: !0 },
    Ac = function (e, t) {
      let n = Xu(e);
      return e.prepend(n + " not"), e;
    },
    xc = function (e) {
      let t = e.match("be");
      return t.found
        ? (t.prepend("not"), e)
        : ((t = e.match("(is|was|am|are|will|were)")),
          t.found ? (t.append("not"), e) : e);
    },
    Dc = (e) => e.has("(is|was|am|are|will|were|be)"),
    Ic = {
      "simple-present": (e, t) =>
        !0 === Dc(e) ? xc(e) : ((e = tc(e, t)), (e = Ac(e))),
      "simple-past": (e, t) =>
        !0 === Dc(e) ? xc(e) : ((e = tc(e, t)).prepend("did not"), e),
      imperative: (e) => (e.prepend("do not"), e),
      infinitive: (e, t) => (!0 === Dc(e) ? xc(e) : Ac(e)),
      "passive-past": (e) => {
        if (e.has("got"))
          return e.replace("got", "get", jc), e.prepend("did not"), e;
        let t = e.match("(was|were|had|have)");
        return t.found && t.append("not"), e;
      },
      "auxiliary-past": (e) => {
        if (e.has("used")) return e.prepend("did not"), e;
        let t = e.match("(did|does|do)");
        return t.found && t.append("not"), e;
      },
      "want-infinitive": (e, t) => (e = Ac(e)).replace("wants", "want", jc),
    },
    Nc = {
      api: function (e) {
        class t extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = "Verbs");
          }
          parse(e) {
            return this.getNth(e).map(zu);
          }
          json(e, t) {
            let n = this.getNth(t).map((t) => {
              let n = t.toView().json(e)[0] || {};
              return (
                (n.verb = (function (e) {
                  let t = zu(e);
                  e = e.clone().toView();
                  const n = _u(e, t);
                  return {
                    root: t.root.text(),
                    preAdverbs: ac(t.adverbs.pre),
                    postAdverbs: ac(t.adverbs.post),
                    auxiliary: rc(t.auxiliary),
                    negative: t.negative.found,
                    prefix: rc(t.prefix),
                    infinitive: oc(t.root),
                    grammar: n,
                  };
                })(t)),
                n
              );
            }, []);
            return n;
          }
          subjects(e) {
            return this.getNth(e).map((e) => {
              zu(e);
              return Ru(e).subject;
            });
          }
          adverbs(e) {
            return this.getNth(e).map((e) => e.match("#Adverb"));
          }
          isSingular(e) {
            return this.getNth(e).filter((e) => !0 !== Ru(e).plural);
          }
          isPlural(e) {
            return this.getNth(e).filter((e) => !0 === Ru(e).plural);
          }
          isImperative(e) {
            return this.getNth(e).filter((e) => e.has("#Imperative"));
          }
          toInfinitive(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e),
                n = _u(e, t);
              return sc(e, t, n.form);
            });
          }
          toPresentTense(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e),
                n = _u(e, t);
              return fc(e, t, n.form);
            });
          }
          toPastTense(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e),
                n = _u(e, t);
              return hc(e, t, n.form);
            });
          }
          toFutureTense(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e),
                n = _u(e, t);
              return kc(e, t, n.form);
            });
          }
          toGerund(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e);
              return (function (e, t) {
                const { toInfinitive: n, conjugate: a } =
                    e.methods.two.transform.verb,
                  { root: r, auxiliary: o } = t;
                if (e.has("#Gerund")) return e;
                let i = r.text("normal");
                i = n(i, e.model, ec(r));
                let s = a(i, e.model).Gerund;
                return (
                  s && ((s = `${Zu(e)} ${s}`), e.replace(r, s, Pc)),
                  o.found && e.remove(o),
                  e.replace("not is", "is not"),
                  e.replace("not are", "are not"),
                  e.fullSentence().compute(["tagger", "chunks"]),
                  e
                );
              })(e, t, _u(e, t).form);
            });
          }
          conjugate(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e),
                n = _u(e, t);
              return (
                "imperative" === n.form && (n.form = "simple-present"),
                {
                  Infinitive: sc(e.clone(), t, n.form).text("normal"),
                  PastTense: hc(e.clone(), t, n.form).text("normal"),
                  PresentTense: fc(e.clone(), t, n.form).text("normal"),
                  FutureTense: kc(e.clone(), t, n.form).text("normal"),
                }
              );
            }, []);
          }
          isNegative() {
            return this.if("#Negative");
          }
          isPositive() {
            return this.ifNo("#Negative");
          }
          toPositive() {
            let e = this.match("do not #Verb");
            return e.found && e.remove("do not"), this.remove("#Negative");
          }
          toNegative(e) {
            return this.getNth(e).map((e) => {
              let t = zu(e);
              return (function (e, t, n) {
                if (e.has("#Negative")) return e;
                if (Ic.hasOwnProperty(n)) return Ic[n](e, t);
                let a = e.matchOne("be");
                return a.found
                  ? (a.prepend("not"), e)
                  : !0 === Dc(e)
                  ? xc(e)
                  : ((a = e.matchOne("(will|had|have|has|did|does|do|#Modal)")),
                    a.found ? (a.append("not"), e) : e);
              })(e, t, _u(e, t).form);
            });
          }
          update(e) {
            let n = new t(this.document, e);
            return (n._cache = this._cache), n;
          }
        }
        (t.prototype.toPast = t.prototype.toPastTense),
          (t.prototype.toPresent = t.prototype.toPresentTense),
          (t.prototype.toFuture = t.prototype.toFutureTense),
          (e.prototype.verbs = function (e) {
            let n = (function (e) {
              let t = e.match("<Verb>");
              return (
                (t = t.not("(#Conjunction && !to)")),
                (t = t.not("#Preposition")),
                (t = t.splitAfter("@hasComma")),
                (t = t.splitAfter("[(do|did|am|was|is|will)] (is|was)", 0)),
                (t = t.splitBefore("(#Verb && !#Copula) [being] #Verb", 0)),
                (t = t.splitBefore("#Verb [to be] #Verb", 0)),
                (t = t.splitAfter("[help] #PresentTense", 0)),
                (t = t.splitBefore("(#PresentTense|#PastTense) [#Copula]$", 0)),
                (t = t.splitBefore("(#PresentTense|#PastTense) [will be]$", 0)),
                (t = t.not("#Reflexive$")),
                (t = t.splitAfter("[#PastTense] #PastTense", 0)),
                (t = t.splitAfter("[#PastTense] #Auxiliary+ #PastTense", 0)),
                (t = t.splitAfter("#Copula [#Gerund] #PastTense", 0)),
                (t = t.if("#Verb")),
                t.has("(#Verb && !#Auxiliary) #Adverb+? #Copula") &&
                  (t = t.splitBefore("#Copula")),
                t
              );
            })(this);
            return (n = n.getNth(e)), new t(this.document, n.pointer);
          });
      },
    },
    Ec = function (e, t) {
      let n = t.match(e);
      if (n.found) {
        let e = n.pronouns().refersTo();
        if (e.found) return e;
      }
      return t.none();
    },
    Tc = function (e) {
      if (!e.found) return e;
      let [t] = e.fullPointer[0];
      return t && t > 0 ? e.update([[t - 1]]) : e.none();
    },
    Oc = function (e, t) {
      let n = e.people();
      return (
        (n = (function (e, t) {
          return "m" === t
            ? e.filter((e) => !e.presumedFemale().found)
            : "f" === t
            ? e.filter((e) => !e.presumedMale().found)
            : e;
        })(n, t)),
        n.found
          ? n.last()
          : ((n = e.nouns("#Actor")),
            n.found
              ? n.last()
              : "f" === t
              ? Ec("(she|her|hers)", e)
              : "m" === t
              ? Ec("(he|him|his)", e)
              : e.none())
      );
    },
    Cc = function (e) {
      let t = e.nouns(),
        n = t.isPlural().notIf("#Pronoun");
      if (n.found) return n.last();
      let a = Ec("(they|their|theirs)", e);
      return a.found
        ? a
        : ((n = t.match(
            "(somebody|nobody|everybody|anybody|someone|noone|everyone|anyone)"
          )),
          n.found ? n.last() : e.none());
    },
    Vc = function (e, t) {
      let n = e.before(),
        a = t(n);
      return a.found
        ? a
        : ((n = Tc(e)),
          (a = t(n)),
          a.found ? a : ((n = Tc(n)), (a = t(n)), a.found ? a : e.none()));
    },
    zc = {
      compute: {
        coreference: function (e) {
          e.pronouns()
            .if("(he|him|his|she|her|hers|they|their|theirs|it|its)")
            .forEach((e) => {
              let t = null;
              e.has("(he|him|his)")
                ? (t = Vc(e, (e) => Oc(e, "m")))
                : e.has("(she|her|hers)")
                ? (t = Vc(e, (e) => Oc(e, "f")))
                : e.has("(they|their|theirs)") && (t = Vc(e, Cc)),
                t &&
                  t.found &&
                  (function (e, t) {
                    t && t.found && (e.docs[0][0].reference = t.ptrs[0]);
                  })(e, t);
            });
        },
      },
      api: function (e) {
        class t extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = "Pronouns");
          }
          hasReference() {
            return (
              this.compute("coreference"),
              this.filter((e) => e.docs[0][0].reference)
            );
          }
          refersTo() {
            return (
              this.compute("coreference"),
              this.map((e) => {
                if (!e.found) return e.none();
                let t = e.docs[0][0];
                return t.reference ? e.update([t.reference]) : e.none();
              })
            );
          }
          update(e) {
            let n = new t(this.document, e);
            return (n._cache = this._cache), n;
          }
        }
        e.prototype.pronouns = function (e) {
          let n = this.match("#Pronoun");
          return (n = n.getNth(e)), new t(n.document, n.pointer);
        };
      },
    };
  nl.plugin(ul),
    nl.plugin(zc),
    nl.plugin(jl),
    nl.plugin(Tl),
    nl.plugin(Gl),
    nl.plugin(gu),
    nl.plugin(vu),
    nl.plugin(Pu),
    nl.plugin(Eu),
    nl.plugin(Nc);
  const $c = nl,
    Fc = {
      second: !0,
      minute: !0,
      hour: !0,
      day: !0,
      week: !0,
      weekend: !0,
      month: !0,
      season: !0,
      quarter: !0,
      year: !0,
    },
    Bc = { wk: "week", min: "minute", sec: "second", weekend: "week" },
    Mc = function (e) {
      let t = e.match("#Duration").text("normal");
      return (t = t.replace(/s$/, "")), Bc.hasOwnProperty(t) && (t = Bc[t]), t;
    },
    Sc = { minute: !0 },
    Gc = (e, t, n) => {
      const [a, r] = e.split("/"),
        [o, i] = r.split(":");
      return Date.UTC(n, a - 1, o, i) - 36e5 * t;
    },
    Lc = (e, t, n, a, r) => {
      const o = new Date(e).getUTCFullYear(),
        i = Gc(t, r, o),
        s = Gc(n, a, o);
      return e >= i && e < s;
    },
    Hc = {
      "9|s": "2/dili,2/jayapura",
      "9|n":
        "2/chita,2/khandyga,2/pyongyang,2/seoul,2/tokyo,11/palau,japan,rok",
      "9.5|s|04/03:03->10/02:02":
        "4/adelaide,4/broken_hill,4/south,4/yancowinna",
      "9.5|s": "4/darwin,4/north",
      "8|s|03/08:01->10/04:00": "12/casey",
      "8|s":
        "2/kuala_lumpur,2/makassar,2/singapore,4/perth,2/ujung_pandang,4/west,singapore",
      "8|n":
        "2/brunei,2/choibalsan,2/hong_kong,2/irkutsk,2/kuching,2/macau,2/manila,2/shanghai,2/taipei,2/ulaanbaatar,2/chongqing,2/chungking,2/harbin,2/macao,2/ulan_bator,hongkong,prc,roc",
      "8.75|s": "4/eucla",
      "7|s": "12/davis,2/jakarta,9/christmas",
      "7|n":
        "2/bangkok,2/barnaul,2/hovd,2/krasnoyarsk,2/novokuznetsk,2/novosibirsk,2/phnom_penh,2/pontianak,2/ho_chi_minh,2/tomsk,2/vientiane,2/saigon",
      "6|s": "12/vostok",
      "6|n":
        "2/almaty,2/bishkek,2/dhaka,2/omsk,2/qyzylorda,2/qostanay,2/thimphu,2/urumqi,9/chagos,2/dacca,2/kashgar,2/thimbu",
      "6.5|n": "2/yangon,9/cocos,2/rangoon",
      "5|s": "12/mawson,9/kerguelen",
      "5|n":
        "2/aqtau,2/aqtobe,2/ashgabat,2/atyrau,2/dushanbe,2/karachi,2/oral,2/samarkand,2/tashkent,2/yekaterinburg,9/maldives,2/ashkhabad",
      "5.75|n": "2/katmandu,2/kathmandu",
      "5.5|n": "2/kolkata,2/colombo,2/calcutta",
      "4|s": "9/reunion",
      "4|n":
        "2/baku,2/dubai,2/muscat,2/tbilisi,2/yerevan,8/astrakhan,8/samara,8/saratov,8/ulyanovsk,8/volgograd,2/volgograd,9/mahe,9/mauritius",
      "4.5|n|03/22:00->09/21:24": "2/tehran,iran",
      "4.5|n": "2/kabul",
      "3|s": "12/syowa,9/antananarivo",
      "3|n|03/27:03->10/30:04":
        "2/famagusta,2/nicosia,8/athens,8/bucharest,8/helsinki,8/kiev,8/mariehamn,8/riga,8/sofia,8/tallinn,8/uzhgorod,8/vilnius,8/zaporozhye,8/nicosia",
      "3|n|03/27:02->10/30:03": "8/chisinau,8/tiraspol",
      "3|n|03/27:00->10/29:24": "2/beirut",
      "3|n|03/27:00->10/28:01": "2/gaza,2/hebron",
      "3|n|03/25:02->10/30:02": "2/jerusalem,2/tel_aviv,israel",
      "3|n|03/25:00->10/27:24": "2/damascus",
      "3|n|02/25:00->10/28:01": "2/amman",
      "3|n":
        "0/addis_ababa,0/asmara,0/asmera,0/dar_es_salaam,0/djibouti,0/juba,0/kampala,0/mogadishu,0/nairobi,2/aden,2/baghdad,2/bahrain,2/kuwait,2/qatar,2/riyadh,8/istanbul,8/kirov,8/minsk,8/moscow,8/simferopol,9/comoro,9/mayotte,2/istanbul,turkey,w-su",
      "2|s|03/27:02->10/30:02": "12/troll",
      "2|s":
        "0/gaborone,0/harare,0/johannesburg,0/lubumbashi,0/lusaka,0/maputo,0/maseru,0/mbabane",
      "2|n|03/27:02->10/30:03":
        "0/ceuta,arctic/longyearbyen,8/amsterdam,8/andorra,8/belgrade,8/berlin,8/bratislava,8/brussels,8/budapest,8/busingen,8/copenhagen,8/gibraltar,8/ljubljana,8/luxembourg,8/madrid,8/malta,8/monaco,8/oslo,8/paris,8/podgorica,8/prague,8/rome,8/san_marino,8/sarajevo,8/skopje,8/stockholm,8/tirane,8/vaduz,8/vatican,8/vienna,8/warsaw,8/zagreb,8/zurich,3/jan_mayen,poland",
      "2|n":
        "0/blantyre,0/bujumbura,0/cairo,0/khartoum,0/kigali,0/tripoli,8/kaliningrad,egypt,libya",
      "1|s": "0/brazzaville,0/kinshasa,0/luanda,0/windhoek",
      "1|n|03/27:03->05/08:02": "0/casablanca,0/el_aaiun",
      "1|n|03/27:01->10/30:02":
        "3/canary,3/faroe,3/madeira,8/dublin,8/guernsey,8/isle_of_man,8/jersey,8/lisbon,8/london,3/faeroe,eire,8/belfast,gb-eire,gb,portugal",
      "1|n":
        "0/algiers,0/bangui,0/douala,0/lagos,0/libreville,0/malabo,0/ndjamena,0/niamey,0/porto-novo,0/tunis",
      "14|n": "11/kiritimati",
      "13|s|04/04:04->09/26:03": "11/apia",
      "13|s|01/15:02->11/05:03": "11/tongatapu",
      "13|n": "11/enderbury,11/fakaofo",
      "12|s|04/03:03->09/25:02": "12/mcmurdo,11/auckland,12/south_pole,nz",
      "12|s|01/17:03->11/14:02": "11/fiji",
      "12|n":
        "2/anadyr,2/kamchatka,2/srednekolymsk,11/funafuti,11/kwajalein,11/majuro,11/nauru,11/tarawa,11/wake,11/wallis,kwajalein",
      "12.75|s|04/03:03->04/03:02": "11/chatham,nz-chat",
      "11|s|04/03:03->10/02:02": "12/macquarie",
      "11|s": "11/bougainville",
      "11|n":
        "2/magadan,2/sakhalin,11/efate,11/guadalcanal,11/kosrae,11/noumea,11/pohnpei,11/ponape",
      "11.5|n|04/03:03->10/02:02": "11/norfolk",
      "10|s|04/03:03->10/02:02":
        "4/currie,4/hobart,4/melbourne,4/sydney,4/act,4/canberra,4/nsw,4/tasmania,4/victoria",
      "10|s":
        "12/dumontdurville,4/brisbane,4/lindeman,11/port_moresby,4/queensland",
      "10|n":
        "2/ust-nera,2/vladivostok,2/yakutsk,11/guam,11/saipan,11/chuuk,11/truk,11/yap",
      "10.5|s|04/03:01->10/02:02": "4/lord_howe,4/lhi",
      "0|n|03/27:00->10/30:01": "1/scoresbysund,3/azores",
      "0|n":
        "0/abidjan,0/accra,0/bamako,0/banjul,0/bissau,0/conakry,0/dakar,0/freetown,0/lome,0/monrovia,0/nouakchott,0/ouagadougou,0/sao_tome,1/danmarkshavn,3/reykjavik,3/st_helena,13/gmt,13/utc,0/timbuktu,13/greenwich,13/uct,13/universal,13/zulu,gmt-0,gmt+0,gmt0,greenwich,iceland,uct,universal,utc,zulu",
      "-9|n|03/13:02->11/06:02": "1/adak,1/atka,us/aleutian",
      "-9|n": "11/gambier",
      "-9.5|n": "11/marquesas",
      "-8|n|03/13:02->11/06:02":
        "1/anchorage,1/juneau,1/metlakatla,1/nome,1/sitka,1/yakutat,us/alaska",
      "-8|n": "11/pitcairn",
      "-7|n|03/13:02->11/06:02":
        "1/los_angeles,1/santa_isabel,1/tijuana,1/vancouver,1/ensenada,6/pacific,10/bajanorte,us/pacific-new,us/pacific",
      "-7|n|03/08:02->11/01:01": "1/dawson,1/whitehorse,6/yukon",
      "-7|n":
        "1/creston,1/dawson_creek,1/fort_nelson,1/hermosillo,1/phoenix,us/arizona",
      "-6|s|04/02:22->09/03:22": "11/easter,7/easterisland",
      "-6|n|04/03:02->10/30:02": "1/chihuahua,1/mazatlan,10/bajasur",
      "-6|n|03/13:02->11/06:02":
        "1/boise,1/cambridge_bay,1/denver,1/edmonton,1/inuvik,1/ojinaga,1/yellowknife,1/shiprock,6/mountain,navajo,us/mountain",
      "-6|n":
        "1/belize,1/costa_rica,1/el_salvador,1/guatemala,1/managua,1/regina,1/swift_current,1/tegucigalpa,11/galapagos,6/east-saskatchewan,6/saskatchewan",
      "-5|s": "1/lima,1/rio_branco,1/porto_acre,5/acre",
      "-5|n|04/03:02->10/30:02":
        "1/bahia_banderas,1/merida,1/mexico_city,1/monterrey,10/general",
      "-5|n|03/13:02->11/06:02":
        "1/chicago,1/matamoros,1/menominee,1/rainy_river,1/rankin_inlet,1/resolute,1/winnipeg,1/indiana/knox,1/indiana/tell_city,1/north_dakota/beulah,1/north_dakota/center,1/north_dakota/new_salem,1/knox_in,6/central,us/central,us/indiana-starke",
      "-5|n|03/12:03->11/05:01": "1/north_dakota",
      "-5|n":
        "1/bogota,1/cancun,1/cayman,1/coral_harbour,1/eirunepe,1/guayaquil,1/jamaica,1/panama,1/atikokan,jamaica",
      "-4|s|05/13:23->08/13:01": "12/palmer",
      "-4|s|04/02:24->09/04:00": "1/santiago,7/continental",
      "-4|s|03/26:24->10/02:00": "1/asuncion",
      "-4|s|02/16:24->11/03:00": "1/campo_grande,1/cuiaba",
      "-4|s": "1/la_paz,1/manaus,5/west",
      "-4|n|03/13:02->11/06:02":
        "1/detroit,1/grand_turk,1/indianapolis,1/iqaluit,1/louisville,1/montreal,1/nassau,1/new_york,1/nipigon,1/pangnirtung,1/port-au-prince,1/thunder_bay,1/toronto,1/indiana/marengo,1/indiana/petersburg,1/indiana/vevay,1/indiana/vincennes,1/indiana/winamac,1/kentucky/monticello,1/fort_wayne,1/indiana/indianapolis,1/kentucky/louisville,6/eastern,us/east-indiana,us/eastern,us/michigan",
      "-4|n|03/13:00->11/06:01": "1/havana,cuba",
      "-4|n|03/12:03->11/05:01": "1/indiana,1/kentucky",
      "-4|n":
        "1/anguilla,1/antigua,1/aruba,1/barbados,1/blanc-sablon,1/boa_vista,1/caracas,1/curacao,1/dominica,1/grenada,1/guadeloupe,1/guyana,1/kralendijk,1/lower_princes,1/marigot,1/martinique,1/montserrat,1/port_of_spain,1/porto_velho,1/puerto_rico,1/santo_domingo,1/st_barthelemy,1/st_kitts,1/st_lucia,1/st_thomas,1/st_vincent,1/tortola,1/virgin",
      "-3|s":
        "1/argentina,1/buenos_aires,1/catamarca,1/cordoba,1/fortaleza,1/jujuy,1/mendoza,1/montevideo,1/punta_arenas,1/sao_paulo,12/rothera,3/stanley,1/argentina/la_rioja,1/argentina/rio_gallegos,1/argentina/salta,1/argentina/san_juan,1/argentina/san_luis,1/argentina/tucuman,1/argentina/ushuaia,1/argentina/comodrivadavia,1/argentina/buenos_aires,1/argentina/catamarca,1/argentina/cordoba,1/argentina/jujuy,1/argentina/mendoza,1/argentina/rosario,1/rosario,5/east",
      "-3|n|03/13:02->11/06:02":
        "1/glace_bay,1/goose_bay,1/halifax,1/moncton,1/thule,3/bermuda,6/atlantic",
      "-3|n":
        "1/araguaina,1/bahia,1/belem,1/cayenne,1/maceio,1/paramaribo,1/recife,1/santarem",
      "-2|n|03/26:22->10/29:23": "1/nuuk,1/godthab",
      "-2|n|03/13:02->11/06:02": "1/miquelon",
      "-2|n": "1/noronha,3/south_georgia,5/denoronha",
      "-2.5|n|03/13:02->11/06:02": "1/st_johns,6/newfoundland",
      "-1|n": "3/cape_verde",
      "-11|n": "11/midway,11/niue,11/pago_pago,11/samoa,us/samoa",
      "-10|n": "11/honolulu,11/johnston,11/rarotonga,11/tahiti,us/hawaii",
    },
    qc = [
      "africa",
      "america",
      "asia",
      "atlantic",
      "australia",
      "brazil",
      "canada",
      "chile",
      "europe",
      "indian",
      "mexico",
      "pacific",
      "antarctica",
      "etc",
    ];
  let Wc = {};
  Object.keys(Hc).forEach((e) => {
    let t = e.split("|"),
      n = { offset: Number(t[0]), hem: t[1] };
    t[2] && (n.dst = t[2]),
      Hc[e].split(",").forEach((e) => {
        (e = e.replace(
          /(^[0-9]+)\//,
          (e, t) => ((t = Number(t)), qc[t] + "/")
        )),
          (Wc[e] = n);
      });
  }),
    (Wc.utc = { offset: 0, hem: "n" });
  for (let e = -14; e <= 14; e += 0.5) {
    let t = e;
    t > 0 && (t = "+" + t);
    let n = "etc/gmt" + t;
    (Wc[n] = { offset: -1 * e, hem: "n" }),
      (n = "utc/gmt" + t),
      (Wc[n] = { offset: -1 * e, hem: "n" });
  }
  const Jc = Wc,
    _c = /(\-?[0-9]+)h(rs)?/i,
    Kc = /(\-?[0-9]+)/,
    Uc = /utc([\-+]?[0-9]+)/i,
    Rc = /gmt([\-+]?[0-9]+)/i,
    Yc = function (e) {
      return (e = Number(e)) >= -13 && e <= 13
        ? "etc/gmt" + (e = ((e *= -1) > 0 ? "+" : "") + e)
        : null;
    },
    Qc = (() => {
      let e = (() => {
        if ("undefined" == typeof Intl || void 0 === Intl.DateTimeFormat)
          return null;
        let e = Intl.DateTimeFormat();
        if (void 0 === e || void 0 === e.resolvedOptions) return null;
        let t = e.resolvedOptions().timeZone;
        return t ? t.toLowerCase() : null;
      })();
      return null === e ? "utc" : e;
    })(),
    Zc = Object.keys(Jc).reduce((e, t) => {
      let n = t.split("/")[1] || "";
      return (n = n.replace(/_/g, " ")), (e[n] = t), e;
    }, {}),
    Xc = (e, t) => {
      if (!e) return Qc;
      "string" != typeof e &&
        console.error("Timezone must be a string - recieved: '", e, "'\n");
      let n = e.trim();
      if (((n = n.toLowerCase()), !0 === t.hasOwnProperty(n))) return n;
      if (
        ((n = ((e) =>
          (e = (e = (e = (e = (e = e.replace(/ time/g, "")).replace(
            / (standard|daylight|summer)/g,
            ""
          )).replace(/\b(east|west|north|south)ern/g, "$1")).replace(
            /\b(africa|america|australia)n/g,
            "$1"
          )).replace(/\beuropean/g, "europe")).replace(/\islands/g, "island"))(
          n
        )),
        !0 === t.hasOwnProperty(n))
      )
        return n;
      if (!0 === Zc.hasOwnProperty(n)) return Zc[n];
      if (!0 === /[0-9]/.test(n)) {
        let e = (function (e) {
          let t = e.match(_c);
          if (null !== t) return Yc(t[1]);
          if (((t = e.match(Uc)), null !== t)) return Yc(t[1]);
          if (((t = e.match(Rc)), null !== t)) {
            let e = -1 * Number(t[1]);
            return Yc(e);
          }
          return (t = e.match(Kc)), null !== t ? Yc(t[1]) : null;
        })(n);
        if (e) return e;
      }
      throw new Error(
        "Spacetime: Cannot find timezone named: '" +
          e +
          "'. Please enter an IANA timezone id."
      );
    };
  function eh(e) {
    return (e % 4 == 0 && e % 100 != 0) || e % 400 == 0;
  }
  function th(e) {
    return (
      "[object Date]" === Object.prototype.toString.call(e) &&
      !isNaN(e.valueOf())
    );
  }
  function nh(e) {
    return "[object Object]" === Object.prototype.toString.call(e);
  }
  function ah(e, t = 2) {
    return (e += "").length >= t
      ? e
      : new Array(t - e.length + 1).join("0") + e;
  }
  function rh(e) {
    let t = e % 10,
      n = e % 100;
    return 1 === t && 11 !== n
      ? e + "st"
      : 2 === t && 12 !== n
      ? e + "nd"
      : 3 === t && 13 !== n
      ? e + "rd"
      : e + "th";
  }
  function oh(e) {
    return (
      (e = (e = String(e)).replace(/([0-9])(st|nd|rd|th)$/i, "$1")),
      parseInt(e, 10)
    );
  }
  function ih(e = "") {
    return "day" ===
      (e = (e = (e = (e = e.toLowerCase().trim()).replace(/ies$/, "y")).replace(
        /s$/,
        ""
      )).replace(/-/g, "")) || "days" === e
      ? "date"
      : "min" === e || "mins" === e
      ? "minute"
      : e;
  }
  function sh(e) {
    return "number" == typeof e
      ? e
      : th(e)
      ? e.getTime()
      : e.epoch
      ? e.epoch
      : null;
  }
  function lh(e, t) {
    return !1 === nh(e) ? t.clone().set(e) : e;
  }
  function uh(e, t = "") {
    const n = e > 0 ? "+" : "-",
      a = Math.abs(e);
    return `${n}${ah(parseInt("" + a, 10))}${t}${ah((a % 1) * 60)}`;
  }
  const ch = { year: new Date().getFullYear(), month: 0, date: 1 },
    hh = {
      parseArray: (e, t, n) => {
        if (0 === t.length) return e;
        let a = [
          "year",
          "month",
          "date",
          "hour",
          "minute",
          "second",
          "millisecond",
        ];
        for (let r = 0; r < a.length; r++) {
          let o = t[r] || n[a[r]] || ch[a[r]] || 0;
          e = e[a[r]](o);
        }
        return e;
      },
      parseObject: (e, t, n) => {
        if (0 === Object.keys(t).length) return e;
        t = Object.assign({}, ch, n, t);
        let a = Object.keys(t);
        for (let r = 0; r < a.length; r++) {
          let o = a[r];
          if (void 0 === e[o] || "function" != typeof e[o]) continue;
          if (null === t[o] || void 0 === t[o] || "" === t[o]) continue;
          let i = t[o] || n[o] || ch[o] || 0;
          e = e[o](i);
        }
        return e;
      },
      parseNumber: function (e, t) {
        return (
          t > 0 &&
            t < 25e8 &&
            !1 === e.silent &&
            (console.warn(
              "  - Warning: You are setting the date to January 1970."
            ),
            console.warn(
              "       -   did input seconds instead of milliseconds?"
            )),
          (e.epoch = t),
          e
        );
      },
    },
    dh = function (e) {
      return (
        (e.epoch = Date.now()),
        Object.keys(e._today || {}).forEach((t) => {
          "function" == typeof e[t] && (e = e[t](e._today[t]));
        }),
        e
      );
    },
    mh = {
      now: (e) => dh(e),
      today: (e) => dh(e),
      tonight: (e) => (e = dh(e)).hour(18),
      tomorrow: (e) => (e = (e = dh(e)).add(1, "day")).startOf("day"),
      yesterday: (e) => (e = (e = dh(e)).subtract(1, "day")).startOf("day"),
      christmas: (e) => {
        let t = dh(e).year();
        return e.set([t, 11, 25, 18, 0, 0]);
      },
      "new years": (e) => {
        let t = dh(e).year();
        return e.set([t, 11, 31, 18, 0, 0]);
      },
    };
  mh["new years eve"] = mh["new years"];
  const ph = mh;
  let gh = { millisecond: 1, second: 1e3, minute: 6e4, hour: 36e5, day: 864e5 };
  (gh.date = gh.day),
    (gh.month = 25488e5),
    (gh.week = 6048e5),
    (gh.year = 3154e7),
    Object.keys(gh).forEach((e) => {
      gh[e + "s"] = gh[e];
    });
  const fh = gh,
    yh = (e, t, n, a, r) => {
      let o = e.d[n]();
      if (o === t) return;
      let i = null === r ? null : e.d[r](),
        s = e.epoch,
        l = t - o;
      (e.epoch += fh[a] * l),
        "day" === a && Math.abs(l) > 28 && t < 28 && (e.epoch += fh.hour),
        null !== r && i !== e.d[r]() && (e.epoch = s);
      const u = fh[a] / 2;
      for (; e.d[n]() < t; ) e.epoch += u;
      for (; e.d[n]() > t; ) e.epoch -= u;
      null !== r && i !== e.d[r]() && (e.epoch = s);
    },
    bh = {
      year: {
        valid: (e) => e > -4e3 && e < 4e3,
        walkTo: (e, t) => yh(e, t, "getFullYear", "year", null),
      },
      month: {
        valid: (e) => e >= 0 && e <= 11,
        walkTo: (e, t) => {
          let n = e.d,
            a = n.getMonth(),
            r = e.epoch,
            o = n.getFullYear();
          if (a === t) return;
          let i = t - a;
          for (
            e.epoch += fh.day * (28 * i),
              o !== e.d.getFullYear() && (e.epoch = r);
            e.d.getMonth() < t;

          )
            e.epoch += fh.day;
          for (; e.d.getMonth() > t; ) e.epoch -= fh.day;
        },
      },
      date: {
        valid: (e) => e > 0 && e <= 31,
        walkTo: (e, t) => yh(e, t, "getDate", "day", "getMonth"),
      },
      hour: {
        valid: (e) => e >= 0 && e < 24,
        walkTo: (e, t) => yh(e, t, "getHours", "hour", "getDate"),
      },
      minute: {
        valid: (e) => e >= 0 && e < 60,
        walkTo: (e, t) => yh(e, t, "getMinutes", "minute", "getHours"),
      },
      second: {
        valid: (e) => e >= 0 && e < 60,
        walkTo: (e, t) => {
          e.epoch = e.seconds(t).epoch;
        },
      },
      millisecond: {
        valid: (e) => e >= 0 && e < 1e3,
        walkTo: (e, t) => {
          e.epoch = e.milliseconds(t).epoch;
        },
      },
    },
    vh = (e, t) => {
      let n = Object.keys(bh),
        a = e.clone();
      for (let r = 0; r < n.length; r++) {
        let o = n[r],
          i = t[o];
        if (
          (void 0 === i && (i = a[o]()),
          "string" == typeof i && (i = parseInt(i, 10)),
          !bh[o].valid(i))
        )
          return (
            (e.epoch = null),
            void (!1 === e.silent && console.warn("invalid " + o + ": " + i))
          );
        bh[o].walkTo(e, i);
      }
    },
    wh = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let kh = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    Ph = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
  function jh() {
    return kh;
  }
  function Ah() {
    return (function () {
      const e = { sep: 8 };
      for (let t = 0; t < kh.length; t++) e[kh[t]] = t;
      for (let t = 0; t < Ph.length; t++) e[Ph[t]] = t;
      return e;
    })();
  }
  let xh = Ah();
  const Dh = (e) => {
      if (!0 !== wh.hasOwnProperty(e.month)) return !1;
      if (1 === e.month) return !!(eh(e.year) && e.date <= 29) || e.date <= 28;
      let t = wh[e.month] || 0;
      return e.date <= t;
    },
    Ih = (e = "", t) => {
      if (((e = e.trim()), !0 === /^'[0-9][0-9]$/.test(e))) {
        let t = Number(e.replace(/'/, ""));
        return t > 50 ? 1900 + t : 2e3 + t;
      }
      let n = parseInt(e, 10);
      return !n && t && (n = t.year), (n = n || new Date().getFullYear()), n;
    },
    Nh = function (e) {
      return "sept" === (e = e.toLowerCase().trim()) ? xh.sep : xh[e];
    },
    Eh = (e, t = "") => {
      let n = (t = t.replace(/^\s+/, "").toLowerCase()).match(
        /([0-9]{1,2}):([0-9]{1,2}):?([0-9]{1,2})?[:\.]?([0-9]{1,4})?/
      );
      if (null !== n) {
        let a = Number(n[1]);
        if (a < 0 || a > 24) return e.startOf("day");
        let r = Number(n[2]);
        if (n[2].length < 2 || r < 0 || r > 59) return e.startOf("day");
        e = (e = (e = (e = e.hour(a)).minute(r)).seconds(
          n[3] || 0
        )).millisecond(
          (function (e = "") {
            return (
              (e = String(e)).length > 3
                ? (e = e.substr(0, 3))
                : 1 === e.length
                ? (e += "00")
                : 2 === e.length && (e += "0"),
              Number(e) || 0
            );
          })(n[4])
        );
        let o = t.match(/[\b0-9] ?(am|pm)\b/);
        return null !== o && o[1] && (e = e.ampm(o[1])), e;
      }
      if (((n = t.match(/([0-9]+) ?(am|pm)/)), null !== n && n[1])) {
        let t = Number(n[1]);
        return t > 12 || t < 1
          ? e.startOf("day")
          : (e = (e = (e = e.hour(n[1] || 0)).ampm(n[2])).startOf("hour"));
      }
      return e.startOf("day");
    },
    Th = [
      {
        reg: /^(\-?0?0?[0-9]{3,4})-([0-9]{1,2})-([0-9]{1,2})[T| ]([0-9.:]+)(Z|[0-9\-\+:]+)?$/i,
        parse: (e, t) => {
          let n = { year: t[1], month: parseInt(t[2], 10) - 1, date: t[3] };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (((e, t) => {
                if (!t) return e;
                let n = 0;
                if (
                  (/^[\+-]?[0-9]{2}:[0-9]{2}$/.test(t) &&
                    (!0 === /:00/.test(t) && (t = t.replace(/:00/, "")),
                    !0 === /:30/.test(t) && (t = t.replace(/:30/, ".5"))),
                  /^[\+-]?[0-9]{4}$/.test(t) && (t = t.replace(/30$/, ".5")),
                  (n = parseFloat(t)),
                  Math.abs(n) > 100 && (n /= 100),
                  0 === n || "Z" === t || "z" === t)
                )
                  return (e.tz = "etc/gmt"), e;
                (n *= -1), n >= 0 && (n = "+" + n);
                let a = "etc/gmt" + n;
                e.timezones[a] && (e.tz = a);
              })(e, t[5]),
              vh(e, n),
              (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^([0-9]{4})[\-\/\. ]([0-9]{1,2})[\-\/\. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
        parse: (e, t) => {
          let n = {
            year: t[1],
            month: parseInt(t[2], 10) - 1,
            date: parseInt(t[3], 10),
          };
          return (
            n.month >= 12 &&
              ((n.date = parseInt(t[2], 10)),
              (n.month = parseInt(t[3], 10) - 1)),
            !1 === Dh(n) ? ((e.epoch = null), e) : (vh(e, n), (e = Eh(e, t[4])))
          );
        },
      },
      {
        reg: /^([0-9]{4})[\-\/\. ]([a-z]+)[\-\/\. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
        parse: (e, t) => {
          let n = {
            year: Ih(t[1], e._today),
            month: Nh(t[2]),
            date: oh(t[3] || ""),
          };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[4])));
        },
      },
    ],
    Oh = [
      {
        reg: /^([0-9]{1,2})[\-\/.]([0-9]{1,2})[\-\/.]?([0-9]{4})?( [0-9]{1,2}:[0-9]{2}:?[0-9]{0,2}? ?(am|pm|gmt))?$/i,
        parse: (e, t) => {
          let n = parseInt(t[1], 10) - 1,
            a = parseInt(t[2], 10);
          (e.british || n >= 12) &&
            ((a = parseInt(t[1], 10)), (n = parseInt(t[2], 10) - 1));
          let r = {
            date: a,
            month: n,
            year: Ih(t[3], e._today) || new Date().getFullYear(),
          };
          return !1 === Dh(r)
            ? ((e.epoch = null), e)
            : (vh(e, r), (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^([a-z]+)[\-\/\. ]([0-9]{1,2})[\-\/\. ]?([0-9]{4}|'[0-9]{2})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
        parse: (e, t) => {
          let n = {
            year: Ih(t[3], e._today),
            month: Nh(t[1]),
            date: oh(t[2] || ""),
          };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^([a-z]+) ([0-9]{1,2})( [0-9]{4})?( ([0-9:]+( ?am| ?pm| ?gmt)?))?$/i,
        parse: (e, t) => {
          let n = {
            year: Ih(t[3], e._today),
            month: Nh(t[1]),
            date: oh(t[2] || ""),
          };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^([a-z]+) ([0-9]{1,2})( [0-9:]+)?( \+[0-9]{4})?( [0-9]{4})?$/i,
        parse: (e, t) => {
          let n = {
            year: Ih(t[5], e._today),
            month: Nh(t[1]),
            date: oh(t[2] || ""),
          };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[3])));
        },
      },
    ],
    Ch = [
      {
        reg: /^([0-9]{1,2})[\-\/]([a-z]+)[\-\/]?([0-9]{4})?$/i,
        parse: (e, t) => {
          let n = {
            year: Ih(t[3], e._today),
            month: Nh(t[2]),
            date: oh(t[1] || ""),
          };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^([0-9]{1,2})( [a-z]+)( [0-9]{4}| '[0-9]{2})? ?([0-9]{1,2}:[0-9]{2}:?[0-9]{0,2}? ?(am|pm|gmt))?$/i,
        parse: (e, t) => {
          let n = { year: Ih(t[3], e._today), month: Nh(t[2]), date: oh(t[1]) };
          return n.month && !1 !== Dh(n)
            ? (vh(e, n), (e = Eh(e, t[4])))
            : ((e.epoch = null), e);
        },
      },
      {
        reg: /^([0-9]{1,2})[\. -/]([a-z]+)[\. -/]([0-9]{4})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
        parse: (e, t) => {
          let n = { date: Number(t[1]), month: Nh(t[2]), year: Number(t[3]) };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = e.startOf("day")), (e = Eh(e, t[4])));
        },
      },
    ],
    Vh = [
      {
        reg: /^([0-9]{4})[\-\/]([0-9]{2})$/i,
        parse: (e, t) => {
          let n = { year: t[1], month: parseInt(t[2], 10) - 1, date: 1 };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^([a-z]+) ([0-9]{4})$/i,
        parse: (e, t) => {
          let n = {
            year: Ih(t[2], e._today),
            month: Nh(t[1]),
            date: e._today.date || 1,
          };
          return !1 === Dh(n)
            ? ((e.epoch = null), e)
            : (vh(e, n), (e = Eh(e, t[4])));
        },
      },
      {
        reg: /^(q[0-9])( of)?( [0-9]{4})?/i,
        parse: (e, t) => {
          let n = t[1] || "";
          e = e.quarter(n);
          let a = t[3] || "";
          return a && ((a = a.trim()), (e = e.year(a))), e;
        },
      },
      {
        reg: /^(spring|summer|winter|fall|autumn)( of)?( [0-9]{4})?/i,
        parse: (e, t) => {
          let n = t[1] || "";
          e = e.season(n);
          let a = t[3] || "";
          return a && ((a = a.trim()), (e = e.year(a))), e;
        },
      },
      {
        reg: /^[0-9,]+ ?b\.?c\.?$/i,
        parse: (e, t) => {
          let n = t[0] || "";
          n = n.replace(/^([0-9,]+) ?b\.?c\.?$/i, "-$1");
          let a = new Date(),
            r = {
              year: parseInt(n.trim(), 10),
              month: a.getMonth(),
              date: a.getDate(),
            };
          return !1 === Dh(r) ? ((e.epoch = null), e) : (vh(e, r), (e = Eh(e)));
        },
      },
      {
        reg: /^[0-9,]+ ?(a\.?d\.?|c\.?e\.?)$/i,
        parse: (e, t) => {
          let n = t[0] || "";
          n = n.replace(/,/g, "");
          let a = new Date(),
            r = {
              year: parseInt(n.trim(), 10),
              month: a.getMonth(),
              date: a.getDate(),
            };
          return !1 === Dh(r) ? ((e.epoch = null), e) : (vh(e, r), (e = Eh(e)));
        },
      },
      {
        reg: /^[0-9]{4}( ?a\.?d\.?)?$/i,
        parse: (e, t) => {
          let n = e._today;
          n.month && !n.date && (n.date = 1);
          let a = new Date(),
            r = {
              year: Ih(t[0], n),
              month: n.month || a.getMonth(),
              date: n.date || a.getDate(),
            };
          return !1 === Dh(r) ? ((e.epoch = null), e) : (vh(e, r), (e = Eh(e)));
        },
      },
    ],
    zh = [].concat(Th, Oh, Ch, Vh),
    { parseArray: $h, parseObject: Fh, parseNumber: Bh } = hh,
    Mh = { year: new Date().getFullYear(), month: 0, date: 1 },
    Sh = (e, t) => {
      let n = e._today || Mh;
      if ("number" == typeof t) return Bh(e, t);
      if (
        ((e.epoch = Date.now()),
        e._today && nh(e._today) && Object.keys(e._today).length > 0)
      ) {
        let t = Fh(e, n, Mh);
        t.isValid() && (e.epoch = t.epoch);
      }
      return null == t || "" === t
        ? e
        : !0 === th(t)
        ? ((e.epoch = t.getTime()), e)
        : !0 ===
          (function (e) {
            return "[object Array]" === Object.prototype.toString.call(e);
          })(t)
        ? (e = $h(e, t, n))
        : !0 === nh(t)
        ? t.epoch
          ? ((e.epoch = t.epoch), (e.tz = t.tz), e)
          : (e = Fh(e, t, n))
        : "string" != typeof t
        ? e
        : ((t = t
            .replace(
              /\b(mon|tues?|wed|wednes|thur?s?|fri|sat|satur|sun)(day)?\b/i,
              ""
            )
            .replace(/([0-9])(th|rd|st|nd)/, "$1")
            .replace(/,/g, "")
            .replace(/ +/g, " ")
            .trim()),
          !0 === ph.hasOwnProperty(t)
            ? (e = ph[t](e))
            : (function (e, t, n) {
                for (let a = 0; a < zh.length; a++) {
                  let r = t.match(zh[a].reg);
                  if (r) {
                    let t = zh[a].parse(e, r, n);
                    if (null !== t && t.isValid()) return t;
                  }
                }
                return (
                  !1 === e.silent &&
                    console.warn(
                      "Warning: couldn't parse date-string: '" + t + "'"
                    ),
                  (e.epoch = null),
                  e
                );
              })(e, t));
    };
  let Gh = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    Lh = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
  function Hh() {
    return Gh;
  }
  function qh() {
    return Lh;
  }
  const Wh = {
    mo: 1,
    tu: 2,
    we: 3,
    th: 4,
    fr: 5,
    sa: 6,
    su: 7,
    tues: 2,
    weds: 3,
    wedn: 3,
    thur: 4,
    thurs: 4,
  };
  let Jh = !0;
  const _h = (e) => {
      let t = e.timezone().current.offset;
      return t ? uh(t, ":") : "Z";
    },
    Kh = (e) =>
      Jh
        ? (function (e) {
            return e ? e[0].toUpperCase() + e.substr(1) : "";
          })(e)
        : e,
    Uh = {
      day: (e) => Kh(e.dayName()),
      "day-short": (e) => Kh(Hh()[e.day()]),
      "day-number": (e) => e.day(),
      "day-ordinal": (e) => rh(e.day()),
      "day-pad": (e) => ah(e.day()),
      date: (e) => e.date(),
      "date-ordinal": (e) => rh(e.date()),
      "date-pad": (e) => ah(e.date()),
      month: (e) => Kh(e.monthName()),
      "month-short": (e) => Kh(jh()[e.month()]),
      "month-number": (e) => e.month(),
      "month-ordinal": (e) => rh(e.month()),
      "month-pad": (e) => ah(e.month()),
      "iso-month": (e) => ah(e.month() + 1),
      year: (e) => {
        let t = e.year();
        return t > 0 ? t : ((t = Math.abs(t)), t + " BC");
      },
      "year-short": (e) => {
        let t = e.year();
        return t > 0
          ? `'${String(e.year()).substr(2, 4)}`
          : ((t = Math.abs(t)), t + " BC");
      },
      "iso-year": (e) => {
        let t = e.year(),
          n = t < 0,
          a = ah(Math.abs(t), 4);
        return n && ((a = ah(a, 6)), (a = "-" + a)), a;
      },
      time: (e) => e.time(),
      "time-24": (e) => `${e.hour24()}:${ah(e.minute())}`,
      hour: (e) => e.hour12(),
      "hour-pad": (e) => ah(e.hour12()),
      "hour-24": (e) => e.hour24(),
      "hour-24-pad": (e) => ah(e.hour24()),
      minute: (e) => e.minute(),
      "minute-pad": (e) => ah(e.minute()),
      second: (e) => e.second(),
      "second-pad": (e) => ah(e.second()),
      millisecond: (e) => e.millisecond(),
      "millisecond-pad": (e) => ah(e.millisecond(), 3),
      ampm: (e) => e.ampm(),
      quarter: (e) => "Q" + e.quarter(),
      season: (e) => e.season(),
      era: (e) => e.era(),
      json: (e) => e.json(),
      timezone: (e) => e.timezone().name,
      offset: (e) => _h(e),
      numeric: (e) => `${e.year()}/${ah(e.month() + 1)}/${ah(e.date())}`,
      "numeric-us": (e) => `${ah(e.month() + 1)}/${ah(e.date())}/${e.year()}`,
      "numeric-uk": (e) => `${ah(e.date())}/${ah(e.month() + 1)}/${e.year()}`,
      "mm/dd": (e) => `${ah(e.month() + 1)}/${ah(e.date())}`,
      iso: (e) =>
        `${e.format("iso-year")}-${ah(e.month() + 1)}-${ah(e.date())}T${ah(
          e.h24()
        )}:${ah(e.minute())}:${ah(e.second())}.${ah(e.millisecond(), 3)}${_h(
          e
        )}`,
      "iso-short": (e) => {
        let t = ah(e.month() + 1),
          n = ah(e.date());
        var a;
        return `${
          (a = e.year()) >= 0 ? ah(a, 4) : "-" + ah((a = Math.abs(a)), 4)
        }-${t}-${n}`;
      },
      "iso-utc": (e) => new Date(e.epoch).toISOString(),
      nice: (e) => `${jh()[e.month()]} ${rh(e.date())}, ${e.time()}`,
      "nice-24": (e) =>
        `${jh()[e.month()]} ${rh(e.date())}, ${e.hour24()}:${ah(e.minute())}`,
      "nice-year": (e) => `${jh()[e.month()]} ${rh(e.date())}, ${e.year()}`,
      "nice-day": (e) =>
        `${Hh()[e.day()]} ${Kh(jh()[e.month()])} ${rh(e.date())}`,
      "nice-full": (e) =>
        `${e.dayName()} ${Kh(e.monthName())} ${rh(e.date())}, ${e.time()}`,
      "nice-full-24": (e) =>
        `${e.dayName()} ${Kh(e.monthName())} ${rh(
          e.date()
        )}, ${e.hour24()}:${ah(e.minute())}`,
    },
    Rh = {
      "day-name": "day",
      "month-name": "month",
      "iso 8601": "iso",
      "time-h24": "time-24",
      "time-12": "time",
      "time-h12": "time",
      tz: "timezone",
      "day-num": "day-number",
      "month-num": "month-number",
      "month-iso": "iso-month",
      "year-iso": "iso-year",
      "nice-short": "nice",
      "nice-short-24": "nice-24",
      mdy: "numeric-us",
      dmy: "numeric-uk",
      ymd: "numeric",
      "yyyy/mm/dd": "numeric",
      "mm/dd/yyyy": "numeric-us",
      "dd/mm/yyyy": "numeric-us",
      "little-endian": "numeric-uk",
      "big-endian": "numeric",
      "day-nice": "nice-day",
    };
  Object.keys(Rh).forEach((e) => (Uh[e] = Uh[Rh[e]]));
  const Yh = (e, t = "") => {
      if (!0 !== e.isValid()) return "";
      if (Uh.hasOwnProperty(t)) {
        let n = Uh[t](e) || "";
        return (
          "json" !== t && ((n = String(n)), "ampm" !== t && (n = Kh(n))), n
        );
      }
      if (-1 !== t.indexOf("{")) {
        let n = /\{(.+?)\}/g;
        return (t = t.replace(n, (t, n) => {
          if (((n = n.toLowerCase().trim()), Uh.hasOwnProperty(n))) {
            let t = String(Uh[n](e));
            return "ampm" !== n ? Kh(t) : t;
          }
          return "";
        }));
      }
      return e.format("iso-short");
    },
    Qh = {
      G: (e) => e.era(),
      GG: (e) => e.era(),
      GGG: (e) => e.era(),
      GGGG: (e) => ("AD" === e.era() ? "Anno Domini" : "Before Christ"),
      y: (e) => e.year(),
      yy: (e) => ah(Number(String(e.year()).substr(2, 4))),
      yyy: (e) => e.year(),
      yyyy: (e) => e.year(),
      yyyyy: (e) => "0" + e.year(),
      Q: (e) => e.quarter(),
      QQ: (e) => e.quarter(),
      QQQ: (e) => e.quarter(),
      QQQQ: (e) => e.quarter(),
      M: (e) => e.month() + 1,
      MM: (e) => ah(e.month() + 1),
      MMM: (e) => e.format("month-short"),
      MMMM: (e) => e.format("month"),
      w: (e) => e.week(),
      ww: (e) => ah(e.week()),
      d: (e) => e.date(),
      dd: (e) => ah(e.date()),
      D: (e) => e.dayOfYear(),
      DD: (e) => ah(e.dayOfYear()),
      DDD: (e) => ah(e.dayOfYear(), 3),
      E: (e) => e.format("day-short"),
      EE: (e) => e.format("day-short"),
      EEE: (e) => e.format("day-short"),
      EEEE: (e) => e.format("day"),
      EEEEE: (e) => e.format("day")[0],
      e: (e) => e.day(),
      ee: (e) => e.day(),
      eee: (e) => e.format("day-short"),
      eeee: (e) => e.format("day"),
      eeeee: (e) => e.format("day")[0],
      a: (e) => e.ampm().toUpperCase(),
      aa: (e) => e.ampm().toUpperCase(),
      aaa: (e) => e.ampm().toUpperCase(),
      aaaa: (e) => e.ampm().toUpperCase(),
      h: (e) => e.h12(),
      hh: (e) => ah(e.h12()),
      H: (e) => e.hour(),
      HH: (e) => ah(e.hour()),
      m: (e) => e.minute(),
      mm: (e) => ah(e.minute()),
      s: (e) => e.second(),
      ss: (e) => ah(e.second()),
      SSS: (e) => ah(e.millisecond(), 3),
      A: (e) => e.epoch - e.startOf("day").epoch,
      z: (e) => e.timezone().name,
      zz: (e) => e.timezone().name,
      zzz: (e) => e.timezone().name,
      zzzz: (e) => e.timezone().name,
      Z: (e) => uh(e.timezone().current.offset),
      ZZ: (e) => uh(e.timezone().current.offset),
      ZZZ: (e) => uh(e.timezone().current.offset),
      ZZZZ: (e) => uh(e.timezone().current.offset, ":"),
    },
    Zh = (e, t, n) => {
      let a = e,
        r = t;
      for (let o = 0; o < n; o += 1) (Qh[a] = Qh[r]), (a += e), (r += t);
    };
  Zh("q", "Q", 4),
    Zh("L", "M", 4),
    Zh("Y", "y", 4),
    Zh("c", "e", 4),
    Zh("k", "H", 2),
    Zh("K", "h", 2),
    Zh("S", "s", 2),
    Zh("v", "z", 4),
    Zh("V", "Z", 4);
  const Xh = [
      "year",
      "season",
      "quarter",
      "month",
      "week",
      "day",
      "quarterHour",
      "hour",
      "minute",
    ],
    ed = function (e, t) {
      let n = e.clone().startOf(t),
        a = e.clone().endOf(t).epoch - n.epoch,
        r = (e.epoch - n.epoch) / a;
      return parseFloat(r.toFixed(2));
    },
    td = (e, t, n) => {
      let a = 0;
      for (e = e.clone(); e.isBefore(t); ) (e = e.add(1, n)), (a += 1);
      return e.isAfter(t, n) && (a -= 1), a;
    },
    nd = (e, t, n) => (e.isBefore(t) ? td(e, t, n) : -1 * td(t, e, n)),
    ad = function (e, t, n) {
      t = lh(t, e);
      let a = !1;
      if (e.isAfter(t)) {
        let n = e;
        (e = t), (t = n), (a = !0);
      }
      let r = (function (e, t) {
        let n = t.epoch - e.epoch,
          a = { milliseconds: n, seconds: parseInt(n / 1e3, 10) };
        (a.minutes = parseInt(a.seconds / 60, 10)),
          (a.hours = parseInt(a.minutes / 60, 10));
        let r = e.clone();
        return (
          (a.years = ((e, t) => {
            let n = t.year() - e.year();
            return (e = e.year(t.year())).isAfter(t) && (n -= 1), n;
          })(r, t)),
          (r = e.add(a.years, "year")),
          (a.months = 12 * a.years),
          (r = e.add(a.months, "month")),
          (a.months += nd(r, t, "month")),
          (a.weeks = 52 * a.years),
          (r = e.add(a.weeks, "week")),
          (a.weeks += nd(r, t, "week")),
          (a.days = 7 * a.weeks),
          (r = e.add(a.days, "day")),
          (a.days += nd(r, t, "day")),
          a
        );
      })(e, t);
      return (
        a &&
          (r = (function (e) {
            return (
              Object.keys(e).forEach((t) => {
                e[t] *= -1;
              }),
              e
            );
          })(r)),
        n
          ? ((n = ih(n)),
            !0 !== /s$/.test(n) && (n += "s"),
            "dates" === n && (n = "days"),
            r[n])
          : r
      );
    },
    rd = (e) => Math.abs(e) || 0,
    od = {
      months: { almost: 10, over: 4 },
      days: { almost: 25, over: 10 },
      hours: { almost: 20, over: 8 },
      minutes: { almost: 50, over: 20 },
      seconds: { almost: 50, over: 20 },
    };
  function id(e, t) {
    return 1 === e && (t = t.slice(0, -1)), e + " " + t;
  }
  const sd = (e, t) => {
      const n = (function (e, t) {
          const n = e.isBefore(t),
            a = n ? t : e;
          let r = n ? e : t;
          r = r.clone();
          const o = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
          return (
            Object.keys(o).forEach((e) => {
              if (r.isSame(a, e)) return;
              let t = r.diff(a, e);
              (r = r.add(t, e)), (o[e] = t);
            }),
            n &&
              Object.keys(o).forEach((e) => {
                0 !== o[e] && (o[e] *= -1);
              }),
            o
          );
        })(e, (t = lh(t, e))),
        a = Object.keys(n).every((e) => !n[e]);
      if (!0 === a)
        return {
          diff: n,
          rounded: "now",
          qualified: "now",
          precise: "now",
          abbreviated: [],
          iso: "P0Y0M0DT0H0M0S",
          direction: "present",
        };
      let r,
        o = "future",
        {
          rounded: i,
          qualified: s,
          englishValues: l,
          abbreviated: u,
        } = (function (e) {
          let t = null,
            n = null,
            a = [],
            r = [];
          return (
            Object.keys(e).forEach((o, i, s) => {
              const l = Math.abs(e[o]);
              if (0 === l) return;
              a.push(l + o[0]);
              const u = id(l, o);
              if ((r.push(u), !t)) {
                if (((t = n = u), i > 4)) return;
                const a = s[i + 1],
                  r = Math.abs(e[a]);
                r > od[a].almost
                  ? ((t = id(l + 1, o)), (n = "almost " + t))
                  : r > od[a].over && (n = "over " + u);
              }
            }),
            { qualified: n, rounded: t, abbreviated: a, englishValues: r }
          );
        })(n);
      (r = l.splice(0, 2).join(", ")),
        !0 === e.isAfter(t)
          ? ((i += " ago"), (s += " ago"), (r += " ago"), (o = "past"))
          : ((i = "in " + i), (s = "in " + s), (r = "in " + r));
      let c = (function (e) {
        let t = "P";
        return (
          (t += rd(e.years) + "Y"),
          (t += rd(e.months) + "M"),
          (t += rd(e.days) + "DT"),
          (t += rd(e.hours) + "H"),
          (t += rd(e.minutes) + "M"),
          (t += rd(e.seconds) + "S"),
          t
        );
      })(n);
      return {
        diff: n,
        rounded: i,
        qualified: s,
        precise: r,
        abbreviated: u,
        iso: c,
        direction: o,
      };
    },
    ld = {
      north: [
        ["spring", 2, 1],
        ["summer", 5, 1],
        ["fall", 8, 1],
        ["autumn", 8, 1],
        ["winter", 11, 1],
      ],
      south: [
        ["fall", 2, 1],
        ["autumn", 2, 1],
        ["winter", 5, 1],
        ["spring", 8, 1],
        ["summer", 11, 1],
      ],
    },
    ud = [null, [0, 1], [3, 1], [6, 1], [9, 1]],
    cd = {
      minute: (e) => (vh(e, { second: 0, millisecond: 0 }), e),
      quarterhour: (e) => {
        let t = e.minutes();
        return (
          (e =
            t >= 45
              ? e.minutes(45)
              : t >= 30
              ? e.minutes(30)
              : t >= 15
              ? e.minutes(15)
              : e.minutes(0)),
          vh(e, { second: 0, millisecond: 0 }),
          e
        );
      },
      hour: (e) => (vh(e, { minute: 0, second: 0, millisecond: 0 }), e),
      day: (e) => (vh(e, { hour: 0, minute: 0, second: 0, millisecond: 0 }), e),
      week: (e) => {
        let t = e.clone();
        return (
          (e = e.day(e._weekStart)).isAfter(t) && (e = e.subtract(1, "week")),
          vh(e, { hour: 0, minute: 0, second: 0, millisecond: 0 }),
          e
        );
      },
      month: (e) => (
        vh(e, { date: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }), e
      ),
      quarter: (e) => {
        let t = e.quarter();
        return (
          ud[t] &&
            vh(e, {
              month: ud[t][0],
              date: ud[t][1],
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            }),
          e
        );
      },
      season: (e) => {
        let t = e.season(),
          n = "north";
        "South" === e.hemisphere() && (n = "south");
        for (let a = 0; a < ld[n].length; a++)
          if (ld[n][a][0] === t) {
            let r = e.year();
            return (
              "winter" === t && e.month() < 3 && (r -= 1),
              vh(e, {
                year: r,
                month: ld[n][a][1],
                date: ld[n][a][2],
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
              }),
              e
            );
          }
        return e;
      },
      year: (e) => (
        vh(e, {
          month: 0,
          date: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        e
      ),
      decade: (e) => {
        let t = (e = e.startOf("year")).year(),
          n = 10 * parseInt(t / 10, 10);
        return e.year(n);
      },
      century: (e) => {
        let t = (e = e.startOf("year")).year(),
          n = 100 * parseInt(t / 100, 10);
        return e.year(n);
      },
    };
  cd.date = cd.day;
  const hd = (e) => {
      let t = e.timezones,
        n = e.tz;
      if ((!1 === t.hasOwnProperty(n) && (n = Xc(e.tz, t)), null === n))
        return (
          !1 === e.silent &&
            console.warn(
              "Warn: could not find given or local timezone - '" + e.tz + "'"
            ),
          { current: { epochShift: 0 } }
        );
      let a = t[n],
        r = {
          name:
            ((o = n),
            (o = (o = (o = o[0].toUpperCase() + o.substr(1)).replace(
              /\/gmt/,
              "/GMT"
            )).replace(/[\/_]([a-z])/gi, (e) => e.toUpperCase())),
            o),
          hasDst: Boolean(a.dst),
          default_offset: a.offset,
          hemisphere: "s" === a.hem ? "South" : "North",
          current: {},
        };
      var o, i;
      if (r.hasDst) {
        let e = (i = a.dst) ? i.split("->") : [];
        r.change = { start: e[0], back: e[1] };
      }
      let s = a.offset,
        l = s;
      return (
        !0 === r.hasDst &&
          (l = "North" === r.hemisphere ? s - 1 : a.offset + 1),
        !1 === r.hasDst
          ? ((r.current.offset = s), (r.current.isDST = !1))
          : !0 === Lc(e.epoch, r.change.start, r.change.back, s, l)
          ? ((r.current.offset = s),
            (r.current.isDST = "North" === r.hemisphere))
          : ((r.current.offset = l),
            (r.current.isDST = "South" === r.hemisphere)),
        r
      );
    },
    dd = [
      "century",
      "decade",
      "year",
      "month",
      "date",
      "day",
      "hour",
      "minute",
      "second",
      "millisecond",
    ],
    md = {
      set: function (e, t) {
        let n = this.clone();
        return (n = Sh(n, e)), t && (this.tz = Xc(t)), n;
      },
      timezone: function () {
        return hd(this);
      },
      isDST: function () {
        return hd(this).current.isDST;
      },
      hasDST: function () {
        return hd(this).hasDst;
      },
      offset: function () {
        return 60 * hd(this).current.offset;
      },
      hemisphere: function () {
        return hd(this).hemisphere;
      },
      format: function (e) {
        return Yh(this, e);
      },
      unixFmt: function (e) {
        return ((e, t) => {
          let n = t.split("");
          return (
            (n = (function (e) {
              for (let t = 0; t < e.length; t += 1)
                if ("'" === e[t])
                  for (let n = t + 1; n < e.length; n += 1) {
                    if ((e[n] && (e[t] += e[n]), "'" === e[n])) {
                      e[n] = null;
                      break;
                    }
                    e[n] = null;
                  }
              return e.filter((e) => e);
            })(n)),
            (n = (function (e) {
              for (let t = 0; t < e.length; t += 1) {
                let n = e[t];
                for (let a = t + 1; a < e.length && e[a] === n; a += 1)
                  (e[t] += e[a]), (e[a] = null);
              }
              return (e = e.filter((e) => e)).map(
                (e) => ("''" === e && (e = "'"), e)
              );
            })(n)),
            n.reduce(
              (t, n) => (
                void 0 !== Qh[n]
                  ? (t += Qh[n](e) || "")
                  : (/^'.{1,}'$/.test(n) && (n = n.replace(/'/g, "")),
                    (t += n)),
                t
              ),
              ""
            )
          );
        })(this, e);
      },
      startOf: function (e) {
        return ((e, t) => {
          let n = this.clone();
          return (
            (t = ih(t)),
            cd[t]
              ? cd[t](n)
              : "summer" === t || "winter" === t
              ? ((n = n.season(t)), cd.season(n))
              : n
          );
        })(0, e);
      },
      endOf: function (e) {
        return ((e, t) => {
          let n = this.clone();
          return (
            (t = ih(t)),
            cd[t]
              ? ((n = cd[t](n)),
                (n = n.add(1, t)),
                (n = n.subtract(1, "millisecond")),
                n)
              : n
          );
        })(0, e);
      },
      leapYear: function () {
        return eh(this.year());
      },
      progress: function (e) {
        return ((e, t) => {
          if (t) return (t = ih(t)), ed(e, t);
          let n = {};
          return (
            Xh.forEach((t) => {
              n[t] = ed(e, t);
            }),
            n
          );
        })(this, e);
      },
      nearest: function (e) {
        return ((e, t) => {
          let n = e.progress();
          return (
            "quarterhour" === (t = ih(t)) && (t = "quarterHour"),
            void 0 !== n[t]
              ? (n[t] > 0.5 && (e = e.add(1, t)), (e = e.startOf(t)))
              : !1 === e.silent && console.warn("no known unit '" + t + "'"),
            e
          );
        })(this, e);
      },
      diff: function (e, t) {
        return ad(this, e, t);
      },
      since: function (e) {
        return e || (e = this.clone().set()), sd(this, e);
      },
      next: function (e) {
        return this.add(1, e).startOf(e);
      },
      last: function (e) {
        return this.subtract(1, e).startOf(e);
      },
      isValid: function () {
        return !((!this.epoch && 0 !== this.epoch) || isNaN(this.d.getTime()));
      },
      goto: function (e) {
        let t = this.clone();
        return (t.tz = Xc(e, t.timezones)), t;
      },
      every: function (e, t) {
        if ("object" == typeof e && "string" == typeof t) {
          let n = t;
          (t = e), (e = n);
        }
        return (function (e, t, n) {
          if (!t || !n) return [];
          if (((t = ih(t)), (n = e.clone().set(n)), e.isAfter(n))) {
            let t = e;
            (e = n), (n = t);
          }
          let a = e.clone();
          !(function (e) {
            return !!Hh().find((t) => t === e) || !!qh().find((t) => t === e);
          })(t)
            ? a.startOf(t).isBefore(e) && (a = a.next(t))
            : ((a = a.next(t)), (t = "week"));
          let r = [];
          for (; a.isBefore(n); ) r.push(a), (a = a.add(1, t));
          return r;
        })(this, e, t);
      },
      isAwake: function () {
        let e = this.hour();
        return !(e < 8 || e > 22);
      },
      isAsleep: function () {
        return !this.isAwake();
      },
      daysInMonth: function () {
        switch (this.month()) {
          case 0:
          case 2:
          case 4:
          case 6:
          case 7:
          case 9:
          case 11:
            return 31;
          case 1:
            return this.leapYear() ? 29 : 28;
          case 3:
          case 5:
          case 8:
          case 10:
            return 30;
          default:
            throw new Error("Invalid Month state.");
        }
      },
      log: function () {
        return console.log(""), console.log(Yh(this, "nice-short")), this;
      },
      logYear: function () {
        return console.log(""), console.log(Yh(this, "full-short")), this;
      },
      json: function () {
        return dd.reduce((e, t) => ((e[t] = this[t]()), e), {});
      },
      debug: function () {
        let e = this.timezone(),
          t =
            this.format("MM") +
            " " +
            this.format("date-ordinal") +
            " " +
            this.year();
        return (
          (t += "\n     - " + this.format("time")),
          console.log(
            "\n\n",
            t + "\n     - " + e.name + " (" + e.current.offset + ")"
          ),
          this
        );
      },
      from: function (e) {
        return (e = this.clone().set(e)).since(this);
      },
      fromNow: function () {
        return this.clone().set(Date.now()).since(this);
      },
      weekStart: function (e) {
        if ("number" == typeof e) return (this._weekStart = e), this;
        if ("string" == typeof e) {
          e = e.toLowerCase().trim();
          let t = Hh().indexOf(e);
          -1 === t && (t = qh().indexOf(e)),
            -1 === t && (t = 1),
            (this._weekStart = t);
        } else
          console.warn(
            "Spacetime Error: Cannot understand .weekStart() input:",
            e
          );
        return this;
      },
    };
  (md.inDST = md.isDST), (md.round = md.nearest), (md.each = md.every);
  const pd = md,
    gd = (e) => ("string" == typeof e && (e = parseInt(e, 10)), e),
    fd = ["year", "month", "date", "hour", "minute", "second", "millisecond"],
    yd = (e, t, n) => {
      let a = fd.indexOf(n),
        r = fd.slice(a, fd.length);
      for (let n = 0; n < r.length; n++) {
        let a = t[r[n]]();
        e[r[n]](a);
      }
      return e;
    },
    bd = function (e, t, n, a) {
      return (
        !0 === n && e.isBefore(t)
          ? (e = e.add(1, a))
          : !1 === n && e.isAfter(t) && (e = e.minus(1, a)),
        e
      );
    },
    vd = function (e, t, n) {
      t = gd(t);
      let a = e.clone(),
        r = (e.minute() - t) * fh.minute;
      return (
        (e.epoch -= r), yd(e, a, "second"), (e = bd(e, a, n, "hour")).epoch
      );
    },
    wd = function (e, t, n) {
      (t = gd(t)) >= 24 ? (t = 24) : t < 0 && (t = 0);
      let a = e.clone(),
        r = e.hour() - t,
        o = r * fh.hour;
      return (
        (e.epoch -= o),
        e.date() !== a.date() &&
          ((e = a.clone()),
          r > 1 && (r -= 1),
          r < 1 && (r += 1),
          (o = r * fh.hour),
          (e.epoch -= o)),
        vh(e, { hour: t }),
        yd(e, a, "minute"),
        (e = bd(e, a, n, "day")).epoch
      );
    },
    kd = function (e, t) {
      return (
        "string" == typeof t &&
          /^'[0-9]{2}$/.test(t) &&
          ((t = t.replace(/'/, "").trim()),
          (t = (t = Number(t)) > 30 ? 1900 + t : 2e3 + t)),
        (t = gd(t)),
        vh(e, { year: t }),
        e.epoch
      );
    };
  let Pd = "am",
    jd = "pm";
  const Ad = {
      millisecond: function (e) {
        if (void 0 !== e) {
          let t = this.clone();
          return (
            (t.epoch = (function (e, t) {
              t = gd(t);
              let n = e.millisecond() - t;
              return e.epoch - n;
            })(t, e)),
            t
          );
        }
        return this.d.getMilliseconds();
      },
      second: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (
            (n.epoch = (function (e, t, n) {
              t = gd(t);
              let a = e.clone(),
                r = (e.second() - t) * fh.second;
              return (e.epoch = e.epoch - r), (e = bd(e, a, n, "minute")).epoch;
            })(n, e, t)),
            n
          );
        }
        return this.d.getSeconds();
      },
      minute: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (n.epoch = vd(n, e, t)), n;
        }
        return this.d.getMinutes();
      },
      hour: function (e, t) {
        let n = this.d;
        if (void 0 !== e) {
          let n = this.clone();
          return (n.epoch = wd(n, e, t)), n;
        }
        return n.getHours();
      },
      hourFloat: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone(),
            a = e % 1;
          a *= 60;
          let r = parseInt(e, 10);
          return (n.epoch = wd(n, r, t)), (n.epoch = vd(n, a, t)), n;
        }
        let n = this.d,
          a = n.getHours(),
          r = n.getMinutes();
        return (r /= 60), a + r;
      },
      hour12: function (e, t) {
        let n = this.d;
        if (void 0 !== e) {
          let n = this.clone(),
            a = (e = "" + e).match(/^([0-9]+)(am|pm)$/);
          if (a) {
            let e = parseInt(a[1], 10);
            "pm" === a[2] && (e += 12), (n.epoch = wd(n, e, t));
          }
          return n;
        }
        let a = n.getHours();
        return a > 12 && (a -= 12), 0 === a && (a = 12), a;
      },
      time: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (
            (e = e.toLowerCase().trim()),
            (n.epoch = (function (e, t, n) {
              let a = t.match(
                /([0-9]{1,2})[:h]([0-9]{1,2})(:[0-9]{1,2})? ?(am|pm)?/
              );
              if (!a) {
                if (((a = t.match(/([0-9]{1,2}) ?(am|pm)/)), !a))
                  return e.epoch;
                a.splice(2, 0, "0"), a.splice(3, 0, "");
              }
              let r = !1,
                o = parseInt(a[1], 10),
                i = parseInt(a[2], 10);
              i >= 60 && (i = 59),
                o > 12 && (r = !0),
                !1 === r &&
                  ("am" === a[4] && 12 === o && (o = 0),
                  "pm" === a[4] && o < 12 && (o += 12)),
                (a[3] = a[3] || ""),
                (a[3] = a[3].replace(/:/, ""));
              let s = parseInt(a[3], 10) || 0,
                l = e.clone();
              return (
                (e = (e = (e = (e = e.hour(o)).minute(i)).second(
                  s
                )).millisecond(0)),
                (e = bd(e, l, n, "day")).epoch
              );
            })(n, e, t)),
            n
          );
        }
        return `${this.h12()}:${ah(this.minute())}${this.ampm()}`;
      },
      ampm: function (e, t) {
        let n = Pd,
          a = this.hour();
        if ((a >= 12 && (n = jd), "string" != typeof e)) return n;
        let r = this.clone();
        return (
          (e = e.toLowerCase().trim()),
          a >= 12 && "am" === e
            ? ((a -= 12), r.hour(a, t))
            : a < 12 && "pm" === e
            ? ((a += 12), r.hour(a, t))
            : r
        );
      },
      dayTime: function (e, t) {
        if (void 0 !== e) {
          const n = {
            morning: "7:00am",
            breakfast: "7:00am",
            noon: "12:00am",
            lunch: "12:00pm",
            afternoon: "2:00pm",
            evening: "6:00pm",
            dinner: "6:00pm",
            night: "11:00pm",
            midnight: "23:59pm",
          };
          let a = this.clone();
          return (
            (e = (e = e || "").toLowerCase()),
            !0 === n.hasOwnProperty(e) && (a = a.time(n[e], t)),
            a
          );
        }
        let n = this.hour();
        return n < 6
          ? "night"
          : n < 12
          ? "morning"
          : n < 17
          ? "afternoon"
          : n < 22
          ? "evening"
          : "night";
      },
      iso: function (e) {
        return void 0 !== e ? this.set(e) : this.format("iso");
      },
    },
    xd = Ad,
    Dd = {
      date: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (
            (e = parseInt(e, 10)) &&
              (n.epoch = (function (e, t, n) {
                if ((t = gd(t)) > 28) {
                  let n = e.month(),
                    a = wh[n];
                  1 === n && 29 === t && eh(e.year()) && (a = 29),
                    t > a && (t = a);
                }
                t <= 0 && (t = 1);
                let a = e.clone();
                return vh(e, { date: t }), (e = bd(e, a, n, "month")).epoch;
              })(n, e, t)),
            n
          );
        }
        return this.d.getDate();
      },
      day: function (e, t) {
        if (void 0 === e) return this.d.getDay();
        let n = this.clone(),
          a = e;
        "string" == typeof e &&
          ((e = e.toLowerCase()),
          Wh.hasOwnProperty(e)
            ? (a = Wh[e])
            : ((a = Hh().indexOf(e)), -1 === a && (a = qh().indexOf(e))));
        let r = this.d.getDay() - a;
        !0 === t && r > 0 && (r -= 7), !1 === t && r < 0 && (r += 7);
        let o = this.subtract(r, "days");
        return (
          vh(o, { hour: n.hour(), minute: n.minute(), second: n.second() }), o
        );
      },
      dayName: function (e, t) {
        if (void 0 === e) return qh()[this.day()];
        let n = this.clone();
        return (n = n.day(e, t)), n;
      },
    },
    Id = Dd,
    Nd = (e) => (e = (e = e.minute(0)).second(0)).millisecond(1),
    Ed = {
      dayOfYear: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (
            (n.epoch = (function (e, t, n) {
              t = gd(t);
              let a = e.clone();
              return (
                (t -= 1) <= 0 ? (t = 0) : t >= 365 && (t = 364),
                (e = (e = e.startOf("year")).add(t, "day")),
                yd(e, a, "hour"),
                (e = bd(e, a, n, "year")).epoch
              );
            })(n, e, t)),
            n
          );
        }
        let n,
          a = 0,
          r = this.d.getMonth();
        for (let e = 1; e <= r; e++)
          (n = new Date()),
            n.setDate(1),
            n.setFullYear(this.d.getFullYear()),
            n.setHours(1),
            n.setMinutes(1),
            n.setMonth(e),
            n.setHours(-2),
            (a += n.getDate());
        return a + this.d.getDate();
      },
      week: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (
            (n.epoch = (function (e, t, n) {
              let a = e.clone();
              return (
                (t = gd(t)),
                "december" ===
                  (e = (e = (e = e.month(0)).date(1)).day(
                    "monday"
                  )).monthName() &&
                  e.date() >= 28 &&
                  (e = e.add(1, "week")),
                (t -= 1),
                (e = e.add(t, "weeks")),
                (e = bd(e, a, n, "year")).epoch
              );
            })(this, e, t)),
            (n = Nd(n)),
            n
          );
        }
        let n = this.clone();
        (n = n.month(0)),
          (n = n.date(1)),
          (n = Nd(n)),
          (n = n.day("monday")),
          "december" === n.monthName() &&
            n.date() >= 28 &&
            (n = n.add(1, "week"));
        let a = 1;
        1 === n.date() && (a = 0), (n = n.minus(1, "second"));
        const r = this.epoch;
        if (n.epoch > r) return 1;
        let o = 0,
          i = 4 * this.month();
        for (n.epoch += fh.week * i, o += i; o <= 52; o++) {
          if (n.epoch > r) return o + a;
          n = n.add(1, "week");
        }
        return 52;
      },
      month: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (
            (n.epoch = (function (e, t, n) {
              "string" == typeof t &&
                ("sept" === t && (t = "sep"), (t = Ah()[t.toLowerCase()])),
                (t = gd(t)) >= 12 && (t = 11),
                t <= 0 && (t = 0);
              let a = e.date();
              a > wh[t] && (a = wh[t]);
              let r = e.clone();
              return vh(e, { month: t, d: a }), (e = bd(e, r, n, "year")).epoch;
            })(n, e, t)),
            n
          );
        }
        return this.d.getMonth();
      },
      monthName: function (e, t) {
        if (void 0 !== e) {
          let n = this.clone();
          return (n = n.month(e, t)), n;
        }
        return Ph[this.month()];
      },
      quarter: function (e, t) {
        if (
          void 0 !== e &&
          ("string" == typeof e &&
            ((e = e.replace(/^q/i, "")), (e = parseInt(e, 10))),
          ud[e])
        ) {
          let n = this.clone(),
            a = ud[e][0];
          return (
            (n = n.month(a, t)), (n = n.date(1, t)), (n = n.startOf("day")), n
          );
        }
        let n = this.d.getMonth();
        for (let e = 1; e < ud.length; e++) if (n < ud[e][0]) return e - 1;
        return 4;
      },
      season: function (e, t) {
        let n = "north";
        if (("South" === this.hemisphere() && (n = "south"), void 0 !== e)) {
          let a = this.clone();
          for (let r = 0; r < ld[n].length; r++)
            e === ld[n][r][0] &&
              ((a = a.month(ld[n][r][1], t)),
              (a = a.date(1)),
              (a = a.startOf("day")));
          return a;
        }
        let a = this.d.getMonth();
        for (let e = 0; e < ld[n].length - 1; e++)
          if (a >= ld[n][e][1] && a < ld[n][e + 1][1]) return ld[n][e][0];
        return "winter";
      },
      year: function (e) {
        if (void 0 !== e) {
          let t = this.clone();
          return (t.epoch = kd(t, e)), t;
        }
        return this.d.getFullYear();
      },
      era: function (e) {
        if (void 0 !== e) {
          let t = this.clone();
          e = e.toLowerCase();
          let n = t.d.getFullYear();
          return (
            "bc" === e && n > 0 && (t.epoch = kd(t, -1 * n)),
            "ad" === e && n < 0 && (t.epoch = kd(t, -1 * n)),
            t
          );
        }
        return this.d.getFullYear() < 0 ? "BC" : "AD";
      },
      decade: function (e) {
        if (void 0 !== e) {
          if (
            !(e = (e = (e = String(e)).replace(/([0-9])'?s$/, "$1")).replace(
              /([0-9])(th|rd|st|nd)/,
              "$1"
            ))
          )
            return console.warn("Spacetime: Invalid decade input"), this;
          2 === e.length && /[0-9][0-9]/.test(e) && (e = "19" + e);
          let t = Number(e);
          return isNaN(t)
            ? this
            : ((t = 10 * Math.floor(t / 10)), this.year(t));
        }
        return this.startOf("decade").year();
      },
      century: function (e) {
        if (void 0 !== e) {
          "string" == typeof e &&
            ((e = (e = e.replace(/([0-9])(th|rd|st|nd)/, "$1")).replace(
              /([0-9]+) ?(b\.?c\.?|a\.?d\.?)/i,
              (e, t, n) => (n.match(/b\.?c\.?/i) && (t = "-" + t), t)
            )),
            (e = e.replace(/c$/, "")));
          let t = Number(e);
          return isNaN(e)
            ? (console.warn("Spacetime: Invalid century input"), this)
            : (0 === t && (t = 1),
              (t = t >= 0 ? 100 * (t - 1) : 100 * (t + 1)),
              this.year(t));
        }
        let t = this.startOf("century").year();
        return (t = Math.floor(t / 100)), t < 0 ? t - 1 : t + 1;
      },
      millenium: function (e) {
        if (void 0 !== e) {
          if (
            "string" == typeof e &&
            ((e = e.replace(/([0-9])(th|rd|st|nd)/, "$1")),
            (e = Number(e)),
            isNaN(e))
          )
            return console.warn("Spacetime: Invalid millenium input"), this;
          e > 0 && (e -= 1);
          let t = 1e3 * e;
          return 0 === t && (t = 1), this.year(t);
        }
        let t = Math.floor(this.year() / 1e3);
        return t >= 0 && (t += 1), t;
      },
    },
    Td = Ed,
    Od = Object.assign({}, xd, Id, Td);
  (Od.milliseconds = Od.millisecond),
    (Od.seconds = Od.second),
    (Od.minutes = Od.minute),
    (Od.hours = Od.hour),
    (Od.hour24 = Od.hour),
    (Od.h12 = Od.hour12),
    (Od.h24 = Od.hour24),
    (Od.days = Od.day);
  const Cd = function (e, t) {
      return 1 === e && eh(t) ? 29 : wh[e];
    },
    Vd = ["millisecond", "second", "minute", "hour", "date", "month"];
  let zd = {
    second: Vd.slice(0, 1),
    minute: Vd.slice(0, 2),
    quarterhour: Vd.slice(0, 2),
    hour: Vd.slice(0, 3),
    date: Vd.slice(0, 4),
    month: Vd.slice(0, 4),
    quarter: Vd.slice(0, 4),
    season: Vd.slice(0, 4),
    year: Vd,
    decade: Vd,
    century: Vd,
  };
  (zd.week = zd.hour), (zd.season = zd.date), (zd.quarter = zd.date);
  const $d = {
      year: !0,
      quarter: !0,
      season: !0,
      month: !0,
      week: !0,
      date: !0,
    },
    Fd = { month: !0, quarter: !0, season: !0, year: !0 },
    Bd = {
      millisecond: (e) => e.epoch,
      second: (e) =>
        [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second()].join(
          "-"
        ),
      minute: (e) =>
        [e.year(), e.month(), e.date(), e.hour(), e.minute()].join("-"),
      hour: (e) => [e.year(), e.month(), e.date(), e.hour()].join("-"),
      day: (e) => [e.year(), e.month(), e.date()].join("-"),
      week: (e) => [e.year(), e.week()].join("-"),
      month: (e) => [e.year(), e.month()].join("-"),
      quarter: (e) => [e.year(), e.quarter()].join("-"),
      year: (e) => e.year(),
    };
  Bd.date = Bd.day;
  let Md = Jc;
  const Sd = function (e, t, n = {}) {
    (this.epoch = null),
      (this.tz = Xc(t, Md)),
      (this.silent = void 0 === n.silent || n.silent),
      (this.british = n.dmy || n.british),
      (this._weekStart = 1),
      void 0 !== n.weekStart && (this._weekStart = n.weekStart),
      (this._today = {}),
      void 0 !== n.today && (this._today = n.today),
      Object.defineProperty(this, "d", {
        get: function () {
          let e = ((e) => {
              let t = e.timezones[e.tz];
              if (void 0 === t)
                return (
                  console.warn("Warning: couldn't find timezone " + e.tz), 0
                );
              if (void 0 === t.dst) return t.offset;
              let n = t.offset,
                a = t.offset + 1;
              "n" === t.hem && (a = n - 1);
              let r = t.dst.split("->");
              return !0 === Lc(e.epoch, r[0], r[1], n, a) ? n : a;
            })(this),
            t = (new Date(this.epoch).getTimezoneOffset() || 0) + 60 * e;
          t = 60 * t * 1e3;
          let n = this.epoch + t;
          return new Date(n);
        },
      }),
      Object.defineProperty(this, "timezones", {
        get: () => Md,
        set: (e) => ((Md = e), e),
      });
    let a = Sh(this, e);
    this.epoch = a.epoch;
  };
  var Gd;
  Object.keys(pd).forEach((e) => {
    Sd.prototype[e] = pd[e];
  }),
    (Sd.prototype.clone = function () {
      return new Sd(this.epoch, this.tz, {
        silent: this.silent,
        weekStart: this._weekStart,
        today: this._today,
        parsers: this.parsers,
      });
    }),
    (Sd.prototype.toLocalDate = function () {
      return this.toNativeDate();
    }),
    (Sd.prototype.toNativeDate = function () {
      return new Date(this.epoch);
    }),
    (Gd = Sd),
    Object.keys(Od).forEach((e) => {
      Gd.prototype[e] = Od[e];
    }),
    ((e) => {
      (e.prototype.add = function (e, t) {
        let n = this.clone();
        if (!t || 0 === e) return n;
        let a = this.clone();
        if ("millisecond" === (t = ih(t))) return (n.epoch += e), n;
        "fortnight" === t && ((e *= 2), (t = "week")),
          fh[t]
            ? (n.epoch += fh[t] * e)
            : "week" === t || "weekend" === t
            ? (n.epoch += fh.day * (7 * e))
            : "quarter" === t || "season" === t
            ? (n.epoch += fh.month * (3 * e))
            : "quarterhour" === t && (n.epoch += 15 * fh.minute * e);
        let r = {};
        if (
          (zd[t] &&
            zd[t].forEach((e) => {
              r[e] = a[e]();
            }),
          $d[t])
        ) {
          const e = a.timezone().current.offset - n.timezone().current.offset;
          n.epoch += 3600 * e * 1e3;
        }
        if (
          ("month" === t &&
            ((r.month = a.month() + e),
            (r = ((e, t) => {
              if (e.month > 0) {
                let n = parseInt(e.month / 12, 10);
                (e.year = t.year() + n), (e.month = e.month % 12);
              } else if (e.month < 0) {
                let n = Math.abs(e.month),
                  a = parseInt(n / 12, 10);
                n % 12 != 0 && (a += 1),
                  (e.year = t.year() - a),
                  (e.month = e.month % 12),
                  (e.month = e.month + 12),
                  12 === e.month && (e.month = 0);
              }
              return e;
            })(r, a))),
          "week" === t)
        ) {
          let t = a.date() + 7 * e;
          t <= 28 && t > 1 && (r.date = t);
        }
        if ("weekend" === t && "saturday" !== n.dayName())
          n = n.day("saturday", !0);
        else if ("date" === t) {
          if (e < 0)
            r = ((e, t, n) => {
              (e.year = t.year()), (e.month = t.month());
              let a = t.date();
              for (e.date = a - Math.abs(n); e.date < 1; ) {
                (e.month -= 1), e.month < 0 && ((e.month = 11), (e.year -= 1));
                let t = Cd(e.month, e.year);
                e.date += t;
              }
              return e;
            })(r, a, e);
          else {
            let t = a.date() + e;
            r = ((e, t, n) => {
              let a = t.year(),
                r = t.month(),
                o = Cd(r, a);
              for (; n > o; )
                (n -= o),
                  (r += 1),
                  r >= 12 && ((r -= 12), (a += 1)),
                  (o = Cd(r, a));
              return (e.month = r), (e.date = n), e;
            })(r, a, t);
          }
          0 !== e && a.isSame(n, "day") && (r.date = a.date() + e);
        } else if ("quarter" === t) {
          if (
            ((r.month = a.month() + 3 * e), (r.year = a.year()), r.month < 0)
          ) {
            let e = Math.floor(r.month / 12),
              t = r.month + 12 * Math.abs(e);
            (r.month = t), (r.year += e);
          } else if (r.month >= 12) {
            let e = Math.floor(r.month / 12);
            (r.month = r.month % 12), (r.year += e);
          }
          r.date = a.date();
        } else if ("year" === t) {
          let t = a.year() + e,
            r = n.year();
          if (r < t) {
            let t = Math.floor(e / 4) || 1;
            n.epoch += Math.abs(fh.day * t);
          } else if (r > t) {
            let t = Math.floor(e / 4) || 1;
            n.epoch += fh.day * t;
          }
        } else
          "decade" === t
            ? (r.year = n.year() + 10)
            : "century" === t && (r.year = n.year() + 100);
        if (Fd[t]) {
          let e = wh[r.month];
          (r.date = a.date()), r.date > e && (r.date = e);
        }
        return Object.keys(r).length > 1 && vh(n, r), n;
      }),
        (e.prototype.subtract = function (e, t) {
          return this.clone().add(-1 * e, t);
        }),
        (e.prototype.minus = e.prototype.subtract),
        (e.prototype.plus = e.prototype.add);
    })(Sd),
    ((e) => {
      e.prototype.isSame = function (t, n, a = !0) {
        let r = this;
        if (!n) return null;
        if ("string" == typeof t && "object" == typeof n) {
          let e = t;
          (t = n), (n = e);
        }
        return (
          ("string" != typeof t && "number" != typeof t) ||
            (t = new e(t, this.timezone.name)),
          (n = n.replace(/s$/, "")),
          !0 === a && r.tz !== t.tz && ((t = t.clone()).tz = r.tz),
          Bd[n] ? Bd[n](r) === Bd[n](t) : null
        );
      };
    })(Sd),
    ((e) => {
      const t = {
        isAfter: function (e) {
          let t = sh((e = lh(e, this)));
          return null === t ? null : this.epoch > t;
        },
        isBefore: function (e) {
          let t = sh((e = lh(e, this)));
          return null === t ? null : this.epoch < t;
        },
        isEqual: function (e) {
          let t = sh((e = lh(e, this)));
          return null === t ? null : this.epoch === t;
        },
        isBetween: function (e, t, n = !1) {
          (e = lh(e, this)), (t = lh(t, this));
          let a = sh(e);
          if (null === a) return null;
          let r = sh(t);
          return null === r
            ? null
            : n
            ? this.isBetween(e, t) || this.isEqual(e) || this.isEqual(t)
            : a < this.epoch && this.epoch < r;
        },
      };
      Object.keys(t).forEach((n) => {
        e.prototype[n] = t[n];
      });
    })(Sd),
    ((e) => {
      const t = {
        i18n: (e) => {
          var t, n;
          nh(e.days) &&
            (function (e) {
              (Gh = e.short || Gh), (Lh = e.long || Lh);
            })(e.days),
            nh(e.months) &&
              (function (e) {
                (kh = e.short || kh), (Ph = e.long || Ph);
              })(e.months),
            (n = e.useTitleCase),
            "[object Boolean]" === Object.prototype.toString.call(n) &&
              ((t = e.useTitleCase), (Jh = t)),
            nh(e.ampm) &&
              (function (e) {
                (Pd = e.am || Pd), (jd = e.pm || jd);
              })(e.ampm);
        },
      };
      Object.keys(t).forEach((n) => {
        e.prototype[n] = t[n];
      });
    })(Sd);
  const Ld = Sd,
    Hd = (e, t, n) => new Ld(e, t, n),
    qd = function (e) {
      let t = e._today || {};
      return (
        Object.keys(t).forEach((n) => {
          e = e[n](t[n]);
        }),
        e
      );
    };
  (Hd.now = (e, t) => {
    let n = new Ld(new Date().getTime(), e, t);
    return (n = qd(n)), n;
  }),
    (Hd.today = (e, t) => {
      let n = new Ld(new Date().getTime(), e, t);
      return (n = qd(n)), n.startOf("day");
    }),
    (Hd.tomorrow = (e, t) => {
      let n = new Ld(new Date().getTime(), e, t);
      return (n = qd(n)), n.add(1, "day").startOf("day");
    }),
    (Hd.yesterday = (e, t) => {
      let n = new Ld(new Date().getTime(), e, t);
      return (n = qd(n)), n.subtract(1, "day").startOf("day");
    }),
    (Hd.extend = function (e = {}) {
      return (
        Object.keys(e).forEach((t) => {
          Ld.prototype[t] = e[t];
        }),
        this
      );
    }),
    (Hd.timezones = function () {
      return new Ld().timezones;
    }),
    (Hd.max = function (e, t) {
      let n = new Ld(null, e, t);
      return (n.epoch = 864e13), n;
    }),
    (Hd.min = function (e, t) {
      let n = new Ld(null, e, t);
      return (n.epoch = -864e13), n;
    }),
    (Hd.whereIts = (e, t) => {
      let n = new Ld(null),
        a = new Ld(null);
      (n = n.time(e)), (a = t ? a.time(t) : n.add(59, "minutes"));
      let r = n.hour(),
        o = a.hour(),
        i = Object.keys(n.timezones).filter((e) => {
          if (-1 === e.indexOf("/")) return !1;
          let t = new Ld(null, e),
            i = t.hour();
          return (
            i >= r &&
            i <= o &&
            !(i === r && t.minute() < n.minute()) &&
            !(i === o && t.minute() > a.minute())
          );
        });
      return i;
    }),
    (Hd.version = "7.1.4"),
    (Hd.plugin = Hd.extend);
  const Wd = Hd,
    Jd = {
      daybreak: "7:00am",
      breakfast: "8:00am",
      morning: "9:00am",
      noon: "12:00pm",
      midday: "12:00pm",
      afternoon: "2:00pm",
      lunchtime: "12:00pm",
      evening: "6:00pm",
      dinnertime: "6:00pm",
      night: "8:00pm",
      eod: "10:00pm",
      midnight: "12:00am",
      am: "9:00am",
      pm: "5:00pm",
      "early day": "8:00am",
      "late at night": "11:00pm",
    },
    _d = { quarter: 15, half: 30 },
    Kd = function (e) {
      let t = e.time("6:00am");
      return e.isBefore(t) ? e.ampm("pm") : e;
    },
    Ud = function (e, t) {
      let n = e.match("(at|by|for|before|this|after)? #Time+");
      (n = n.not("^(at|by|for|before|this|after)")),
        (n = n.not("sharp")),
        (n = n.not("on the dot"));
      let a = Wd.now(t.timezone),
        r = a.clone(),
        o = n.not("in the").text("reduced");
      if (((o = o.replace(/^@/, "")), Jd.hasOwnProperty(o)))
        return { result: Jd[o], m: n };
      let i = n.match("^#Cardinal oclock (am|pm)?");
      if (
        i.found &&
        ((a = a.hour(i.text("reduced"))),
        (a = a.startOf("hour")),
        a.isValid() && !a.isEqual(r))
      ) {
        let e = i.match("(am|pm)");
        return (
          (a = e.found ? a.ampm(e.text("reduced")) : Kd(a)),
          { result: a.time(), m: i }
        );
      }
      if (
        ((i = n.match(
          "(half|quarter|25|20|15|10|5) (past|after|to) #Cardinal"
        )),
        i.found &&
          ((a = (function (e, t) {
            let n = e.match("#Cardinal$"),
              a = e.not(n).match("(half|quarter|25|20|15|10|5)");
            n = n.text("reduced");
            let r = a.text("reduced");
            _d.hasOwnProperty(r) && (r = _d[r]);
            let o = e.has("to");
            return (
              (t = (t = t.hour(n)).startOf("hour")),
              n < 6 && (t = t.ampm("pm")),
              o ? t.subtract(r, "minutes") : t.add(r, "minutes")
            );
          })(i, a)),
          a.isValid() && !a.isEqual(r)))
      )
        return (a = Kd(a)), { result: a.time(), m: i };
      if (
        ((i = n.match("[<min>(half|quarter|25|20|15|10|5)] (past|after)")),
        i.found)
      ) {
        let e = i.groups("min").text("reduced"),
          n = Wd(t.today);
        if (
          (_d.hasOwnProperty(e) && (e = _d[e]),
          (n = n.next("hour").startOf("hour").minute(e)),
          n.isValid() && !n.isEqual(r))
        )
          return { result: n.time(), m: i };
      }
      if (((i = n.match("[<min>(half|quarter|25|20|15|10|5)] to")), i.found)) {
        let e = i.groups("min").text("reduced"),
          n = Wd(t.today);
        if (
          (_d.hasOwnProperty(e) && (e = _d[e]),
          (n = n.next("hour").startOf("hour").minus(e, "minutes")),
          n.isValid() && !n.isEqual(r))
        )
          return { result: n.time(), m: i };
      }
      if (
        ((i = n.match(
          "[<time>#Time] (in|at) the? [<desc>(morning|evening|night|nighttime)]"
        )),
        i.found)
      ) {
        let e = i.groups("time").text("normal");
        if (
          (/^[0-9]{1,2}$/.test(e)
            ? ((a = a.hour(e)), (a = a.startOf("hour")))
            : (a = a.time(e)),
          a.isValid() && !a.isEqual(r))
        ) {
          let e = i.groups("desc").text("reduced");
          return (
            ("evening" !== e && "night" !== e) || (a = a.ampm("pm")),
            { result: a.time(), m: i }
          );
        }
      }
      if (
        ((i = n.match(
          "this? [<desc>(morning|evening|tonight)] at [<time>(#Cardinal|#Time)]"
        )),
        i.found)
      ) {
        let e = i.groups(),
          t = e.time.text("reduced");
        if (
          (/^[0-9]{1,2}$/.test(t)
            ? ((a = a.hour(t)), (a = a.startOf("hour")))
            : (a = a.time(t)),
          a.isValid() && !a.isEqual(r))
        ) {
          let t = e.desc.text("reduced");
          return (
            "morning" === t && (a = a.ampm("am")),
            ("evening" !== t && "tonight" !== t) || (a = a.ampm("pm")),
            { result: a.time(), m: i }
          );
        }
      }
      if (((i = n.match("^#Cardinal$")), i.found)) {
        let e = i.text("reduced");
        if (
          ((a = a.hour(e)),
          (a = a.startOf("hour")),
          a.isValid() && !a.isEqual(r))
        )
          return (
            !1 === /(am|pm)/i.test(e) && (a = Kd(a)), { result: a.time(), m: i }
          );
      }
      let s = n.text("reduced");
      return (
        (a = a.time(s)),
        a.isValid() && !a.isEqual(r)
          ? (!1 === /(am|pm)/i.test(s) && (a = Kd(a)),
            { result: a.time(), m: n })
          : t.dayStart
          ? { result: t.dayStart, m: e.none() }
          : { result: null, m: e.none() }
      );
    },
    Rd = "America/",
    Yd = "Asia/",
    Qd = "Europe/",
    Zd = "Africa/",
    Xd = "Australia/",
    em = "Pacific/",
    tm = {
      "british summer time": Qd + "London",
      bst: Qd + "London",
      "british time": Qd + "London",
      "britain time": Qd + "London",
      "irish summer time": Qd + "Dublin",
      "irish time": Qd + "Dublin",
      ireland: Qd + "Dublin",
      "central european time": Qd + "Berlin",
      cet: Qd + "Berlin",
      "central european summer time": Qd + "Berlin",
      cest: Qd + "Berlin",
      "central europe": Qd + "Berlin",
      "eastern european time": Qd + "Riga",
      eet: Qd + "Riga",
      "eastern european summer time": Qd + "Riga",
      eest: Qd + "Riga",
      "eastern europe time": Qd + "Riga",
      "western european time": Qd + "Lisbon",
      "western european summer time": Qd + "Lisbon",
      "western europe": Qd + "Lisbon",
      "turkey standard time": Qd + "Istanbul",
      trt: Qd + "Istanbul",
      "turkish time": Qd + "Istanbul",
      etc: Zd + "Freetown",
      utc: Zd + "Freetown",
      "greenwich standard time": Zd + "Freetown",
      gmt: Zd + "Freetown",
      "east africa time": Zd + "Nairobi",
      "east african time": Zd + "Nairobi",
      "eastern africa time": Zd + "Nairobi",
      "central africa time": Zd + "Khartoum",
      "central african time": Zd + "Khartoum",
      "south africa standard time": Zd + "Johannesburg",
      sast: Zd + "Johannesburg",
      "southern africa": Zd + "Johannesburg",
      "south african": Zd + "Johannesburg",
      "west africa standard time": Zd + "Lagos",
      "western africa time": Zd + "Lagos",
      "west african time": Zd + "Lagos",
      "australian central standard time": Xd + "Adelaide",
      acst: Xd + "Adelaide",
      "australian central daylight time": Xd + "Adelaide",
      acdt: Xd + "Adelaide",
      "australia central": Xd + "Adelaide",
      "australian eastern standard time": Xd + "Brisbane",
      aest: Xd + "Brisbane",
      "australian eastern daylight time": Xd + "Brisbane",
      aedt: Xd + "Brisbane",
      "australia east": Xd + "Brisbane",
      "australian western standard time": Xd + "Perth",
      awst: Xd + "Perth",
      "australian western daylight time": Xd + "Perth",
      awdt: Xd + "Perth",
      "australia west": Xd + "Perth",
      "australian central western standard time": Xd + "Eucla",
      acwst: Xd + "Eucla",
      "australia central west": Xd + "Eucla",
      "lord howe standard time": Xd + "Lord_Howe",
      lhst: Xd + "Lord_Howe",
      "lord howe daylight time": Xd + "Lord_Howe",
      lhdt: Xd + "Lord_Howe",
      "russian standard time": Qd + "Moscow",
      msk: Qd + "Moscow",
      russian: Qd + "Moscow",
      "central standard time": Rd + "Chicago",
      "central time": Rd + "Chicago",
      cst: Rd + "Havana",
      "central daylight time": Rd + "Chicago",
      cdt: Rd + "Havana",
      "mountain standard time": Rd + "Denver",
      "mountain time": Rd + "Denver",
      mst: Rd + "Denver",
      "mountain daylight time": Rd + "Denver",
      mdt: Rd + "Denver",
      "atlantic standard time": Rd + "Halifax",
      "atlantic time": Rd + "Halifax",
      ast: Yd + "Baghdad",
      "atlantic daylight time": Rd + "Halifax",
      adt: Rd + "Halifax",
      "eastern standard time": Rd + "New_York",
      eastern: Rd + "New_York",
      "eastern time": Rd + "New_York",
      est: Rd + "New_York",
      "eastern daylight time": Rd + "New_York",
      edt: Rd + "New_York",
      "pacific time": Rd + "Los_Angeles",
      "pacific standard time": Rd + "Los_Angeles",
      pst: Rd + "Los_Angeles",
      "pacific daylight time": Rd + "Los_Angeles",
      pdt: Rd + "Los_Angeles",
      "alaskan standard time": Rd + "Anchorage",
      "alaskan time": Rd + "Anchorage",
      ahst: Rd + "Anchorage",
      "alaskan daylight time": Rd + "Anchorage",
      ahdt: Rd + "Anchorage",
      "hawaiian standard time": em + "Honolulu",
      "hawaiian time": em + "Honolulu",
      hst: em + "Honolulu",
      "aleutian time": em + "Honolulu",
      "hawaii time": em + "Honolulu",
      "newfoundland standard time": Rd + "St_Johns",
      "newfoundland time": Rd + "St_Johns",
      nst: Rd + "St_Johns",
      "newfoundland daylight time": Rd + "St_Johns",
      ndt: Rd + "St_Johns",
      "brazil time": Rd + "Sao_Paulo",
      brt: Rd + "Sao_Paulo",
      brasília: Rd + "Sao_Paulo",
      brasilia: Rd + "Sao_Paulo",
      "brazilian time": Rd + "Sao_Paulo",
      "argentina time": Rd + "Buenos_Aires",
      "argentinian time": Rd + "Buenos_Aires",
      "amazon time": Rd + "Manaus",
      amt: Rd + "Manaus",
      "amazonian time": Rd + "Manaus",
      "easter island standard time": "Chile/Easterisland",
      east: "Chile/Easterisland",
      "easter island summer time": "Chile/Easterisland",
      easst: "Chile/Easterisland",
      "venezuelan standard time": Rd + "Caracas",
      "venezuelan time": Rd + "Caracas",
      vet: Rd + "Caracas",
      "venezuela time": Rd + "Caracas",
      "paraguay time": Rd + "Asuncion",
      pyt: Rd + "Asuncion",
      "paraguay summer time": Rd + "Asuncion",
      pyst: Rd + "Asuncion",
      "cuba standard time": Rd + "Havana",
      "cuba time": Rd + "Havana",
      "cuba daylight time": Rd + "Havana",
      "cuban time": Rd + "Havana",
      "bolivia time": Rd + "La_Paz",
      "bolivian time": Rd + "La_Paz",
      "colombia time": Rd + "Bogota",
      cot: Rd + "Bogota",
      "colombian time": Rd + "Bogota",
      "acre time": Rd + "Eirunepe",
      "peru time": Rd + "Lima",
      "chile standard time": Rd + "Punta_Arenas",
      "chile time": Rd + "Punta_Arenas",
      clst: Rd + "Punta_Arenas",
      "chile summer time": Rd + "Punta_Arenas",
      cldt: Rd + "Punta_Arenas",
      "uruguay time": Rd + "Montevideo",
      uyt: Rd + "Montevideo",
      ist: Yd + "Jerusalem",
      "arabic standard time": Yd + "Baghdad",
      "arabic time": Yd + "Baghdad",
      "arab time": Yd + "Baghdad",
      "iran standard time": Yd + "Tehran",
      "iran time": Yd + "Tehran",
      irst: Yd + "Tehran",
      "iran daylight time": Yd + "Tehran",
      irdt: Yd + "Tehran",
      iranian: Yd + "Tehran",
      "pakistan standard time": Yd + "Karachi",
      "pakistan time": Yd + "Karachi",
      pkt: Yd + "Karachi",
      "india standard time": Yd + "Kolkata",
      "indian time": Yd + "Kolkata",
      "indochina time": Yd + "Bangkok",
      ict: Yd + "Bangkok",
      "south east asia": Yd + "Bangkok",
      "china standard time": Yd + "Shanghai",
      ct: Yd + "Shanghai",
      "chinese time": Yd + "Shanghai",
      "alma-ata time": Yd + "Almaty",
      almt: Yd + "Almaty",
      "oral time": Yd + "Oral",
      "orat time": Yd + "Oral",
      "yakutsk time": Yd + "Yakutsk",
      yakt: Yd + "Yakutsk",
      "gulf standard time": Yd + "Dubai",
      "gulf time": Yd + "Dubai",
      gst: Yd + "Dubai",
      uae: Yd + "Dubai",
      "hong kong time": Yd + "Hong_Kong",
      hkt: Yd + "Hong_Kong",
      "western indonesian time": Yd + "Jakarta",
      wib: Yd + "Jakarta",
      "indonesia time": Yd + "Jakarta",
      "central indonesian time": Yd + "Makassar",
      wita: Yd + "Makassar",
      "israel daylight time": Yd + "Jerusalem",
      idt: Yd + "Jerusalem",
      "israel standard time": Yd + "Jerusalem",
      "israel time": Yd + "Jerusalem",
      israeli: Yd + "Jerusalem",
      "krasnoyarsk time": Yd + "Krasnoyarsk",
      krat: Yd + "Krasnoyarsk",
      "malaysia time": Yd + "Kuala_Lumpur",
      myt: Yd + "Kuala_Lumpur",
      "singapore time": Yd + "Singapore",
      sgt: Yd + "Singapore",
      "korea standard time": Yd + "Seoul",
      "korea time": Yd + "Seoul",
      kst: Yd + "Seoul",
      "korean time": Yd + "Seoul",
      "uzbekistan time": Yd + "Samarkand",
      uzt: Yd + "Samarkand",
      "vladivostok time": Yd + "Vladivostok",
      vlat: Yd + "Vladivostok",
      "maldives time": "Indian/Maldives",
      mvt: "Indian/Maldives",
      "mauritius time": "Indian/Mauritius",
      mut: "Indian/Mauritius",
      "marshall islands time": em + "Kwajalein",
      mht: em + "Kwajalein",
      "samoa standard time": em + "Midway",
      sst: em + "Midway",
      "somoan time": em + "Midway",
      "chamorro standard time": em + "Guam",
      chst: em + "Guam",
      "papua new guinea time": em + "Bougainville",
      pgt: em + "Bougainville",
    };
  let nm = Wd().timezones,
    am = Object.keys(nm).reduce((e, t) => ((e[t] = t), e), {});
  const rm = Object.assign({}, tm, am),
    om = /(-?[0-9]+)h(rs)?/i,
    im = /(-?[0-9]+)/,
    sm = /utc([-+]?[0-9]+)/i,
    lm = /gmt([-+]?[0-9]+)/i,
    um = function (e) {
      return (e = Number(e)) > -13 && e < 13
        ? "Etc/GMT" + (e = ((e *= -1) > 0 ? "+" : "") + e)
        : null;
    },
    cm = function (e, t) {
      let n = (function (e) {
          let t = {},
            n = e.none(),
            a = e.match("#DateShift+");
          if (!1 === a.found) return { res: t, m: n };
          if (
            (a.match("#Cardinal #Duration").forEach((e) => {
              let n = e.match("#Cardinal").numbers().get()[0];
              if (n && "number" == typeof n) {
                let a = Mc(e);
                !0 === Fc[a] && (t[a] = n);
              }
            }),
            !0 === a.has("(before|ago|hence|back)$") &&
              Object.keys(t).forEach((e) => (t[e] *= -1)),
            (n = a.match("#Cardinal #Duration")),
            (a = a.not(n)),
            (n = a.match("[<unit>#Duration] [<dir>(after|before)]")),
            n.found)
          ) {
            let e = n.groups("unit").text("reduced"),
              a = n.groups("dir").text("reduced");
            "after" === a ? (t[e] = 1) : "before" === a && (t[e] = -1);
          }
          if (((n = a.match("half (a|an) [#Duration]", 0)), n.found)) {
            let e = Mc(n);
            t[e] = 0.5;
          }
          return (n = e.match("#DateShift+")), { result: t, m: n };
        })(e),
        a = n.result;
      n = (function (e) {
        let t = e.match("[<num>#Value] [<unit>#Duration+] (of|in)");
        if (t.found) {
          let e = t.groups(),
            n = e.num.numbers().get()[0],
            a = e.unit.text("reduced"),
            r = { unit: a, num: Number(n) || 0 };
          return Sc[a] || (r.num -= 1), { result: r, m: t };
        }
        if (
          ((t = e.match(
            "[<dir>(first|initial|last|final)] [<unit>#Duration+] (of|in)"
          )),
          t.found)
        ) {
          let e = t.groups(),
            n = e.dir.text("reduced");
          return (
            "initial" === n && (n = "first"),
            "final" === n && (n = "last"),
            { result: { unit: e.unit.text("reduced"), dir: n }, m: t }
          );
        }
        return { result: null, m: e.none() };
      })((e = e.not(n.m)));
      let r = n.result;
      n = (function (e) {
        let t = e.match("#Timezone+");
        t = t.not("(in|for|by|near|at)");
        let n = t.text("reduced");
        if (rm.hasOwnProperty(n)) return { result: rm[n], m: t };
        let a = (function (e) {
          let t = e.match(om);
          if (null !== t) return um(t[1]);
          if (((t = e.match(sm)), null !== t)) return um(t[1]);
          if (((t = e.match(lm)), null !== t)) {
            let e = -1 * Number(t[1]);
            return um(e);
          }
          return (t = e.match(im)), null !== t ? um(t[1]) : null;
        })(n);
        return a ? { result: a, m: t } : { result: null, m: e.none() };
      })((e = e.not(n.m)));
      let o = n.result;
      (e = e.not(n.m)), (n = Ud(e, t));
      let i = n.result;
      n = (function (e) {
        let t = e.match("#WeekDay");
        return t.found && !e.has("^#WeekDay$")
          ? e.has("(this|next|last) (next|upcoming|coming|past)? #WeekDay")
            ? { result: null, m: e.none() }
            : { result: t.text("reduced"), m: t }
          : { result: null, m: e.none() };
      })((e = e.not(n.m)));
      let s = n.result;
      n = (function (e) {
        let t = e.match("[(start|beginning) of] .", 0);
        return t.found
          ? { result: "start", m: t }
          : ((t = e.match("[end of] .", 0)),
            t.found
              ? { result: "end", m: t }
              : ((t = e.match("[(middle|midpoint|center) of] .", 0)),
                t.found ? { result: "middle", m: t } : { result: null, m: t }));
      })((e = e.not(n.m)));
      let l = n.result;
      return (
        (n = (function (e) {
          if (e.has("(next|last|this)$")) return { result: null, m: e.none() };
          let t = e.match("^this? (next|upcoming|coming)");
          return t.found
            ? { result: "next", m: t }
            : ((t = e.match("^this? (past)")),
              t.found
                ? { result: "this-past", m: t }
                : ((t = e.match("^this? (last|previous)")),
                  t.found
                    ? { result: "last", m: t }
                    : ((t = e.match("^(this|current)")),
                      t.found
                        ? { result: "this", m: t }
                        : { result: null, m: e.none() })));
        })((e = e.not(n.m)))),
        {
          shift: a,
          counter: r,
          tz: o,
          time: i,
          weekDay: s,
          section: l,
          rel: n.result,
          doc: (e = (function (e) {
            return (e = (e = (e = (e = (e = (e = e.not(
              "[^the] !#Value",
              0
            )).not("#Preposition$")).not("#Conjunction$")).not("sharp")).not(
              "on the dot"
            )).not("^(on|of)")).not("(next|last|this)$");
          })((e = e.not(n.m)))),
        }
      );
    };
  class hm {
    constructor(e, t, n) {
      (this.unit = t || "day"), (this.setTime = !1);
      let a = {};
      (n = n || {}).today &&
        (a = {
          date: n.today.date(),
          month: n.today.month(),
          year: n.today.year(),
        }),
        e && "sept" === e.month && (e.month = "sep");
      let r = Wd(e, n.timezone, { today: a });
      Object.defineProperty(this, "d", {
        enumerable: !1,
        writable: !0,
        value: r,
      }),
        Object.defineProperty(this, "context", {
          enumerable: !1,
          writable: !0,
          value: n,
        });
    }
    clone() {
      let e = new hm(this.d, this.unit, this.context);
      return (e.setTime = this.setTime), e;
    }
    log() {
      return console.log("--"), this.d.log(), console.log("\n"), this;
    }
    applyShift(e = {}) {
      return (
        Object.keys(e).forEach((t) => {
          (this.d = this.d.add(e[t], t)),
            ("hour" !== t && "minute" !== t) || (this.setTime = !0);
        }),
        this
      );
    }
    applyTime(e) {
      if (e) {
        if (
          (/^[0-9]{1,2}$/.test(e)
            ? (this.d = this.d.hour(e))
            : (this.d = this.d.time(e)),
          !/[ap]m/.test(e))
        ) {
          let e = this.d.time("6:00am");
          this.d.isBefore(e) && (this.d = this.d.ampm("pm"));
          let t = this.d.time("10:00pm");
          this.d.isAfter(t) && (this.d = this.d.ampm("am"));
        }
      } else this.d = this.d.startOf("day");
      return (this.setTime = !0), this;
    }
    applyWeekDay(e) {
      if (e) {
        let t = this.d.epoch;
        (this.d = this.d.day(e)),
          this.d.epoch < t && (this.d = this.d.add(1, "week"));
      }
      return this;
    }
    applyRel(e) {
      return "next" === e
        ? this.next()
        : "last" === e || "this-past" === e
        ? this.last()
        : this;
    }
    applySection(e) {
      return "start" === e
        ? this.start()
        : "end" === e
        ? this.end()
        : "middle" === e
        ? this.middle()
        : this;
    }
    format(e) {
      return this.d.format(e);
    }
    start() {
      return (
        (this.d = this.d.startOf(this.unit)),
        this.context.dayStart && (this.d = this.d.time(this.context.dayStart)),
        this
      );
    }
    end() {
      if (((this.d = this.d.endOf(this.unit)), this.context.dayEnd)) {
        this.d = this.d.startOf("day");
        let e = this.d.time(this.context.dayEnd);
        if (e.isAfter(this.d)) return (this.d = e), this;
      }
      return this;
    }
    middle() {
      let e = this.d.diff(this.d.endOf(this.unit)),
        t = Math.round(e.minutes / 2);
      return (this.d = this.d.add(t, "minutes")), this;
    }
    beforeEnd() {
      let e = this.d.startOf(this.unit).diff(this.d.endOf(this.unit)),
        t = Math.round(e.minutes / 4);
      return (
        (this.d = this.d.endOf(this.unit)),
        (this.d = this.d.minus(t, "minutes")),
        this.context.dayStart && (this.d = this.d.time(this.context.dayStart)),
        this
      );
    }
    before() {
      return (
        (this.d = this.d.minus(1, this.unit)),
        (this.d = this.d.endOf(this.unit)),
        this.context.dayEnd && (this.d = this.d.time(this.context.dayEnd)),
        this
      );
    }
    after() {
      return (
        (this.d = this.d.add(1, this.unit)),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
    next() {
      return (
        (this.d = this.d.add(1, this.unit)),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
    last() {
      return (
        (this.d = this.d.minus(1, this.unit)),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
  }
  const dm = hm;
  class mm extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "day"),
        this.d.isValid() && (this.d = this.d.startOf("day"));
    }
    middle() {
      return (this.d = this.d.time("10am")), this;
    }
    beforeEnd() {
      return (this.d = this.d.time("2pm")), this;
    }
  }
  class pm extends mm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "day"),
        this.d.isValid() && (this.d = this.d.startOf("day"));
    }
    next() {
      return (this.d = this.d.add(1, "year")), this;
    }
    last() {
      return (this.d = this.d.minus(1, "year")), this;
    }
  }
  class gm extends mm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "day"),
        (this.isWeekDay = !0),
        "string" == typeof e
          ? ((this.d = Wd(n.today, n.timezone)),
            (this.d = this.d.day(e)),
            this.d.isBefore(n.today) && (this.d = this.d.add(7, "days")))
          : (this.d = e),
        (this.weekDay = this.d.dayName()),
        this.d.isValid() && (this.d = this.d.startOf("day"));
    }
    next() {
      return (
        (this.d = this.d.add(7, "days")),
        (this.d = this.d.day(this.weekDay)),
        this
      );
    }
    last() {
      return (
        (this.d = this.d.minus(7, "days")),
        (this.d = this.d.day(this.weekDay)),
        this
      );
    }
    before() {
      return (
        (this.d = this.d.minus(1, "day")),
        (this.d = this.d.endOf("day")),
        this.context.dayEnd && (this.d = this.d.time(this.context.dayEnd)),
        this
      );
    }
    applyRel(e) {
      if ("next" === e) {
        let e = this.context.today.endOf("week").add(1, "week");
        return this.next(), this.d.isAfter(e) && this.last(), this;
      }
      if ("this-past" === e) return this.last();
      if ("last" === e) {
        let e = this.context.today.startOf("week");
        return this.last(), !1 === this.d.isBefore(e) && this.last(), this;
      }
      return this;
    }
  }
  class fm extends pm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "day"),
        this.d.isValid() && (this.d = this.d.startOf("day"));
    }
  }
  class ym extends dm {
    constructor(e, t, n) {
      super(e, t, n, !0),
        (this.unit = "hour"),
        this.d.isValid() && (this.d = this.d.startOf("hour"));
    }
  }
  class bm extends dm {
    constructor(e, t, n) {
      super(e, t, n, !0),
        (this.unit = "minute"),
        this.d.isValid() && (this.d = this.d.startOf("minute"));
    }
  }
  class vm extends dm {
    constructor(e, t, n) {
      super(e, t, n, !0), (this.unit = "millisecond");
    }
  }
  const wm = {
    today: (e) => new mm(e.today, null, e),
    yesterday: (e) => new mm(e.today.minus(1, "day"), null, e),
    tomorrow: (e) => new mm(e.today.plus(1, "day"), null, e),
    eom: (e) => {
      let t = e.today.endOf("month");
      return (t = t.startOf("day")), new mm(t, null, e);
    },
    eoy: (e) => {
      let t = e.today.endOf("year");
      return (t = t.startOf("day")), new mm(t, null, e);
    },
    now: (e) => new vm(e.today, null, e),
  };
  (wm.tommorrow = wm.tomorrow),
    (wm.tmrw = wm.tomorrow),
    (wm.anytime = wm.today),
    (wm.sometime = wm.today);
  const km = "january",
    Pm = "february",
    jm = "march",
    Am = "april",
    xm = "may",
    Dm = "july",
    Im = "august",
    Nm = "september",
    Em = "october",
    Tm = "november",
    Om = "december";
  var Cm = {
    "new years eve": [Om, 31],
    "new years": [km, 1],
    "new years day": [km, 1],
    "inauguration day": [km, 20],
    "australia day": [km, 26],
    "national freedom day": [Pm, 1],
    "groundhog day": [Pm, 2],
    "rosa parks day": [Pm, 4],
    "valentines day": [Pm, 14],
    "saint valentines day": [Pm, 14],
    "st valentines day ": [Pm, 14],
    "saint patricks day": [jm, 17],
    "st patricks day": [jm, 17],
    "april fools": [Am, 1],
    "april fools day": [Am, 1],
    "emancipation day": [Am, 16],
    "tax day": [Am, 15],
    "labour day": [xm, 1],
    "cinco de mayo": [xm, 5],
    "national nurses day": [xm, 6],
    "harvey milk day": [xm, 22],
    "victoria day": [xm, 24],
    juneteenth: ["june", 19],
    "canada day": [Dm, 1],
    "independence day": [Dm, 4],
    "independents day": [Dm, 4],
    "bastille day": [Dm, 14],
    "purple heart day": [Im, 7],
    "womens equality day": [Im, 26],
    "16 de septiembre": [Nm, 16],
    "dieciseis de septiembre": [Nm, 16],
    "grito de dolores": [Nm, 16],
    halloween: [Em, 31],
    "all hallows eve": [Em, 31],
    "day of the dead": [Em, 31],
    "dia de muertos": [Em, 31],
    "veterans day": [Tm, 11],
    "st andrews day": [Tm, 30],
    "saint andrews day": [Tm, 30],
    "all saints day": [Tm, 1],
    "all sts day": [Tm, 1],
    "armistice day": [Tm, 11],
    "rememberance day": [Tm, 11],
    "christmas eve": [Om, 24],
    christmas: [Om, 25],
    xmas: [Om, 25],
    "boxing day": [Om, 26],
    "st stephens day": [Om, 26],
    "saint stephens day": [Om, 26],
    epiphany: [km, 6],
    "orthodox christmas day": [km, 7],
    "orthodox new year": [km, 14],
    "assumption of mary": [Im, 15],
    "all souls day": [Tm, 2],
    "feast of the immaculate conception": [Om, 8],
    "feast of our lady of guadalupe": [Om, 12],
    kwanzaa: [Om, 26],
    imbolc: [Pm, 2],
    beltaine: [xm, 1],
    lughnassadh: [Im, 1],
    samhain: [Em, 31],
  };
  const Vm = "october",
    zm = "november",
    $m = "monday",
    Fm = "sunday";
  let Bm = {
    "martin luther king day": [3, $m, "january"],
    "presidents day": [3, $m, "february"],
    "commonwealth day": [2, $m, "march"],
    "mothers day": [2, Fm, "may"],
    "fathers day": [3, Fm, "june"],
    "labor day": [1, $m, "september"],
    "columbus day": [2, $m, Vm],
    "canadian thanksgiving": [2, $m, Vm],
    thanksgiving: [4, "thursday", zm],
    "black friday": [4, "friday", zm],
  };
  (Bm["turday day"] = Bm.thanksgiving),
    (Bm["indigenous peoples day"] = Bm["columbus day"]),
    (Bm["mlk day"] = Bm["martin luther king day"]);
  var Mm = Bm;
  let Sm = {
    easter: 0,
    "ash wednesday": -46,
    "palm sunday": 7,
    "maundy thursday": -3,
    "good friday": -2,
    "holy saturday": -1,
    "easter saturday": -1,
    "easter monday": 1,
    "ascension day": 39,
    "whit sunday": 49,
    "whit monday": 50,
    "trinity sunday": 65,
    "corpus christi": 60,
    "mardi gras": -47,
  };
  (Sm["easter sunday"] = Sm.easter),
    (Sm.pentecost = Sm["whit sunday"]),
    (Sm.whitsun = Sm["whit sunday"]);
  var Gm = Sm,
    Lm = function (e, t, n, a) {
      if (Gm.hasOwnProperty(e) || Gm.hasOwnProperty(t)) {
        let r = Gm[e] || Gm[t] || [],
          o = (function (e) {
            let t = Math.floor,
              n = e % 19,
              a = t(e / 100),
              r = (a - t(a / 4) - t((8 * a + 13) / 25) + 19 * n + 15) % 30,
              o = r - t(r / 28) * (1 - t(29 / (r + 1)) * t((21 - n) / 11)),
              i = o - ((e + t(e / 4) + o + 2 - a + t(a / 4)) % 7),
              s = 3 + t((i + 40) / 44),
              l = i + 28 - 31 * t(s / 4);
            return (s = 4 === s ? "April" : "March"), s + " " + l;
          })(n);
        if (!o) return null;
        let i = Wd(o, a);
        i = i.year(n);
        let s = i.add(r, "day");
        if (s.isValid()) return s;
      }
      return null;
    };
  const Hm = {
      spring: [
        2003, 2007, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2077,
        2080, 2081, 2084, 2085, 2088, 2089, 2092, 2093, 2096, 2097,
      ],
      summer: [
        2021, 2016, 2020, 2024, 2028, 2032, 2036, 2040, 2041, 2044, 2045, 2048,
        2049, 2052, 2053, 2056, 2057, 2060, 2061, 2064, 2065, 2068, 2069, 2070,
        2072, 2073, 2074, 2076, 2077, 2078, 2080, 2081, 2082, 2084, 2085, 2086,
        2088, 2089, 2090, 2092, 2093, 2094, 2096, 2097, 2098, 2099,
      ],
      fall: [
        2002, 2003, 2004, 2006, 2007, 2010, 2011, 2014, 2015, 2018, 2019, 2022,
        2023, 2026, 2027, 2031, 2035, 2039, 2043, 2047, 2051, 2055, 2059, 2092,
        2096,
      ],
      winter: [
        2002, 2003, 2006, 2007, 2011, 2015, 2019, 2023, 2027, 2031, 2035, 2039,
        2043, 2080, 2084, 2088, 2092, 2096,
      ],
    },
    qm = [2080, 2084, 2088, 2092, 2096];
  let Wm = {
    "spring equinox": "spring",
    "summer solistice": "summer",
    "fall equinox": "fall",
    "winter solstice": "winter",
  };
  (Wm["march equinox"] = Wm["spring equinox"]),
    (Wm["vernal equinox"] = Wm["spring equinox"]),
    (Wm.ostara = Wm["spring equinox"]),
    (Wm["june solstice"] = Wm["summer solistice"]),
    (Wm.litha = Wm["summer solistice"]),
    (Wm["autumn equinox"] = Wm["fall equinox"]),
    (Wm["autumnal equinox"] = Wm["fall equinox"]),
    (Wm["september equinox"] = Wm["fall equinox"]),
    (Wm["sept equinox"] = Wm["fall equinox"]),
    (Wm.mabon = Wm["fall equinox"]),
    (Wm["december solstice"] = Wm["winter solistice"]),
    (Wm["dec solstice"] = Wm["winter solistice"]),
    (Wm.yule = Wm["winter solistice"]);
  var Jm = Wm,
    _m = function (e, t, n, a) {
      if (Jm.hasOwnProperty(e) || Jm.hasOwnProperty(t)) {
        let r = Jm[e] || Jm[t],
          o = (function (e) {
            let t = {
              spring: "March 20 " + e,
              summer: "June 21 " + e,
              fall: "Sept 22 " + e,
              winter: "Dec 21 " + e,
            };
            return (
              -1 !== Hm.spring.indexOf(e) && (t.spring = "March 19 " + e),
              -1 !== Hm.summer.indexOf(e) && (t.summer = "June 20 " + e),
              -1 !== Hm.fall.indexOf(e) && (t.fall = "Sept 21 " + e),
              -1 !== Hm.winter.indexOf(e) && (t.winter = "Dec 22 " + e),
              -1 !== qm.indexOf(e) && (t.winter = "Dec 20 " + e),
              t
            );
          })(n);
        if (!r || !o || !o[r]) return null;
        let i = Wd(o[r], a);
        if (i.isValid()) return i;
      }
      return null;
    },
    Km = {
      "isra and miraj": "april 13",
      "lailat al-qadr": "june 10",
      "eid al-fitr": "june 15",
      "id al-Fitr": "june 15",
      "eid ul-Fitr": "june 15",
      ramadan: "may 16",
      "eid al-adha": "sep 22",
      muharram: "sep 12",
      "prophets birthday": "nov 21",
    };
  const Um = Wd.now().year(),
    Rm = function (e, t, n) {
      (t = t || Um), (e = e || "");
      let a = (e = (e = (e = String(e)).trim().toLowerCase()).replace(
        /'s/,
        "s"
      )).replace(/ day$/, "");
      (a = a.replace(/^the /, "")), (a = a.replace(/^orthodox /, ""));
      let r = (function (e, t, n, a) {
        if (Cm.hasOwnProperty(e) || Cm.hasOwnProperty(t)) {
          let r = Cm[e] || Cm[t] || [],
            o = Wd.now(a);
          if (
            ((o = o.year(n)),
            (o = o.startOf("year")),
            (o = o.month(r[0])),
            (o = o.date(r[1])),
            o.isValid())
          )
            return o;
        }
        return null;
      })(e, a, t, n);
      return null !== r
        ? r
        : ((r = (function (e, t, n, a) {
            if (Mm.hasOwnProperty(e) || Mm.hasOwnProperty(t)) {
              let r = Mm[e] || Mm[t] || [],
                o = Wd.now(a);
              (o = o.year(n)), (o = o.month(r[2])), (o = o.startOf("month"));
              let i = o.month();
              if (
                ((o = o.day(r[1])),
                o.month() !== i && (o = o.add(1, "week")),
                r[0] > 1 && (o = o.add(r[0] - 1, "week")),
                o.isValid())
              )
                return o;
            }
            return null;
          })(e, a, t, n)),
          null !== r
            ? r
            : ((r = Lm(e, a, t, n)),
              null !== r
                ? r
                : ((r = _m(e, a, t, n)),
                  null !== r
                    ? r
                    : ((r = (function (e, t, n, a) {
                        if (Km.hasOwnProperty(e) || Km.hasOwnProperty(t)) {
                          let r = Km[e] || Km[t] || [];
                          if (!r) return null;
                          let o = Wd(r + " 2018", a),
                            i = -10.64 * (n - 2018);
                          if (
                            ((o = o.add(i, "day")),
                            (o = o.startOf("day")),
                            (o = o.year(n)),
                            o.isValid())
                          )
                            return o;
                        }
                        return null;
                      })(e, a, t, n)),
                      null !== r ? r : null))));
    };
  class Ym extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "week"),
        this.d.isValid() && (this.d = this.d.startOf("week"));
    }
    clone() {
      return new Ym(this.d, this.unit, this.context);
    }
    middle() {
      return (this.d = this.d.add(2, "days")), this;
    }
    beforeEnd() {
      return (this.d = this.d.day("friday")), this;
    }
  }
  class Qm extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "week"),
        this.d.isValid() &&
          ((this.d = this.d.day("saturday")), (this.d = this.d.startOf("day")));
    }
    start() {
      return (this.d = this.d.day("saturday").startOf("day")), this;
    }
    next() {
      return (
        (this.d = this.d.add(1, this.unit)),
        (this.d = this.d.startOf("weekend")),
        this
      );
    }
    last() {
      return (
        (this.d = this.d.minus(1, this.unit)),
        (this.d = this.d.startOf("weekend")),
        this
      );
    }
  }
  class Zm extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "month"),
        this.d.isValid() && (this.d = this.d.startOf(this.unit));
    }
    next() {
      return (
        (this.d = this.d.add(1, "year")),
        (this.d = this.d.startOf("month")),
        this
      );
    }
    last() {
      return (
        (this.d = this.d.minus(1, "year")),
        (this.d = this.d.startOf("month")),
        this
      );
    }
  }
  class Xm extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "quarter"),
        this.d.isValid() && (this.d = this.d.startOf(this.unit));
    }
    last() {
      return (
        (this.d = this.d.minus(1, "quarter")),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
  }
  class ep extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "quarter"),
        this.d.isValid() && (this.d = this.d.startOf(this.unit));
    }
    next() {
      return (
        (this.d = this.d.add(1, "year")),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
    last() {
      return (
        (this.d = this.d.minus(1, "year")),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
  }
  class tp extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "season"),
        this.d.isValid() && (this.d = this.d.startOf(this.unit));
    }
    next() {
      return (
        (this.d = this.d.add(1, "year")),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
    last() {
      return (
        (this.d = this.d.minus(1, "year")),
        (this.d = this.d.startOf(this.unit)),
        this
      );
    }
  }
  class np extends dm {
    constructor(e, t, n) {
      super(e, t, n),
        (this.unit = "year"),
        this.d.isValid() && (this.d = this.d.startOf("year"));
    }
  }
  const ap = {
    day: mm,
    hour: ym,
    evening: ym,
    second: vm,
    milliscond: vm,
    instant: vm,
    minute: bm,
    week: Ym,
    weekend: Qm,
    month: class extends dm {
      constructor(e, t, n) {
        super(e, t, n),
          (this.unit = "month"),
          this.d.isValid() && (this.d = this.d.startOf(this.unit));
      }
    },
    quarter: Xm,
    year: np,
    season: tp,
    yr: np,
    qtr: Xm,
    wk: Ym,
    sec: vm,
    hr: ym,
  };
  let rp = `^(${Object.keys(ap).join("|")})$`;
  const op = function (e) {
      return {
        date: e.today.date(),
        month: e.today.month(),
        year: e.today.year(),
      };
    },
    ip = function (e, t, n) {
      let a = null;
      return (
        (a =
          a ||
          (function (e, t, n) {
            let a = null;
            !1 === e.found &&
              (null !== n.time && (a = new vm(t.today, null, t)),
              n.shift &&
                Object.keys(n.shift).length > 0 &&
                (a =
                  n.shift.hour || n.shift.minute
                    ? new vm(t.today, null, t)
                    : new mm(t.today, null, t)));
            let r = e.text("reduced");
            return !0 === wm.hasOwnProperty(r)
              ? wm[r](t)
              : "next" === r && n.shift && Object.keys(n.shift).length > 0
              ? wm.tomorrow(t)
              : a;
          })(e, t, n)),
        (a =
          a ||
          (function (e, t) {
            let n = null,
              a = e.match("[<holiday>#Holiday+] [<year>#Year?]"),
              r = t.today.year();
            a.groups("year").found &&
              (r = Number(a.groups("year").text("reduced")) || r);
            let o = a.groups("holiday").text("reduced"),
              i = Rm(o, r, t.timezone);
            return (
              null !== i &&
                (i.isBefore(t.today) &&
                  r === t.today.year() &&
                  (i = Rm(o, r + 1, t.timezone)),
                (n = new fm(i, null, t))),
              n
            );
          })(e, t)),
        (a =
          a ||
          (function (e, t) {
            let n = e.match(rp);
            if (!0 === n.found) {
              let e = n.text("reduced");
              if (ap.hasOwnProperty(e)) {
                let n = ap[e];
                return n ? new n(null, e, t) : null;
              }
            }
            if (((n = e.match("^#WeekDay$")), !0 === n.found)) {
              let e = n.text("reduced");
              return new gm(e, null, t);
            }
            return null;
          })(e, t)),
        (a =
          a ||
          (function (e, t) {
            let n = e.match(
              "(spring|summer|winter|fall|autumn) [<year>#Year?]"
            );
            if (n.found) {
              let n = e.text("reduced"),
                a = Wd(n, t.timezone, { today: op(t) }),
                r = new tp(a, null, t);
              if (!0 === r.d.isValid()) return r;
            }
            if (
              ((n = e.match("[<q>#FinancialQuarter] [<year>#Year?]")), n.found)
            ) {
              let e = n.groups("q").text("reduced"),
                a = Wd(e, t.timezone, { today: op(t) });
              if (n.groups("year")) {
                let e = Number(n.groups("year").text()) || t.today.year();
                a = a.year(e);
              }
              let r = new ep(a, null, t);
              if (!0 === r.d.isValid()) return r;
            }
            if (
              ((n = e.match("[<q>#Value] quarter (of|in)? [<year>#Year?]")),
              n.found)
            ) {
              let e = n.groups("q").text("reduced"),
                a = Wd(`q${e}`, t.timezone, { today: op(t) });
              if (n.groups("year")) {
                let e = Number(n.groups("year").text()) || t.today.year();
                a = a.year(e);
              }
              let r = new ep(a, null, t);
              if (!0 === r.d.isValid()) return r;
            }
            if (((n = e.match("^#Year$")), n.found)) {
              let n = e.text("reduced"),
                a = Wd(null, t.timezone, { today: op(t) });
              a = a.year(n);
              let r = new np(a, null, t);
              if (!0 === r.d.isValid()) return r;
            }
            return null;
          })(e, t)),
        (a =
          a ||
          (function (e, t) {
            let n = t.today.year(),
              a = e.match("[<date>#Value] of? [<month>#Month] [<year>#Year]");
            if (
              (a.found ||
                (a = e.match(
                  "[<month>#Month] the? [<date>#Value] [<year>#Year]"
                )),
              a.found)
            ) {
              let e = {
                  month: a.groups("month").text("reduced"),
                  date: a.groups("date").text("reduced"),
                  year: a.groups("year").text() || n,
                },
                r = new pm(e, null, t);
              if (!0 === r.d.isValid()) return r;
            }
            if (((a = e.match("[<month>#Month] of? [<year>#Year]")), a.found)) {
              let e = {
                  month: a.groups("month").text("reduced"),
                  year: a.groups("year").text("reduced") || n,
                },
                r = new Zm(e, null, t);
              if (!0 === r.d.isValid()) return r;
            }
            if (
              ((a = e.match("[<date>#Value] of? [<month>#Month]")),
              a.found || (a = e.match("[<month>#Month] the? [<date>#Value]")),
              a.found)
            ) {
              let e = {
                  month: a.groups("month").text("reduced"),
                  date: a.groups("date").text("reduced"),
                  year: t.today.year(),
                },
                n = new pm(e, null, t);
              if (
                (n.d.month() < t.today.month() &&
                  ((e.year += 1), (n = new pm(e, null, t))),
                !0 === n.d.isValid())
              )
                return n;
            }
            if (e.has("#Month")) {
              let n = {
                  month: e.match("#Month").text("reduced"),
                  date: 1,
                  year: t.today.year(),
                },
                a = new Zm(n, null, t);
              if (
                (a.d.month() < t.today.month() &&
                  ((n.year += 1), (a = new Zm(n, null, t))),
                !0 === a.d.isValid())
              )
                return a;
            }
            if (((a = e.match("#WeekDay [<date>#Value]")), a.found)) {
              let e = {
                  month: t.today.month(),
                  date: a.groups("date").text("reduced"),
                  year: t.today.year(),
                },
                n = new pm(e, null, t);
              if (!0 === n.d.isValid()) return n;
            }
            if (((a = e.match("the [<date>#Value]")), a.found)) {
              let e = {
                  month: t.today.month(),
                  date: a.groups("date").text("reduced"),
                  year: t.today.year(),
                },
                n = new pm(e, null, t);
              if (!0 === n.d.isValid())
                return n.d.isBefore(t.today) && (n.d = n.d.add(1, "month")), n;
            }
            if (
              ((a = e.match("/[0-9]{4}-[0-9]{2}-[0-9]{2}t[0-9]{2}:/")), a.found)
            ) {
              let n = e.text("reduced"),
                a = new vm(n, null, t);
              if (!0 === a.d.isValid()) return a;
            }
            let r = e.text("reduced");
            if (!r) return new vm(t.today, null, t);
            let o = new mm(r, null, t);
            return !1 === o.d.isValid() ? null : o;
          })(e, t)),
        a
      );
    },
    sp = {
      day: mm,
      week: Ym,
      weekend: Qm,
      month: Zm,
      quarter: ep,
      season: tp,
      hour: ym,
      minute: bm,
    },
    lp = function (e, t, n) {
      if (
        (!e &&
          n.weekDay &&
          ((e = new gm(n.weekDay, null, t)), (n.weekDay = null)),
        !e)
      )
        return null;
      if (n.shift) {
        let t = n.shift;
        e.applyShift(t),
          t.hour || t.minute
            ? (e = new vm(e.d, null, e.context))
            : (t.week || t.day || t.month) &&
              (e = new mm(e.d, null, e.context));
      }
      return (
        n.weekDay &&
          "day" !== e.unit &&
          (e.applyWeekDay(n.weekDay), (e = new gm(e.d, null, e.context))),
        n.rel && e.applyRel(n.rel),
        n.section && e.applySection(n.section),
        n.time && e.applyTime(n.time),
        n.counter &&
          n.counter.unit &&
          (e = (function (e, t = {}) {
            let n = sp[t.unit];
            if (!n) return e;
            let a = e.d;
            "first" === t.dir || 0 === t.num
              ? ((a = e.start().d), (a = a.startOf(t.unit)))
              : "last" === t.dir
              ? ((a = a.endOf(e.unit)),
                (a =
                  "weekend" === t.unit
                    ? a.day("saturday", !1)
                    : a.startOf(t.unit)))
              : t.num &&
                ("weekend" === t.unit &&
                  (a = a.day("saturday", !0).add(1, "day")),
                (a = a.add(t.num, t.unit)));
            let r = new n(a, null, e.context);
            return !0 === r.d.isValid() ? r : e;
          })(e, n.counter)),
        e
      );
    },
    up =
      "undefined" != typeof process && process.env
        ? process.env
        : self.env || {},
    cp = function (e, t) {
      let n = cm(e, t);
      if (
        ((e = n.doc),
        ((e) => {
          up.DEBUG_DATE &&
            (console.log(`\n==== '${e.doc.text()}' =====`),
            Object.keys(e).forEach((t) => {
              "doc" !== t && e[t] && console.log(t, e[t]);
            }),
            e.doc.debug());
        })(n),
        n.tz)
      ) {
        let e = (t = Object.assign({}, t, { timezone: n.tz })).today.format(
          "iso-short"
        );
        t.today = t.today.goto(t.timezone).set(e);
      }
      let a = ip(e, t, n);
      return (a = lp(a, t, n)), a;
    },
    hp = {
      mon: "monday",
      tue: "tuesday",
      tues: "wednesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday",
      sat: "saturday",
      sun: "sunday",
      monday: "monday",
      tuesday: "tuesday",
      wednesday: "wednesday",
      thursday: "thursday",
      friday: "friday",
      saturday: "saturday",
      sunday: "sunday",
    },
    dp = function (e) {
      return e.match("(every|each)").found
        ? "AND"
        : e.match("(any|a)").found
        ? "OR"
        : null;
    },
    mp = function (e) {
      let t = e.start,
        n = e.end;
      if (t.d.isAfter(n.d)) {
        if (t.isWeekDay && n.isWeekDay) return e.end.next(), e;
        let a = t;
        (e.start = n), (e.end = a);
      }
      return e;
    },
    pp = function (e) {
      let t = e.start,
        n = e.end;
      return t.d.isAfter(n.d) && n.d.hour() < 10 && (n.d = n.d.ampm("pm")), e;
    },
    gp = [
      {
        match:
          "[<from>#Time+] (to|until|upto|through|thru|and) [<to>#Time+ #Date+]",
        desc: "3pm to 4pm january 5th",
        parse: (e, t) => {
          let n = e.groups("from"),
            a = e.groups("to"),
            r = cp(a, t);
          if (r) {
            let e = r.clone();
            if ((e.applyTime(n.text("implicit")), e)) {
              let t = { start: e, end: r, unit: "time" };
              return !1 === /(am|pm)/.test(a) && (t = pp(t)), (t = mp(t)), t;
            }
          }
          return null;
        },
      },
      {
        match:
          "[<main>#Date+] from [<a>#Time] (to|until|upto|through|thru|and) [<b>#Time+]",
        desc: "january from 3pm to 4pm",
        parse: (e, t) => {
          let n = e.groups("main"),
            a = e.groups("a"),
            r = e.groups("b");
          if (((n = cp(n, t)), n)) {
            n.applyTime(a.text("implicit"));
            let e = n.clone();
            if ((e.applyTime(r.text("implicit")), e)) {
              let t = { start: n, end: e, unit: "time" };
              return (
                !1 === /(am|pm)/.test(r.text()) && (t = pp(t)), (t = mp(t)), t
              );
            }
          }
          return null;
        },
      },
      {
        match: "[<from>#Date+] (to|until|upto|through|thru|and) [<to>#Time+]",
        desc: "january from 3pm to 4pm",
        parse: (e, t) => {
          let n = e.groups("from"),
            a = e.groups("to");
          if (((n = cp(n, t)), n)) {
            let e = n.clone();
            if ((e.applyTime(a.text("implicit")), e)) {
              let t = { start: n, end: e, unit: "time" };
              return (
                !1 === /(am|pm)/.test(a.text()) && (t = pp(t)), (t = mp(t)), t
              );
            }
          }
          return null;
        },
      },
    ],
    fp = [
      {
        match: "^during? #Month+ (or|and) #Month [<year>#Year]?",
        desc: "march or june",
        parse: (e, t) => {
          let n = e.match("^during? [#Month]", 0);
          e = e.not("(or|and)");
          let a = cp(n, t);
          if (a) {
            let r = [{ start: a, end: a.clone().end(), unit: a.unit }],
              o = e.not(n);
            o.found &&
              o.match("#Month").forEach((e) => {
                let n = cp(e, t);
                r.push({ start: n, end: n.clone().end(), unit: n.unit });
              });
            let i = e.match("#Year$");
            return (
              i.found &&
                ((i = i.text("reduced")),
                r.forEach((e) => {
                  (e.start.d = e.start.d.year(i)), (e.end.d = e.end.d.year(i));
                })),
              r
            );
          }
          return null;
        },
      },
      {
        match: "^#Month #Value+ (or|and)? #Value$",
        desc: "jan 5 or 8",
        parse: (e, t) => {
          let n = (e = e.not("(or|and)")).match("^#Month #Value"),
            a = cp(n, t);
          if (a) {
            let t = [{ start: a, end: a.clone().end(), unit: a.unit }],
              r = e.not(n);
            return (
              r.found &&
                r.match("#Value").forEach((e) => {
                  let n = a.clone();
                  (n.d = n.d.date(e.text("reduced"))),
                    t.push({ start: n, end: n.clone().end(), unit: n.unit });
                }),
              t
            );
          }
          return null;
        },
      },
      {
        match: "^#Month+ #Value #Value+$",
        desc: "jan 5 8",
        parse: (e, t) => {
          let n = e.match("#Month"),
            a = e.match("#Year");
          e = e.not("#Year");
          let r = [];
          return (
            e.match("#Value").forEach((e) => {
              let o = (e = e.clone()).prepend(n.text());
              a.found && o.append(a);
              let i = cp(o, t);
              i && r.push({ start: i, end: i.clone().end(), unit: i.unit });
            }),
            r
          );
        },
      },
      {
        match: "^#Value+ (or|and)? #Value of #Month #Year?$",
        desc: "5 or 8 of Jan",
        parse: (e, t) => {
          let n = e.match("#Month"),
            a = e.match("#Year");
          e = e.not("#Year");
          let r = [];
          return (
            e.match("#Value").forEach((e) => {
              let o = e.append(n);
              a.found && o.append(a);
              let i = cp(o, t);
              i && r.push({ start: i, end: i.clone().end(), unit: i.unit });
            }),
            r
          );
        },
      },
      {
        match: "^!(between|from|during)? [<from>#Date+] (and|or) [<to>#Date+]$",
        desc: "A or B",
        parse: (e, t) => {
          let n = e.groups("from"),
            a = e.groups("to"),
            r = cp(n, t),
            o = cp(a, t);
          return r && o
            ? [
                { start: r, end: r.clone().end() },
                { start: o, end: o.clone().end() },
              ]
            : null;
        },
      },
    ],
    yp = [
      {
        match: "between [<start>.+] and [<end>.+]",
        desc: "between friday and sunday",
        parse: (e, t) => {
          let n = e.groups("start");
          n = cp(n, t);
          let a = e.groups("end");
          return (
            (a = cp(a, t)),
            n && a ? ((a = a.before()), { start: n, end: a }) : null
          );
        },
      },
      {
        match:
          "[<from>#Month #Value] (to|through|thru) [<to>#Month #Value] [<year>#Year?]",
        desc: "june 5 to june 7",
        parse: (e, t) => {
          let n = e.groups(),
            a = n.from;
          if ((n.year && (a = a.append(n.year)), (a = cp(a, t)), a)) {
            let e = n.to;
            if ((n.year && (e = e.append(n.year)), (e = cp(e, t)), e))
              return (
                a.d.isAfter(e.d) && (e.d = e.d.add(1, "year")),
                { start: a, end: e.end() }
              );
          }
          return null;
        },
      },
      {
        match:
          "[<month>#Month] [<from>#Value] (to|through|thru) [<to>#Value] of? [<year>#Year]",
        desc: "january 5 to 7 1998",
        parse: (e, t) => {
          let { month: n, from: a, to: r, year: o } = e.groups(),
            i = o.clone(),
            s = a.prepend(n).append(o);
          if (((s = cp(s, t)), s)) {
            let e = r.prepend(n).append(i);
            return (e = cp(e, t)), { start: s, end: e.end() };
          }
          return null;
        },
      },
      {
        match:
          "[<from>#Value] (to|through|thru) [<to>#Value of? #Month #Date+?]",
        desc: "5 to 7 of january 1998",
        parse: (e, t) => {
          let n = e.groups("to");
          if (((n = cp(n, t)), n)) {
            let t = e.groups("from"),
              a = n.clone();
            return (
              (a.d = a.d.date(t.text("implicit"))), { start: a, end: n.end() }
            );
          }
          return null;
        },
      },
      {
        match: "[<from>#Month #Value] (to|through|thru) [<to>#Value]",
        desc: "january 5 to 7",
        parse: (e, t) => {
          let n = e.groups("from");
          if (((n = cp(n, t)), n)) {
            let t = e.groups("to"),
              a = n.clone();
            return (
              (a.d = a.d.date(t.text("implicit"))), { start: n, end: a.end() }
            );
          }
          return null;
        },
      },
      {
        match:
          "from? [<from>#Month] (to|until|upto|through|thru) [<to>#Month] [<year>#Year]",
        desc: "january to may 2020",
        parse: (e, t) => {
          let n = e.groups("from"),
            a = e.groups("year").numbers().get()[0],
            r = e.groups("to");
          if (
            ((n = cp(n, t)),
            (r = cp(r, t)),
            (n.d = n.d.year(a)),
            (r.d = r.d.year(a)),
            n && r)
          ) {
            let e = { start: n, end: r.end() };
            return (e = mp(e)), e;
          }
          return null;
        },
      },
    ],
    bp = function (e, t) {
      return e.applyShift(t.punt);
    },
    vp = [
      {
        match: "from? [<from>.+] (to|until|upto|through|thru) [<to>.+]",
        desc: "from A to B",
        parse: (e, t) => {
          let n = e.groups("from"),
            a = e.groups("to");
          if (((n = cp(n, t)), (a = cp(a, t)), n && a)) {
            let e = { start: n, end: a.end() };
            return (e = mp(e)), e;
          }
          return null;
        },
      },
      {
        match: "^due? (by|before) [.+]",
        desc: "before june",
        parse: (e, t) => {
          e = e.group(0);
          let n = cp(e, t);
          if (n) {
            let e = new dm(t.today, null, t);
            return (
              e.d.isAfter(n.d) && (e = n.clone().applyShift({ weeks: -2 })),
              { start: e, end: n.clone().applyShift({ day: -1 }).end() }
            );
          }
          return null;
        },
      },
      {
        match: "^(on|in|at|@|during) [.+]",
        desc: "in june",
        parse: (e, t) => {
          e = e.group(0);
          let n = cp(e, t);
          return n ? { start: n, end: n.clone().end(), unit: n.unit } : null;
        },
      },
      {
        match: "^(after|following) [.+]",
        desc: "after june",
        parse: (e, t) => {
          e = e.group(0);
          let n = cp(e, t);
          return n
            ? ((n = n.after()), { start: n.clone(), end: bp(n.clone(), t) })
            : null;
        },
      },
      {
        match: "^(middle|center|midpoint) of [.+]",
        desc: "middle of",
        parse: (e, t) => {
          e = e.group(0);
          let n = cp(e, t),
            a = n.clone().middle(),
            r = n.beforeEnd();
          return n ? { start: a, end: r } : null;
        },
      },
      {
        match: ".+ after #Time+$",
        desc: "tuesday after 5pm",
        parse: (e, t) => {
          let n = cp(e, t);
          return n ? { start: n.clone(), end: n.end(), unit: "time" } : null;
        },
      },
      {
        match: ".+ before #Time+$",
        desc: "tuesday before noon",
        parse: (e, t) => {
          let n = cp(e, t);
          if (n) {
            let e = n.clone(),
              t = n.start();
            if (n) return { start: t, end: e, unit: "time" };
          }
          return null;
        },
      },
    ],
    wp = [].concat(gp, fp, yp, vp),
    kp =
      "undefined" != typeof process && process.env
        ? process.env
        : self.env || {},
    Pp = function (e, t) {
      let n = { start: null, end: null };
      if (!e.found) return n;
      let a = cp(e, t);
      if (a) {
        let e = a.clone().end();
        n = { start: a, end: e, unit: a.setTime ? "time" : a.unit };
      }
      return n;
    },
    jp = function (e, t) {
      let n =
          (function (e, t) {
            let n = e.match(
              "[<logic>(every|any|each)] [<skip>other?] [<unit>#Duration] (starting|beginning|commencing)?"
            );
            if (n.found) {
              let t = { interval: {} },
                a = n.groups("unit").text("reduced");
              return (
                (t.interval[a] = 1),
                (t.choose = dp(n)),
                n.groups("skip").found && (t.interval[a] = 2),
                (e = e.remove(n)),
                { repeat: t }
              );
            }
            if (
              ((n = e.match(
                "[<logic>(every|any|each)] [<num>#Value] [<unit>#Duration] (starting|beginning|commencing)?"
              )),
              n.found)
            ) {
              let t = { interval: {} },
                a = n.groups("unit");
              a.nouns().toSingular();
              let r = a.text("reduced");
              return (
                (t.interval[r] = n.groups("num").numbers().get()[0]),
                (t.choose = dp(n)),
                (e = e.remove(n)),
                { repeat: t }
              );
            }
            if (
              ((n = e.match(
                "[<logic>(every|any|each|a)] [<skip>other?] [<day>#WeekDay+] (starting|beginning|commencing)?"
              )),
              n.found)
            ) {
              let t = { interval: { day: 1 }, filter: { weekDays: {} } },
                a = n.groups("day").text("reduced");
              if (((a = hp[a]), a))
                return (
                  (t.filter.weekDays[a] = !0),
                  (t.choose = dp(n)),
                  (e = e.remove(n)),
                  { repeat: t }
                );
            }
            if (
              ((n = e.match(
                "[<logic>(every|any|each|a)] [<day>(weekday|week day|weekend|weekend day)] (starting|beginning|commencing)?"
              )),
              n.found)
            ) {
              let t = { interval: { day: 1 }, filter: { weekDays: {} } },
                a = n.groups("day");
              return (
                a.has("(weekday|week day)")
                  ? (t.filter.weekDays = {
                      monday: !0,
                      tuesday: !0,
                      wednesday: !0,
                      thursday: !0,
                      friday: !0,
                    })
                  : a.has("(weekend|weekend day)") &&
                    (t.filter.weekDays = { saturday: !0, sunday: !0 }),
                (t.choose = dp(n)),
                (e = e.remove(n)),
                { repeat: t }
              );
            }
            if (
              ((n = e.match(
                "[<day>(mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays)] (at|near|after)? [<time>#Time+?]"
              )),
              n.found)
            ) {
              let a = { interval: { day: 1 }, filter: { weekDays: {} } },
                r = n.groups("day").text("reduced");
              if (((r = r.replace(/s$/, "")), (r = hp[r]), r)) {
                (a.filter.weekDays[r] = !0),
                  (a.choose = "OR"),
                  (e = e.remove(n));
                let o = n.groups("time");
                return o.found && (a.time = Ud(o, t)), { repeat: a };
              }
            }
            return null;
          })(e, t) || {},
        a = (function (e, t) {
          for (let r = 0; r < wp.length; r += 1) {
            let o = wp[r],
              i = e.match(o.match);
            if (i.found) {
              (a = `  ---[${o.desc}]---`),
                kp.DEBUG_DATE && console.log(`\n  [32m ${a} [0m`);
              let e = o.parse(i, t);
              if (null !== e)
                return (
                  (n = e),
                  "[object Array]" !== Object.prototype.toString.call(n) &&
                    (e = [e]),
                  e
                );
            }
          }
          var n, a;
          return null;
        })(e, t);
      return (
        a || (a = [Pp(e, t)]),
        (a = a.map((e) => Object.assign({}, n, e))),
        a.forEach((e) => {
          e.start &&
            e.end &&
            e.start.d.epoch > e.end.d.epoch &&
            (e.start = e.start.start());
        }),
        a
      );
    },
    Ap = function (e, t) {
      return (
        !1 === (t = t || {}).timezone && (t.timezone = "UTC"),
        (t.today = t.today || Wd.now(t.timezone)),
        (t.today = Wd(t.today, t.timezone)),
        (e = (function (e) {
          return (
            e.numbers ||
              console.warn(
                "\nCompromise warning: compromise/three must be used with compromise-dates plugin\n"
              ),
            (e = e.clone()).numbers().toNumber(),
            e.contractions().expand(),
            e.replace("week end", "weekend", !0).tag("Date"),
            e.replace("up to", "upto", !0).tag("Date"),
            !1 === e.has("once (a|an) #Duration") &&
              e
                .match("[(a|an)] #Duration", 0)
                .replaceWith("1", { tags: !0 })
                .compute("lexicon"),
            e.match("@hasDash").insertAfter("to").tag("Date"),
            e
          );
        })(e)),
        jp(e, t)
      );
    },
    xp = function (e) {
      if (!e.start)
        return { start: null, end: null, timezone: null, duration: {} };
      let t = e.end
        ? (function (e) {
            let t = e.end.d.add(1, "millisecond").since(e.start.d).diff;
            return delete t.milliseconds, delete t.seconds, t;
          })(e)
        : {};
      return {
        start: e.start.format("iso"),
        end: e.end ? e.end.format("iso") : null,
        timezone: e.start.d.format("timezone"),
        duration: t,
      };
    },
    Dp = function (e, t = {}) {
      e = (function (e) {
        let t = (e = e.clone())
          .match("#Time+")
          .match("[<hour>#Cardinal] [<min>(thirty|fifteen)]");
        if (t.found) {
          let e = t.groups("hour"),
            n = t.groups("min"),
            a = e.values().get()[0];
          if (a > 0 && a <= 12) {
            let e = `${a}:${n.values().get()[0]}`;
            t.replaceWith(e);
          }
        }
        if (e.numbers) {
          let t = e.numbers();
          t.toNumber(), t.toCardinal(!1);
        } else
          console.warn(
            "Warning: compromise .numbers() not loaded.\n   This plugin requires >= v14"
          );
        return (
          e.contractions && e.contractions().expand(),
          e.adverbs().remove(),
          e.replace("week end", "weekend", !0).tag("Date"),
          e.replace("up to", "upto", !0).tag("Date"),
          !1 === e.has("once (a|an) #Duration") &&
            e
              .match("[(a|an)] #Duration", 0)
              .replaceWith("1")
              .compute("lexicon"),
          e.match("@hasDash").insertAfter("to").tag("Date"),
          e
        );
      })(e);
      let n = Ud(e, t);
      if (!n.result) return { time: null, "24h": null };
      let a = Wd.now().time(n.result);
      return {
        time: n.result,
        "24h": a.format("time-24"),
        hour: a.hour(),
        minute: a.minute(),
      };
    },
    Ip = (e, t) => ("number" == typeof t ? e.eq(t) : e),
    Np = {
      century: !0,
      day: !0,
      decade: !0,
      hour: !0,
      millisecond: !0,
      minute: !0,
      month: !0,
      second: !0,
      weekend: !0,
      week: !0,
      year: !0,
      quarter: !0,
      season: !0,
    };
  let Ep = {
    m: "minute",
    h: "hour",
    hr: "hour",
    min: "minute",
    sec: "second",
    "week end": "weekend",
    wk: "week",
    yr: "year",
    qtr: "quarter",
  };
  Object.keys(Ep).forEach((e) => {
    Ep[e + "s"] = Ep[e];
  });
  const Tp = function (e) {
      let t = {},
        n = e.match("#Value+ #Duration");
      if (n.found)
        n.forEach((e) => {
          let n = e.numbers().get()[0],
            a = e.terms().last().text("reduced");
          (a = a.replace(/ies$/, "y")),
            (a = a.replace(/s$/, "")),
            Ep.hasOwnProperty(a) && (a = Ep[a]),
            Np.hasOwnProperty(a) && null !== n && (t[a] = n);
        });
      else if (e.match("(#Duration && /[0-9][a-z]+$/)").found) {
        let n = e.text(),
          a = n.match(/([0-9]+)/),
          r = n.match(/([a-z]+)/);
        a &&
          r &&
          ((a = a[0] || null),
          (r = r[0] || null),
          Ep.hasOwnProperty(r) && (r = Ep[r]),
          Np.hasOwnProperty(r) && null !== a && (t[r] = Number(a)));
      }
      return t;
    },
    Op = "(start|end|middle|starting|ending|midpoint|beginning)",
    Cp = (e, t) => {
      !0 === e.found &&
        e.forEach((e) => {
          let n = e.text("reduced"),
            a = parseInt(n, 10);
          a && a > 1e3 && a < 3e3 && e.tag("Year", t);
        });
    },
    Vp = (e, t) => {
      !0 === e.found &&
        e.forEach((e) => {
          let n = e.text("reduced"),
            a = parseInt(n, 10);
          a && a > 1900 && a < 2030 && e.tag("Year", t);
        });
    },
    zp = function (e, t) {
      e.found &&
        (e.tag("Date", t),
        e.numbers().lessThan(31).ifNo("#Year").tag("#Time", t));
    },
    $p = [
      "act",
      "aft",
      "akst",
      "anat",
      "art",
      "azot",
      "azt",
      "bnt",
      "bot",
      "bt",
      "cast",
      "cat",
      "cct",
      "chast",
      "chut",
      "ckt",
      "cvt",
      "cxt",
      "davt",
      "eat",
      "ect",
      "fjt",
      "fkst",
      "fnt",
      "gamt",
      "get",
      "gft",
      "gilt",
      "gyt",
      "hast",
      "hncu",
      "hneg",
      "hnnomx",
      "hnog",
      "hnpm",
      "hnpmx",
      "hntn",
      "hovt",
      "iot",
      "irkt",
      "jst",
      "kgt",
      "kost",
      "lint",
      "magt",
      "mart",
      "mawt",
      "mmt",
      "nct",
      "nft",
      "novt",
      "npt",
      "nrt",
      "nut",
      "nzst",
      "omst",
      "pet",
      "pett",
      "phot",
      "phst",
      "pont",
      "pwt",
      "ret",
      "sakt",
      "samt",
      "sbt",
      "sct",
      "sret",
      "srt",
      "syot",
      "taht",
      "tft",
      "tjt",
      "tkt",
      "tlt",
      "tmt",
      "tot",
      "tvt",
      "ulat",
      "vut",
      "wakt",
      "wat",
      "wet",
      "wft",
      "wit",
      "wst",
      "yekt",
    ].reduce((e, t) => ((e[t] = !0), e), {}),
    Fp = "(in|by|before|during|on|until|after|of|within|all)",
    Bp = "(last|next|this|previous|current|upcoming|coming)",
    Mp = "(start|end|middle|starting|ending|midpoint|beginning|mid)",
    Sp = "(spring|summer|winter|fall|autumn)",
    Gp = "(yesterday|today|tomorrow)",
    Lp = [
      {
        match: "in the (night|evening|morning|afternoon|day|daytime)",
        tag: "Time",
        reason: "in-the-night",
      },
      { match: "(#Value|#Time) (am|pm)", tag: "Time", reason: "value-ampm" },
      { match: "(tue|thu)", tag: "WeekDay", reason: "misc-weekday" },
      { match: "#Month #Date+", tag: "Date", reason: "correction-numberRange" },
      {
        match: "#Value of #Month",
        tag: "Date",
        unTag: "Time",
        reason: "value-of-month",
      },
      { match: "#Cardinal #Month", tag: "Date", reason: "cardinal-month" },
      {
        match: "#Month #Value (and|or|to)? #Value+",
        tag: "Date",
        reason: "value-to-value",
      },
      { match: "#Month the #Value", tag: "Date", reason: "month-the-value" },
      {
        match: "[(march|may)] to? #Date",
        group: 0,
        tag: "Month",
        reason: "march-to",
      },
      { match: "^(march|may)$", tag: "Month", reason: "single-march" },
      { match: "#Month or #Month", tag: "Date", reason: "month-or-month" },
      {
        match: "(#WeekDay|#Month) #Value",
        ifNo: "#Money",
        tag: "Date",
        reason: "date-value",
      },
      {
        match: "#Value (#WeekDay|#Month)",
        ifNo: "#Money",
        tag: "Date",
        reason: "value-date",
      },
      {
        match: "#Value (#WeekDay|#Duration) back",
        tag: "#Date",
        reason: "3-back",
      },
      { match: "for #Value #Duration", tag: "Date", reason: "for-x-duration" },
      {
        match: "#Value #Duration #Conjunction",
        tag: "Date",
        reason: "val-duration-conjunction",
      },
      {
        match: `${Fp}? #Value #Duration`,
        tag: "Date",
        reason: "value-duration",
      },
      {
        match: "in? #Value to #Value #Duration time?",
        tag: "Date",
        reason: "6-to-8-years",
      },
      { match: "#Value #Duration old", unTag: "Date", reason: "val-years-old" },
      { match: `${Fp}? ${Bp} ${Sp}`, tag: "Date", reason: "thisNext-season" },
      { match: `the? ${Mp} of ${Sp}`, tag: "Date", reason: "section-season" },
      { match: `${Sp} ${Fp}? #Cardinal`, tag: "Date", reason: "season-year" },
      { match: "#Date the? #Ordinal", tag: "Date", reason: "correction" },
      { match: `${Bp} #Date`, tag: "Date", reason: "thisNext-date" },
      {
        match: "due? (by|before|after|until) #Date",
        tag: "Date",
        reason: "by",
      },
      {
        match: "(last|next|this|previous|current|upcoming|coming|the) #Date",
        tag: "Date",
        reason: "next-feb",
      },
      {
        match: `#Preposition? the? ${Mp} of #Date`,
        tag: "Date",
        reason: "section-of",
      },
      {
        match: "#Ordinal #Duration in #Date",
        tag: "Date",
        reason: "duration-in",
      },
      {
        match: "(early|late) (at|in)? the? #Date",
        tag: "Time",
        reason: "early-evening",
      },
      {
        match: "#Date [(by|before|after|at|@|about) #Cardinal]",
        group: 0,
        tag: "Time",
        reason: "date-before-Cardinal",
      },
      {
        match: "#Date (#Preposition|to) #Date",
        ifNo: "#Duration",
        tag: "Date",
        reason: "date-prep-date",
      },
      {
        match: "(by|before|after|at|@|about) #Time",
        tag: "Time",
        reason: "preposition-time",
      },
      {
        match: "(in|after) /^[0-9]+(min|sec|wk)s?/",
        tag: "Date",
        reason: "shift-units",
      },
      {
        match: "#Date [(now|night|sometime)]",
        group: 0,
        tag: "Time",
        reason: "date-now",
      },
      { match: "(from|starting|until|by) now", tag: "Date", reason: "for-now" },
      { match: "(each|every) night", tag: "Date", reason: "for-now" },
      { match: "#Date [(am|pm)]", group: 0, tag: "Time", reason: "date-am" },
      { match: `[${Mp}] #Date`, group: 0, tag: "Date", reason: "mid-sept" },
      {
        match: "#Month #Value to #Value of? #Year?",
        tag: "Date",
        reason: "june 5 to 7th",
      },
      {
        match: "#Value to #Value of? #Month #Year?",
        tag: "Date",
        reason: "5 to 7th june",
      },
      {
        match: "#Value #Duration of #Date",
        tag: "Date",
        reason: "third week of may",
      },
      {
        match: "#Value+ #Duration (after|before|into|later|afterwards|ago)?",
        tag: "Date",
        reason: "two days after",
      },
      { match: "#Value #Date", tag: "Date", reason: "two days" },
      { match: "#Date #Value", tag: "Date", reason: "june 5th" },
      {
        match: "#Date #Preposition #Value",
        tag: "Date",
        reason: "tuesday at 5",
      },
      {
        match: "#Date (after|before|during|on|in) #Value",
        tag: "Date",
        reason: "tomorrow before 3",
      },
      {
        match: "#Value (year|month|week|day) and a half",
        tag: "Date",
        reason: "a year and a half",
      },
      {
        match: "#Value and a half (years|months|weeks|days)",
        tag: "Date",
        reason: "5 and a half years",
      },
      { match: "on the #Ordinal", tag: "Date", reason: "on the fifth" },
      {
        match: "#Month #Value+ (and|or) #Value",
        tag: "Date",
        reason: "date-or-date",
      },
      {
        match: "#Value+ (and|or) #Value of #Month ",
        tag: "Date",
        reason: "date-and-date",
      },
      {
        match:
          "(spring|summer|winter|fall|autumn|springtime|wintertime|summertime)",
        tag: "Season",
        reason: "date-tag1",
      },
      { match: "(q1|q2|q3|q4)", tag: "FinancialQuarter", reason: "date-tag2" },
      {
        match: "(this|next|last|current) quarter",
        tag: "FinancialQuarter",
        reason: "date-tag3",
      },
      {
        match: "(this|next|last|current) season",
        tag: "Season",
        reason: "date-tag4",
      },
      {
        match: "#Date #Preposition #Date",
        tag: "Date",
        reason: "friday to sunday",
      },
      {
        match: "(once|twice) (a|an|each) #Date",
        tag: "Date",
        reason: "once a day",
      },
      { match: "a #Duration", tag: "Date", reason: "a year" },
      { match: "(between|from) #Date", tag: "Date", reason: "between x and y" },
      {
        match: "(to|until|upto) #Date",
        tag: "Date",
        reason: "between x and y2",
      },
      { match: "#Date and #Date", tag: "Date", reason: "between x and y3" },
      {
        match: "the? #Date after next one?",
        tag: "Date",
        reason: "day after next",
      },
      {
        match: "(about|approx|approximately|around) #Date",
        tag: "Date",
        reason: "approximately june",
      },
      {
        match: "(by|until|on|in|at|during|over|every|each|due) the? #Date",
        ifNo: "#PhrasalVerb",
        tag: "Date",
        reason: "until june",
      },
      {
        match:
          "(by|until|after|before|during|on|in|following|since) (next|this|last)? #Date",
        ifNo: "#PhrasalVerb",
        tag: "Date",
        reason: "until last june",
      },
      {
        match:
          "this? (last|next|past|this|previous|current|upcoming|coming|the) #Date",
        tag: "Date",
        reason: "next september",
      },
      {
        match: "(starting|beginning|ending) #Date",
        tag: "Date",
        reason: "starting this june",
      },
      {
        match:
          "the? (start|end|middle|beginning) of (last|next|this|the) #Date",
        tag: "Date",
        reason: "start of june",
      },
      { match: "(the|this) #Date", tag: "Date", reason: "this coming june" },
      { match: "#Date up to #Date", tag: "Date", reason: "january up to june" },
      { match: "#Cardinal oclock", tag: "Time", reason: "2 oclock" },
      {
        match: "#Value (in|at) the? (morning|evening|night|nighttime)",
        tag: "Time",
        reason: "3 in the morning",
      },
      {
        match:
          "(5|10|15|20|five|ten|fifteen|quarter|twenty|half) (after|past) #Cardinal",
        tag: "Time",
        reason: "ten to seven",
      },
      {
        match:
          "(at|by|before) (5|10|15|20|five|ten|fifteen|twenty|quarter|half) (after|past|to)",
        tag: "Time",
        reason: "at-20-past",
      },
      {
        match: "#Date [at #Cardinal]",
        group: 0,
        ifNo: "#Year",
        tag: "Time",
        reason: " tuesday at 4",
      },
      {
        match: "half an (hour|minute|second)",
        tag: "Date",
        reason: "half an hour",
      },
      {
        match: "(in|for|by|near|at) #Timezone",
        tag: "Date",
        reason: "in eastern time",
      },
      { match: "#Time to #Time", tag: "Date", reason: "3pm to 4pm" },
      {
        match: "#Time [(sharp|on the dot)]",
        group: 0,
        tag: "Time",
        reason: "4pm sharp",
      },
      {
        match: "(at|around|near|#Date) [#Cardinal (thirty|fifteen) (am|pm)?]",
        group: 0,
        tag: "Time",
        reason: "around four thirty",
      },
      {
        match: "#Cardinal (thirty|fifteen) (am|pm)",
        tag: "Time",
        reason: "four thirty am",
      },
      {
        match: "[#Cardinal (thirty|fifteen)] #Date",
        group: 0,
        tag: "Time",
        reason: "four thirty tomorrow",
      },
      {
        match: "(anytime|sometime) (before|after|near) [#Cardinal]",
        group: 0,
        tag: "Time",
        reason: "antime-after-3",
      },
      {
        match: "(#Cardinal|a|an) #Duration (before|after|ago|from|hence|back)",
        tag: "DateShift",
        reason: "nine weeks frow now",
      },
      {
        match: "in (around|about|maybe|perhaps)? #Cardinal #Duration",
        tag: "DateShift",
        reason: "in two weeks",
      },
      { match: "in (a|an) #Duration", tag: "DateShift", reason: "in a week" },
      {
        match: "[(a|an) #Duration from] #Date",
        group: 0,
        tag: "DateShift",
        reason: "an hour from now",
      },
      {
        match: "(a|an) #Duration ago",
        tag: "DateShift",
        reason: "a month ago",
      },
      {
        match: "in half (a|an) #Duration",
        tag: "DateShift",
        reason: "in half an hour",
      },
      {
        match: "in a (few|couple) of? #Duration",
        tag: "DateShift",
        reason: "in a few weeks",
      },
      {
        match: "[#Duration (after|before)] #Date",
        group: 0,
        tag: "DateShift",
        reason: "day after tomorrow",
      },
      {
        match: "#Month #Ordinal and #Ordinal",
        tag: "Date",
        reason: "ord-and-ord",
      },
      { match: "every other #Duration", tag: "Date", reason: "every-other" },
      {
        match: "(every|any|each|a) (day|weekday|week day|weekend|weekend day)",
        tag: "Date",
        reason: "any-weekday",
      },
      {
        match: "(every|any|each|a) (#WeekDay)",
        tag: "Date",
        reason: "any-wednesday",
      },
      {
        match: "(every|any|each|a) (#Duration)",
        tag: "Date",
        reason: "any-week",
      },
      {
        match: "[(wed|sat)] (#Month|#Year|on|between|during|from)",
        group: 0,
        tag: "WeekDay",
        reason: "wed",
      },
      { match: "^day$", unTag: "Date", reason: "spa-day" },
      {
        match: "(in|of|by|for)? (#Possessive && #Date)",
        unTag: "Date",
        reason: "tomorrows meeting",
      },
      {
        match: `${Gp} [#Value]$`,
        unTag: "Date",
        group: 0,
        reason: "yesterday-7",
      },
      {
        match: `^[#Value] ${Gp}$`,
        group: 0,
        unTag: "Date",
        reason: "7 yesterday",
      },
      { match: "on #Cardinal$", unTag: "Date", reason: "on 5" },
      {
        match: "[this] tomorrow",
        group: 0,
        unTag: "Date",
        reason: "this-tomorrow",
      },
      { match: "(q1|q2|q3|q4) #Year", tag: "Date", reason: "q2 2016" },
      {
        match: "^[#Value] (this|next|last)",
        group: 0,
        unTag: "Date",
        reason: "4 next",
      },
      {
        match: "(last|this|next) #Duration [#Value]",
        group: 0,
        unTag: "Date",
        reason: "this month 7",
      },
      {
        match: "[!#Month] #Value (last|this|next) #Date",
        group: 0,
        unTag: "Date",
        reason: "7 this month",
      },
      {
        match: "(in|over) the #Duration #Date+?",
        unTag: "Date",
        reason: "over-the-duration",
      },
      { match: "#Ordinal quarter of? #Year", unTag: "Fraction" },
      { match: "(from|by|before) now", unTag: "Time", tag: "Date" },
    ];
  let Hp = null;
  const qp = function (e) {
      let { world: t } = e;
      (Hp = Hp || t.methods.one.buildNet(Lp, t)), e.sweep(Hp);
    },
    Wp = {
      dates: function (e) {
        return (
          e.cache(),
          qp(e),
          qp(e),
          (function (e) {
            e.match(
              "(march|april|may) (and|to|or|through|until)? (march|april|may)"
            )
              .tag("Date")
              .match("(march|april|may)")
              .tag("Month", "march|april|may");
            let t = e.if("#Cardinal");
            if (!0 === t.found) {
              let e = t.match("#Date #Value [#Cardinal]", 0);
              Cp(e, "date-value-year"),
                (e = t.match("#Date [#Cardinal]", 0)),
                Vp(e, "date-year"),
                (e = t.match(`${Op} of [#Cardinal]`)),
                Vp(e, "section-year"),
                (e = t.match("#Month #Value [#Cardinal]", 0)),
                Cp(e, "month-value-year"),
                (e = t.match("#Month #Value to #Value [#Cardinal]", 0)),
                Cp(e, "month-range-year"),
                (e = t.match(
                  "(in|of|by|during|before|starting|ending|for|year|since) [#Cardinal]",
                  0
                )),
                Cp(e, "in-year-1"),
                (e = t.match("(q1|q2|q3|q4) [#Cardinal]", 0)),
                Cp(e, "in-year-2"),
                (e = t.match("#Ordinal quarter of? [#Cardinal]", 0)),
                Cp(e, "in-year-3"),
                (e = t.match("the year [#Cardinal]", 0)),
                Cp(e, "in-year-4"),
                (e = t.match("it (is|was) [#Cardinal]", 0)),
                Vp(e, "in-year-5"),
                t.match(`${Op} of #Year`).tag("Date");
              let n = t.match("between [#Cardinal] and [#Cardinal]");
              Cp(n.groups("0"), "between-year-and-year-1"),
                Cp(n.groups("1"), "between-year-and-year-2");
            }
            let n = e.match("^/^20[012][0-9]$/$");
            Vp(n, "2020-ish");
          })(e),
          (function (e) {
            let t = e.if("#Date");
            if (t.found) {
              let n = t.if("#NumberRange");
              if (n.found) {
                let e = n.match("[#NumberRange+] (on|by|at)? #WeekDay", 0);
                zp(e, "3-4-tuesday"),
                  (e = n.match("[#NumberRange+] (on|by|at)? #Month #Value", 0)),
                  zp(e, "3-4 mar 3"),
                  (e = n.match("[#NumberRange] to (#NumberRange && #Time)", 0)),
                  zp(e, "3-4pm"),
                  (e = n.match("(#NumberRange && #Time) to [#NumberRange]", 0)),
                  zp(e, "3pm-4");
              }
              let a = t.match(
                "(from|between) #Cardinal and #Cardinal (in|on)? (#WeekDay|tomorrow|yesterday)"
              );
              zp(a, "from 9-5 tues"),
                (a = e.match(
                  "#Cardinal to #Cardinal (#WeekDay|tomorrow|yesterday)"
                )),
                zp(a, "9-5 tues"),
                (a = t
                  .match("(from|between) [#NumericValue] (to|and) #Time", 0)
                  .tag("Time", "4-to-5pm")),
                zp(a, "from 9-5pm"),
                (a = t.match(
                  "(#WeekDay|tomorrow|yesterday) (from|between)? (#Cardinal|#Time) (and|to) (#Cardinal|#Time)"
                )),
                zp(a, "tues 3-5"),
                (a = t
                  .match(
                    "#Month #Value+ (from|between) [<time>(#Cardinal|#Time) (and|to) (#Cardinal|#Time)]"
                  )
                  .group("time")),
                zp(a, "sep 4 from 9-5"),
                (a = t.match("#Time to #Cardinal on? #Date")),
                zp(a, "3pm-4 wed"),
                (a = t.match("#Cardinal to #Time on? #Date")),
                zp(a, "3-4pm wed"),
                (a = t.match(
                  "#Cardinal to #Cardinal on? (#WeekDay|#Month #Value)"
                )),
                zp(a, "3-4 wed");
            }
          })(e),
          (function (e) {
            let t = e.match("#Time [#Acronym]", 0);
            if (t.found) {
              let e = t.text("reduced");
              !0 === $p[e] && t.tag("Timezone", "tz-abbr");
            }
          })(e),
          (function (e) {
            if (e.has("#Date")) {
              let t = e.match("#Date+ by #Date+");
              t.found &&
                !t.has("^due") &&
                t.match("^#Date+").unTag("Date", "by-monday");
              let n = e.match("#Date+");
              n.has("^between") &&
                !n.has("and .") &&
                n.unTag("Date", "fix-tagger"),
                n.has("(minutes|seconds|weeks|hours|days|months)") &&
                  !n.has("#Value #Duration") &&
                  n
                    .match("(minutes|seconds|weeks|hours|days|months)")
                    .unTag("Date", "log-hours"),
                n.has("about #Holiday") &&
                  n.match("about").unTag("#Date", "about-thanksgiving"),
                n.match("#Date+").match("^the").unTag("Date");
            }
          })(e),
          e.uncache(),
          e
            .match("#Cardinal #Duration and? #DateShift")
            .tag("DateShift", "three days before"),
          e
            .match("#DateShift and #Cardinal #Duration")
            .tag("DateShift", "three days and two weeks"),
          e.match("#Time [(sharp|on the dot)]").tag("Time", "4pm sharp"),
          e
        );
      },
    },
    Jp = "America/",
    _p = "Asia/",
    Kp = "Europe/",
    Up = "Africa/",
    Rp = "Australia/",
    Yp = "Pacific/",
    Qp = {
      "british summer time": Kp + "London",
      bst: Kp + "London",
      "british time": Kp + "London",
      "britain time": Kp + "London",
      "irish summer time": Kp + "Dublin",
      "irish time": Kp + "Dublin",
      "central european time": Kp + "Berlin",
      cet: Kp + "Berlin",
      "central european summer time": Kp + "Berlin",
      cest: Kp + "Berlin",
      "central europe": Kp + "Berlin",
      "eastern european time": Kp + "Riga",
      eet: Kp + "Riga",
      "eastern european summer time": Kp + "Riga",
      eest: Kp + "Riga",
      "eastern europe time": Kp + "Riga",
      "western european time": Kp + "Lisbon",
      "western european summer time": Kp + "Lisbon",
      "turkey standard time": Kp + "Istanbul",
      "turkish time": Kp + "Istanbul",
      utc: Up + "Freetown",
      "greenwich standard time": Up + "Freetown",
      gmt: Up + "Freetown",
      "east africa time": Up + "Nairobi",
      "east african time": Up + "Nairobi",
      "eastern africa time": Up + "Nairobi",
      "central africa time": Up + "Khartoum",
      "central african time": Up + "Khartoum",
      "south africa standard time": Up + "Johannesburg",
      "west africa standard time": Up + "Lagos",
      "western africa time": Up + "Lagos",
      "west african time": Up + "Lagos",
      "australian central standard time": Rp + "Adelaide",
      acst: Rp + "Adelaide",
      "australian central daylight time": Rp + "Adelaide",
      acdt: Rp + "Adelaide",
      "australian eastern standard time": Rp + "Brisbane",
      aest: Rp + "Brisbane",
      "australian eastern daylight time": Rp + "Brisbane",
      aedt: Rp + "Brisbane",
      "australian western standard time": Rp + "Perth",
      awst: Rp + "Perth",
      "australian western daylight time": Rp + "Perth",
      awdt: Rp + "Perth",
      "australian central western standard time": Rp + "Eucla",
      acwst: Rp + "Eucla",
      "lord howe standard time": Rp + "Lord_Howe",
      lhst: Rp + "Lord_Howe",
      "lord howe daylight time": Rp + "Lord_Howe",
      lhdt: Rp + "Lord_Howe",
      "russian standard time": Kp + "Moscow",
      msk: Kp + "Moscow",
      "central standard time": Jp + "Chicago",
      "central time": Jp + "Chicago",
      cst: Jp + "Havana",
      "central daylight time": Jp + "Chicago",
      cdt: Jp + "Havana",
      "mountain standard time": Jp + "Denver",
      "mountain time": Jp + "Denver",
      mst: Jp + "Denver",
      "mountain daylight time": Jp + "Denver",
      mdt: Jp + "Denver",
      "atlantic standard time": Jp + "Halifax",
      "atlantic time": Jp + "Halifax",
      ast: _p + "Baghdad",
      "atlantic daylight time": Jp + "Halifax",
      adt: Jp + "Halifax",
      "eastern standard time": Jp + "New_York",
      "eastern time": Jp + "New_York",
      est: Jp + "New_York",
      "eastern daylight time": Jp + "New_York",
      edt: Jp + "New_York",
      "pacific time": Jp + "Los_Angeles",
      "pacific standard time": Jp + "Los_Angeles",
      pst: Jp + "Los_Angeles",
      "pacific daylight time": Jp + "Los_Angeles",
      pdt: Jp + "Los_Angeles",
      "alaskan standard time": Jp + "Anchorage",
      "alaskan time": Jp + "Anchorage",
      ahst: Jp + "Anchorage",
      "alaskan daylight time": Jp + "Anchorage",
      ahdt: Jp + "Anchorage",
      "hawaiian standard time": Yp + "Honolulu",
      "hawaiian time": Yp + "Honolulu",
      hst: Yp + "Honolulu",
      "aleutian time": Yp + "Honolulu",
      "hawaii time": Yp + "Honolulu",
      "newfoundland standard time": Jp + "St_Johns",
      "newfoundland time": Jp + "St_Johns",
      "newfoundland daylight time": Jp + "St_Johns",
      "brazil time": Jp + "Sao_Paulo",
      "brazilian time": Jp + "Sao_Paulo",
      "argentina time": Jp + "Buenos_Aires",
      "argentinian time": Jp + "Buenos_Aires",
      "amazon time": Jp + "Manaus",
      "amazonian time": Jp + "Manaus",
      "easter island standard time": "Chile/Easterisland",
      "easter island summer time": "Chile/Easterisland",
      easst: "Chile/Easterisland",
      "venezuelan standard time": Jp + "Caracas",
      "venezuelan time": Jp + "Caracas",
      "venezuela time": Jp + "Caracas",
      "paraguay time": Jp + "Asuncion",
      "paraguay summer time": Jp + "Asuncion",
      "cuba standard time": Jp + "Havana",
      "cuba time": Jp + "Havana",
      "cuba daylight time": Jp + "Havana",
      "cuban time": Jp + "Havana",
      "bolivia time": Jp + "La_Paz",
      "bolivian time": Jp + "La_Paz",
      "colombia time": Jp + "Bogota",
      "colombian time": Jp + "Bogota",
      "acre time": Jp + "Eirunepe",
      "peru time": Jp + "Lima",
      "chile standard time": Jp + "Punta_Arenas",
      "chile time": Jp + "Punta_Arenas",
      clst: Jp + "Punta_Arenas",
      "chile summer time": Jp + "Punta_Arenas",
      cldt: Jp + "Punta_Arenas",
      "uruguay time": Jp + "Montevideo",
      uyt: Jp + "Montevideo",
      "arabic standard time": _p + "Baghdad",
      "iran standard time": _p + "Tehran",
      "iran time": _p + "Tehran",
      "iran daylight time": _p + "Tehran",
      "pakistan standard time": _p + "Karachi",
      "pakistan time": _p + "Karachi",
      "india standard time": _p + "Kolkata",
      "indian time": _p + "Kolkata",
      "indochina time": _p + "Bangkok",
      "china standard time": _p + "Shanghai",
      "alma-ata time": _p + "Almaty",
      "oral time": _p + "Oral",
      "orat time": _p + "Oral",
      "yakutsk time": _p + "Yakutsk",
      yakt: _p + "Yakutsk",
      "gulf standard time": _p + "Dubai",
      "gulf time": _p + "Dubai",
      "hong kong time": _p + "Hong_Kong",
      "western indonesian time": _p + "Jakarta",
      "indonesia time": _p + "Jakarta",
      "central indonesian time": _p + "Makassar",
      "israel daylight time": _p + "Jerusalem",
      "israel standard time": _p + "Jerusalem",
      "israel time": _p + "Jerusalem",
      "krasnoyarsk time": _p + "Krasnoyarsk",
      "malaysia time": _p + "Kuala_Lumpur",
      "singapore time": _p + "Singapore",
      "korea standard time": _p + "Seoul",
      "korea time": _p + "Seoul",
      kst: _p + "Seoul",
      "korean time": _p + "Seoul",
      "uzbekistan time": _p + "Samarkand",
      "vladivostok time": _p + "Vladivostok",
      "maldives time": "Indian/Maldives",
      "mauritius time": "Indian/Mauritius",
      "marshall islands time": Yp + "Kwajalein",
      "samoa standard time": Yp + "Midway",
      "somoan time": Yp + "Midway",
      "chamorro standard time": Yp + "Guam",
      "papua new guinea time": Yp + "Bougainville",
    };
  let Zp = Wd().timezones,
    Xp = Object.keys(Zp).reduce((e, t) => ((e[t] = t), e), {});
  const eg = Object.assign({}, Qp, Xp);
  let tg = { "a couple": "Value", thur: "WeekDay", thurs: "WeekDay" };
  const ng = function (e, t) {
    e.forEach((e) => {
      tg[e] = t;
    });
  };
  ng(Object.keys(eg), "Timezone"),
    ng(
      [
        "weekday",
        "summer",
        "winter",
        "autumn",
        "all day",
        "eod",
        "eom",
        "eoy",
        "standard time",
        "daylight time",
        "tommorrow",
      ],
      "Date"
    ),
    ng(
      [
        "centuries",
        "century",
        "day",
        "days",
        "decade",
        "decades",
        "hour",
        "hours",
        "hr",
        "hrs",
        "millisecond",
        "milliseconds",
        "minute",
        "minutes",
        "min",
        "mins",
        "month",
        "months",
        "seconds",
        "sec",
        "secs",
        "week end",
        "week ends",
        "weekend",
        "weekends",
        "week",
        "weeks",
        "wk",
        "wks",
        "year",
        "years",
        "yr",
        "yrs",
        "quarter",
        "qtr",
        "qtrs",
        "season",
        "seasons",
      ],
      "Duration"
    ),
    ng(
      [
        "all hallows eve",
        "all saints day",
        "all sts day",
        "april fools",
        "armistice day",
        "australia day",
        "bastille day",
        "boxing day",
        "canada day",
        "christmas eve",
        "christmas",
        "cinco de mayo",
        "day of the dead",
        "dia de muertos",
        "dieciseis de septiembre",
        "emancipation day",
        "grito de dolores",
        "groundhog day",
        "halloween",
        "harvey milk day",
        "inauguration day",
        "independence day",
        "independents day",
        "juneteenth",
        "labour day",
        "national freedom day",
        "national nurses day",
        "new years eve",
        "new years",
        "purple heart day",
        "rememberance day",
        "rosa parks day",
        "saint andrews day",
        "saint patricks day",
        "saint stephens day",
        "saint valentines day",
        "st andrews day",
        "st patricks day",
        "st stephens day",
        "st valentines day ",
        "valentines day",
        "valentines",
        "veterans day",
        "victoria day",
        "womens equality day",
        "xmas",
        "epiphany",
        "orthodox christmas day",
        "orthodox new year",
        "assumption of mary",
        "all souls day",
        "feast of the immaculate conception",
        "feast of our lady of guadalupe",
        "kwanzaa",
        "imbolc",
        "beltaine",
        "lughnassadh",
        "samhain",
        "martin luther king day",
        "mlk day",
        "presidents day",
        "mardi gras",
        "tax day",
        "commonwealth day",
        "mothers day",
        "memorial day",
        "fathers day",
        "columbus day",
        "indigenous peoples day",
        "canadian thanksgiving",
        "election day",
        "thanksgiving",
        "t-day",
        "turkey day",
        "black friday",
        "cyber monday",
        "ash wednesday",
        "palm sunday",
        "maundy thursday",
        "good friday",
        "holy saturday",
        "easter",
        "easter sunday",
        "easter monday",
        "orthodox good friday",
        "orthodox holy saturday",
        "orthodox easter",
        "orthodox easter monday",
        "ascension day",
        "pentecost",
        "whitsunday",
        "whit sunday",
        "whit monday",
        "trinity sunday",
        "corpus christi",
        "advent",
        "tu bishvat",
        "tu bshevat",
        "purim",
        "passover",
        "yom hashoah",
        "lag baomer",
        "shavuot",
        "tisha bav",
        "rosh hashana",
        "yom kippur",
        "sukkot",
        "shmini atzeret",
        "simchat torah",
        "chanukah",
        "hanukkah",
        "isra and miraj",
        "lailat al-qadr",
        "eid al-fitr",
        "id al-Fitr",
        "eid ul-Fitr",
        "ramadan",
        "eid al-adha",
        "muharram",
        "the prophets birthday",
        "ostara",
        "march equinox",
        "vernal equinox",
        "litha",
        "june solistice",
        "summer solistice",
        "mabon",
        "september equinox",
        "fall equinox",
        "autumnal equinox",
        "yule",
        "december solstice",
        "winter solstice",
        "chinese new year",
        "diwali",
      ],
      "Holiday"
    ),
    ng(
      [
        "noon",
        "midnight",
        "morning",
        "tonight",
        "evening",
        "afternoon",
        "breakfast time",
        "lunchtime",
        "dinnertime",
        "midday",
        "eod",
        "oclock",
        "oclock",
        "at night",
      ],
      "Time"
    );
  const ag = [
      [/^[0-9]+(min|sec|hr|d)s?$/i, "Duration", "30min"],
      [/^[0-9]{4}-[0-9]{2}$/, "Date", "2012-06"],
      [/^[0-9]{2}h[0-9]{2}$/i, "Time", "13h30"],
      [/^@[0-9]+:[0-9]{2}$/, "Time", "@5:30"],
      [/^@[1-9]+(am|pm)$/, "Time", "@5pm"],
      [/^[0-9]{2}\/[0-9]{2}/, "Date", "03/02"],
    ],
    rg = {
      tags: {
        FinancialQuarter: { is: "Date", not: ["Fraction"] },
        Season: { is: "Date" },
        Year: { is: "Date", not: ["RomanNumeral"] },
        Holiday: { is: "Date", also: "Noun" },
        DateShift: { is: "Date", not: ["Timezone", "Holiday"] },
      },
      words: tg,
      compute: Wp,
      api: function (e) {
        (function (e) {
          class t extends e {
            constructor(e, t, n, a = {}) {
              super(e, t, n), (this.viewType = "Dates"), (this.opts = a);
            }
            get(e) {
              let t = [];
              return (
                this.forEach((e) => {
                  Ap(e, this.opts).forEach((e) => {
                    t.push(xp(e));
                  });
                }),
                "number" == typeof e ? t[e] : t
              );
            }
            json(e = {}) {
              return this.map((t) => {
                let n = t.toView().json(e)[0] || {};
                if (e && !0 !== e.dates) {
                  let e = Ap(t, this.opts);
                  n.dates = xp(e[0]);
                }
                return n;
              }, []);
            }
            format(e) {
              let n = this.map((t) => {
                let n = Ap(t, this.opts)[0] || {};
                if (n.start) {
                  let a = n.start.d,
                    r = a.format(e);
                  if (n.end) {
                    let t = n.end.d;
                    !1 === a.isSame(t, "day") && (r += " to " + t.format(e));
                  }
                  t.replaceWith(r);
                }
                return t;
              });
              return new t(this.document, n.pointer, null, this.opts);
            }
          }
          e.prototype.dates = function (e) {
            let n = (function (e) {
              let t = e.match("#Date+");
              t = t.filter((e) => {
                let t = e.has("^#Duration+$") || e.has("^#Value #Duration+$");
                return (
                  !(!0 !== t || !e.has("(#FinancialQuarter|quarter)")) ||
                  !1 === t
                );
              });
              let n = t.match(
                "[#Cardinal #Duration (in|on|this|next|during|for)] #Date",
                0
              );
              return (
                n.found && (t = t.not(n)),
                (n = t.match("[#Cardinal #Duration] #WeekDay", 0)),
                n.found && (t = t.not(n)),
                (n = t.match("#Date [for #Value #Duration]$", 0)),
                n.found && (t = t.not(n)),
                (n = t.match("[#Cardinal #Duration] #Date", 0)),
                n.found &&
                  !t.has("#Cardinal #Duration] (ago|from|before|after|back)") &&
                  (t = t.not(n)),
                (n = t.match("for #Cardinal #Duration")),
                n.found && (t = t.not(n)),
                (t = t.notIf("^one (#WeekDay|#Month)$")),
                (t = (function (e) {
                  let t = null;
                  return e.has("^(between|within) #Date")
                    ? e
                    : (e.has("#Month") &&
                        ((t = e
                          .match("[#Month #Value] and? #Month", 0)
                          .ifNo("@hasDash$")),
                        t.found && (e = e.splitAfter(t)),
                        (t = e.match("[#Value #Month] and? #Value #Month", 0)),
                        t.found && (e = e.splitAfter(t)),
                        (t = e.match("^[#Month] and? #Month #Ordinal?$", 0)),
                        t.found && (e = e.splitAfter(t)),
                        (t = e
                          .match("[#Month #Value] #Month", 0)
                          .ifNo("@hasDash$")),
                        t.found && (e = e.splitAfter(t))),
                      e.has("#WeekDay") &&
                        ((t = e
                          .match("^[#WeekDay] and? #WeekDay$", 0)
                          .ifNo("@hasDash$")),
                        t.found && (e = e.splitAfter(t)),
                        (t = e.match("#WeekDay #WeekDay and? #WeekDay")),
                        t.found && (e = e.splitOn("#WeekDay")),
                        (t = e
                          .match("[#WeekDay] (and|or|this|next)? #WeekDay", 0)
                          .ifNo("@hasDash$")),
                        t.found && (e = e.splitAfter("#WeekDay"))),
                      (t = e.match(
                        "(this|next) #Duration [(today|tomorrow|yesterday)]",
                        0
                      )),
                      t.found && (e = e.splitBefore(t)),
                      (t = e.match(
                        "[(today|tomorrow|yesterday)] #Value #Month",
                        0
                      )),
                      t.found && (e = e.splitAfter(t)),
                      (t = e
                        .match(
                          "[(today|tomorrow|yesterday)] (today|tomorrow|yesterday|#WeekDay)",
                          0
                        )
                        .ifNo("@hasDash$")),
                      t.found && (e = e.splitAfter(t)),
                      (e = e.not("^and")));
                })(t)),
                (t = t.notIf("(#Money|#Percentage)")),
                (t = t.notIf("^per #Duration")),
                t
              );
            })(this);
            return new t(this.document, n.pointer, null, e);
          };
        })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n, a) {
                super(e, t, n),
                  (this.viewType = "Times"),
                  (this.opts = a || {});
              }
              format(e) {
                let n = this.map((t) => {
                  let n = Dp(t) || {};
                  if (n.time) {
                    let a = Wd.now().time(n.time),
                      r = n.time;
                    (r = "24h" === e ? a.format("time-24") : a.format(e)),
                      (t = t.not("#Preposition")).replaceWith(r);
                  }
                  return t;
                });
                return new t(this.document, n.pointer, null, this.opts);
              }
              get(e) {
                return Ip(this, e).map(Dp);
              }
              json(e = {}) {
                return this.map((t) => {
                  let n = t.toView().json(e)[0] || {};
                  return e && !0 !== e.times && (n.time = Dp(t)), n;
                }, []);
              }
            }
            e.prototype.times = function (e) {
              let n = this.match("#Time+ (am|pm)?");
              return (n = Ip(n, e)), new t(this.document, n.pointer);
            };
          })(e),
          (function (e) {
            class t extends e {
              constructor(e, t, n) {
                super(e, t, n), (this.context = {});
              }
              json(e = {}) {
                return this.map((t) => {
                  let n = t.toView().json(e)[0] || {};
                  return e && !0 !== e.times && (n.duration = Tp(t)), n;
                }, []);
              }
              get(e) {
                let t = [];
                return (
                  this.forEach((e) => {
                    let n = Tp(e);
                    t.push(n);
                  }),
                  "number" == typeof e ? t[e] : t
                );
              }
            }
            e.prototype.durations = function (e) {
              let n = this.match("#Value+ #Duration (and? #Value+ #Duration)?");
              return (
                (n = n.notIf("#DateShift")),
                "number" == typeof e && (n = n.eq(e)),
                new t(this.document, n.pointer)
              );
            };
          })(e);
      },
      mutate: (e) => {
        (e.model.two.regexText = e.model.two.regexText || []),
          (e.model.two.regexText = e.model.two.regexText.concat(ag));
      },
      hooks: ["dates"],
      version: "3.4.1",
    };
  $c.extend(rg), (window.nlp = $c);
})();
