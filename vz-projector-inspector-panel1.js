zc =
  (this && this.__extends) ||
  (function () {
    var a =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (b, c) {
          b.__proto__ = c;
        }) ||
      function (b, c) {
        for (var d in c) c.hasOwnProperty(d) && (b[d] = c[d]);
      };
    return function (b, c) {
      function d() {
        this.constructor = b;
      }
      a(b, c);
      b.prototype =
        null === c ? Object.create(c) : ((d.prototype = c.prototype), new d());
    };
  })();
(function (a) {
  a.InspectorPanelPolymer = a.PolymerElement({
    is: "vz-projector-inspector-panel",
    properties: {
      selectedMetadataField: String,
      metadataFields: Array,
      metadataColumn: String,
      numNN: { type: Number, value: 100 },
      updateNumNN: Object,
    },
  });
  var b = (function (c) {
    function d() {
      return (null !== c && c.apply(this, arguments)) || this;
    }
    zc(d, c);
    d.prototype.ready = function () {
      this.resetFilterButton = this.querySelector(".reset-filter");
      this.setFilterButton = this.querySelector(".set-filter");
      this.clearSelectionButton = this.querySelector(".clear-selection");
      this.limitMessage = this.querySelector(".limit-msg");
      this.searchBox = this.querySelector("#search-box");
      this.displayContexts = [];
      this.scopeSubtree(this, !0);
    };
    d.prototype.initialize = function (e, g) {
      var h = this;
      this.projector = e;
      this.projectorEventContext = g;
      this.setupUI(e);
      g.registerSelectionChangedListener(function (k, l) {
        return h.updateInspectorPane(k, l);
      });
    };
    d.prototype.updateInspectorPane = function (e, g) {
      this.neighborsOfFirstPoint = g;
      this.selectedPointIndices = e;
      this.updateFilterButtons(e.length + g.length);
      this.updateNeighborsList(g);
      0 === g.length
        ? this.updateSearchResults(e)
        : this.updateSearchResults([]);
    };
    d.prototype.enableResetFilterButton = function (e) {
      this.resetFilterButton.disabled = !e;
    };
    d.prototype.restoreUIFromBookmark = function (e) {
      this.enableResetFilterButton(null != e.filteredPoints);
    };
    d.prototype.metadataChanged = function (e) {
      var g = this,
        h = -1;
      this.metadataFields = e.stats.map(function (k, l) {
        k.isNumeric || -1 !== h || (h = l);
        return k.name;
      });
      if (
        null == this.selectedMetadataField ||
        0 ===
          this.metadataFields.filter(function (k) {
            return k === g.selectedMetadataField;
          }).length
      )
        this.selectedMetadataField = this.metadataFields[Math.max(0, h)];
      this.updateInspectorPane(
        this.selectedPointIndices,
        this.neighborsOfFirstPoint
      );
    };
    d.prototype.datasetChanged = function () {
      this.enableResetFilterButton(!1);
    };
    d.prototype.metadataEditorContext = function (e, g) {
      var h = this;
      if (this.projector && this.projector.dataSet) {
        var k = this.projector.dataSet.spriteAndMetadataInfo.stats.filter(
          function (n) {
            return n.name === g;
          }
        );
        if (!e || 0 === k.length || k[0].tooManyUniqueValues)
          this.removeContext(".metadata-info");
        else {
          this.metadataColumn = g;
          this.addContext(".metadata-info");
          var l = this.querySelector(".metadata-list");
          l.innerHTML = "";
          e = k[0].uniqueEntries.sort(function (n, q) {
            return n.count - q.count;
          });
          var m = e[e.length - 1].count;
          e.forEach(function (n) {
            var q = document.createElement("div");
            q.className = "metadata";
            var p = document.createElement("a");
            p.className = "metadata-link";
            p.title = n.label;
            var t = document.createElement("div");
            t.className = "label-and-value";
            var r = document.createElement("div");
            r.className = "label";
            r.style.color = a.dist2color(h.distFunc, m, n.count);
            r.innerText = n.label;
            var v = document.createElement("div");
            v.className = "value";
            v.innerText = n.count.toString();
            t.appendChild(r);
            t.appendChild(v);
            r = document.createElement("div");
            r.className = "bar";
            v = document.createElement("div");
            v.className = "fill";
            v.style.borderTopColor = a.dist2color(h.distFunc, m, n.count);
            v.style.width = 100 * a.normalizeDist(h.distFunc, m, n.count) + "%";
            r.appendChild(v);
            for (v = 1; 4 > v; v++) {
              var u = document.createElement("div");
              u.className = "tick";
              u.style.left = (100 * v) / 4 + "%";
              r.appendChild(u);
            }
            p.appendChild(t);
            p.appendChild(r);
            q.appendChild(p);
            l.appendChild(q);
            p.onclick = function () {
              h.projector.metadataEdit(g, n.label);
            };
          });
        }
      }
    };
    d.prototype.addContext = function (e) {
      var g = this;
      -1 === this.displayContexts.indexOf(e) && this.displayContexts.push(e);
      this.displayContexts.forEach(function (h) {
        g.querySelector(h).style.display = "none";
      });
      this.querySelector(e).style.display = null;
    };
    d.prototype.removeContext = function (e) {
      this.displayContexts = this.displayContexts.filter(function (g) {
        return g !== e;
      });
      this.querySelector(e).style.display = "none";
      0 < this.displayContexts.length &&
        (this.querySelector(
          this.displayContexts[this.displayContexts.length - 1]
        ).style.display = null);
    };
    d.prototype.updateSearchResults = function (e) {
      var g = this,
        h = this.querySelector(".matches-list").querySelector(".list");
      h.innerHTML = "";
      if (0 === e.length) this.removeContext(".matches-list");
      else {
        this.addContext(".matches-list");
        this.limitMessage.style.display = 100 >= e.length ? "none" : null;
        e = e.slice(0, 100);
        for (
          var k = function (n) {
              var q = e[n];
              n = document.createElement("div");
              n.className = "row";
              var p = l.getLabelFromIndex(q),
                t = document.createElement("a");
              t.className = "label";
              t.title = p;
              t.innerText = p;
              t.onmouseenter = function () {
                g.projectorEventContext.notifyHoverOverPoint(q);
              };
              t.onmouseleave = function () {
                g.projectorEventContext.notifyHoverOverPoint(null);
              };
              t.onclick = function () {
                g.projectorEventContext.notifySelectionChanged([q]);
              };
              n.appendChild(t);
              h.appendChild(n);
            },
            l = this,
            m = 0;
          m < e.length;
          m++
        )
          k(m);
      }
    };
    d.prototype.getLabelFromIndex = function (e) {
      return this.projector.dataSet.points[e].metadata[
        this.selectedMetadataField
      ].toString();
    };
    d.prototype.updateNeighborsList = function (e) {
      var g = this,
        h = this.querySelector(".nn-list");
      h.innerHTML = "";
      if (0 === e.length) this.removeContext(".nn");
      else {
        this.addContext(".nn");
        this.searchBox.message = "";
        for (
          var k = 0 < e.length ? e[0].dist : 0,
            l = function (q) {
              var p = e[q];
              q = document.createElement("div");
              q.className = "neighbor";
              var t = document.createElement("a");
              t.className = "neighbor-link";
              t.title = m.getLabelFromIndex(p.index);
              var r = document.createElement("div");
              r.className = "label-and-value";
              var v = document.createElement("div");
              v.className = "label";
              v.style.color = a.dist2color(m.distFunc, p.dist, k);
              v.innerText = m.getLabelFromIndex(p.index);
              var u = document.createElement("div");
              u.className = "value";
              u.innerText = p.dist.toFixed(3);
              r.appendChild(v);
              r.appendChild(u);
              v = document.createElement("div");
              v.className = "bar";
              u = document.createElement("div");
              u.className = "fill";
              u.style.borderTopColor = a.dist2color(m.distFunc, p.dist, k);
              u.style.width =
                100 * a.normalizeDist(m.distFunc, p.dist, k) + "%";
              v.appendChild(u);
              for (u = 1; 4 > u; u++) {
                var w = document.createElement("div");
                w.className = "tick";
                w.style.left = (100 * u) / 4 + "%";
                v.appendChild(w);
              }
              t.appendChild(r);
              t.appendChild(v);
              q.appendChild(t);
              h.appendChild(q);
              t.onmouseenter = function () {
                g.projectorEventContext.notifyHoverOverPoint(p.index);
              };
              t.onmouseleave = function () {
                g.projectorEventContext.notifyHoverOverPoint(null);
              };
              t.onclick = function () {
                g.projectorEventContext.notifySelectionChanged([p.index]);
              };
            },
            m = this,
            n = 0;
          n < e.length;
          n++
        )
          l(n);
      }
    };
    d.prototype.updateFilterButtons = function (e) {
      1 < e
        ? ((this.setFilterButton.innerText = "Isolate " + e + " points"),
          (this.setFilterButton.disabled = null),
          (this.clearSelectionButton.disabled = null))
        : ((this.setFilterButton.disabled = !0),
          (this.clearSelectionButton.disabled = !0));
    };
    d.prototype.setupUI = function (e) {
      var g = this;
      this.distFunc = a.vector.cosDist;
      var h = this.querySelector(".distance a.euclidean");
      h.onclick = function () {
        for (
          var l = g.querySelectorAll(".distance a"), m = 0;
          m < l.length;
          m++
        )
          a.util.classed(l[m], "selected", !1);
        a.util.classed(h, "selected", !0);
        g.distFunc = a.vector.dist;
        g.projectorEventContext.notifyDistanceMetricChanged(g.distFunc);
        l = e.dataSet.findNeighbors(
          g.selectedPointIndices[0],
          g.distFunc,
          g.numNN
        );
        g.updateNeighborsList(l);
      };
      var k = this.querySelector(".distance a.cosine");
      k.onclick = function () {
        for (
          var l = g.querySelectorAll(".distance a"), m = 0;
          m < l.length;
          m++
        )
          a.util.classed(l[m], "selected", !1);
        a.util.classed(k, "selected", !0);
        g.distFunc = a.vector.cosDist;
        g.projectorEventContext.notifyDistanceMetricChanged(g.distFunc);
        l = e.dataSet.findNeighbors(
          g.selectedPointIndices[0],
          g.distFunc,
          g.numNN
        );
        g.updateNeighborsList(l);
      };
      this.searchBox.registerInputChangedListener(function (l, m) {
        null == l || "" === l.trim()
          ? ((g.searchBox.message = ""),
            g.projectorEventContext.notifySelectionChanged([]))
          : ((l = e.dataSet.query(l, m, g.selectedMetadataField)),
            (g.searchBox.message =
              0 === l.length ? "0 matches." : l.length + " matches."),
            g.projectorEventContext.notifySelectionChanged(l));
      });
      this.setFilterButton.onclick = function () {
        var l = g.selectedPointIndices.concat(
          g.neighborsOfFirstPoint.map(function (m) {
            return m.index;
          })
        );
        e.filterDataset(l);
        g.enableResetFilterButton(!0);
        g.updateFilterButtons(0);
      };
      this.resetFilterButton.onclick = function () {
        e.resetFilterDataset();
        g.enableResetFilterButton(!1);
      };
      this.clearSelectionButton.onclick = function () {
        e.adjustSelectionAndHover([]);
      };
      this.enableResetFilterButton(!1);
    };
    d.prototype.updateNumNN = function () {
      null != this.selectedPointIndices &&
        this.projectorEventContext.notifySelectionChanged([
          this.selectedPointIndices[0],
        ]);
    };
    return d;
  })(a.InspectorPanelPolymer);
  a.InspectorPanel = b;
  document.registerElement(b.prototype.is, b);
})(wc || (wc = {}));
