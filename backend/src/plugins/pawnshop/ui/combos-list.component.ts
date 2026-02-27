import { Component, OnInit } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_COMBOS = gql`
  query GetCombos {
    combos {
      id
      nombre
      productIds
      precioAntes
      precioAhora
      visible
      createdAt
    }
  }
`;

@Component({
  standalone: false,
  selector: 'combos-list',
  styles: [`
    .visible-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .visible-si  { background: #e6f4ea; color: #1e7e34; }
    .visible-no  { background: #f0f0f0; color: #666; }
    .precio-antes { color: #999; text-decoration: line-through; font-size: 12px; }
    .precio-ahora { color: #1a73b8; font-weight: 700; }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>Combos de Artículos</vdr-page-title>
    </vdr-page-header>
    <vdr-page-body>
      <vdr-action-bar>
        <vdr-ab-right>
          <a class="btn btn-primary" [routerLink]="['./new']">
            <clr-icon shape="plus"></clr-icon>
            Nuevo Combo
          </a>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Artículos</th>
              <th>Precio Antes</th>
              <th>Precio Ahora</th>
              <th>Visible</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of combos">
              <td>{{ c.id }}</td>
              <td>{{ c.nombre }}</td>
              <td>
                <span style="background:#f0f4ff;color:#3b6bbf;padding:2px 7px;border-radius:8px;font-size:12px;">
                  {{ c.productIds?.length || 0 }} artículo(s)
                </span>
              </td>
              <td>
                <span class="precio-antes">\${{ c.precioAntes | number:'1.2-2' }}</span>
              </td>
              <td>
                <span class="precio-ahora">\${{ c.precioAhora | number:'1.2-2' }}</span>
              </td>
              <td>
                <span class="visible-badge"
                  [class.visible-si]="c.visible"
                  [class.visible-no]="!c.visible">
                  {{ c.visible ? 'Visible' : 'Oculto' }}
                </span>
              </td>
              <td style="text-align:right;">
                <a [routerLink]="['./', c.id]" class="btn btn-sm btn-secondary">
                  Editar →
                </a>
              </td>
            </tr>
            <tr *ngIf="combos.length === 0">
              <td colspan="7" style="text-align:center; padding: 24px; color: #666;">
                No hay combos registrados
              </td>
            </tr>
          </tbody>
        </table>
        <div style="padding: 8px 0; color: #666; font-size: 12px;">
          {{ combos.length }} combo(s) en total
        </div>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class CombosListComponent implements OnInit {
  combos: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.query(GET_COMBOS).stream$.subscribe((result: any) => {
      this.combos = result.combos ?? [];
    });
  }
}
