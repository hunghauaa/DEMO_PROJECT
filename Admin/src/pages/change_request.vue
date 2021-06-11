<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Quản lý đơn hàng"
        :data="data"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode == 'grid'"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            v-if="mode === 'list'"
          >
            <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
              >{{
                props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
              }}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            :icon="mode === 'grid' ? 'list' : 'grid_on'"
            @click="
              mode = mode === 'grid' ? 'list' : 'grid';
              separator = mode === 'grid' ? 'none' : 'horizontal';
            "
            v-if="!props.inFullscreen"
          >
            <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
              >{{ mode === "grid" ? "List" : "Grid" }}
            </q-tooltip>
          </q-btn>

          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
          />
        </template>
        <template v-slot:body-cell-detail="props">
          <q-td :props="props">
            <q-btn
              @click="onDetail(props.row.id)"
              dense
              round
              color="secondary"
              icon="pageview"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn
                dense
                @click="
                  onChangeProgressOrder(props.row.id, props.row.trinhTrangId)
                "
                style="width: 132px"
                :color="
                  props.row.tinhTrang == 'Đơn hàng đã đặt'
                    ? 'primary'
                    : props.row.tinhTrang == 'Đã xác nhận thông tin thanh toán'
                    ? 'orange'
                    : props.row.tinhTrang == 'Đã giao cho ĐVVC'
                    ? 'green'
                    : 'grey'
                "
                :label="
                  props.row.tinhTrang == 'Đơn hàng đã đặt'
                    ? 'Xác nhận'
                    : props.row.tinhTrang == 'Đã xác nhận thông tin thanh toán'
                    ? 'Giao cho ĐVVC'
                    : props.row.tinhTrang == 'Đã giao cho ĐVVC'
                    ? 'Kết thúc'
                    : 'Ẩn'
                "
              />
              <q-btn
                :disable="!(props.row.tinhTrang == 'Đơn hàng đã đặt')"
                @click="cancelOrder(props.row.id)"
                dense
                color="red"
                icon="delete"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="
                props.row.tinhTrang == 'Đơn hàng đã đặt'
                  ? 'red'
                  : props.row.tinhTrang == 'Đã xác nhận thông tin thanh toán'
                  ? 'blue'
                  : props.row.tinhTrang == 'Đã giao cho ĐVVC'
                  ? 'orange'
                  : props.row.tinhTrang == 'Đã hủy'
                  ? 'grey'
                  : 'green'
              "
              text-color="white"
              dense
              class="text-weight-bold"
              square
              style="width: 132px"
              >{{
                props.row.tinhTrang == "Đơn hàng đã đặt"
                  ? "Chờ xác nhận"
                  : props.row.tinhTrang == "Đã xác nhận thông tin thanh toán"
                  ? "Đợi giao ĐVVC  "
                  : props.row.tinhTrang == "Đã giao cho ĐVVC"
                  ? "Đang giao"
                  : props.row.tinhTrang == "Đánh giá" ||
                    props.row.tinhTrang == "Đã giao"
                  ? "Hoàn thành"
                  : props.row.tinhTrang
              }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="new_customer">
      <q-card style="width: 600px; max-width: 60vw">
        <q-card-section>
          <div class="text-h6">
            Add new change request
            <q-btn
              round
              flat
              dense
              icon="close"
              class="float-right"
              color="grey-8"
              v-close-popup
            ></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Change Name</q-item-label>
                  <q-input
                    dense
                    outlined
                    v-model="customer.name"
                    label="Change Name"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Change Type</q-item-label>
                  <q-input
                    dense
                    outlined
                    v-model="customer.change_type"
                    label="Change Type"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs"
                    >New Address Information</q-item-label
                  >
                  <q-input
                    dense
                    outlined
                    v-model="customer.new_address"
                    label="New Address Information"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Status</q-item-label>
                  <q-input
                    dense
                    outlined
                    v-model="customer.status"
                    label="Status"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn label="Save" type="submit" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="bar"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card
        class="bg-green-1 text-black text-h6"
        style="max-width: 1500px; width: 1200px; height: auto"
      >
        <q-bar>
          Chi tiết đơn hàng
          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <q-table
              title="Danh sách sản phẩm"
              :data="data1"
              :columns="columns1"
              row-key="name"
              :separator="separator"
            >
              <template v-slot:body-cell-name="props">
                <q-td :props="props" width="350px">
                  <div class="row items-center">
                    <div class="my-table-details ol-md-7">
                      <!-- <p>{{props.row}}</p> -->
                      <img
                        width="100px"
                        height="100px"
                        :src="props.row.Product.img1"
                        alt="haha"
                      />
                    </div>
                    <div class="col-md-5">
                      <q-badge
                        class="word q-ml-xs text-subtitle1"
                        style="
                          word-break: break-word !important;
                          word-spacing: revert;
                          white-space: normal;
                          width: 230px;
                          background-color: white !important;
                          color: black;
                          line-height: 1rem;
                        "
                        color="purple"
                        :label="props.row.Product.name"
                      />
                    </div>
                  </div>
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmCancel" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Bạn chắc chắc không muốn nhận đơn hàng này ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Không" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="cancelOr(cancelOrderId)"
            color="red"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}
