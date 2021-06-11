<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Quản lý danh mục sản phẩm"
        :data="data"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode == 'grid'"
        :filter="filter"
        :pagination.sync="pagination"
      >
        <template v-slot:body-cell-img1="props">
          <q-td :props="props" width="350px">
            <div class="row items-center">
              <div class="my-table-details ol-md-7">
                <img
                  width="100px"
                  height="100px"
                  :src="props.row.img1"
                  alt="haha"
                />
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-img2="props">
          <q-td :props="props" width="350px">
            <div class="row items-center">
              <div class="my-table-details ol-md-7">
                <img
                  width="100px"
                  height="100px"
                  :src="props.row.img2"
                  alt="haha"
                />
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-img3="props">
          <q-td :props="props" width="350px">
            <div class="row items-center">
              <div class="my-table-details ol-md-7">
                <img
                  width="100px"
                  height="100px"
                  :src="props.row.img3"
                  alt="haha"
                />
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-img4="props">
          <q-td :props="props" width="350px">
            <div class="row items-center">
              <div class="my-table-details ol-md-7">
                <img
                  width="100px"
                  height="100px"
                  :src="props.row.img4"
                  alt="haha"
                />
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:top-right="props">
          <q-btn
            @click="addProduct = true"
            outline
            color="primary"
            label="Thêm sản phẩm"
            class="q-mr-xs"
          />
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
              @click="employee_dialog = true"
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
                color="primary"
                @click="onEdit(props.row.id)"
                icon="edit"
              />
              <q-btn
                dense
                color="red"
                icon="delete"
                @click="onDelete(props.row.id)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="employee_dialog">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 1500px; width: 1500px"
      >
        <div class="row text-h6 q-pa-md text-orange">
          Chỉnh sửa thông tin sản phẩm
        </div>
        <q-card-section>
          <div class="row">
            <div
              class="col-md-6 col-sm-6 col-xs-6 q-pa-md q-gutter-y-md column"
            >
              <q-input
                v-model="product.name"
                label="Tên sản phẩm"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="product.origin_price"
                label="Giá bán(VNĐ)"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="product.sale"
                label="Giảm giá(%)"
                stack-label
                :dense="dense"
              />
            </div>
            <div
              class="
                col-md-6 col-sm-6 col-xs-6
                q-pa-md q-gutter-y-md
                column
                q-pl-xl
              "
            >
              <q-select
                v-model="product.category"
                label="Danh mục sản phẩm"
                stack-label
                :options="categorys"
                :dense="dense"
              />
              <q-select
                v-model="product.company_id"
                label="Hãng xe"
                stack-label
                :options="companys"
                :dense="dense"
              />
              <div class="row">
                <div class="col-md-3 col-xs-3 col-sm-2">
                  <q-img
                    width="100px"
                    class="rounded-borders"
                    :src="product.img1"
                  />
                </div>
                <div class="col-md-3 col-xs-3 col-sm-3">
                  <q-img
                    width="100px"
                    class="rounded-borders"
                    :src="product.img2"
                  />
                </div>
                <div class="col-md-3 col-xs-3 col-sm-3">
                  <q-img
                    width="100px"
                    class="rounded-borders"
                    :src="product.img3"
                  />
                </div>
                <div class="col-md-3 col-xs-3 col-sm-3">
                  <q-img
                    width="100px"
                    class="rounded-borders"
                    :src="product.img4"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <p class="q-pl-md">Mô tả</p>
          <div class="q-pa-md q-gutter-sm">
            <q-editor v-model="product.description" min-height="5rem" />

            <!-- <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ editor }}</pre>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section v-html="editor" />
    </q-card> -->
          </div>
        </q-card-section>
        <!-- <q-separator /> -->
        <div class="text-right q-pa-lg">
          <q-btn
            class="q-mr-sm"
            color="white"
            text-color="black"
            label="Hủy"
            v-close-popup
          />
          <q-btn
            color="primary"
            label="Lưu"
            @click="ConfirmSave"
            v-close-popup
          />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addProduct">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 1500px; width: 1500px"
      >
        <q-card-section>
          <div class="row">
            <div class="col-md-12 text-h6 q-pa-md text-orange">
              Chỉnh sửa thông tin sản phẩm
            </div>

            <div class="col-md-6 col-sm-6 q-pa-md q-gutter-y-md column">
              <q-input
                v-model="name"
                label="Tên sản phẩm"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model.number="origin_price"
                label="Giá bán(VNĐ)"
                type="number"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model.number="sale"
                label="Giảm giá(%)"
                type="number"
                :rules="[(val) => val < 100 || 'Please use maximum 99%']"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col-md-6 col-sm-6 q-pa-md q-gutter-y-md column q-pl-xl">
              <q-select
                v-model="category"
                label="Danh mục sản phẩm"
                stack-label
                :options="categorys"
                :dense="dense"
              />
              <q-select
                v-model="company"
                label="Hãng xe"
                stack-label
                :options="companys"
                :dense="dense"
              />
              <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-file v-model="files" label="Ảnh mô tả" filled multiple>
                    <template v-if="files" v-slot:append>
                      <q-icon
                        name="cancel"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <p class="q-pl-md">Mô tả</p>
          <div class="q-pa-md q-gutter-sm">
            <q-editor v-model="description" min-height="5rem" />

            <!-- <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ editor }}</pre>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section v-html="editor" />
    </q-card> -->
          </div>
        </q-card-section>
        <!-- <q-separator /> -->
        <div class="text-right q-pa-lg">
          <q-btn
            class="q-mr-sm"
            color="white"
            text-color="black"
            label="Hủy"
            v-close-popup
          />
          <q-btn
            color="primary"
            @click="handleSubmit"
            label="Lưu"
            v-close-popup
          />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmDel" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Bạn chắc chắc muốn xóa sản phẩm này ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="delProduct"
            color="red"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import { exportFile } from "quasar";
