<template>
  <q-page>
    <h5 class="q-my-xs q-pt-sm q-ml-md text-black">Department</h5>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">Danh mục sản phẩm</div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section>
            <q-table
              :data="categorys"
              :columns="columns"
              row-key="name"
              :pagination.sync="pagination"
            >
              <template v-slot:top>
                <q-space />
                <q-btn
                  dense
                  color="green"
                  class="q-mr-md"
                  icon="add_circle"
                  @click="categoryDialog = true"
                />

                <!-- <q-btn
                  class="q-ml-sm"
                  color="primary"
                  label="Remove row"
                  @click="removeRow"
                /> -->
                <!-- <q-input
                  borderless
                  dense
                  debounce="300"
                  color="primary"
                  v-model="filter"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input> -->
              </template>
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn
                      dense
                      color="red"
                      icon="delete"
                      @click="showDeleteCategory(props.row.id)"
                    />
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">Thương hiệu</div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section>
            <q-table
              :data="companys"
              :columns="columns"
              row-key="name"
              :pagination.sync="pagination"
            >
              <template v-slot:top>
                <q-space />

                <q-btn
                  dense
                  color="green"
                  class="q-mr-md"
                  icon="add_circle"
                  @click="companyDialog = true"
                />

                <!-- <q-btn
                  class="q-ml-sm"
                  color="primary"
                  label="Remove row"
                  @click="removeRow"
                /> -->
                <!-- <q-input
                  borderless
                  dense
                  debounce="300"
                  color="primary"
                  v-model="filter"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input> -->
              </template>
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn
                      dense
                      color="red"
                      icon="delete"
                      @click="showDelete(props.row.id)"
                    />
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="categoryDialog">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 500px; width: 400px"
      >
        <q-card-section>
          <div class="row justify-center text-center align-center item-center">
            <div class="col-md-12 text-h6 q-pb-xl">Thêm danh mục sản phẩm</div>

            <div class="col-md-12 col-sm-12 q-px-md q-gutter-y-md">
              <q-input
                v-model="newCategory"
                label="Tên danh mục"
                stack-label
                :dense="dense"
              />
            </div>
          </div>
          <div class="text-right q-mt-md">
            <q-btn
              dense
              color="green"
              label="Thêm"
              @click="addCategory"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>
    <q-dialog v-model="companyDialog">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 500px; width: 400px"
      >
        <q-card-section>
          <div class="row justify-center text-center align-center item-center">
            <div class="col-md-12 text-h6 q-pb-xl">Thêm danh thương hiệu</div>

            <div class="col-md-12 col-sm-12 q-px-md q-gutter-y-md">
              <q-input
                v-model="newCompany"
                label="Tên thương hiệu"
                stack-label
                :dense="dense"
              />
            </div>
          </div>
          <div class="text-right q-mt-md">
            <q-btn
              dense
              color="green"
              label="Thêm"
              @click="delCompanyActive"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>

    <q-dialog v-model="companyDialogDel">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 500px; width: 400px"
      >
        <q-card-section>
          <p class="text-center text-h6">Bạn chắc chắn muốn xóa ??</p>

          <div class="text-right q-mt-md">
            <q-btn
              style="width: 5rem"
              class="q-mr-sm"
              dense
              color="grey"
              label="Hủy"
              v-close-popup
            />
            <q-btn
              dense
              color="red"
              style="width: 5rem"
              label="Xóa"
              @click="delCompanyActive"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>
    <q-dialog v-model="categoryDialogDel">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 500px; width: 400px"
      >
        <q-card-section>
          <p class="text-center text-h6">Bạn chắc chắn muốn xóa ss ??</p>

          <div class="text-right q-mt-md">
            <q-btn
              style="width: 5rem"
              class="q-mr-sm"
              dense
              color="grey"
              label="Hủy"
              v-close-popup
            />
            <q-btn
              dense
              color="red"
              style="width: 5rem"
              label="Xóa"
              @click="delCategoryActive"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      companyDialogDel: false,
      categoryDialogDel: false,
      categoryDialog: false,
      companyDialog: false,
      newCategory: null,
      dense: false,
      pagination: 5,
      newCompany: null,
      delCompany: null,
      delCategory: null,
      columns: [
        {
          name: "serial_no",
          align: "left",
          label: "ID",
          field: "id",
          sortable: true,
        },
        {
          name: "designation",
          align: "left",
          label: "Tên",
          field: "name",
          sortable: true,
        },
        {
          name: "action",
          align: "left",
          label: "Thao tác",
          field: "action",
          sortable: true,
        },
      ],
      categorys: [
        {
          serial_no: "01",
          designation: "Admin",
        },
        {
          serial_no: "02",
          designation: "Staff",
        },
        {
          serial_no: "03",
          designation: "Admin",
        },
      ],
      companys: [
        {
          serial_no: "01",
          designation: "Senior Account",
        },
        {
          serial_no: "02",
          designation: "Manager Account",
        },
        {
          serial_no: "03",
          designation: "Manager",
        },
      ],
    };
  },
  methods: {
    ...mapActions([
      "acGetCategory",
      "acGetCompany",
      "acCreateCategory",
      "acCreateCompany",
      "acDeleteCompany",
      "acDeleteCategory",
    ]),

    showDelete(id) {
      this.delCompany = id;
      this.companyDialogDel = true;
    },
    showDeleteCategory(id) {
      this.delCategory = id;
      this.categoryDialogDel = true;
    },
    async loadData() {
      this.categorys = await this.acGetCategory();
      this.companys = await this.acGetCompany();
    },
    async addCategory() {
      if (this.newCategory) {
        const data = await this.acCreateCategory({ name: this.newCategory });
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
    },
    async addCompany() {
      if (this.newCompany) {
        const data = await this.acCreateCompany({ name: this.newCompany });
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
    },
    async delCompanyActive() {
      if (this.delCompany) {
        const data = await this.acDeleteCompany(this.delCompany);
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
    },
    async delCategoryActive() {
      if (this.delCategory) {
        const data = await this.acDeleteCategory(this.delCategory);
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
    },
  },
  created() {
    this.loadData();
  },
};
</script>
