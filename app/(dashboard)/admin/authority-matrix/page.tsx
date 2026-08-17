/**
 * Authority Matrix Configuration Page
 * Allows administrators to configure approval workflows and authority rules
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';

interface AuthorityRule {
  id: string;
  name: string;
  description: string;
  role: string;
  category: string;
  minValue: number;
  maxValue: number;
  action: string;
  routeToRole: string;
  requiresPaymentGuarantee: boolean;
  requiresEtaValidation: boolean;
  requiresDualSignOff: boolean;
  isActive: boolean;
  priority: number;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export default function AuthorityMatrixPage() {
  const { user, hasPermission } = useAuth();
  const router = useRouter();
  const [rules, setRules] = useState<AuthorityRule[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<AuthorityRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!hasPermission('admin:manage_authority_matrix')) {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [hasPermission, router]);

  const fetchData = async () => {
    try {
      const [rulesRes, rolesRes] = await Promise.all([
        fetch('/api/v1/authority/rules'),
        fetch('/api/v1/roles'),
      ]);

      if (rulesRes.ok) {
        const rulesData = await rulesRes.json();
        setRules(rulesData.rules);
      }

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRule = () => {
    setEditingRule({
      id: '',
      name: '',
      description: '',
      role: 'DEPARTMENT_HEAD',
      category: '',
      minValue: 0,
      maxValue: 100000,
      action: 'ROUTE_TO_GM',
      routeToRole: 'GM',
      requiresPaymentGuarantee: false,
      requiresEtaValidation: true,
      requiresDualSignOff: false,
      isActive: true,
      priority: 0,
    });
    setIsCreating(true);
  };

  const handleEditRule = (rule: AuthorityRule) => {
    setEditingRule(rule);
    setIsCreating(false);
  };

  const handleSaveRule = async () => {
    if (!editingRule) return;

    try {
      const url = isCreating
        ? '/api/v1/authority/rules'
        : `/api/v1/authority/rules/${editingRule.id}`;

      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRule),
      });

      if (response.ok) {
        await fetchData();
        setEditingRule(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Failed to save rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const response = await fetch(`/api/v1/authority/rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/v1/authority/rules/${ruleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Authority Matrix</h1>
          <p className="text-gray-400 mt-2">
            Configure approval workflows and authority rules
          </p>
        </div>
        <button
          onClick={handleCreateRule}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Rule
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rule Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Value Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Route To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Controls
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{rule.name}</div>
                  <div className="text-sm text-gray-400">{rule.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  EGP {rule.minValue.toLocaleString()} - {rule.maxValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {rule.action.replace(/_/g, ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {rule.routeToRole.replace(/_/g, ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {rule.requiresPaymentGuarantee && (
                      <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                        Payment Guarantee
                      </span>
                    )}
                    {rule.requiresDualSignOff && (
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                        Dual Sign-off
                      </span>
                    )}
                    {rule.requiresEtaValidation && (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                        ETA Validation
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleRule(rule.id, rule.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {isCreating ? 'Create New Rule' : 'Edit Rule'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingRule.description}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Value (EGP)
                  </label>
                  <input
                    type="number"
                    value={editingRule.minValue}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        minValue: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Value (EGP)
                  </label>
                  <input
                    type="number"
                    value={editingRule.maxValue}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        maxValue: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Action
                  </label>
                  <select
                    value={editingRule.action}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, action: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="AUTO_APPROVE">Auto Approve</option>
                    <option value="ROUTE_TO_GM">Route to GM</option>
                    <option value="ROUTE_TO_FINANCIAL_CONTROLLER">
                      Route to Financial Controller
                    </option>
                    <option value="DUAL_SIGN_OFF">Require Dual Sign-off</option>
                    <option value="REQUIRE_OWNER">Require Owner Approval</option>
                    <option value="REJECT">Reject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Route To Role
                  </label>
                  <select
                    value={editingRule.routeToRole}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        routeToRole: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="OWNER">Owner</option>
                    <option value="REGIONAL_GM">Regional GM</option>
                    <option value="GM">General Manager</option>
                    <option value="FINANCIAL_CONTROLLER">Financial Controller</option>
                    <option value="DEPARTMENT_HEAD">Department Head</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingRule.requiresPaymentGuarantee}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        requiresPaymentGuarantee: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Require Payment Guarantee
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingRule.requiresDualSignOff}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        requiresDualSignOff: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Require Dual Sign-off
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingRule.requiresEtaValidation}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        requiresEtaValidation: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Require ETA Validation
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setEditingRule(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isCreating ? 'Create Rule' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}