use pelainsi_tcc;

select ponto_id, classificacao_id, sum(valor),
(valor * classificacao_id) as valorClassificacao,
( sum(valor) / (count(distinct usuario_id) * 5) ) as media

from usuarios_ponto_class a

group by ponto_id
order by ponto_id, classificacao_id;




select ponto_id, count(distinct usuario_id) as quantidade_usuarios,
( sum(valor) / (count(distinct usuario_id) * 5) ) as media

from usuarios_ponto_class

group by ponto_id
order by ponto_id;