import { mapActions, mapGetters } from "vuex";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  data() {
    return {
      addProduct: false,
      // filesMaxSize: null,
      // filesPng: null,
      category: null,
      files: null,
      confirmDel: false,
      filter: "",
      dense: false,
      mode: "list",
      invoice: {},
      name: "",
      category: "",
      company: "",
      description: "",
      sale: 0,
      origin_price: 0,
      product: {},
      employee_dialog: false,
      columns: [
        {
          name: "serial_no",
          align: "left",
          label: "Tên sản phẩm",
          field: "name",
          sortable: true,
        },
        {
          name: "name",
          required: true,
          label: "Mô tả",
          align: "left",
          field: (row) => row.description,
          format: (val) => `${val}`,
          sortable: true,
          classes: "bg-grey-2 ellipsis",
          style: "max-width: 500px",
          headerClasses: "text-white",
          headerStyle: "max-width: 500px",
        },
        {
          name: "name",
          align: "left",
          label: "Giá bán",
          field: (row) => row.origin_price,
          format: (val) => `₫${val.toLocaleString("de-DE")}`,
          sortable: true,
        },
        {
          name: "salary_type",
          align: "left",
          label: "Giảm giá (%)",
          field: "sale",
          sortable: true,
        },
        {
          name: "img1",
          align: "left",
          label: "Ảnh đại diện",
          field: "img1",
          sortable: true,
        },
        ,
        {
          name: "img2",
          align: "left",
          label: "Ảnh mô tả",
          field: "img2",
          sortable: true,
        },
        ,
        {
          name: "img3",
          align: "left",
          label: "Ảnh mô tả",
          field: "img3",
          sortable: true,
        },
        ,
        {
          name: "img4",
          align: "left",
          label: "Ảnh mô tả",
          field: "img4",
          sortable: true,
        },
        ,
        {
          name: "action",
          align: "left",
          label: "Action",
          field: "action",
          sortable: true,
        },
      ],
      data: null,
      delId: null,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  methods: {
    // checkFileSize(files) {
    //   return files.filter((file) => file.size < 2048);
    // },
    // checkFileType(files) {
    //   return files.filter((file) => file.type === "image/png/jpg");
    // },
    // onRejected(rejectedEntries) {
    //   // Notify plugin needs to be installed
    //   // https://quasar.dev/quasar-plugins/notify#Installation
    //   this.$q.notify({
    //     type: "negative",
    //     message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
    //   });
    // },
    ...mapActions([
      "acCreateProduct",
      "acGetCategory",
      "acUploadImgProduct",
      "getProducts",
      "acUpdateProducts",
      "acDeleteProducts",
    ]),
    // uploadFile(event) {
    //   this.files = event.target.files;
    // },
    async delProduct() {
      const data = await this.acDeleteProducts({ id: this.delId });
      if (data > 0) {
        await this.getProducts();
        this.data = this.products;
        this.$q.notify({
          message: "Xóa sản phẩm thành công",
          color: "green",
        });
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra!",
          color: "red",
        });
      }
      console.log(data);
    },
    onDelete(id) {
      this.delId = id;
      console.log(this.delId);
      this.confirmDel = true;
    },
    rowClick(evt, row, index) {
      console.log(evt, row, index);
      this.onEdit(row.id);
    },
    async handleSubmit() {
      // console.log(this.files);
      let payload = {
        name: this.name,
        category: this.category.value,
        company_id: this.company.value,
        sale: this.sale,
        origin_price: this.origin_price,
        description: this.description,
      };
      console.log(payload);
      const formData = new FormData();
      this.files.forEach((file) => formData.append("files", file));
      // formData.append("file", this.files[0]);
      console.log("from", formData.getAll("files"));
      // console.log(formData);
      // await this.acCreateProduct(formData);
      const data = await this.acUploadImgProduct(formData);
      if (data) {
        payload = {
          ...payload,
          ...data,
        };
        const product = await this.acCreateProduct(payload);
        console.log(product);
        if (product) {
          await this.getProducts();
          this.data = this.products;
          this.name = this.category = this.company = this.description = null;
          this.sale = this.origin_price = 0;
          this.files = null;

          this.$q.notify({
            message: "Thêm sản phẩm thành công",
            color: "green",
          });
        } else {
          this.$q.notify({
            message: "Có lỗi xảy ra!",
            color: "red",
          });
        }
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra!",
          color: "red",
        });
      }
      // console.log(data);
    },
    async ConfirmSave() {
      this.product.company_id = this.product.company_id.value;
      this.product.category = this.product.category.value;
      console.log(this.product);
      const data = await this.acUpdateProducts(this.product);
      console.log(data);
      // acUpdateProducts
    },
    onEdit(id) {
      console.log(id);
      this.product = this.products.find((e) => e.id == id);
      this.product.company_id = this.product.company_id
        ? this.companys.find((e) => e.id == this.product.company_id)
        : null;
      this.product.category = this.product.category
        ? this.categorys.find((e) => e.id == this.product.category)
        : null;

      console.log(this.product);
      this.employee_dialog = true;
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

      const status = exportFile(
        "employee_salary_list.csv",
        content,
        "text/csv"
      );

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
  computed: {
    // ...mapState(["products"]),
    ...mapGetters(["getCategory", "getCompany", "products"]),
  },
  async created() {
    this.data = this.products;
    this.categorys = [...this.getCategory];
    this.categorys.map((e) => {
      e.label = e.name;
      e.value = e.id;
    });
    this.companys = [...this.getCompany];
    this.companys.map((e) => {
      e.label = e.name;
      e.value = e.id;
    });
    console.log(this.getCategory);
  },
};
</script>
<style>
* {
  box-sizing: border-box !important;
}
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
