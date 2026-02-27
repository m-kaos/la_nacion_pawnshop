import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, NotificationService, ModalService, AssetPickerDialogComponent } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_ARTICULO = gql`
  query GetArticulo($id: ID!) {
    product(id: $id) {
      id
      name
      description
      featuredAsset { id preview }
      assets { id preview }
      variants {
        id
        sku
        price
      }
      customFields {
        marca
        modelo
        numeroDeSerie
        valorAvaluo
        estadoArticulo
        familia
        fechaEntrada
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) { id featuredAsset { id preview } assets { id preview } }
  }
`;

const CREATE_VARIANT = gql`
  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
    createProductVariants(input: $input) { id sku price }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) { id featuredAsset { id preview } assets { id preview } }
  }
`;

const UPDATE_VARIANT = gql`
  mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
    updateProductVariants(input: $input) { id }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) { result message }
  }
`;

@Component({
  standalone: false,
  selector: 'articulo-detail',
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 24px;
    }
    .form-grid .full-width { grid-column: 1 / -1; }
    .section-title {
      grid-column: 1 / -1;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #999;
      letter-spacing: 0.05em;
      margin: 16px 0 4px;
      padding-bottom: 6px;
      border-bottom: 1px solid #eee;
    }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>{{ isNew ? 'Nuevo Artículo' : 'Artículo #' + id }}</vdr-page-title>
    </vdr-page-header>
    <vdr-page-body>
      <vdr-action-bar>
        <vdr-ab-left>
          <button class="btn btn-danger-outline" *ngIf="!isNew" (click)="delete()">
            Eliminar
          </button>
        </vdr-ab-left>
        <vdr-ab-right>
          <a class="btn btn-secondary" [routerLink]="['../']">Cancelar</a>
          <button class="btn btn-primary" (click)="save()" [disabled]="form?.invalid || saving">
            {{ saving ? 'Guardando…' : 'Guardar' }}
          </button>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card *ngIf="form" [formGroup]="form">
        <div class="form-grid">

          <div class="section-title">Identificación del Artículo</div>

          <vdr-form-field label="Nombre / Descripción corta" for="name" class="full-width">
            <input type="text" id="name" formControlName="name" class="clr-input" placeholder="Ej: Reloj Casio G-Shock GA-110" />
          </vdr-form-field>

          <vdr-form-field label="Familia / Categoría" for="familia">
            <input type="text" id="familia" formControlName="familia" class="clr-input" placeholder="Ej: Relojería, Electrónica" />
          </vdr-form-field>

          <vdr-form-field label="Estado del Artículo" for="estadoArticulo">
            <select id="estadoArticulo" formControlName="estadoArticulo" class="clr-select">
              <option value="Disponible">Disponible</option>
              <option value="Empeñado">Empeñado</option>
              <option value="Vendido">Vendido</option>
              <option value="Retirado">Retirado</option>
            </select>
          </vdr-form-field>

          <vdr-form-field label="Marca" for="marca">
            <input type="text" id="marca" formControlName="marca" class="clr-input" placeholder="Ej: Casio" />
          </vdr-form-field>

          <vdr-form-field label="Modelo" for="modelo">
            <input type="text" id="modelo" formControlName="modelo" class="clr-input" placeholder="Ej: GA-110" />
          </vdr-form-field>

          <vdr-form-field label="Número de Serie" for="numeroDeSerie" class="full-width">
            <input type="text" id="numeroDeSerie" formControlName="numeroDeSerie" class="clr-input" placeholder="Opcional" />
          </vdr-form-field>

          <vdr-form-field label="Fecha de Entrada" for="fechaEntrada">
            <input type="date" id="fechaEntrada" formControlName="fechaEntrada" class="clr-input" />
          </vdr-form-field>

          <div class="section-title">Valores</div>

          <vdr-form-field label="Valor de Avalúo (MXN)" for="valorAvaluo">
            <input type="number" id="valorAvaluo" formControlName="valorAvaluo" class="clr-input" placeholder="0" step="1" min="0" />
            <small style="color:#666">Valor estimado del artículo</small>
          </vdr-form-field>

          <vdr-form-field label="Precio de Venta (MXN)" for="precio">
            <input type="number" id="precio" formControlName="precio" class="clr-input" placeholder="0.00" step="0.01" min="0" />
            <small style="color:#666">Precio al que se vendería en tienda</small>
          </vdr-form-field>

          <vdr-form-field label="SKU" for="sku" class="full-width">
            <input type="text" id="sku" formControlName="sku" class="clr-input" placeholder="Se genera automáticamente si se deja vacío" />
          </vdr-form-field>

          <div class="section-title">Imágenes</div>

          <div class="full-width" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:8px;">
            <div *ngFor="let asset of selectedAssets" style="position:relative;">
              <img [src]="asset.preview + '?preset=thumb'" style="width:80px;height:80px;object-fit:cover;border-radius:4px;border:1px solid #ddd;" />
            </div>
            <div *ngIf="selectedAssets.length === 0" style="color:#999;font-size:13px;padding:8px 0;">
              Sin imágenes
            </div>
          </div>
          <div class="full-width">
            <button type="button" class="btn btn-secondary btn-sm" (click)="openAssetPicker()">
              Seleccionar imagen(es)
            </button>
          </div>

          <vdr-form-field label="Descripción / Notas" for="description" class="full-width">
            <textarea id="description" formControlName="description" class="clr-textarea" rows="3" placeholder="Estado físico, accesorios incluidos, observaciones…"></textarea>
          </vdr-form-field>

        </div>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class ArticuloDetailComponent implements OnInit {
  id: string | null = null;
  variantId: string | null = null;
  isNew = true;
  saving = false;
  form!: FormGroup;
  selectedAssets: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [''],
      familia: [''],
      marca: [''],
      modelo: [''],
      numeroDeSerie: [''],
      estadoArticulo: ['Disponible', Validators.required],
      valorAvaluo: [0],
      precio: [0],
      sku: [''],
      fechaEntrada: [''],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = idParam;
      this.isNew = false;
      this.dataService.query(GET_ARTICULO, { id: this.id }).single$.subscribe((result: any) => {
        const p = result.product;
        if (p) {
          const v = p.variants?.[0];
          this.variantId = v?.id ?? null;
          this.selectedAssets = p.assets ?? [];
          this.form.patchValue({
            name: p.name,
            description: p.description,
            familia: p.customFields?.familia ?? '',
            marca: p.customFields?.marca ?? '',
            modelo: p.customFields?.modelo ?? '',
            numeroDeSerie: p.customFields?.numeroDeSerie ?? '',
            estadoArticulo: p.customFields?.estadoArticulo ?? 'Disponible',
            valorAvaluo: p.customFields?.valorAvaluo ?? 0,
            precio: (v?.price ?? 0) / 100,
            sku: v?.sku ?? '',
            fechaEntrada: p.customFields?.fechaEntrada
              ? new Date(p.customFields.fechaEntrada).toISOString().split('T')[0]
              : '',
          });
        }
      });
    }
  }

  save() {
    if (!this.form || this.form.invalid) return;
    this.saving = true;
    const raw = this.form.value;

    const customFields: any = {
      familia: raw.familia,
      marca: raw.marca,
      modelo: raw.modelo,
      numeroDeSerie: raw.numeroDeSerie,
      estadoArticulo: raw.estadoArticulo,
      valorAvaluo: Math.round(+raw.valorAvaluo || 0),
    };
    if (raw.fechaEntrada) {
      customFields.fechaEntrada = new Date(raw.fechaEntrada).toISOString();
    }

    const precio = Math.round((+raw.precio || 0) * 100);
    const sku = raw.sku || `ART-${Date.now()}`;

    const assetIds = this.selectedAssets.map((a: any) => a.id);
    const featuredAssetId = assetIds[0] ?? null;

    if (this.isNew) {
      this.dataService
        .mutate(CREATE_PRODUCT, {
          input: {
            translations: [{ languageCode: 'es', name: raw.name, description: raw.description, slug: this.toSlug(raw.name) }],
            customFields,
            ...(featuredAssetId ? { featuredAssetId, assetIds } : {}),
          },
        })
        .subscribe((res: any) => {
          const productId = res.createProduct.id;
          this.dataService
            .mutate(CREATE_VARIANT, {
              input: [{
                productId,
                sku,
                price: precio,
                stockOnHand: 1,
                translations: [{ languageCode: 'es', name: raw.name }],
              }],
            })
            .subscribe(() => {
              this.saving = false;
              this.notificationService.success('Artículo creado');
              this.router.navigate(['../'], { relativeTo: this.route });
            }, () => { this.saving = false; });
        }, () => { this.saving = false; });
    } else {
      this.dataService
        .mutate(UPDATE_PRODUCT, {
          input: {
            id: this.id,
            translations: [{ languageCode: 'es', name: raw.name, description: raw.description, slug: this.toSlug(raw.name) }],
            customFields,
            ...(featuredAssetId ? { featuredAssetId, assetIds } : { assetIds: [] }),
          },
        })
        .subscribe(() => {
          if (this.variantId) {
            this.dataService
              .mutate(UPDATE_VARIANT, {
                input: [{
                  id: this.variantId,
                  sku,
                  price: precio,
                  translations: [{ languageCode: 'es', name: raw.name }],
                }],
              })
              .subscribe(() => {
                this.saving = false;
                this.notificationService.success('Artículo actualizado');
              }, () => { this.saving = false; });
          } else {
            this.saving = false;
            this.notificationService.success('Artículo actualizado');
          }
        }, () => { this.saving = false; });
    }
  }

  openAssetPicker() {
    this.modalService
      .fromComponent(AssetPickerDialogComponent, {
        size: 'xl',
        locals: { multiSelect: true },
      })
      .subscribe((result: any) => {
        if (result && result.length) {
          this.selectedAssets = result;
        }
      });
  }

  delete() {
    if (!this.id) return;
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return;
    this.dataService.mutate(DELETE_PRODUCT, { id: this.id }).subscribe(() => {
      this.notificationService.success('Artículo eliminado');
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  private toSlug(name: string): string {
    return (name || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now();
  }
}