import { mapGetters, mapActions } from "vuex";
// .toLocaleString("de-DE")
export default {
  data() {
    return {
      confirmCancel:false,
      cancelOrderId:null,
      separator: "cell",
      columns1: [
        {
          name: "code",
          required: true,
          label: "Mã sản phẩm",
          align: "center",
          headerClasses: "text-weight-bolder bg-light-green",
          headerStyle: "font-size:1rem",
          classes: "text-weight-bold",
          field: (row) => row.Product.id,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "name",
          required: true,
          label: "Sản phẩm",
          align: "left",
          field: (row) => row.name,
          classes: "text-weight-bold",
          headerClasses: "text-weight-bolder bg-light-green",
          headerStyle: "font-size:1rem",
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "fat",
          classes: "text-weight-bold",
          headerClasses: "text-weight-bolder bg-light-green",
          headerStyle: "font-size:1rem",
          label: "Số lượng",
          field: "quantity",
          sortable: true,
          align: "center",
        },
        {
          name: "calories",
          align: "center",
          classes: "text-weight-bold",
          headerClasses: "text-weight-bolder bg-light-green",
          headerStyle: "font-size:1rem",
          label: "Thành tiền",
          field: (row) => row.totalMoney,
          format: (val) => `₫${val.toLocaleString("de-DE")}`,
          sortable: true,
        },
        {
          name: "carbs",
          label: "Ngày mua",
          headerClasses: "text-weight-bolder bg-light-green",
          headerStyle: "font-size:1rem",
          field: "createdAt",
          align: "center",
          classes: "text-weight-bold",
        },
        // { name: "protein", label: "Protein (g)", field: "protein" },
        // { name: "sodium", label: "Sodium (mg)", field: "sodium" },
        // {
        //   name: "calcium",
        //   label: "Calcium (%)",
        //   field: "calcium",
        //   sortable: true,
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        // },
        // {
        //   name: "iron",
        //   label: "Iron (%)",
        //   field: "iron",
        //   sortable: true,
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        // },
      ],
      data1: [
        {
          name: "Frozen dđsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadaaaaaaaaaaaYogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ],
      filter: "",
      customer: {},
      new_customer: false,
      bar: false,
      mode: "list",
      columns: [
        {
          name: "change_id1",
          align: "left",
          label: "Mã đơn hàng",
          field: "id",
          sortable: true,
        },
        {
          name: "desc",
          required: true,
          label: "Người nhận",
          align: "nguoiNhan",
          field: (row) => row.nguoiNhan,
          sortable: true,
        },
        {
          name: "change_id",
          align: "left",
          label: "Địa chỉ",
          field: "diaChi",
          sortable: true,
        },

        {
          name: "change_id",
          align: "left",
          label: "Số điện thoại",
          field: "sdt",
          sortable: true,
        },

        {
          name: "status",
          align: "left",
          label: "Tình trạng đơn hàng",
          field: "tinhTrang",
          sortable: true,
        },
        {
          name: "creation_date",
          align: "left",
          label: "Tổng thanh toán",
          field: (row) => row.thanhTien + row.phiVC,
          format: (val) => `₫${val.toLocaleString("de-DE")}`,

          // field: "thanhTien",
          sortable: true,
        },
        {
          name: "creation_date1",
          align: "left",
          label: "Phương thức thanh toán",
          field: "pttt",
          sortable: true,
        },
        {
          name: "creation_date2",
          align: "left",
          label: "Ghi chú",
          field: "ghiChu",
          sortable: true,
        },
        {
          name: "creation_date3",
          align: "left",
          label: "Đơn vị vận chuyển",
          field: "ptvc",
          sortable: true,
        },
        {
          name: "detail",
          align: "left",
          label: "Chi tiết",
          field: "detail",
          sortable: true,
        },
        {
          name: "action",
          align: "left",
          label: "Hành động",
          field: "action",
          sortable: true,
        },
      ],
      data: [
        {
          change_id: "C001",
          name: "Dr. Jada Conolly",
          change_type: "Name Change",
          status: "Submitted",
          creation_date: "12-09-2019",
        },
        {
          change_id1: "C002",
          name: "Dr. Kiley Ibbotson",
          change_type: "Address Change",
          status: "Approved",
          creation_date: "09-02-2019",
        },
        {
          change_id2: "C003",
          name: "Dr. Leslie Tecklenburg",
          change_type: "New Profile",
          status: "Approved",
          creation_date: "03-25-2019",
        },
        {
          change_id3: "C004",
          name: "Dr. Lia Whitledge",
          change_type: "Name Change",
          status: "Submitted",
          creation_date: "03-18-2019",
        },
        {
          change_id4: "C005",
          name: "Dr. Sam Wileman",
          change_type: "Name Change",
          status: "Rejected",
          creation_date: "04-09-2019",
        },
        {
          change_id5: "C006",
          name: "Dr. Edgar Colmer",
          change_type: "Address Change",
          status: "Approved",
          creation_date: "09-03-2019",
        },
        {
          change_id6: "C007",
          name: "Dr. Kaiden Rozelle",
          change_type: "Address Change",
          status: "Submitted",
          creation_date: "01-12-2019",
        },
        {
          change_id7: "C008",
          name: "Dr. Leslie Stopher",
          change_type: "New Profile",
          status: "Approved",
          creation_date: "04-15-2019",
        },
        {
          change_id8: "C009",
          name: "Dr. Miguel Subasic",
          change_type: "New Profile",
          status: "Approved",
          creation_date: "11-09-2019",
        },
        {
          change_id9: "C010",
          name: "Dr. Reese Vandygriff",
          change_type: "New Profile",
          status: "Rejected",
          creation_date: "01-01-2019",
        },
        {
          change_id99: "C011",
          name: "Dr. Griffin Troglen",
          change_type: "New Profile",
          status: "Approved",
          creation_date: "04-12-2019",
        },
        {
          change_id999: "C012",
          name: "Dr. Zachary Wehrley",
          change_type: "Address Change",
          status: "Submitted",
          creation_date: "10-09-2019",
        },
        {
          change_id777: "C013",
          name: "Dr. Kyle Wahlert",
          change_type: "Address Change",
          status: "Approved",
          creation_date: "01-02-2019",
        },
        {
          change_id77: "C014",
          name: "Dr. John Subasic",
          change_type: "Address Change",
          status: "Approved",
          creation_date: "07-06-2019",
        },
      ],
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  methods: {
    ...mapActions(["acGetOrderDetail", "acGetAllOrderAdmin", "acCancelOrder"]),
    cancelOrder(id){
      this.cancelOrderId = id;
      this.confirmCancel = true;
    },
    async cancelOr(id) {
      console.log(id);
      const data = await this.acCancelOrder({
        id,
        order_progress_id: 6,
      });
      if (data) {
        this.$q.notify({
          message: "Thành công",
          color: "green",
        });
        this.loadData();
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          color: "red",
        });
      }
    },
    async onChangeProgressOrder(id, order_progress_id) {
      if (order_progress_id < 4) {
        const data = await this.acCancelOrder({
          id,
          order_progress_id: order_progress_id + 1,
        });
        if (data) {
          this.$q.notify({
            message: "Thành công",
            color: "green",
          });
          this.loadData();
        } else {
          this.$q.notify({
            message: "Có lỗi xảy ra",
            color: "red",
          });
        }
      } else {
        const data = await this.acCancelOrder({ id, status: "disable" });
        if (data) {
          this.loadData();
          this.$q.notify({
            message: "Thành công",
            color: "green",
          });
        } else {
          this.$q.notify({
            message: "Có lỗi xảy ra",
            color: "red",
          });
        }
      }
      // console.log("a", id, order_progress_id);
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("change-request.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
    async onDetail(id) {
      const data = await this.acGetOrderDetail({ id });
      if (!data.length) this.data1 = [data];
      else {
        this.data1 = data;
      }
      this.bar = true;
      console.log(data);
    },
    async loadData() {
      console.log(this.getOrderAdmin);
      const data = await this.acGetAllOrderAdmin();
      this.data = data;
    },
  },
  computed: {
    ...mapGetters(["getOrderAdmin"]),
  },
  created() {
    this.loadData();
  },
};
</script>
<style>
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
