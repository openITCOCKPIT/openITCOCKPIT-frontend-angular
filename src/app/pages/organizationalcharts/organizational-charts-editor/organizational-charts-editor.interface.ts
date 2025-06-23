import { IPoint } from '@foblex/2d';
import { OrganizationalChartsTreeNode } from '../organizationalcharts.interface';

export interface OcTreeNode {
    fNodeId: string
    fNodeParentId?: string,
    position: IPoint,
    node: OrganizationalChartsTreeNode
}
