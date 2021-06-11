<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Danh sách người dùng"
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
        <!-- <template v-slot:body-cell-detail="props">
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
              <q-btn dense color="primary" icon="edit" />
              <q-btn dense color="red" icon="delete" />
            </div>
          </q-td>
        </template> -->
      </q-table>
    </q-card>
    <q-dialog v-model="employee_dialog">
      <q-card
        class="my-card"
        flat
        bordered
        style="max-width: 1500px; width: 1000px"
      >
        <q-card-section>
          <div class="row justify-center text-center align-center item-center">
          <div class="col-md-12 text-h6 q-pb-xl">Chỉnh sửa thông tin người dùng</div>
           
           <div
              class="col-md-6 col-sm-6 q-gutter-y-md column"
            
            >
              <q-input
                v-model="text"
                label="Họ và tên"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="text"
                label="Email"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="text"
                label="Ngày sinh"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="text"
                label="Giới tính"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="text"
                label="Số điện thoại"
                stack-label
                :dense="dense"
              />
              <q-input
                v-model="text"
                label="Địa chỉ"
                stack-label
                :dense="dense"
              />
            </div>
            <div
              class="col-md-3 col-sm-6 q-gutter-y-md column q-pl-xl"
            >
              <q-img
              width="100px"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/boy-avatar.png"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";
import { mapState } from "vuex";
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
      filter: "",
      mode: "list",
      invoice: {},
      dense: false,
      employee_dialog: false,
      columns: [
        {
          name: "serial_no",
          align: "left",
          label: "Họ và tên",
          field: "name",
          sortable: true,
        },
        {
          name: "emp_id",
          required: true,
          label: "Email",
          align: "left",
          field: "email",
          sortable: true,
        },
        {
          name: "name",
          align: "left",
          label: "Ngày sinh",
          field: "date_of_birth",
          sortable: true,
        },
        {
          name: "salary_type",
          align: "left",
          label: "Giới tính",
          field: "gender",
          sortable: true,
        },
        {
          name: "basic_salary",
          align: "left",
          label: "Địa chỉ",
          field: "address",
          sortable: true,
        },
        {
          name: "overtime",
          align: "left",
          label: "Số điện thoại",
          field: "phone_number",
          sortable: true,
        },
        // {
        //   name: "detail",
        //   align: "left",
        //   label: "Detail",
        //   field: "detail",
        //   sortable: true,
        // },
        // {
        //   name: "action",
        //   align: "left",
        //   label: "Action",
        //   field: "action",
        //   sortable: true,
        // },
      ],
      data: null,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  methods: {
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
    ...mapState(["users"]),
  },
  created() {
    this.data = this.users;
  },
};
</script>
<style>
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
